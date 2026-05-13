import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/layout/MainLayout.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'dai-ly-list',
        name: 'HoSoDaiLyList',
        component: () => import('../views/HoSoDaiLyListView.vue'),
      },
      {
        path: 'dai-ly/:id',
        name: 'HoSoDaiLy',
        component: () => import('../views/HoSoDaiLyView.vue'),
      },
      {
        path: 'dai-ly',
        name: 'DaiLy',
        component: () => import('../views/DaiLyView.vue'),
      },
      {
        path: 'mat-hang',
        name: 'MatHang',
        component: () => import('../views/MatHangView.vue'),
      },
      {
        path: 'phieu-nhap',
        name: 'PhieuNhap',
        component: () => import('../views/PhieuNhapView.vue'),
      },
      {
        path: 'phieu-xuat',
        name: 'PhieuXuat',
        component: () => import('../views/PhieuXuatView.vue'),
      },
      {
        path: 'tra-cuu',
        name: 'TraCuu',
        component: () => import('../views/TraCuuView.vue'),
      },
      {
        path: 'thu-tien',
        redirect: '/tra-cuu',
      },
      {
        path: 'bao-cao',
        name: 'BaoCao',
        component: () => import('../views/BaoCaoView.vue'),
      },
      {
        path: 'cai-dat',
        name: 'CaiDat',
        component: () => import('../views/CaiDatView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard - kiểm tra đăng nhập
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');
  const isPublic = to.meta?.public;

  // Auto-set dummy token for demo/dev if not exists
  if (!token && !isPublic) {
    const dummyToken = 'demo_token_' + Date.now();
    localStorage.setItem('token', dummyToken);
    token = dummyToken;
  }

  if (!isPublic && !token) {
    return next('/login');
  }

  // Nếu đã login mà vào /login → redirect dashboard
  if (to.path === '/login' && token) {
    return next('/dashboard');
  }

  next();
});

export default router;
