import { computed, ref, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';

/**
 * usePermission(screenName)
 * 
 * @param {string} screenName - TenManHinhDuocLoad khớp với bảng ChucNang
 * @returns {{ canView, canAdd, canEdit, canDelete, guardAction, permToast }}
 */
export function usePermission(screenName) {
  const authStore = useAuthStore();

  const isAdmin = computed(() => {
    const role = (authStore.user?.role || '').toLowerCase();
    return role === 'admin' || role.includes('quản trị') || role.includes('admin');
  });

  const _perm = computed(() => {
    if (!authStore.user) return null;
    if (isAdmin.value) return { Xem: true, Them: true, Sua: true, Xoa: true };
    return (authStore.user.permissions || []).find(
      (p) => p.TenManHinhDuocLoad === screenName
    ) ?? null;
  });

  const canView   = computed(() => isAdmin.value || !!_perm.value?.Xem);
  const canAdd    = computed(() => isAdmin.value || !!_perm.value?.Them);
  const canEdit   = computed(() => isAdmin.value || !!_perm.value?.Sua);
  const canDelete = computed(() => isAdmin.value || !!_perm.value?.Xoa);

  // Toast state
  const permToast = ref({ show: false, msg: '' });
  let _timer = null;

  const _showToast = (msg) => {
    clearTimeout(_timer);
    permToast.value = { show: true, msg };
    _timer = setTimeout(() => { permToast.value.show = false; }, 2800);
  };

  onUnmounted(() => clearTimeout(_timer));

  /**
   * Kiểm tra quyền trước khi thực hiện action.
   * Trả về true nếu có quyền, false và hiện toast nếu không có.
   * 
   * @param {'add'|'edit'|'delete'} action
   * @returns {boolean}
   */
  const guardAction = (action) => {
    const map = { add: canAdd, edit: canEdit, delete: canDelete };
    if (map[action]?.value) return true;
    _showToast('Bạn không có quyền thực hiện chức năng này');
    return false;
  };

  return { canView, canAdd, canEdit, canDelete, guardAction, permToast };
}
