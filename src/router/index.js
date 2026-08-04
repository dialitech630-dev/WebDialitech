import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import RegisterView from '../modules/register/views/RegisterView.vue';
import PlansView from '../modules/plans/views/PlansView.vue';
import ForgotPasswordView from '../modules/authentication/views/ForgotPasswordView.vue';
import ResetPasswordView from '../modules/authentication/views/ResetPasswordView.vue';
import DashboardView from '../pages/DashboardView.vue';
import PatientsView from '../modules/patients/views/PatientsView.vue';
import PatientDetailView from '../modules/patients/views/PatientDetailView.vue';
import AlertsView from '../modules/alerts/views/AlertsView.vue';
import SettingsView from '../modules/settings/views/SettingsView.vue';
import ForbiddenView from '../pages/ForbiddenView.vue';
import UpgradeRequiredView from '../pages/UpgradeRequiredView.vue';
import NotFoundView from '../pages/NotFoundView.vue';
import { PUBLIC_ROUTES, GUEST_ONLY_ROUTES, ROUTE_ACTION_DEFAULT } from '../config/security';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import tokenService from '../services/token.service';
import permissionService from '../services/permission.service';

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: Home, meta: { public: true } },
      { path: 'login', name: 'login', component: Login, meta: { public: true } },
      { path: 'register', name: 'register', component: RegisterView, meta: { public: true } },
      { path: 'plans', name: 'plans', component: PlansView, meta: { public: true } },
      { path: 'forgot-password', name: 'forgot-password', component: ForgotPasswordView, meta: { public: true } },
      { path: 'reset-password', name: 'reset-password', component: ResetPasswordView, meta: { public: true } },
    ],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true, module: 'dashboard' } },
    ],
  },
  {
    path: '/patients',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'patients', component: PatientsView, meta: { requiresAuth: true, module: 'patients' } },
      { path: ':id', name: 'patient-detail', component: PatientDetailView, meta: { requiresAuth: true, module: 'patients' } },
    ],
  },
  {
    path: '/alerts',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'alerts', component: AlertsView, meta: { requiresAuth: true, module: 'alerts' } },
    ],
  },
  {
    path: '/settings',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'settings', component: SettingsView, meta: { requiresAuth: true, module: 'settings' } },
    ],
  },
  {
    path: '/forbidden',
    component: PublicLayout,
    children: [
      { path: '', name: 'forbidden', component: ForbiddenView, meta: { public: true } },
    ],
  },
  {
    path: '/upgrade-required',
    component: PublicLayout,
    children: [
      { path: '', name: 'upgrade-required', component: UpgradeRequiredView, meta: { public: true } },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  const sub = useSubscriptionStore();

  const isPublic = to.meta.public || PUBLIC_ROUTES.includes(to.name);

  if (isPublic) {
    if (auth.isAuthenticated && GUEST_ONLY_ROUTES.includes(to.name)) {
      return { name: 'dashboard' };
    }
    return true;
  }

  if (!to.meta.requiresAuth) {
    return true;
  }

  if (!auth.isAuthenticated || !tokenService.getToken()) {
    auth.logout();
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  const validToken = tokenService.isTokenValid(tokenService.getToken());
  if (!validToken) {
    auth.logout();
    return { name: 'login', query: { redirect: to.fullPath, expired: '1' } };
  }

  if (!auth.userLoaded) {
    const ok = await auth.refreshSession();
    if (!ok) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }
  }

  sub.syncFromAuth();

  const routeModule = to.meta.module;
  if (routeModule) {
    const action = to.meta.permission || ROUTE_ACTION_DEFAULT;

    if (!permissionService.roleAllows(auth.role, routeModule)) {
      return { name: 'forbidden' };
    }

    if (!permissionService.can(auth.plan, auth.role, action, routeModule)) {
      if (!permissionService.hasFeature(auth.plan, routeModule)) {
        return { name: 'upgrade-required', query: { feature: routeModule } };
      }
      return { name: 'forbidden' };
    }
  }

  return true;
});

export default router;
