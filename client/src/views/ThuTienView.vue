<template>
  <div class="page-thu">
    <div class="page-header-actions">
      <button class="btn btn-primary" @click="showForm = true">
        <Plus :size="16" />
        Lập phiếu thu
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Mã PT</th><th>Đại lý</th><th>Ngày thu</th><th>Số tiền thu</th></tr></thead>
            <tbody>
              <tr v-for="p in phieuThus" :key="p.MaPT">
                <td><strong>PT{{ String(p.MaPT).padStart(3,'0') }}</strong></td>
                <td>{{ p.daiLy?.TenDaiLy }}</td>
                <td>{{ formatDate(p.NgayThu) }}</td>
                <td class="text-success">{{ formatCurrency(p.SoTienThu) }}</td>
              </tr>
              <tr v-if="phieuThus.length === 0"><td colspan="4" class="empty-cell">Chưa có phiếu thu nào.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-content">
        <div class="modal-header"><h3>Lập phiếu thu tiền</h3><button class="modal-close" @click="showForm = false">✕</button></div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Đại lý *</label>
            <select v-model="form.MaDaiLy" class="form-select" @change="onSelectDaiLy">
              <option value="">Chọn đại lý</option>
              <option v-for="dl in daiLysWithDebt" :key="dl.MaDaiLy" :value="dl.MaDaiLy">{{ dl.TenDaiLy }} — Nợ: {{ formatCurrency(dl.TienNo) }}</option>
            </select>
          </div>
          <div v-if="selectedDebt !== null" class="debt-display">
            Tiền nợ hiện tại: <strong :class="{ 'text-danger': selectedDebt > 0 }">{{ formatCurrency(selectedDebt) }}</strong>
          </div>
          <div class="form-group">
            <label class="form-label">Ngày thu</label>
            <input v-model="form.NgayThu" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Số tiền thu * <span style="font-weight: 400; color: var(--gray-400);">(≤ tiền nợ)</span></label>
            <input v-model.number="form.SoTienThu" type="number" class="form-input" min="1" :max="selectedDebt" placeholder="Nhập số tiền" />
          </div>
          <div v-if="formError" class="error-msg">{{ formError }}</div>
          <div class="form-actions">
            <button class="btn btn-secondary" @click="showForm = false">Hủy</button>
            <button class="btn btn-success" @click="submitForm" :disabled="submitting">{{ submitting ? 'Đang lưu...' : 'Lập phiếu' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '../services/api';
import { Plus } from 'lucide-vue-next';

const phieuThus = ref([]);
const daiLys = ref([]);
const showForm = ref(false);
const submitting = ref(false);
const formError = ref('');
const selectedDebt = ref(null);

const daiLysWithDebt = computed(() => daiLys.value.filter(dl => parseFloat(dl.TienNo) > 0));

const form = reactive({ MaDaiLy: '', NgayThu: new Date().toISOString().split('T')[0], SoTienThu: 0 });

const onSelectDaiLy = () => {
  const dl = daiLys.value.find(d => d.MaDaiLy === form.MaDaiLy);
  selectedDebt.value = dl ? parseFloat(dl.TienNo) : null;
  form.SoTienThu = 0;
};

const fetchData = async () => {
  try {
    const [ptRes, dlRes] = await Promise.all([api.get('/phieu-thu'), api.get('/dai-ly')]);
    phieuThus.value = ptRes.data.data; daiLys.value = dlRes.data.data;
  } catch (error) { console.error(error); }
};

const submitForm = async () => {
  if (!form.MaDaiLy || !form.SoTienThu || form.SoTienThu <= 0) { formError.value = 'Vui lòng điền đầy đủ thông tin.'; return; }
  submitting.value = true; formError.value = '';
  try {
    await api.post('/phieu-thu', form);
    showForm.value = false; selectedDebt.value = null;
    form.MaDaiLy = ''; form.SoTienThu = 0;
    await fetchData();
  } catch (error) {
    formError.value = error.response?.data?.message || 'Lỗi khi lập phiếu thu.';
  } finally { submitting.value = false; }
};

const formatCurrency = (n) => (parseFloat(n) || 0).toLocaleString('vi-VN') + 'đ';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
onMounted(fetchData);
</script>

<style scoped>
.page-header-actions { display: flex; justify-content: flex-end; margin-bottom: 20px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.text-success { color: var(--success); font-weight: 600; }
.text-danger { color: var(--danger); font-weight: 600; }
.empty-cell { text-align: center; padding: 40px !important; color: var(--gray-400); }
.error-msg { margin-top: 12px; padding: 12px; background: var(--danger-light); border-radius: var(--radius-md); color: var(--danger); font-size: 0.85rem; }
.debt-display { padding: 12px 16px; background: var(--warning-light); border-radius: var(--radius-md); margin-bottom: 16px; font-size: 0.9rem; }
</style>
