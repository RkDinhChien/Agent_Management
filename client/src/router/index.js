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
        meta: { permission: 'DaiLyView' },
      },
      {
        path: 'dai-ly/:id',
        name: 'HoSoDaiLy',
        component: () => import('../views/HoSoDaiLyView.vue'),
        meta: { permission: 'DaiLyView' },
      },
      {
        path: 'dai-ly',
        name: 'DaiLy',
        component: () => import('../views/DaiLyView.vue'),
        meta: { permission: 'DaiLyView' },
      },
      {
        path: 'mat-hang',
        name: 'MatHang',
        component: () => import('../views/MatHangView.vue'),
        meta: { permission: 'MatHangView' },
      },
      {
        path: 'phieu-nhap',
        name: 'PhieuNhap',
        component: () => import('../views/PhieuNhapView.vue'),
        meta: { permission: 'PhieuNhapView' },
      },
      {
        path: 'phieu-xuat',
        name: 'PhieuXuat',
        component: () => import('../views/PhieuXuatView.vue'),
        meta: { permission: 'PhieuXuatView' },
      },
      {
        path: 'tra-cuu',
        name: 'TraCuu',
        component: () => import('../views/TraCuuView.vue'),
        meta: { permission: 'TraCuuView' },
      },
      {
        path: 'thu-tien',
        name: 'ThuTien',
        component: () => import('../views/ThuTienView.vue'),
        meta: { permission: 'ThuTienView' },
      },
      {
        path: 'phan-quyen',
        name: 'PhanQuyen',
        component: () => import('../views/PhanQuyenView.vue'),
        meta: { permission: 'PhanQuyenView' },
      },
      {
        path: 'bao-cao',
        name: 'BaoCao',
        component: () => import('../views/BaoCaoView.vue'),
        meta: { permission: 'BaoCaoView' },
      },
      {
        path: 'cai-dat',
        name: 'CaiDat',
        component: () => import('../views/CaiDatView.vue'),
        meta: { permission: 'CaiDatView' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const hasViewPermission = (to) => {
  if (!to.meta?.permission) return true;

  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return (user.permissions || []).some(
      (p) => p.TenManHinhDuocLoad === to.meta.permission && p.Xem
    );
  } catch (error) {
    return false;
  }
};

// Navigation guard - kiểm tra đăng nhập và phân quyền
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isPublic = to.meta?.public;

  if (!isPublic && !token) {
    return next('/login');
  }

  if (to.path === '/login' && token) {
    return next('/dashboard');
  }

  if (!isPublic && token && !hasViewPermission(to)) {
    return next('/dashboard');
  }

  next();
});

export default router;
