<template>
  <div class="page-caidat">
    <h1 class="page-main-title">Cài đặt hệ thống</h1>
    <p class="page-main-sub">Quản lý các quy định và tham số hoạt động • QĐ7</p>

    <div class="param-grid">
      <div v-for="(ts, i) in thamSos" :key="ts.MaThamSo" class="param-card">
        <div class="param-card-header">
          <div class="param-icon" :style="{ background: paramColors[i % paramColors.length].bg }">
            <component :is="paramIcons[i % paramIcons.length]" :size="18" :color="paramColors[i % paramColors.length].fg" />
          </div>
          <button v-if="isAdmin" class="edit-icon-btn" @click="startEdit(ts)"><Pencil :size="14" /></button>
        </div>
        <h4 class="param-name">{{ ts.TenThamSo }}</h4>
        <p class="param-desc">{{ ts.MoTa || 'Tham số hệ thống' }}</p>
        <div class="param-value-display">
          <span class="param-big-value">{{ formatParamValue(ts) }}</span>
          <span class="param-unit">{{ getUnit(ts) }}</span>
        </div>
      </div>

      <!-- Add New Card (placeholder) -->
      <div class="param-card param-card-add" v-if="isAdmin">
        <div class="add-card-content">
          <Plus :size="24" color="var(--gray-300)" />
          <span>Thêm quy định mới</span>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingParam" class="modal-overlay" @click.self="editingParam = null">
      <div class="modal-content" style="max-width: 440px;">
        <div class="modal-header">
          <h3>Sửa tham số</h3>
          <button class="modal-close" @click="editingParam = null"><X :size="18" /></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Tên tham số</label>
            <input type="text" class="form-input" :value="editingParam.TenThamSo" disabled />
          </div>
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <input type="text" class="form-input" :value="editingParam.MoTa" disabled />
          </div>
          <div class="form-group">
            <label class="form-label">Giá trị</label>
            <input v-model="editValue" type="text" class="form-input" />
          </div>
          <div v-if="editError" class="alert alert-error">{{ editError }}</div>
          <div class="form-actions">
            <button class="btn btn-secondary" @click="editingParam = null">Hủy</button>
            <button class="btn btn-primary" @click="saveParam" :disabled="saving">
              <Save :size="16" /> {{ saving ? 'Đang lưu...' : 'Lưu tham số' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';
import { Building, Hash, Package, AlertCircle, Percent, Pencil, Plus, X, Save } from 'lucide-vue-next';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.currentUser?.role === 'Admin');

const thamSos = ref([]);
const editingParam = ref(null);
const editValue = ref('');
const editError = ref('');
const saving = ref(false);

const paramColors = [
  { bg: '#e0f2fe', fg: '#0284c7' },
  { bg: '#d1fae5', fg: '#059669' },
  { bg: '#f3e8ff', fg: '#7c3aed' },
  { bg: '#fee2e2', fg: '#dc2626' },
  { bg: '#fef3c7', fg: '#d97706' },
];
const paramIcons = [Building, Hash, Package, AlertCircle, Percent];

const formatParamValue = (ts) => {
  const v = parseFloat(ts.GiaTri);
  if (isNaN(v)) return ts.GiaTri;
  if (v >= 1e6) return (v / 1e6).toFixed(0) + 'M';
  return v.toLocaleString('vi-VN');
};

const getUnit = (ts) => {
  const name = ts.TenThamSo?.toLowerCase() || '';
  if (name.includes('loại') || name.includes('loai')) return 'Loại';
  if (name.includes('đại lý') || name.includes('dai ly')) return 'Đại lý';
  if (name.includes('mặt hàng') || name.includes('mat hang')) return 'Mặt hàng';
  if (name.includes('nợ') || name.includes('no')) return 'VND';
  if (name.includes('%') || name.includes('tỷ lệ') || name.includes('ty le')) return '% Giá nhập';
  return '';
};

const startEdit = (ts) => {
  editingParam.value = ts;
  editValue.value = ts.GiaTri;
  editError.value = '';
};

const saveParam = async () => {
  saving.value = true;
  editError.value = '';
  try {
    await api.put(`/tham-so/${editingParam.value.MaThamSo}`, { GiaTri: editValue.value });
    editingParam.value.GiaTri = editValue.value;
    editingParam.value = null;
  } catch (e) {
    editError.value = e.response?.data?.message || 'Lỗi khi lưu.';
  } finally { saving.value = false; }
};

onMounted(async () => {
  try { const r = await api.get('/tham-so'); thamSos.value = r.data.data || []; } catch (e) { console.error(e); }
});
</script>

<style scoped>
.page-main-title { font-size: 1.6rem; font-weight: 800; color: var(--gray-900); margin-bottom: 4px; }
.page-main-sub { font-size: 0.9rem; color: var(--gray-400); margin-bottom: 28px; }

.param-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 900px) { .param-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .param-grid { grid-template-columns: 1fr; } }

.param-card {
  background: white; border-radius: 18px; padding: 24px; border: 1px solid var(--gray-100);
  box-shadow: var(--shadow-sm); transition: all var(--transition-base); position: relative;
}
.param-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

.param-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.param-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

.edit-icon-btn {
  width: 32px; height: 32px; border: none; background: var(--gray-50); border-radius: 8px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--gray-400);
  transition: all var(--transition-fast);
}
.edit-icon-btn:hover { background: var(--gray-100); color: var(--gray-600); }

.param-name { font-size: 0.9rem; font-weight: 700; color: var(--gray-800); margin-bottom: 4px; }
.param-desc { font-size: 0.78rem; color: var(--gray-400); line-height: 1.4; margin-bottom: 16px; min-height: 32px; }

.param-value-display { display: flex; align-items: baseline; gap: 6px; }
.param-big-value { font-size: 1.8rem; font-weight: 800; color: var(--primary-600); }
.param-unit { font-size: 0.82rem; color: var(--gray-400); font-weight: 500; }

.param-card-add {
  border: 2px dashed var(--gray-200); background: var(--gray-50);
  display: flex; align-items: center; justify-content: center; cursor: pointer; min-height: 200px;
}
.param-card-add:hover { border-color: var(--gray-300); background: var(--gray-100); }
.add-card-content { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--gray-400); font-size: 0.85rem; }

.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
.alert { padding: 12px; border-radius: var(--radius-md); font-size: 0.85rem; margin-top: 12px; }
.alert-error { background: var(--danger-light); color: var(--danger); }
</style>
