<template>
  <div class="page-mathang">
    <div class="page-header-actions">
      <button class="btn btn-primary" @click="showForm = true">
        <Plus :size="16" />
        Thêm mặt hàng
      </button>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Mã</th><th>Tên mặt hàng</th><th>ĐVT</th><th>Số lượng tồn</th><th>Thao tác</th></tr></thead>
            <tbody>
              <tr v-for="mh in matHangs" :key="mh.MaMatHang">
                <td><strong>MH{{ String(mh.MaMatHang).padStart(3,'0') }}</strong></td>
                <td>{{ mh.TenMatHang }}</td>
                <td>{{ mh.dvt?.TenDVT }}</td>
                <td><span :class="mh.SoLuongTon <= 10 ? 'text-danger' : 'text-success'">{{ mh.SoLuongTon }}</span></td>
                <td><div class="action-btns">
                  <button class="btn btn-sm btn-secondary" @click="editItem(mh)">Sửa</button>
                  <button class="btn btn-sm btn-danger" @click="deleteItem(mh.MaMatHang)">Xóa</button>
                </div></td>
              </tr>
              <tr v-if="matHangs.length === 0"><td colspan="5" class="empty-cell">Chưa có mặt hàng nào.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-content">
        <div class="modal-header"><h3>{{ editingId ? 'Sửa mặt hàng' : 'Thêm mặt hàng' }}</h3><button class="modal-close" @click="closeForm">✕</button></div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Tên mặt hàng *</label><input v-model="form.TenMatHang" class="form-input" placeholder="Nhập tên" /></div>
          <div class="form-group"><label class="form-label">Đơn vị tính *</label>
            <select v-model="form.MaDVT" class="form-select"><option value="">Chọn ĐVT</option><option v-for="d in dvts" :key="d.MaDVT" :value="d.MaDVT">{{ d.TenDVT }}</option></select>
          </div>
          <div class="form-group"><label class="form-label">Số lượng tồn ban đầu</label><input v-model.number="form.SoLuongTon" type="number" class="form-input" min="0" /></div>
          <div class="form-actions">
            <button class="btn btn-secondary" @click="closeForm">Hủy</button>
            <button class="btn btn-primary" @click="submitForm">{{ editingId ? 'Cập nhật' : 'Thêm' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../services/api';
import { Plus, Pencil, Trash2 } from 'lucide-vue-next';

const matHangs = ref([]); const dvts = ref([]); const showForm = ref(false); const editingId = ref(null);
const form = reactive({ TenMatHang: '', MaDVT: '', SoLuongTon: 0 });

const resetForm = () => { Object.assign(form, { TenMatHang: '', MaDVT: '', SoLuongTon: 0 }); editingId.value = null; };
const closeForm = () => { showForm.value = false; resetForm(); };

const fetchData = async () => {
  try {
    const [mhRes] = await Promise.all([api.get('/mat-hang')]);
    matHangs.value = mhRes.data.data;
    // extract unique DVTs
    const dvtSet = new Map();
    matHangs.value.forEach(mh => { if (mh.dvt) dvtSet.set(mh.dvt.MaDVT, mh.dvt); });
    dvts.value = Array.from(dvtSet.values());
    if (dvts.value.length === 0) dvts.value = [{ MaDVT: 1, TenDVT: 'Cái' }, { MaDVT: 2, TenDVT: 'Hộp' }, { MaDVT: 3, TenDVT: 'Thùng' }, { MaDVT: 4, TenDVT: 'Kg' }, { MaDVT: 5, TenDVT: 'Lít' }];
  } catch (error) { console.error(error); }
};

const editItem = (mh) => { Object.assign(form, { TenMatHang: mh.TenMatHang, MaDVT: mh.MaDVT, SoLuongTon: mh.SoLuongTon }); editingId.value = mh.MaMatHang; showForm.value = true; };

const submitForm = async () => {
  if (!form.TenMatHang || !form.MaDVT) return;
  try {
    if (editingId.value) await api.put(`/mat-hang/${editingId.value}`, form);
    else await api.post('/mat-hang', form);
    closeForm(); await fetchData();
  } catch (error) { alert(error.response?.data?.message || 'Lỗi'); }
};

const deleteItem = async (id) => {
  if (!confirm('Xóa mặt hàng này?')) return;
  try { await api.delete(`/mat-hang/${id}`); await fetchData(); } catch (error) { alert('Lỗi khi xóa'); }
};

onMounted(fetchData);
</script>

<style scoped>
.page-header-actions { display: flex; justify-content: flex-end; margin-bottom: 20px; }
.action-btns { display: flex; gap: 6px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.text-danger { color: var(--danger); font-weight: 600; }
.text-success { color: var(--success); font-weight: 600; }
.empty-cell { text-align: center; padding: 40px !important; color: var(--gray-400); }
</style>
