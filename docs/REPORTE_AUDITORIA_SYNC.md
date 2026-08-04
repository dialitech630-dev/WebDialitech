# Reporte de Auditoría y Sincronización Frontend ↔ Backend

**Fecha:** 2026-07-31
**Proyecto:** proyectoEmodialisis (Frontend Vue 3 + Vite) ↔ API.Dialitech_Core.V2 (.NET)
**Backend de referencia:** https://api-dialitech-core-v2.onrender.com

---

## 1. APIs nuevas encontradas (backend recientemente actualizado)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/dashboard` | Resumen del dashboard (total pacientes, alertas activas, pacientes con dispositivo, estado por paciente) |
| GET | `/api/v1/dashboard/{patientId}` | Estado en vivo de un paciente |
| GET | `/api/v1/patients` | Lista de pacientes del caregiver |
| GET | `/api/v1/patients/{id}` | Detalle de paciente |
| POST | `/api/v1/patients` | Crear paciente |
| DELETE | `/api/v1/patients/{id}` | Eliminar paciente |
| POST | `/api/v1/patients/{id}/generate-code` | Generar código de vinculación de dispositivo |
| POST | `/api/v1/patients/validate-code` | Validar código de vinculación (público) |
| POST | `/api/v1/devices/link` | Vincular dispositivo (público) |
| GET | `/api/v1/alerts` | Alertas del caregiver (desde el token JWT) |
| GET | `/api/v1/alerts/{patientId}` | Alertas por paciente |
| DELETE | `/api/v1/alerts/{alertId}` | Eliminar alerta |
| POST | `/api/v1/health-data/batch` | Ingesta de datos de salud (IoT, rate-limited) |
| GET | `/api/v1/health-data/patient-info/{patientCode}` | Info del paciente por código |

### Nuevos modelos / DTOs / entidades
- Entidades: `Caregiver` (antes `User`), `Patient`, `Device`, `Alert`.
- Enum `Plan`: `Standard=1`, `Pro=3`, `Premium=10`.
- DTOs: `CaregiverDto`, `PatientDto`, `CreatePatientRequest`, `DashboardSummary`, `PatientStatusDto`, `GenerateCodeResponse`, `ValidateCodeResponse`, `LinkDeviceResponse`, `BatchRequest`, `PatientInfoResponse`, `AlertDto`.
- Auth: `RegisterRequest`, `LoginRequest`, `AuthResponse`, `UpdateProfileRequest`.

## 2. APIs modificadas

| Endpoint | Cambio |
|----------|--------|
| `PUT /auth/profile` | Antes el frontend usaba `PUT /auth/me`; el backend expone `/auth/profile` con `{ name, lastname, phone, imageUrl }`. |
| `GET /alerts` | Antes el frontend usaba `GET /alerts/{userId}`; ahora el backend obtiene las alertas del caregiver desde el token (sin parámetro). El parámetro de ruta corresponde al `patientId`. |
| `POST /auth/register` | El campo `plan` es una string (`Standard`/`Pro`/`Premium`). El frontend enviaba `"free"` (inválido, el backend lo degradaba a `Standard`). |
| Modelo `User` → `Caregiver` | Toda la semántica de cuenta pasó a "caregiver"; no existe campo `role` en el usuario autenticado. |

## 3. APIs eliminadas

| Endpoint eliminado | Nota |
|--------------------|------|
| `/api/v1/Users` (CRUD completo) | El controlador `UsersController` fue eliminado. El módulo de gestión de usuarios no tiene API. |
| `/api/Auth/register`, `/api/Auth/login`, `/api/Auth/me` | Rutas antiguas de un esquema de servicio obsoleto (duplicado en `services/authService.js`). |
| `/api/v1/WeatherForecast` | Removido. |
| `UserService` / repositorios `User`, `HealthRecord` | Refactorizados fuera del código. |

## 4. Documentación OpenAPI / Scalar vs. código

- La documentación OpenAPI (https://api-dialitech-core-v2.onrender.com/openapi/v1.json) **coincide** con los controladores del código.
- **Limitación detectada (no es inconsistencia):** las respuestas de los endpoints no definen esquemas (solo `200 OK`). La doc no describe los cuerpos de respuesta (p. ej. `AuthResponse`, `PatientDto`, `DashboardSummary`).
- El bearer JWT está declarado a través del `BearerSecuritySchemeTransformer`; los endpoints protegidos están marcados `[Authorize]`.

## 5. Bugs encontrados y corregidos

| # | Bug | Archivo(s) | Estado |
|---|-----|-----------|--------|
| 1 | Alertas: se llamaba `GET /alerts/{caregiverId}` (parámetro incorrecto); el backend espera `GET /alerts` sin parámetro. | `services/alertService.js`, `stores/alertStore.js`, `composables/useNotifications.js`, `views/AlertsView.vue`, `CriticalAlertsPanel.vue` | ✅ Corregido |
| 2 | Mapeo de alertas con campos inexistentes (`userName`, `timestamp`) en vez de `patientName`, `createdAt`. | `stores/alertStore.js`, `composables/useNotifications.js` | ✅ Corregido |
| 3 | `profile.service.update()` usaba `PUT /auth/me`; el backend expone `PUT /auth/profile`. | `services/settings/profile.service.js` | ✅ Corregido |
| 4 | `useProfile.save()` no enviaba `imageUrl`. | `composables/useProfile.js` | ✅ Corregido |
| 5 | `authService.sendRecoveryCode/verifyCode/resetPassword` no existían → error en runtime en ForgotPassword/VerifyCode/ResetPassword. | `services/auth/auth.service.js` | ✅ Corregido (preparado; el backend aún no expone los endpoints) |
| 6 | `subscriptionStore.setRole()` asignaba `admin` por defecto; el flujo es caregiver-only. | `stores/subscriptionStore.js` | ✅ Corregido |
| 7 | `PLAN_MAP` no contemplaba el plan `Pro` del backend; `reverseMap` inconsistente. | `stores/subscriptionStore.js` | ✅ Corregido |
| 8 | Registro enviaba `plan: "free"` (inválido) y nunca incluía la foto seleccionada (`imageUrl`). | `CaregiverRegisterForm.vue`, `RegisterAvatarUploader.vue` | ✅ Corregido |
| 9 | Dashboard usaba `GET /patients` para conteos en vez del nuevo `GET /dashboard`. | `pages/DashboardView.vue`, `services/dashboardService.js` (nuevo) | ✅ Corregido |
| 10 | `PatientMonitoringPanel` mapeaba campos inexistentes (`bloodPressure`, `temperature`, `status`). | `PatientMonitoringPanel.vue`, `PatientMonitoringCard.vue` | ✅ Corregido |
| 11 | Botón "View All" de alertas críticas sin acción. | `CriticalAlertsPanel.vue` | ✅ Corregido |
| 12 | Rol mostrado como "Administrator" en Account; el flujo es caregiver. | `composables/useAccount.js` | ✅ Corregido |
| 13 | Guard de rutas no sincronizaba el plan desde localStorage al recargar. | `router/index.js` | ✅ Corregido |
| 14 | Guardar perfil no actualizaba localStorage / navbar. | `composables/useProfile.js` | ✅ Corregido |
| 15 | Código muerto: `services/authService.js` (endpoints eliminados) y `services/forgotPasswordService.js` (sin uso). | eliminados | ✅ Corregido |

## 6. Bugs / observaciones detectadas NO corregidas (requieren backend)

- **Cambio de plan:** el endpoint `PUT /subscription/plan` no existe. El frontend queda preparado; ante 404 aplica modo "offline" local (solo localStorage). Requiere endpoint del backend.
- **Apariencia:** `PUT /settings/appearance` no existe. El guardado de preferencias se hace local; el `syncToApi` está preparado.
- **Recuperación de contraseña:** `POST /auth/forgot-password`, `/auth/verify-code`, `/auth/reset-password` no existen. El frontend queda preparado; las vistas mostrarán error de 404 hasta que el backend las implemente.
- **Notificaciones:** no hay endpoint para marcar leídas / configurar preferencias (solo se marcan localmente).
- **Gestión de usuarios:** módulo `user-management` sin API (controlador `Users` eliminado). La vista no está enrutada (dormant).
- **Cambio de contraseña / 2FA / seguridad:** `SecuritySettingsCard` es solo visual (deshabilitado); no hay endpoint de cambio de contraseña.

## 7. Archivos modificados

```
src/components/CriticalAlertsPanel.vue
src/components/PatientMonitoringCard.vue
src/components/PatientMonitoringPanel.vue
src/composables/useAccount.js
src/composables/useNotifications.js
src/composables/useProfile.js
src/modules/alerts/views/AlertsView.vue
src/modules/register/components/CaregiverRegisterForm.vue
src/modules/register/components/RegisterAvatarUploader.vue
src/pages/DashboardView.vue
src/router/index.js
src/services/alertService.js
src/services/auth/auth.service.js
src/services/settings/profile.service.js
src/stores/alertStore.js
src/stores/subscriptionStore.js
```

### Eliminados
```
src/services/authService.js
src/services/forgotPasswordService.js
```

### Nuevos
```
src/services/dashboardService.js
```

## 8. Estado por módulo

| Módulo | Estado | Observación |
|--------|--------|-------------|
| Authentication (Login/Register/Me) | ✅ Implementado | Sincronizado con `/auth/*`. |
| Logout | ✅ Implementado | Local + limpieza de sesión. |
| Forgot / Verify / Reset password | ⚠️ Parcialmente implementado | Frontend preparado; **sin API backend**. |
| Dashboard | ✅ Implementado | Conectado a `GET /dashboard` + `GET /alerts`. |
| Patients (listado/crear/eliminar/detalle) | ✅ Implementado | Conectado a `/patients/*`. |
| Devices (códigos de vinculación) | ⚠️ Pendiente en Web | Endpoints existen (IoT); no hay UI web de vinculación. |
| Alerts (listado/eliminar) | ✅ Implementado | Conectado a `/alerts/*`. |
| HealthData | ⚠️ Sin API en Web | Endpoints para dispositivos IoT; no se usan desde la web. |
| Profile | ✅ Implementado | Conectado a `PUT /auth/profile`. |
| Account | ✅ Implementado | Basado en `GET /auth/me`. |
| Subscription / Planes | ⚠️ Parcialmente implementado | Visual + local; **cambio de plan sin API** (`PUT /subscription/plan`). |
| Settings / Apariencia | ⚠️ Parcialmente implementado | Local; `PUT /settings/appearance` sin API. |
| Notifications | ⚠️ Parcialmente implementado | Lee `/alerts`; marcar leídas solo local. |
| Security (password/2FA) | ⚠️ Pendiente | Solo UI deshabilitada; sin API. |
| Reports | ⚠️ Pendiente | Página sin enrutar; sin API de reportes. |
| User Management | ⚠️ Pendiente / Sin API | Sin controlador backend; vista sin enrutar. |

## 9. Recomendaciones para el siguiente Sprint

1. **Backend: recuperación de contraseña.** Implementar `POST /auth/forgot-password`, `/auth/verify-code`, `/auth/reset-password` para desbloquear el flujo ya construido en el frontend.
2. **Backend: cambio de plan.** Crear `PUT /subscription/plan` (o `PATCH /auth/plan`) para quitar el modo offline y persistir el plan del caregiver.
3. **Backend: preferencias de apariencia y notificaciones.** Definir endpoints para guardar/leer preferencias por caregiver.
4. **Backend: cambio de contraseña.** `PUT /auth/password` (con verificación de la actual) y habilitar la sección Security.
5. **Mapear los planes** `Standard/Pro/Premium` de forma oficial (precios, límites) y alinear los catálogos del frontend (`config/plans.js`) para eliminar el mapa de traducción local.
6. **Mejorar OpenAPI:** declarar esquemas de respuesta para cada endpoint (hoy solo `200 OK`), y exponer el documento al público (si aplica).
7. **Limpieza de código muerto (frontend):** páginas no enrutadas (`ClinicalDashboard.vue`, `Profile.vue`, `Reports.vue`, `Settings.vue`, `PatientDetail.vue`, `Alerts.vue`), layouts `MainLayout.vue`, componentes `Navbar.vue`, `PatientDashboardView.vue`, y componentes de detalle sin usar (`PatientAlerts.vue`, `PatientHistory.vue`, `VitalSignsCard.vue`).
8. **DevSecOps:** mover `VITE_API_URL` del `.env` commitado a una variable de entorno de build/CI (crear `.env.example`); hoy no hay secretos, pero el `.env` no debería trackearse.
9. **Tests:** añadir un test de humo (Login/Register/Dashboard/Patients/Alerts) con credenciales de staging para validación automatizada.

## 10. Validación ejecutada

- ✅ `npm run build` compila sin errores (252 módulos, ~96 KB gzip).
- ✅ Servidor dev arranca (HTTP 200).
- ✅ Contrato verificado contra la API en vivo:
  - `POST /auth/login` (credenciales inválidas → 401 "Invalid email or password").
  - `POST /patients/validate-code` → 200 `{"isValid":false,...}`.
  - `GET /health` → 200; endpoints protegidos → 401 sin token.
- ⚠️ Verificación funcional completa (Login real, Register, Dashboard) requiere credenciales de una cuenta de staging; el contrato de red fue validado.
