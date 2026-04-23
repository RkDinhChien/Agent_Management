<template>
  <div class="page-phieu">
    <div class="page-header-actions">
      <button class="btn btn-primary" @click="showForm = true">
        <Plus :size="16" />
        Lập phiếu xuất
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Mã PX</th><th>Đại lý</th><th>Ngày xuất</th><th>Số mặt hàng</th><th>Tổng tiền</th><th>Thao tác</th></tr></thead>
            <tbody>
              <tr v-for="p in phieuXuats" :key="p.MaPX">
                <td><strong>PX{{ String(p.MaPX).padStart(3,'0') }}</strong></td>
                <td>{{ p.daiLy?.TenDaiLy }}</td>
                <td>{{ formatDate(p.NgayXuat) }}</td>
                <td>{{ p.chiTiets?.length || 0 }}</td>
                <td class="text-primary">{{ formatCurrency(p.TongTien) }}</td>
                <td><button class="btn btn-sm btn-secondary" @click="selectedPhieu = p">Chi tiết</button></td>
              </tr>
              <tr v-if="phieuXuats.length === 0"><td colspan="6" class="empty-cell">Chưa có phiếu xuất nào.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Form -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-content" style="max-width: 720px;">
        <div class="modal-header"><h3>Lập phiếu xuất hàng</h3><button class="modal-close" @click="showForm = false">✕</button></div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Đại lý *</label>
              <select v-model="form.MaDaiLy" class="form-select" @change="onSelectDaiLy">
                <option value="">Chọn đại lý</option>
                <option v-for="dl in daiLys" :key="dl.MaDaiLy" :value="dl.MaDaiLy">{{ dl.TenDaiLy }} (Nợ: {{ formatCurrency(dl.TienNo) }})</option>
              </select>
            </div>
            <div class="form-group" style="flex: 0.6;">
              <label class="form-label">Ngày xuất</label>
              <input v-model="form.NgayXuat" type="date" class="form-input" />
            </div>
          </div>

          <!-- Debt Warning -->
          <div v-if="debtInfo" class="debt-info" :class="{ 'debt-danger': debtInfo.nearLimit }">
            💰 Nợ hiện tại: <strong>{{ formatCurrency(debtInfo.tienNo) }}</strong> / Hạn mức: <strong>{{ formatCurrency(debtInfo.hanMuc) }}</strong>
          </div>

          <h4 style="margin: 16px 0 12px; color: var(--gray-700);">Chi tiết mặt hàng (giá tự động = 102% giá nhập)</h4>

          <div v-for="(ct, i) in form.chiTiets" :key="i" class="detail-row">
            <select v-model="ct.MaMatHang" class="form-select" style="flex: 2;">
              <option value="">Chọn mặt hàng</option>
              <option v-for="mh in matHangs" :key="mh.MaMatHang" :value="mh.MaMatHang">{{ mh.TenMatHang }} (Tồn: {{ mh.SoLuongTon }})</option>
            </select>
            <input v-model.number="ct.SoLuong" type="number" class="form-input" placeholder="SL" min="1" style="flex: 0.6;" />
            <button v-if="form.chiTiets.length > 1" class="btn btn-sm btn-danger" @click="form.chiTiets.splice(i, 1)">✕</button>
          </div>
          <button class="btn btn-sm btn-secondary" @click="form.chiTiets.push({ MaMatHang: '', SoLuong: 1 })" style="margin-top: 8px;">+ Thêm dòng</button>

          <div v-if="formError" class="error-msg">{{ formError }}</div>

          <div class="form-actions">
            <button class="btn btn-secondary" @click="showForm = false">Hủy</button>
            <button class="btn btn-primary" @click="submitForm" :disabled="submitting">{{ submitting ? 'Đang lưu...' : 'Lập phiếu' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedPhieu" class="modal-overlay" @click.self="selectedPhieu = null">
      <div class="modal-content" style="max-width: 640px;">
        <div class="modal-header"><h3>Phiếu PX{{ String(selectedPhieu.MaPX).padStart(3,'0') }}</h3><button class="modal-close" @click="selectedPhieu = null">✕</button></div>
        <div class="modal-body">
          <p style="color: var(--gray-500); margin-bottom: 16px;">Đại lý: <strong>{{ selectedPhieu.daiLy?.TenDaiLy }}</strong> | Ngày: {{ formatDate(selectedPhieu.NgayXuat) }}</p>
          <div class="table-wrapper">
            <table>
              <thead><tr><th>Mặt hàng</th><th>SL</th><th>Đơn giá xuất</th><th>Thành tiền</th></tr></thead>
              <tbody>
                <tr v-for="ct in selectedPhieu.chiTiets" :key="ct.MaMatHang">
                  <td>{{ ct.matHang?.TenMatHang }}</td><td>{{ ct.SoLuong }}</td>
                  <td>{{ formatCurrency(ct.DonGiaXuat) }}</td><td class="text-primary">{{ formatCurrency(ct.ThanhTien) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="total-line"><strong>Tổng: {{ formatCurrency(selectedPhieu.TongTien) }}</strong></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '../services/api';
import { Plus } from 'lucide-vue-next';

const phieuXuats = ref([]);
const daiLys = ref([]);
const matHangs = ref([]);
const showForm = ref(false);
const submitting = ref(false);
const formError = ref('');
const selectedPhieu = ref(null);
const debtInfo = ref(null);

const form = reactive({
  MaDaiLy: '', NgayXuat: new Date().toISOString().split('T')[0],
  chiTiets: [{ MaMatHang: '', SoLuong: 1 }],
});

const onSelectDaiLy = () => {
  const dl = daiLys.value.find(d => d.MaDaiLy === form.MaDaiLy);
  if (dl) {
    const hanMuc = parseFloat(dl.loaiDaiLy?.SoNoToiDa) || 0;
    const tienNo = parseFloat(dl.TienNo) || 0;
    debtInfo.value = { tienNo, hanMuc, nearLimit: tienNo >= hanMuc * 0.8 };
  } else { debtInfo.value = null; }
};

const fetchData = async () => {
  try {
    const [pxRes, dlRes, mhRes] = await Promise.all([api.get('/phieu-xuat'), api.get('/dai-ly'), api.get('/mat-hang')]);
    phieuXuats.value = pxRes.data.data;
    daiLys.value = dlRes.data.data;
    matHangs.value = mhRes.data.data;
  } catch (error) { console.error(error); }
};

const submitForm = async () => {
  if (!form.MaDaiLy) { formError.value = 'Vui lòng chọn đại lý.'; return; }
  const validDetails = form.chiTiets.filter(ct => ct.MaMatHang && ct.SoLuong > 0);
  if (validDetails.length === 0) { formError.value = 'Vui lòng chọn ít nhất 1 mặt hàng.'; return; }
  submitting.value = true; formError.value = '';
  try {
    await api.post('/phieu-xuat', { MaDaiLy: form.MaDaiLy, NgayXuat: form.NgayXuat, chiTiets: validDetails });
    showForm.value = false;
    form.chiTiets = [{ MaMatHang: '', SoLuong: 1 }]; form.MaDaiLy = ''; debtInfo.value = null;
    await fetchData();
  } catch (error) {
    formError.value = error.response?.data?.message || 'Lỗi khi lập phiếu xuất.';
  } finally { submitting.value = false; }
};

const formatCurrency = (n) => (parseFloat(n) || 0).toLocaleString('vi-VN') + 'đ';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
onMounted(fetchData);
</script>

<style scoped>
.page-header-actions { display: flex; justify-content: flex-end; margin-bottom: 20px; }
.form-row { display: flex; gap: 16px; }
.flex-1 { flex: 1; }
.detail-row { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.total-line { text-align: right; margin-top: 16px; padding-top: 16px; border-top: 2px solid var(--gray-100); font-size: 1.1rem; color: var(--primary-700); }
.text-primary { color: var(--primary-600); font-weight: 600; }
.empty-cell { text-align: center; padding: 40px !important; color: var(--gray-400); }
.error-msg { margin-top: 12px; padding: 12px; background: var(--danger-light); border-radius: var(--radius-md); color: var(--danger); font-size: 0.85rem; }
.debt-info { padding: 12px 16px; border-radius: var(--radius-md); background: var(--info-light); color: var(--gray-700); font-size: 0.875rem; margin-bottom: 12px; }
.debt-danger { background: var(--danger-light); color: var(--danger); }
</style>
