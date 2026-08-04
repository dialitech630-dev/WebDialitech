# Reporte de Limpieza — Código Muerto

Fecha: 31/07/2026
Resultado: `npm run build` OK (267 módulos), `npm run dev` OK (HTTP 200). Sin imports rotos ni rutas huérfanas.

## Código eliminado (26 archivos, ~77.1 KB)

### Vistas / páginas legacy no enrutadas (7)
| Archivo | Motivo |
| --- | --- |
| `src/pages/Alerts.vue` | No registrada en `src/router/index.js`; existe `modules/alerts/views/AlertsView.vue` |
| `src/pages/ClinicalDashboard.vue` | No registrada; existe `pages/DashboardView.vue` |
| `src/pages/PatientDetail.vue` | No registrada; existe `modules/patients/views/PatientDetailView.vue` |
| `src/pages/Reports.vue` | No registrada |
| `src/pages/Settings.vue` | No registrada; existe `modules/settings/views/SettingsView.vue` |
| `src/modules/user-management/views/UserManagementView.vue` | No registrada ni importada (vista dormant con datos mock) |
| `src/components/PatientDashboardView.vue` | Solo mencionada en docs; nunca importada |

### Layout y módulo user-management completo (7)
| Archivo | Motivo |
| --- | --- |
| `src/layouts/MainLayout.vue` | Nunca registrado en el router; además importaba `Navbar.vue` inexistente |
| `src/modules/user-management/components/UsersTable.vue` | Solo la usaba `UserManagementView` |
| `src/modules/user-management/components/UserRow.vue` | Solo la usaba `UsersTable` |
| `src/modules/user-management/components/UsersHeader.vue` | Solo la usaba `UserManagementView` |
| `src/modules/user-management/components/UsersToolbar.vue` | Solo la usaba `UserManagementView` |
| `src/modules/user-management/components/UserActions.vue` | Solo la usaba `UserRow` |
| `src/modules/user-management/data/users.js` | Mock solo consumido por `UsersToolbar` y `userStore` |

### Stores / servicios / composables (4)
| Archivo | Motivo |
| --- | --- |
| `src/stores/userStore.js` | Solo la usaba `UserManagementView` |
| `src/services/userService.js` | Solo lo usaba `userStore` |
| `src/composables/usePermission.js` | Cero referencias en todo el proyecto |
| `src/modules/settings/components/GeneralSettingsCard.vue` | Nunca importada; Settings usa `SystemInformationCard` (que conserva `data/settings.js`) |
| `src/modules/settings/components/AvatarUploader.vue` | Nunca importada; `ProfileSettings` implementa el upload inline |

### Componentes de detalle de paciente huérfanos (3)
| Archivo | Motivo |
| --- | --- |
| `src/modules/patients/components/detail/PatientAlerts.vue` | Nunca importada |
| `src/modules/patients/components/detail/PatientHistory.vue` | Nunca importada |
| `src/modules/patients/components/detail/VitalSignsCard.vue` | Nunca importada |

### Assets no referenciados (4)
| Archivo | Motivo |
| --- | --- |
| `public/icons.svg` | Cero referencias |
| `src/assets/hero.png` | La sección hero usa SVG inline en `Home.vue` |
| `src/assets/vite.svg` | Logo de plantilla Vite sin uso |
| `src/assets/vue.svg` | Logo de plantilla Vite sin uso |

## Conservados a propósito
- `src/modules/user-management/components/RoleBadge.vue` y `UserStatusBadge.vue` — usados por `AccountSettings.vue` en Settings.
- `src/services/types.js` — typedefs de JSDoc referenciados por `auth/auth.service.js` y `token.service.js` (valor documental, no llega al bundle).
- `src/modules/settings/data/settings.js` — usado por `SystemInformationCard.vue`.
- `src/modules/patients/components/detail/PatientProfileCard.vue` y `PatientInfoCard.vue` — usados por `PatientDetailView.vue`.
- `public/favicon.svg` y `public/theme-init.js` — referenciados en `index.html`.
- `src/composables/useAccount/useProfile/useAppearance/useSubscription/useNotifications.js` — verificados con importadores reales.

## Bug corregido durante la auditoría
`src/style.css` (design system: variables de tema `theme-dark/light`, `font-small/medium/large`, `compact-mode`, tipografía fluida y reglas responsive globales de modales) **no estaba importado** en `src/main.js`. El build no incluía el tema y las reglas globales responsive no se aplicaban. Se añadió `import './style.css';` en `src/main.js`; verificado en `dist/assets/index-*.css` (variables de tema y 9 media queries presentes).

## Tamaño reducido
- ~77.1 KB de código muerto eliminados (25 archivos rastreados por git + `usePermission.js` sin trackear).
- Bundle JS: 332.14 kB (sin cambios; el código eliminado no se bundleaba al no tener imports).
- Bundle CSS: 115.55 kB (+2.88 kB: ahora sí incluye `style.css`, el design system antes omitido).

## Mejoras adicionales sugeridas
- Módulo `src/modules/user-management/` queda con solo `RoleBadge.vue` y `UserStatusBadge.vue`; si más adelante no se quiere el módulo, mover ambos a un directorio compartido (`src/components/`).
- `src/i18n/` y `src/config/permissions.js` (ya borrado en una fase previa) validar que no queden referencias sueltas.
- Revisar periódicamente con búsquedas de imports huérfanos tras cada feature (Vite no avisa de componentes sin usar).
