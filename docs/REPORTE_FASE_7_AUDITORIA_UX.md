# Reporte Final — Auditoría y Mejoras del Frontend (FASES 2, 3, 5, 6, 7)

**Fecha:** 2026-08-05
**Proyecto:** Dialitech-Web (DiaMonitor — Vue 3 + Vite + Pinia)
**Resultado:** `npm run build` ✅ (268 módulos transformados, sin errores)

---

## 1. Resumen de fases

| Fase | Descripción | Estado |
|------|-------------|--------|
| FASE 1 | Auditoría completa del proyecto | ✅ Completada |
| FASE 2 | Validaciones de Login (contraseña mínima 6) | ✅ Completada |
| FASE 3 | Recuperación de contraseña sin EmailSender, desacoplada | ✅ Completada |
| FASE 4 | Cambios de interfaz según imágenes | ⏸️ **Pendiente** (el usuario aún no ha entregado las imágenes de referencia) |
| FASE 5 | Revisión de formularios (validación, sanitización, anti doble envío) | ✅ Completada |
| FASE 6 | UX: estados de carga, botones deshabilitados, feedback | ✅ Completada |
| FASE 7 | Reporte final | ✅ Este documento |

---

## 2. FASE 2 — Validaciones de Login

- **Política de contraseña centralizada** (`src/config/security.js`): `PASSWORD_POLICY.MIN_LENGTH` cambiado de **8 → 6** (máx. 128, sin espacios). Todos los formularios que usan `isStrongPassword`/`validateLoginForm`/`validateRegisterForm` se alinean automáticamente.
- **Login (`src/pages/Login.vue`)**: ya validaba email obligatorio + formato válido, contraseña obligatoria con min/max, sanitizaba el email y bloqueaba envíos inválidos vía `validateLoginForm` (leído de la política). Con el cambio de política acepta contraseñas de 6+ caracteres. Muestra errores por campo y banner de error; el botón usa `LoadingButton` (spinner + deshabilitado durante la petición → sin doble envío).
- Mensajes claros para el usuario en banners (Alerts) y, en los flujos nuevos, con toasts globales (`window.__toast`).

## 3. FASE 3 — Recuperación de contraseña (sin EmailSender)

Se eliminó la dependencia del envío de códigos por email. Nuevo flujo de dos pasos en `ForgotPasswordView.vue`:

1. **Identificación**: el usuario introduce su **email o teléfono** (un único campo validado con `isEmailOrPhone`/`sanitizeIdentifier`, nuevos helpers en `src/utils/validators.js`).
2. **Verificación**: se consulta la existencia de la cuenta.
3. **Nueva contraseña**: si la cuenta existe, se muestra directamente el formulario de **nueva contraseña + confirmación** (mín. 6, máx. 128, sin espacios, coincidentes).

Cambios:
- **Nuevo `src/services/auth/recovery.service.js`**: servicio desacoplado del EmailSender. Expone `RECOVERY_ENDPOINTS` (`/auth/recovery/verify`, `/auth/recovery/reset-password`) como constantes, de modo que cuando el backend implemente OTP/correo **solo hay que apuntar estos endpoints** sin tocar las vistas.
- **Nuevo `RecoveryPasswordForm.vue`**: formulario de nueva contraseña con validación de política y confirmación.
- **Reescrito `ForgotPasswordForm.vue`**: campo único email-o-teléfono con validación inline y `LoadingButton`.
- **Eliminado `ResetPasswordView.vue`** (era parte del flujo OTP/EmailSender) y su ruta `reset-password` en `src/router/index.js` y `src/config/security.js` (`PUBLIC_ROUTES`).
- **`src/services/api.js`**: los endpoints `/auth/recovery/*` se excluyen del header Bearer (igual que login/register).
- **`src/services/auth/auth.service.js`**: eliminados los métodos muertos `sendRecoveryCode` y `resetPassword`.

> **Nota backend:** los endpoints `/auth/recovery/*` aún no existen en la API. Hasta que se implementen, el flujo muestra un error claro al verificar la identidad (comportamiento coherente con el resto de la app, que usa toasts de error y botones Retry).

## 4. FASE 5 — Revisión de formularios

| Formulario | Cambios |
|---|---|
| **Register** (`RegisterView.vue` + `CaregiverRegisterForm.vue`) | Alineado a min. 6 por política. **Nuevo: validación de términos** — `TermsCheckbox` expone su estado y `RegisterView` bloquea el envío si no está aceptado (error inline + toast). Guard anti doble envío (`if (authStore.loading) return`). Toast de éxito al crear cuenta. |
| **Avatar de registro** (`RegisterAvatarUploader.vue`) | Validación de archivo: solo imágenes (tipo) y máx. 1 MB; error vía toast y reseteo del input. |
| **Avatar de perfil** (`ProfileSettings.vue`) | Misma validación de imagen (tipo + 1 MB). |
| **Perfil** (`useProfile.js`) | Guard anti doble envío (`if (saving.value) return`); ya sanitizaba `name/lastname/phone` y validaba con `validateProfileForm`. |
| **Cambio de contraseña** (`SecuritySettingsCard.vue`) | `minlength="8"` → dinámico (política, ahora 6); mensaje de error con los límites reales de la política. |
| **Añadir paciente** (`AddPatientModal.vue`) | Sanitización de `name` y `notes`, validación de edad (0–150), guard anti doble envío, `try/finally` para el estado `submitting`. |
| **Recuperación** (`ForgotPasswordForm` / `RecoveryPasswordForm`) | Validación inline por campo, sanitización del identificador, política de contraseña y coincidencia. |

## 5. FASE 6 — UX (carga, feedback)

- `LoadingButton` reutilizado en login, register, recuperación (ambos pasos) y añadir paciente.
- Estados de carga existentes mantenidos: skeletons en Patients, paneles con Retry, toasts de error globales del interceptor de Axios.
- Los formularios deshabilitan sus botones y bloquean envíos duplicados.

## 6. Correcciones de bugs / hallazgos de auditoría

| # | Hallazgo | Corrección |
|---|---|---|
| 1 | `avatarColor` usaba `Number(patient.id) % length` → NaN si el id no es numérico (`PatientsTableRow.vue`) | Índice calculado con id numérico si aplica, o hash del nombre como fallback. |
| 2 | `PatientMonitoringPanel.vue` hacía `api.get('/patients')` directo (duplicaba `patientService`) | Ahora usa `patientService.getAll()`. |
| 3 | `account.service.get()` y `profile.service.get()` duplicaban `GET /auth/me` | Ambos delegan en `authService.me()`. |
| 4 | Toolbar de alertas con `input readonly` y filtros muertos (`AlertsToolbar.vue`) | Búsqueda por paciente/tipo y filtros por prioridad/estado/fecha **funcionales** (v-model + filtrado en `AlertsView`). |
| 5 | Botones de `AlertActions.vue` sin handlers | "Resolve" (marca como resuelta, local) y "Dismiss" (elimina vía `DELETE /alerts/{id}`) con toasts. Eliminados los botones muertos (view/more). |
| 6 | `AlertsHeader` "Mark all as read" sin acción | Emite evento; store marca todas como leídas localmente con toast. |
| 7 | Store de alertas sin acciones de resolución | `alertStore.resolve()` y `alertStore.markAllRead()` (locales, sin endpoint backend). |
| 8 | `PatientsSearchBar`/`PatientsFilters` estáticos | Búsqueda por nombre/doctor/género y filtros por estado/edad/doctor (opciones de doctor y estado dinámicas según datos). |
| 9 | `Pagination.vue` estática (siempre página 1) | Paginación cliente real (prev/next, números de página, "Showing X to Y"). 8 por página. |
| 10 | `PatientsView` sin estado de "sin resultados" | Mensaje "No results" cuando los filtros excluyen todo. |

## 7. Archivos modificados

**Modificados (30):**
```
src/components/AddPatientModal.vue
src/components/PatientMonitoringPanel.vue
src/composables/useProfile.js
src/config/security.js
src/modules/alerts/components/AlertActions.vue
src/modules/alerts/components/AlertCard.vue
src/modules/alerts/components/AlertsHeader.vue
src/modules/alerts/components/AlertsList.vue
src/modules/alerts/components/AlertsToolbar.vue
src/modules/alerts/views/AlertsView.vue
src/modules/authentication/components/ForgotPasswordForm.vue
src/modules/authentication/views/ForgotPasswordView.vue
src/modules/patients/components/Pagination.vue
src/modules/patients/components/PatientsFilters.vue
src/modules/patients/components/PatientsSearchBar.vue
src/modules/patients/components/PatientsTableRow.vue
src/modules/patients/views/PatientsView.vue
src/modules/register/components/RegisterAvatarUploader.vue
src/modules/register/components/TermsCheckbox.vue
src/modules/register/views/RegisterView.vue
src/modules/settings/components/ProfileSettings.vue
src/modules/settings/components/SecuritySettingsCard.vue
src/router/index.js
src/services/api.js
src/services/auth/auth.service.js
src/services/settings/account.service.js
src/services/settings/profile.service.js
src/stores/alertStore.js
src/utils/validators.js
```

**Nuevos (2):**
```
src/modules/authentication/components/RecoveryPasswordForm.vue
src/services/auth/recovery.service.js
```

**Eliminados (1):**
```
src/modules/authentication/views/ResetPasswordView.vue
```

## 8. Validación

- ✅ `npm run build` compila sin errores (268 módulos; JS ~336.9 kB, gzip ~105.2 kB; CSS ~113.3 kB).
- ✅ No quedan referencias a `ResetPasswordView`, `reset-password` (route) ni `sendRecoveryCode`.

## 9. Pendiente / requiere backend

- **FASE 4** (imágenes de interfaz): bloqueada hasta recibir las imágenes de referencia.
- **Recuperación de contraseña**: implementar `POST /auth/recovery/verify` y `POST /auth/recovery/reset-password` (o reutilizar `/auth/forgot-password` + `/auth/reset-password` ajustando payloads) en el backend. Los endpoints ya están aislados en `RECOVERY_ENDPOINTS`.
- **Marcar alertas como leídas/resueltas**: actualmente es local; falta endpoint (el listado/eliminación ya usan `/alerts`).
- **Cambio de contraseña** (`POST /auth/change-password`), **cambio de plan** y **preferencias de apariencia/notificaciones**: el frontend está preparado; faltan endpoints del backend.
- **Recuperación con OTP/correo**: el flujo temporal (reset directo) está desacoplado para poder añadirlo después.
