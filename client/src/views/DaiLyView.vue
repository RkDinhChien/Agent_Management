<template>
  <div class="daily-management-page">
    <!-- Notification Toast -->
    <Transition name="toast">
      <div v-if="notification.show" class="toast-notification" :class="notification.type">
        {{ notification.message }}
      </div>
    </Transition>

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Quản Lý Đại Lý</h1>
        <p>Danh sách các đối tác và nhà phân phối trên hệ thống</p>
      </div>
      <div class="header-right">
        <button class="btn-icon" @click="fetchData" :disabled="loading" title="Làm mới">
          <RefreshCcw :size="18" :class="{ 'spin': loading }" />
        </button>
        <button class="btn-icon" @click="exportToExcel" title="Xuất Excel" :disabled="loading">
          <Download :size="18" />
        </button>
        <button class="btn-primary" @click="showAddModal = true" :disabled="loading">
          <Plus :size="18" />
          <span>Thêm Đại Lý</span>
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-grid">
      <div class="stat-card card-box shadow-sm">
        <div class="stat-icon" style="background: #ecfdf5; color: #10b981;">
          <Users :size="24" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Tổng Đại Lý</span>
          <h3 class="stat-value">{{ daiLys.length }}</h3>
        </div>
      </div>
      <div class="stat-card card-box shadow-sm">
        <div class="stat-icon" style="background: #eff6ff; color: #2563eb;">
          <MapPin :size="24" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Khu Vực Phủ Sóng</span>
          <h3 class="stat-value">{{ quans.length }}</h3>
        </div>
      </div>
      <div class="stat-card card-box shadow-sm">
        <div class="stat-icon" style="background: #fff7ed; color: #f97316;">
          <Wallet :size="24" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Dư Nợ TB/Đại Lý</span>
          <h3 class="stat-value">{{ (avgDebt / 1000000).toFixed(1) }}Tr</h3>
        </div>
      </div>
      <div class="stat-card card-box shadow-sm">
        <div class="stat-icon" style="background: #fef3c7; color: #ca8a04;">
          <AlertCircle :size="24" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Nợ Lớn (>40Tr)</span>
          <h3 class="stat-value">{{ daiLys.filter(d => d.TienNo > 40000000).length }}</h3>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="table-card card-box shadow-sm p-0">
      <!-- Table Header with Filters -->
      <div class="table-header">
        <div class="search-box">
          <Search :size="18" />
          <input 
            v-model="searchText" 
            type="text" 
            placeholder="Tìm tên, SĐT hoặc email..."
          />
        </div>
        
        <div class="filter-group">
          <select v-model="filterQuan" class="filter-select">
            <option value="">Tất cả khu vực</option>
            <option v-for="q in quans" :key="q.MaQuan" :value="q.MaQuan">
              {{ q.TenQuan }}
            </option>
          </select>
          <select v-model="filterLoai" class="filter-select">
            <option value="">Loại đại lý</option>
            <option v-for="l in loaiDaiLys" :key="l.MaLoai" :value="l.MaLoai">
              {{ l.TenLoai }}
            </option>
          </select>
          <select v-model="filterDebt" class="filter-select">
            <option value="">Trạng thái nợ</option>
            <option value="no">Có nợ</option>
            <option value="no-high">Nợ lớn (>40tr)</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Thông Tin</th>
              <th>Loại</th>
              <th>Khu Vực</th>
              <th>Điện Thoại</th>
              <th>Dư Nợ</th>
              <th style="text-align: right;">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dl in paginatedDaiLys" :key="dl.MaDaiLy" class="table-row">
              <td class="cell-code">#{{ String(dl.MaDaiLy).padStart(3, '0') }}</td>
              <td class="cell-info">
                <div class="info-group">
                  <div class="avatar" :style="{ background: getAvatarColor(dl.TenDaiLy) }">
                    {{ dl.TenDaiLy.charAt(0).toUpperCase() }}
                  </div>
                  <div class="info-text">
                    <strong>{{ dl.TenDaiLy }}</strong>
                    <span>{{ dl.DiaChi || 'N/A' }}</span>
                  </div>
                </div>
              </td>
              <td class="cell-type">
                <span class="badge" :class="dl.loaiDaiLy?.TenLoai === 'Loại 1' ? 'badge-primary' : 'badge-secondary'">
                  {{ dl.loaiDaiLy?.TenLoai || 'N/A' }}
                </span>
              </td>
              <td class="cell-location">{{ dl.quan?.TenQuan || 'N/A' }}</td>
              <td class="cell-phone">{{ dl.DienThoai }}</td>
              <td class="cell-debt" :class="{ 'debt-high': dl.TienNo > 40000000 }">
                {{ fmtCurrency(dl.TienNo) }}
              </td>
              <td class="cell-actions">
                <button class="btn-action btn-view" @click="viewDaiLy(dl)" title="Xem">
                  <Eye :size="16" />
                </button>
                <button class="btn-action btn-edit" @click="editDaiLy(dl)" title="Chỉnh sửa">
                  <Pencil :size="16" />
                </button>
                <button class="btn-action btn-delete" @click="deleteDaiLy(dl)" title="Xóa">
                  <span v-if="deleteLoading === dl.MaDaiLy" class="spinner-mini"></span>
                  <Trash2 v-else :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredDaiLys.length === 0" class="empty-state">
          <Search :size="48" />
          <p>Không tìm thấy đại lý nào</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button class="btn-page" :disabled="currentPage === 1" @click="currentPage--">
          ← Trước
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button class="btn-page" :disabled="currentPage === totalPages" @click="currentPage++">
          Sau →
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content card-box">
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-icon" :class="{ 'edit': editingId }">
              <UserPlus v-if="!editingId" :size="24" />
              <Pencil v-else :size="24" />
            </div>
            <div>
              <h3>{{ editingId ? 'Cập Nhật Đại Lý' : 'Thêm Đại Lý Mới' }}</h3>
              <p>Vui lòng nhập thông tin đầy đủ</p>
            </div>
          </div>
          <button class="btn-close" @click="closeModal"><X :size="20" /></button>
        </div>

        <form @submit.prevent="saveDaiLy" class="modal-form">
          <div class="form-grid">
            <div class="form-group full">
              <label>Tên Đại Lý *</label>
              <input 
                v-model="form.TenDaiLy" 
                type="text" 
                placeholder="Nhập tên đại lý" 
                required 
              />
            </div>

            <div class="form-group">
              <label>Loại Đại Lý</label>
              <select v-model="form.MaLoai" required>
                <option value="">Chọn loại</option>
                <option v-for="l in loaiDaiLys" :key="l.MaLoai" :value="l.MaLoai">
                  {{ l.TenLoai }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Khu Vực</label>
              <select v-model="form.MaQuan" required>
                <option value="">Chọn khu vực</option>
                <option v-for="q in quans" :key="q.MaQuan" :value="q.MaQuan">
                  {{ q.TenQuan }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Điện Thoại *</label>
              <input 
                v-model="form.DienThoai" 
                type="text" 
                placeholder="03XXXXXXXX" 
                required 
              />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input 
                v-model="form.Email" 
                type="email" 
                placeholder="agent@example.com" 
              />
            </div>

            <div class="form-group">
              <label>Ngày Tiếp Nhận</label>
              <input 
                v-model="form.NgayTiepNhan" 
                type="date" 
                required 
              />
            </div>

            <div class="form-group full">
              <label>Địa Chỉ *</label>
              <input 
                v-model="form.DiaChi" 
                type="text" 
                placeholder="Số nhà, tên đường, phường..." 
                required 
              />
            </div>
          </div>

          <div v-if="formError" class="form-error">{{ formError }}</div>

          <div class="form-footer">
            <button type="button" class="btn-secondary" @click="closeModal">Hủy</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm mới') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import * as XLSX from 'xlsx';
import {
  Plus, Search, RefreshCcw, Pencil, Trash2, X, Eye,
  Users, MapPin, Wallet, UserPlus, Download, AlertCircle
} from 'lucide-vue-next';

const router = useRouter();

// State
const daiLys = ref([]);
const quans = ref([]);
const loaiDaiLys = ref([]);
const searchText = ref('');
const filterQuan = ref('');
const filterLoai = ref('');
const filterDebt = ref('');
const showAddModal = ref(false);
const editingId = ref(null);
const submitting = ref(false);
const formError = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const loading = ref(false);
const deleteLoading = ref(null);
const notification = ref({ show: false, message: '', type: '' });

const form = reactive({
  TenDaiLy: '',
  MaLoai: '',
  MaQuan: '',
  DiaChi: '',
  DienThoai: '',
  Email: '',
  NgayTiepNhan: new Date().toISOString().split('T')[0]
});

// Computed
const avgDebt = computed(() => {
  if (daiLys.value.length === 0) return 0;
  return daiLys.value.reduce((s, dl) => s + parseFloat(dl.TienNo || 0), 0) / daiLys.value.length;
});

const filteredDaiLys = computed(() => {
  return daiLys.value.filter(dl => {
    const s = searchText.value.toLowerCase();
    const matchesSearch = !s || 
      dl.TenDaiLy.toLowerCase().includes(s) || 
      dl.DienThoai.includes(s) ||
      (dl.Email && dl.Email.toLowerCase().includes(s));
    const matchesQuan = !filterQuan.value || dl.MaQuan == filterQuan.value;
    const matchesLoai = !filterLoai.value || dl.MaLoai == filterLoai.value;
    const matchesDebt = !filterDebt.value || (
      filterDebt.value === 'no' ? dl.TienNo > 0 : 
      filterDebt.value === 'no-high' ? dl.TienNo > 40000000 : true
    );
    return matchesSearch && matchesQuan && matchesLoai && matchesDebt;
  });
});

const paginatedDaiLys = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredDaiLys.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => Math.ceil(filteredDaiLys.value.length / itemsPerPage.value));

// Methods
const fetchData = async () => {
  loading.value = true;
  try {
    const [dl, q, l] = await Promise.all([
      api.get('/dai-ly'),
      api.get('/quan'),
      api.get('/loai-dai-ly')
    ]);
    daiLys.value = dl.data.data;
    quans.value = q.data.data;
    loaiDaiLys.value = l.data.data;
    currentPage.value = 1;
  } catch (e) {
    console.error(e);
    showNotification('Không thể tải dữ liệu', 'error');
  } finally {
    loading.value = false;
  }
};

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => { notification.value.show = false; }, 3000);
};

const viewDaiLy = (dl) => {
  router.push('/dai-ly/' + dl.MaDaiLy);
};

const editDaiLy = (dl) => {
  editingId.value = dl.MaDaiLy;
  Object.assign(form, {
    ...dl,
    NgayTiepNhan: dl.NgayTiepNhan.split('T')[0]
  });
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  editingId.value = null;
  formError.value = '';
  Object.assign(form, {
    TenDaiLy: '',
    MaLoai: '',
    MaQuan: '',
    DiaChi: '',
    DienThoai: '',
    Email: '',
    NgayTiepNhan: new Date().toISOString().split('T')[0]
  });
};

const saveDaiLy = async () => {
  submitting.value = true;
  try {
    if (editingId.value) {
      await api.put(`/dai-ly/${editingId.value}`, form);
    } else {
      await api.post('/dai-ly', form);
    }
    await fetchData();
    closeModal();
    showNotification(
      editingId.value ? 'Cập nhật thành công' : 'Thêm đại lý thành công',
      'success'
    );
  } catch (e) {
    formError.value = e.response?.data?.message || 'Có lỗi xảy ra';
    showNotification(formError.value, 'error');
  } finally {
    submitting.value = false;
  }
};

const deleteDaiLy = async (dl) => {
  if (!confirm(`Xóa đại lý "${dl.TenDaiLy}"?\n\nHành động này không thể hoàn tác.`)) return;
  deleteLoading.value = dl.MaDaiLy;
  try {
    await api.delete(`/dai-ly/${dl.MaDaiLy}`);
    await fetchData();
    showNotification('Xóa thành công', 'success');
  } catch (e) {
    showNotification('Không thể xóa (có phiếu liên quan)', 'error');
  } finally {
    deleteLoading.value = null;
  }
};

const exportToExcel = () => {
  const data = filteredDaiLys.value.map(dl => ({
    'Mã': `#${String(dl.MaDaiLy).padStart(3, '0')}`,
    'Tên Đại Lý': dl.TenDaiLy,
    'Loại': dl.loaiDaiLy?.TenLoai || '',
    'Khu Vực': dl.quan?.TenQuan || '',
    'Địa Chỉ': dl.DiaChi || '',
    'Điện Thoại': dl.DienThoai,
    'Email': dl.Email || '',
    'Dư Nợ': dl.TienNo || 0
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đại lý');
  XLSX.writeFile(wb, `danh-sach-dai-ly-${new Date().toISOString().split('T')[0]}.xlsx`);
};

const getAvatarColor = (name) => {
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#0ea5e9'];
  return colors[name.length % colors.length];
};

const fmtCurrency = (n) => {
  const num = parseFloat(n) || 0;
  return (num / 1000000).toFixed(1) + 'Tr';
};

onMounted(fetchData);
</script>

<style scoped>
/* Base */
.daily-management-page {
  min-height: 100vh;
  padding: 0;
  color: #1f2937;
}

.card-box {
  background: #ffffff;
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 1), 5px 5px 15px rgba(15, 23, 42, 0.05), -1px -1px 2px rgba(255, 255, 255, 0.3) inset;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
}

.shadow-sm {
  /* Uses card-box shadow */
}

.p-0 {
  padding: 0 !important;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-left h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
  color: #0f172a;
}

.header-left p {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 4px;
  font-weight: 500;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: #ffffff;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -3px -3px 8px rgba(255, 255, 255, 1), 3px 3px 8px rgba(15, 23, 42, 0.04);
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-icon:hover:not(:disabled) {
  color: #10b981;
  transform: translateY(-2px);
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 1), 5px 5px 15px rgba(15, 23, 42, 0.06);
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon.spin svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-primary {
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  background: #0c4a35;
  color: white;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 15px rgba(12, 74, 53, 0.15);
}

.btn-primary:hover:not(:disabled) {
  background: #093425;
  transform: translateY(-2px);
  box-shadow: 0 15px 25px rgba(12, 74, 53, 0.25);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: -8px -8px 25px rgba(255, 255, 255, 1), 8px 8px 25px rgba(15, 23, 42, 0.08), -1px -1px 2px rgba(255, 255, 255, 0.3) inset;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.5px;
}

/* Table Card */
.table-card {
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.table-header {
  padding: 20px 25px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.search-box {
  flex: 1;
  max-width: 400px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1.5px solid #f1f5f9;
  padding: 0 14px;
  border-radius: 12px;
  height: 44px;
  color: #94a3b8;
  transition: 0.2s;
}

.search-box:focus-within {
  border-color: #10b981;
  background: white;
  color: #0f172a;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.08);
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-weight: 600;
  font-size: 0.9rem;
  color: #0f172a;
}

.search-box input::placeholder {
  color: #cbd5e1;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 0 12px;
  height: 44px;
  border: 1.5px solid #f1f5f9;
  border-radius: 12px;
  background: #f8fafc;
  color: #64748b;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
  transition: 0.2s;
}

.filter-select:hover {
  border-color: #e2e8f0;
}

.filter-select:focus {
  border-color: #10b981;
  background: white;
}

/* Table */
.table-wrapper {
  flex: 1;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #fafbfc;
}

.data-table th {
  padding: 16px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f1f5f9;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
  font-size: 0.9rem;
}

.table-row:hover {
  background: #fafbfc;
}

.cell-code {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  color: #475569;
  font-size: 0.8rem;
}

.cell-info {
  font-weight: 600;
}

.info-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 0.9rem;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-text strong {
  color: #0f172a;
}

.info-text span {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.cell-type {
  font-size: 0.85rem;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.badge-primary {
  background: #ecfdf5;
  color: #059669;
}

.badge-secondary {
  background: #eff6ff;
  color: #2563eb;
}

.cell-debt {
  font-weight: 800;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
}

.cell-debt.debt-high {
  color: #e11d48;
}

.cell-actions {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-view:hover {
  background: #f0fdf4;
  color: #059669;
  border-color: #bbf7d0;
  transform: translateY(-1px);
}

.btn-edit:hover {
  background: #f0f9ff;
  color: #2563eb;
  border-color: #bfdbfe;
  transform: translateY(-1px);
}

.btn-delete:hover {
  background: #fff1f2;
  color: #e11d48;
  border-color: #fecdd3;
  transform: translateY(-1px);
}

.spinner-mini {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #94a3b8;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #94a3b8;
}

.empty-state svg {
  color: #e2e8f0;
  margin-bottom: 16px;
}

.empty-state p {
  font-weight: 600;
  font-size: 1rem;
}

/* Pagination */
.pagination {
  padding: 18px 25px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.btn-page {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid #f1f5f9;
  background: white;
  color: #64748b;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
}

.btn-page:hover:not(:disabled) {
  background: #ecfdf5;
  border-color: #10b981;
  color: #10b981;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  padding: 0 20px;
  min-width: 100px;
  text-align: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(15px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  padding: 28px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.modal-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #ecfdf5;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon.edit {
  background: #eff6ff;
  color: #2563eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
  letter-spacing: -0.3px;
}

.modal-header p {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}

.btn-close {
  background: #f8fafc;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.btn-close:hover {
  background: #fee2e2;
  color: #e11d48;
}

.modal-form {
  padding: 28px 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full {
  grid-column: span 2;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
  height: 44px;
  padding: 0 14px;
  border: 1.5px solid #f1f5f9;
  border-radius: 10px;
  background: #f8fafc;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
  outline: none;
  transition: 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  background: white;
  border-color: #10b981;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);
}

.form-group input::placeholder {
  color: #cbd5e1;
  font-weight: 500;
}

.form-error {
  background: #fff1f2;
  color: #e11d48;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 18px;
}

.form-footer {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  padding: 10px 24px;
  border-radius: 10px;
  border: 1.5px solid #f1f5f9;
  background: transparent;
  color: #64748b;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  z-index: 3000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.toast-notification.success {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
}

.toast-notification.error {
  background: #fff1f2;
  color: #e11d48;
  border: 1px solid #fecdd3;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    width: 100%;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-left h1 {
    font-size: 1.5rem;
  }

  .header-right {
    width: 100%;
    justify-content: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full {
    grid-column: span 1;
  }
}
</style>
