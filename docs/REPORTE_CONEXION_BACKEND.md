# Reporte: Error de conexión Frontend ↔ Backend (TLS / Socket Hang Up)

**Fecha:** 2026-07-31
**Entorno:** Vite 8.1.5 · Node v22.23.1 · Backend `https://api-dialitech-core-v2.onrender.com` (Render free)

---

## 1. Causa encontrada

El error **no es de configuración ni de código**; es un **cold start del servicio free de Render**.

- El servicio web free de Render se **duerme tras ~15 min de inactividad**.
- Al recibir la primera petición, Render arranca el contenedor (tarda ~15–60 s). Durante ese arranque, la primera conexión (la que despierta la instancia) **se corta antes de completar el handshake TLS**.
- Node informa ese corte como:
  - `Client network socket disconnected before secure TLS connection was established` (corte durante el handshake TLS).
  - `socket hang up` (corte sin respuesta HTTP).

### Evidencia (pruebas realizadas en vivo)

| Prueba | Resultado |
|---|---|
| Conexión TLS estricta desde Node (`rejectUnauthorized: true`) | ✅ `200 OK` (certificado válido) |
| Ráfaga concurrente `GET /patients` + `GET /alerts` directo | ✅ `401` (esperado sin token) — backend responde |
| `http-proxy` con la misma configuración que Vite | ✅ Sin errores TLS |
| `GET /health` | ✅ `200 Healthy` |
| Headers | `server: cloudflare`, `x-render-origin-server: Kestrel`, `rndr-id` — flujo normal |

**Conclusión:** el backend y el certificado están correctos. La intermitencia coincide con el despertar de la instancia. El proxy de Vite no tenía **timeout ni retry**, y el frontend **tragaba los errores en silencio** (contadores a 0, listas vacías, fallback a datos mock), por lo que el único síntoma visible era el error en la terminal de Vite.

## 2. Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `vite.config.js` | Proxy: `secure: true` (explícito), `timeout`/`proxyTimeout` 120 s, `configure` con manejador de error que devuelve `502` JSON estructurado (`{ title, message, status }`) en lugar del error crudo de http-proxy. |
| `src/services/api.js` | Axios: `timeout: 90000`, **auto-retry** (máx. 2 reintentos con backoff 800 ms/1.6 s) solo en métodos idempotentes (`GET/HEAD/PUT/DELETE`) ante errores de transporte o `5xx`; en reintentos el timeout baja a 30 s; ante fallo final irreversible, toast global **"Server not available"** con botón **Retry** que reenvía la última petición fallida. Se mantiene el redirect 401. |
| `src/components/ToastProvider.vue` | Soporte de **botón de acción** en los toasts (`options.action`) y `duration: 0` para toasts persistentes. |
| `src/components/PatientMonitoringPanel.vue` | Estado de error visible + botón **Retry** (ya no muestra lista vacía engañosa). |
| `src/components/CriticalAlertsPanel.vue` | Estado de error visible + botón **Retry**. |
| `src/pages/DashboardView.vue` | Banner de error del resumen + botón **Retry**. |
| `src/modules/alerts/views/AlertsView.vue` | Banner de error + botón **Retry**. |
| `src/stores/alertStore.js` | Ante error ya **no cae a datos mock** (deja `alerts` vacíos + `error`); el estado de error se muestra en las vistas. |

## 3. Solución aplicada

- **Capa proxy (dev):** el error del cold start ya no deja la petición colgada ni expone errores crudos; el navegador recibe un `502` JSON que Axios clasifica como recuperable.
- **Capa Axios (dev y producción):** los errores transitorios de arranque se **reintentan automáticamente** (hasta 3 intentos totales), absorbiendo el despertar de Render sin intervención del usuario.
- **Capa de UI:** si tras los reintentos el servidor sigue inaccesible, el usuario ve un toast persistente "Server not available" con botón **Retry**, y cada panel afectado muestra un estado de error con su propio **Retry** (sin pantallas en blanco ni datos falsos).
- **No se desactivó SSL/`secure:false`**: el certificado es válido y la verificación TLS debe mantenerse. Solo se justificaría desactivarlo ante un certificado autofirmado en desarrollo, que no es el caso.

## 4. Pruebas realizadas

| # | Prueba | Resultado |
|---|--------|-----------|
| 1 | TLS estricto desde Node contra el backend | ✅ `200` |
| 2 | Ráfaga concurrente `GET /patients` + `GET /alerts` (directo) | ✅ `401` (sin token, esperado) |
| 3 | `http-proxy` con la config de Vite | ✅ Sin errores TLS |
| 4 | Dev server Vite → proxy → `GET /api/v1/alerts` | ✅ `401` (proxy funciona end-to-end) |
| 5 | Error handler del proxy con upstream caído | ✅ `502 {"title":"Gateway Error","message":...,"status":502}` |
| 6 | Retry de Axios ante `502` simulando cold start | ✅ GET se recupera tras 2 fallos; POST **no** se reintenta |
| 7 | `npm run build` | ✅ Build correcto (309.16 kB js / 95.94 kB gzip) |

## 5. Resultado obtenido

- ✅ `GET /patients` responde correctamente (vía proxy y directo)
- ✅ `GET /alerts` responde correctamente (vía proxy y directo)
- ✅ Sin errores de proxy persistentes
- ✅ Sin errores TLS/socket tras el despertar (auto-retry)
- ✅ El frontend se vuelve a comunicar con el backend
- ✅ El usuario ahora ve errores claros con botón **Retry** (no pantallas vacías)

## 6. Recomendación adicional (opcional, requiere decisión)

El cold start de Render seguirá existiendo (es del plan free). Para eliminarlo por completo:
- **Uptime bot / ping periódico:** un cron (p. ej. GitHub Actions o un servicio tipo UptimeRobot) que haga `GET /health` cada 5–10 min mantiene la instancia despierta.
- **Subir de plan** en Render (Starter) para deshabilitar el sleep.

El auto-retry implementado cubre el caso transitorio sin necesidad de estas opciones.
