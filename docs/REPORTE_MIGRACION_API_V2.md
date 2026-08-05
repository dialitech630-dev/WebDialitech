# Reporte de Migración Frontend ↔ API DialiTech (especificación como fuente de verdad)

**Fecha:** 2026-08-05
**Proyecto:** proyectoEmodialisis (Vue 3 + Pinia + Vite) ↔ `API.Dialitech_Core_V2`
**Backend de referencia:** https://api-dialitech-core-v2.onrender.com
**Validación:** `npm run build` ✅ · `npm run dev` ✅ (HTTP 200)

---

## 1. APIs integradas

| Método | Endpoint | Uso en el frontend |
|--------|----------|--------------------|
| POST | `/auth/register` | Registro de caregiver (`authStore.register`) |
| POST | `/auth/login` | Login, guarda JWT + caregiver en Pinia/localStorage |
| GET | `/auth/me` | Navbar, Sidebar, Account, Profile, Dashboard, `subscriptionStore.refreshSubscription` |
| PUT | `/auth/profile` | Edición de perfil (nombre, apellido, teléfono, foto con preview) |
| PUT | `/auth/plan` | Cambio de plan (upgrade/downgrade) con mensajes reales del backend |
| POST | `/auth/change-password` | Security: cambiar contraseña con verificación de la actual |
| POST | `/auth/forgot-password` | Envío de código de recuperación por email o teléfono |
| POST | `/auth/reset-password` | Valida código + nueva contraseña + confirmación |
| DELETE | `/auth/account` | Borrar cuenta con modal de confirmación y logout automático |
| POST | `/patients/{id}/generate-code` | Modal de código móvil (6 dígitos, copiar/regenerar/temporizador) |
| POST | `/patients/{id}/generate-wearable-code` | Modal de código wearable |
| GET | `/dashboard` | KPIs, cards, pacientes, alertas, dispositivos, últimas lecturas |
| GET | `/dashboard/{patientId}` | Estado en vivo del paciente en Patient Detail |
| GET | `/dashboard/{patientId}/readings` | Historial de lecturas con filtros fecha (from/to/limit) y gráfica |
| GET | `/alerts` | Lista de alertas ordenadas por fecha, con filtros |
| GET | `/alerts/{patientId}` | Alertas del paciente en Patient Detail |
| DELETE | `/alerts/{alertId}` | Resolve Alert (modal de confirmación) + actualización de lista y campana |

## 2. Componentes modificados

| Archivo | Cambio |
|---------|--------|
| `src/modules/authentication/views/ForgotPasswordView.vue` | Flujo en 2 pasos: identificar (email/teléfono) → paso de código; usa `forgotPassword` + `resetPassword` |
| `src/modules/authentication/components/ForgotPasswordForm.vue` | Sin cambios de contrato (ya email-o-teléfono) |
| `src/modules/authentication/components/RecoveryPasswordForm.vue` | Nuevo campo **Verification Code** (6 dígitos) + validación; envía `{ code, newPassword }` |
| `src/pages/DashboardView.vue` | KPIs "Patients Online" y "System Status" ahora vienen de `GET /dashboard` (se eliminan `--` y `Stable` hardcodeados) |
| `src/modules/patients/views/PatientDetailView.vue` | Integra estado en vivo, alertas del paciente, readings con gráfica y filtros, y modales de códigos |
| `src/modules/alerts/views/AlertsView.vue` | "Resolve Alert" abre modal y llama `DELETE /alerts/{id}`; refresca la campana del navbar |
| `src/modules/alerts/components/AlertCard.vue` | Sin cambios de contrato |
| `src/modules/settings/components/AccountSettings.vue` | Borrado de cuenta con modal de confirmación (reemplaza `window.confirm`) |
| `src/components/TopNavbar.vue` | Ya lee `/auth/me` (foto, nombre, plan, rol) y la campana consume `GET /alerts` con indicador rojo que se oculta al abrir |

## 3. Servicios / stores actualizados

| Archivo | Cambio |
|---------|--------|
| `src/services/auth/recovery.service.js` | `RECOVERY_ENDPOINTS` = `/auth/forgot-password` y `/auth/reset-password`; se eliminan los temporales `/auth/recovery/*` |
| `src/services/patients/patient.service.js` | Añade `generateCode(id)` y `generateWearableCode(id)` |
| `src/services/dashboardService.js` | Añade `getPatientReadings(patientId, { from, to, limit })` |
| `src/stores/alertStore.js` | Eliminada acción local `resolve()` (ahora se resuelve con `DELETE /alerts/{id}`) |
| `src/composables/useAccount.js` | Role/status/plan leídos de la respuesta de `GET /auth/me`; expone `deleteError` |

## 4. Nuevos componentes

| Archivo | Función |
|---------|---------|
| `src/modules/patients/components/detail/PatientCodeModal.vue` | Modal de código de vinculación (móvil/wearable): genera, copia al portapapeles, regenera y muestra temporizador de expiración |
| `src/modules/patients/components/detail/ReadingsChart.vue` | Gráfica SVG ligera de lecturas (sin dependencias externas) con etiquetas de fecha y valor actual |
| `src/modules/alerts/components/ResolveAlertModal.vue` | Modal de confirmación para resolver alertas (reutilizado en AlertsView y Patient Detail) |
| `src/modules/settings/components/DeleteAccountModal.vue` | Modal de confirmación de borrado de cuenta con consecuencias y botón de carga |

## 5. Bugs encontrados y corregidos

| # | Bug | Estado |
|---|-----|--------|
| 1 | Flujo de recuperación usaba endpoints temporales `/auth/recovery/*` que no están en la especificación | ✅ Corregido → `/auth/forgot-password` + `/auth/reset-password` con paso de código |
| 2 | El frontend no tenía el paso de código de verificación (la especificación exige código + nueva contraseña + confirmación) | ✅ Corregido (campo `code` en `RecoveryPasswordForm`) |
| 3 | `Resolve Alert` era una acción local (marcaba como resuelto sin tocar el backend) | ✅ Corregido → modal + `DELETE /alerts/{id}` + refresco de campana |
| 4 | KPIs "Patients Online" y "System Status" estaban hardcodeados (`--` / `Stable`) | ✅ Corregido → datos de `GET /dashboard` |
| 5 | Patient Detail no consumía `GET /dashboard/{id}`, `GET /alerts/{patientId}` ni `GET /dashboard/{id}/readings` | ✅ Corregido (nuevas secciones con estados de carga/error y retry) |
| 6 | No existían los botones/modales de vinculación de código móvil y wearable | ✅ Añadidos (`POST /patients/{id}/generate-code` y `generate-wearable-code`) |
| 7 | Borrado de cuenta usaba `window.confirm` (sin explicación de consecuencias ni estado de carga) | ✅ Corregido → modal dedicado con descripción y logout automático |
| 8 | `account` mostraba `role`/`status` fijos (`Caregiver`/`Active`) | ✅ Corregido → valores reales de `/auth/me` |

## 6. Funcionalidades nuevas

- Recuperación de contraseña completa: email-o-teléfono → envío de código → código + nueva contraseña + confirmación.
- Modal de código móvil: 6 dígitos, copiar al portapapeles, regenerar, temporizador de expiración (con respaldo de 120 s si el backend no manda `expiresAt`).
- Modal de código wearable con su explicación.
- Patient Detail con estado en vivo (estado, última lectura, alertas activas, estado del dispositivo), lecturas históricas con gráfica y filtros **Today / 7 days / 30 days / Custom**, y listado de alertas del paciente.
- Resolve Alert con confirmación vía modal y sincronización automática de la campana del navbar.
- Borrado de cuenta con modal que detalla las consecuencias (pacientes, alertas, dispositivos y datos) y sesión cerrada tras la operación.

## 7. Endpoints/servicios obsoletos eliminados o desactivados

| Elemento | Motivo |
|----------|--------|
| `/auth/recovery/verify` y `/auth/recovery/reset-password` | No existen en la especificación; sustituidos por `/auth/forgot-password` y `/auth/reset-password` |
| Acción `resolve()` local del `alertStore` | El contrato solo expone `DELETE /alerts/{alertId}` |
| Array de alertas mock (`alerts`) en `src/modules/alerts/data/alerts.js` | Datos simulados; se conservan únicamente las constantes `priorities`/`alertStatuses` usadas por el toolbar de filtros |
| Valores hardcodeados del dashboard (`--`, `Stable`) | Sustituidos por respuestas reales de `GET /dashboard` |

## 8. Notas y pendientes

- **Formato de respuestas del backend:** la documentación OpenAPI no declara esquemas de cuerpo; los mapeos defensivos (p. ej. `expiresAt`/`expiresInSeconds`, `patientsWithDevice`/`onlinePatients`) toleran nombres alternativos. Si el backend concreta los campos, se pueden afinar sin cambiar vistas.
- **Lecturas:** se implementó una gráfica SVG propia (sin librería de terceros, `package.json` no tenía chart library). Si se prefiere `Chart.js`/`ECharts`, es un cambio aislado en `ReadingsChart.vue`.
- **Navbar:** la campana marca leídas localmente al abrir (no existe endpoint de "mark all read"); el indicador rojo desaparece al abrir el dropdown.
- **Change plan:** ya muestra los mensajes reales del backend (incluidos rechazos de downgrade).
- La verificación funcional completa con datos reales requiere credenciales de una cuenta de staging; el contrato de red ya fue validado en fases previas (`GET /health`, endpoints protegidos → 401 sin token).
