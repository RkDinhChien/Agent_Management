<template>
  <div class="dai-ly-page-master">
    <!-- Notification Toast -->
    <Transition name="toast">
      <div v-if="notification.show" class="toast-notification" :class="notification.type">
        {{ notification.message }}
      </div>
    </Transition>

    <!-- Clean Page Header -->
    <div class="master-view-title">
      <div class="v-left">
        <h1>Danh sách Đại lý</h1>
        <p>Quản lý và theo dõi thông tin đối tác trên toàn hệ thống (BM1)</p>
      </div>
      <div class="v-right">
        <button class="btn-tool-ghost" @click="fetchData" :disabled="loading"><RefreshCcw :size="18" :class="{ 'spin': loading }" /></button>
        <button class="btn-tool-ghost" @click="exportToExcel" title="Xuất Excel" :disabled="loading"><Download :size="18" /></button>
        <button class="btn-master btn-emerald" @click="showAddModal = true" :disabled="loading">
          <UserPlus :size="18" /> Tiếp nhận đại lý mới
        </button>
      </div>
    </div>

    <!-- Stats Row (Aetheric Master Style) -->
    <div class="stats-master-row">
      <div class="card stat-card-master-lite">
        <div class="sl-icon indigo"><Users :size="20" /></div>
        <div class="sl-content">
          <span class="sl-label">TỔNG ĐẠI LÝ</span>
          <h2 class="sl-val">{{ daiLys.length }} <span>Đối tác</span></h2>
        </div>
      </div>
      <div class="card stat-card-master-lite">
        <div class="sl-icon emerald"><MapPin :size="20" /></div>
        <div class="sl-content">
          <span class="sl-label">KHU VỰC PHỦ</span>
          <h2 class="sl-val">{{ quans.length }} <span>Quận/Huyện</span></h2>
        </div>
      </div>
      <div class="card stat-card-master-lite">
        <div class="sl-icon orange"><Wallet :size="20" /></div>
        <div class="sl-content">
          <span class="sl-label">CÔNG NỢ TRUNG BÌNH</span>
          <h2 class="sl-val">{{ Math.round(avgDebt / 1000000) }} <span>Tr VND</span></h2>
        </div>
      </div>
    </div>

    <!-- Main Data Section -->
    <div class="card master-data-card">
      <div class="data-header">
        <div class="search-box-pill-master">
          <Search :size="18" />
          <input v-model="searchText" type="text" placeholder="Tìm tên hoặc số điện thoại..." />
        </div>
        
        <div class="data-filters">
          <div class="filter-item">
            <Filter :size="14" />
            <select v-model="filterQuan">
              <option value="">Tất cả khu vực</option>
              <option v-for="q in quans" :key="q.MaQuan" :value="q.MaQuan">{{ q.TenQuan }}</option>
            </select>
          </div>
          <div class="filter-item">
            <select v-model="filterLoai">
              <option value="">Loại đại lý</option>
              <option v-for="l in loaiDaiLys" :key="l.MaLoai" :value="l.MaLoai">{{ l.TenLoai }}</option>
            </select>
          </div>
          <div class="filter-item">
            <select v-model="filterDebt">
              <option value="">Trạng thái nợ</option>
              <option value="no">Có nợ</option>
              <option value="no-high">Nợ lớn (>40tr)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-container-airy">
        <table>
          <thead>
            <tr>
              <th width="100">MÃ SỐ</th>
              <th width="300">THÔNG TIN ĐẠI LÝ</th>
              <th>LOẠI</th>
              <th>KHU VỰC</th>
              <th>DƯ NỢ HIỆN TẠI</th>
              <th width="120" style="text-align: right;">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dl in paginatedDaiLys" :key="dl.MaDaiLy">
              <td>
                <span class="agent-id-badge">#{{ String(dl.MaDaiLy).padStart(3, '0') }}</span>
              </td>
              <td>
                <div class="agent-meta">
                  <div class="avatar-letter" :style="{ background: getAvatarColor(dl.TenDaiLy) }">
                    {{ dl.TenDaiLy.charAt(0).toUpperCase() }}
                  </div>
                  <div class="meta-text">
                    <strong>{{ dl.TenDaiLy }}</strong>
                    <span>{{ dl.DienThoai }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="type-pill-master" :class="dl.loaiDaiLy?.TenLoai === 'Loại 1' ? 't1' : 't2'">
                  {{ dl.loaiDaiLy?.TenLoai }}
                </span>
              </td>
              <td>
                <div class="location-chip">
                  <MapPin :size="12" /> {{ dl.quan?.TenQuan }}
                </div>
              </td>
              <td>
                <span class="debt-amount" :class="{ warning: dl.TienNo > 40000000 }">
                  {{ fmtCurrency(dl.TienNo) }}
                </span>
              </td>
              <td>
                <div class="actions-stack-mini">
                  <button class="btn-act profile" @click="$router.push('/dai-ly/' + dl.MaDaiLy)" title="Xem hồ sơ" :disabled="loading"><Eye :size="14" /></button>
                  <button class="btn-act edit" @click="editDaiLy(dl)" title="Chỉnh sửa" :disabled="loading"><Pencil :size="14" /></button>
                  <button class="btn-act delete" @click="deleteDaiLy(dl)" title="Xóa" :disabled="loading || deleteLoading === dl.MaDaiLy">
                    <span v-if="deleteLoading === dl.MaDaiLy" class="spinner-mini"></span>
                    <Trash2 v-else :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredDaiLys.length === 0" class="empty-state">
          <Search :size="48" class="icon-muted" />
          <p>Không tìm thấy đại lý nào phù hợp.</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-master">
          <button class="btn-page" :disabled="currentPage === 1" @click="currentPage--">← Trước</button>
          <div class="page-info">Trang {{ currentPage }} / {{ totalPages }}</div>
          <button class="btn-page" :disabled="currentPage === totalPages" @click="currentPage++">Sau →</button>
        </div>
      </div>
    </div>

    <!-- Aetheric Hub Modal (AgencyHub Style) -->
    <div v-if="showAddModal" class="modal-overlay-glass" @click.self="closeModal">
      <div class="modal-hub-card">
        <div class="modal-hub-header">
          <div class="header-icon-box" :class="{ edit: editingId }">
            <UserPlus v-if="!editingId" :size="24" />
            <Pencil v-else :size="24" />
          </div>
          <div class="header-text">
            <h3>{{ editingId ? 'Cập nhật thông tin' : 'Tiếp nhận đại lý mới' }}</h3>
            <p>Vui lòng nhập đầy đủ thông tin theo mẫu BM1 hệ thống.</p>
          </div>
          <button class="btn-close" @click="closeModal"><X :size="20" /></button>
        </div>

        <div class="modal-hub-body">
          <form @submit.prevent="saveDaiLy" class="hub-form">
            <div class="form-grid">
              <div class="input-entry full">
                <label>TÊN ĐẠI LÝ <span class="req">*</span></label>
                <div class="input-wrap">
                  <input v-model="form.TenDaiLy" type="text" placeholder="Ví dụ: Đại lý Kim Quang..." required />
                </div>
              </div>

              <div class="input-entry">
                <label>LOẠI ĐẠI LÝ</label>
                <div class="input-wrap">
                  <select v-model="form.MaLoai" required>
                    <option v-for="l in loaiDaiLys" :key="l.MaLoai" :value="l.MaLoai">{{ l.TenLoai }}</option>
                  </select>
                </div>
              </div>

              <div class="input-entry">
                <label>KHU VỰC (QUẬN/HUYỆN)</label>
                <div class="input-wrap">
                  <select v-model="form.MaQuan" required>
                    <option v-for="q in quans" :key="q.MaQuan" :value="q.MaQuan">{{ q.TenQuan }}</option>
                  </select>
                </div>
              </div>

              <div class="input-entry">
                <label>SỐ ĐIỆN THOẠI</label>
                <div class="input-wrap">
                  <input v-model="form.DienThoai" type="text" placeholder="03XXXXXXXX" required />
                </div>
              </div>

              <div class="input-entry">
                <label>EMAIL</label>
                <div class="input-wrap">
                  <input v-model="form.Email" type="email" placeholder="agent@example.com" />
                </div>
              </div>

              <div class="input-entry full">
                <label>ĐỊA CHỈ TRỤ SỞ</label>
                <div class="input-wrap">
                  <input v-model="form.DiaChi" type="text" placeholder="Số nhà, tên đường, phường..." required />
                </div>
              </div>

              <div class="input-entry">
                <label>NGÀY TIẾP NHẬN</label>
                <div class="input-wrap">
                  <input v-model="form.NgayTiepNhan" type="date" required />
                </div>
              </div>
            </div>

            <div v-if="formError" class="alert-error-mini">{{ formError }}</div>

            <div class="form-footer-hub">
              <button type="button" class="btn-master btn-ghost" @click="closeModal">Hủy bỏ</button>
              <button type="submit" class="btn-master btn-emerald" :disabled="submitting">
                <Check v-if="!submitting" :size="18" />
                {{ submitting ? 'Đang lưu...' : (editingId ? 'Cập nhật thay đổi' : 'Hoàn tất tiếp nhận') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import XLSX from 'xlsx';
import { 
  Plus, Search, RefreshCcw, Pencil, Trash2, X, Eye,
  Users, MapPin, Wallet, UserPlus, Filter, Check, Download
} from 'lucide-vue-next';

const router = useRouter();

// State
const daiLys = ref([]); const quans = ref([]); const loaiDaiLys = ref([]);
const searchText = ref(''); const filterQuan = ref(''); const filterLoai = ref(''); const filterDebt = ref('');
const showAddModal = ref(false); const editingId = ref(null);
const submitting = ref(false); const formError = ref('');
const currentPage = ref(1); const itemsPerPage = ref(10);
const loading = ref(false); const deleteLoading = ref(null);
const notification = ref({ show: false, message: '', type: '' });

const form = reactive({ 
  TenDaiLy: '', MaLoai: '', MaQuan: '', DiaChi: '', 
  DienThoai: '', Email: '', NgayTiepNhan: new Date().toISOString().split('T')[0] 
});

// Computed
const avgDebt = computed(() => { 
  if (daiLys.value.length === 0) return 0; 
  return daiLys.value.reduce((s, dl) => s + parseFloat(dl.TienNo), 0) / daiLys.value.length; 
});

const filteredDaiLys = computed(() => {
  return daiLys.value.filter(dl => {
    const s = searchText.value.toLowerCase();
    const matchesSearch = !s || dl.TenDaiLy.toLowerCase().includes(s) || dl.DienThoai.includes(s);
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
      api.get('/dai-ly'), api.get('/quan'), api.get('/loai-dai-ly')
    ]);
    daiLys.value = dl.data.data; 
    quans.value = q.data.data; 
    loaiDaiLys.value = l.data.data;
    currentPage.value = 1;
    showNotification('Tải dữ liệu thành công', 'success');
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

const editDaiLy = (dl) => { 
  editingId.value = dl.MaDaiLy; 
  Object.assign(form, { ...dl, NgayTiepNhan: dl.NgayTiepNhan.split('T')[0] }); 
  showAddModal.value = true; 
};

const closeModal = () => {
  showAddModal.value = false; editingId.value = null; formError.value = '';
  Object.assign(form, { 
    TenDaiLy: '', MaLoai: '', MaQuan: '', DiaChi: '', 
    DienThoai: '', Email: '', NgayTiepNhan: new Date().toISOString().split('T')[0] 
  });
};

const saveDaiLy = async () => {
  submitting.value = true;
  try {
    if (editingId.value) await api.put(`/dai-ly/${editingId.value}`, form); 
    else await api.post('/dai-ly', form);
    await fetchData();
    closeModal();
    showNotification(editingId.value ? 'Cập nhật thành công' : 'Thêm đại lý thành công', 'success');
  } catch (e) { 
    formError.value = e.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
    showNotification(formError.value, 'error');
  } finally { submitting.value = false; }
};

const deleteDaiLy = async (dl) => {
  if (!confirm(`Bạn có chắc chắn muốn xóa đại lý "${dl.TenDaiLy}"?\n\nHành động này không thể hoàn tác.`)) return;
  deleteLoading.value = dl.MaDaiLy;
  try { 
    await api.delete(`/dai-ly/${dl.MaDaiLy}`); 
    await fetchData();
    showNotification('Xóa đại lý thành công', 'success');
  } catch (e) { 
    showNotification('Không thể xóa (có thể do đang có phiếu nợ hoặc đơn hàng)', 'error');
  } finally {
    deleteLoading.value = null;
  }
};

const getAvatarColor = (name) => {
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#0ea5e9'];
  return colors[name.length % colors.length];
};

const fmtCurrency = (n) => (parseFloat(n) || 0).toLocaleString('vi-VN') + 'đ';

const exportToExcel = () => {
  const data = filteredDaiLys.value.map(dl => ({
    'Mã Đại Lý': `#${String(dl.MaDaiLy).padStart(3, '0')}`,
    'Tên Đại Lý': dl.TenDaiLy,
    'Điện Thoại': dl.DienThoai,
    'Email': dl.Email || '',
    'Loại': dl.loaiDaiLy?.TenLoai || '',
    'Khu Vực': dl.quan?.TenQuan || '',
    'Địa Chỉ': dl.DiaChi || '',
    'Dư Nợ': dl.TienNo || 0
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách đại lý");
  XLSX.writeFile(wb, `danh-sach-dai-ly-${new Date().toISOString().split('T')[0]}.xlsx`);
};

onMounted(fetchData);
</script>

<style scoped>
.dai-ly-page-master { padding: 10px 0; }

/* ===== HEADER ===== */
.master-view-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.v-left h1 { font-size: 1.8rem; font-weight: 800; color: #0f172a; letter-spacing: -1px; margin: 0; }
.v-left p { color: #64748b; font-size: 0.9rem; margin-top: 4px; font-weight: 500; }
.v-right { display: flex; gap: 12px; align-items: center; }

.btn-tool-ghost {
  background: #ffffff; border: 1px solid rgba(255,255,255,0.8); width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; color: #94a3b8; cursor: pointer;
  box-shadow: -3px -3px 8px rgba(255,255,255,1), 3px 3px 8px rgba(15,23,42,0.04);
  transition: 0.3s cubic-bezier(0.4,0,0.2,1);
}
.btn-tool-ghost:hover { color: #10b981; transform: translateY(-2px); box-shadow: -5px -5px 15px rgba(255,255,255,1), 5px 5px 15px rgba(15,23,42,0.06); }

.btn-master { padding: 10px 24px; border-radius: 99px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s cubic-bezier(0.4,0,0.2,1); border: none; }
.btn-master.btn-emerald { background: #0c4a35; color: white; box-shadow: 0 10px 15px rgba(12,74,53,0.15); }
.btn-master.btn-emerald:hover { transform: translateY(-2px); background: #093425; box-shadow: 0 15px 25px rgba(12,74,53,0.25); }

/* ===== STAT CARDS (Neumorphic) ===== */
.stats-master-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 28px; }
.card.stat-card-master-lite {
  padding: 22px 25px; border-radius: 20px; display: flex; align-items: center; gap: 18px;
  background: #ffffff; border: 1px solid rgba(255,255,255,0.8);
  box-shadow: -5px -5px 15px rgba(255,255,255,1), 5px 5px 15px rgba(15,23,42,0.05), -1px -1px 2px rgba(255,255,255,0.3) inset;
  transition: 0.3s cubic-bezier(0.4,0,0.2,1); cursor: default;
}
.card.stat-card-master-lite:hover {
  transform: translateY(-4px);
  box-shadow: -8px -8px 25px rgba(255,255,255,1), 8px 8px 25px rgba(15,23,42,0.08), -1px -1px 2px rgba(255,255,255,0.3) inset;
}
.sl-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: 0.3s; }
.sl-icon.indigo { background: #eef2ff; color: #6366f1; box-shadow: inset 0 2px 5px rgba(255,255,255,0.6), 0 2px 5px rgba(99,102,241,0.12); }
.sl-icon.emerald { background: #ecfdf5; color: #10b981; box-shadow: inset 0 2px 5px rgba(255,255,255,0.6), 0 2px 5px rgba(16,185,129,0.12); }
.sl-icon.orange { background: #fff7ed; color: #f97316; box-shadow: inset 0 2px 5px rgba(255,255,255,0.6), 0 2px 5px rgba(249,115,22,0.12); }
.card.stat-card-master-lite:hover .sl-icon { transform: scale(1.05); }
.sl-label { font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; display: block; }
.sl-val { font-size: 1.4rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
.sl-val span { font-size: 0.8rem; color: #94a3b8; font-weight: 600; margin-left: 4px; }

/* ===== DATA TABLE CARD (Neumorphic) ===== */
.card.master-data-card {
  padding: 0; min-height: 500px; display: flex; flex-direction: column;
  background: #ffffff; border-radius: 20px; border: 1px solid rgba(255,255,255,0.8);
  box-shadow: -5px -5px 15px rgba(255,255,255,1), 5px 5px 15px rgba(15,23,42,0.05), -1px -1px 2px rgba(255,255,255,0.3) inset;
  overflow: hidden;
}
.data-header { padding: 22px 28px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }

.search-box-pill-master {
  background: #f8fafc; border: 1.5px solid #f1f5f9; padding: 10px 18px; border-radius: 12px;
  display: flex; align-items: center; gap: 12px; width: 340px; transition: 0.2s;
}
.search-box-pill-master:focus-within { border-color: #10b981; background: white; box-shadow: 0 4px 15px rgba(16,185,129,0.08); }
.search-box-pill-master input { border: none; background: transparent; outline: none; flex: 1; font-weight: 600; font-size: 0.88rem; color: #0f172a; }
.search-box-pill-master input::placeholder { color: #cbd5e1; }

.data-filters { display: flex; gap: 10px; }
.filter-item { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; padding: 0 14px; border-radius: 12px; height: 42px; transition: 0.2s; }
.filter-item:hover { border-color: #e2e8f0; }
.filter-item select { border: none; outline: none; font-weight: 700; font-size: 0.82rem; color: #1e293b; background: transparent; cursor: pointer; }

/* ===== TABLE ===== */
.table-container-airy { flex: 1; overflow-x: auto; }
.table-container-airy table { width: 100%; border-collapse: collapse; }
.table-container-airy th {
  background: #fafbfc; text-align: left; padding: 16px 28px;
  font-size: 0.7rem; font-weight: 800; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9;
}
.table-container-airy td { padding: 16px 28px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.table-container-airy tbody tr { transition: 0.2s; cursor: default; }
.table-container-airy tbody tr:hover { background: #fafbfc; }

.agent-id-badge { background: #f1f5f9; color: #475569; font-weight: 800; font-size: 0.72rem; padding: 4px 10px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; }

.agent-meta { display: flex; align-items: center; gap: 14px; }
.avatar-letter {
  width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 800; font-size: 0.85rem;
  box-shadow: inset 0 2px 5px rgba(255,255,255,0.3), 0 4px 10px rgba(0,0,0,0.1);
}
.meta-text { display: flex; flex-direction: column; gap: 2px; }
.meta-text strong { font-size: 0.9rem; color: #0f172a; }
.meta-text span { font-size: 0.78rem; color: #94a3b8; font-weight: 500; }

.type-pill-master { font-size: 0.68rem; font-weight: 800; padding: 4px 12px; border-radius: 99px; letter-spacing: 0.3px; }
.type-pill-master.t1 { background: #ecfdf5; color: #059669; }
.type-pill-master.t2 { background: #eff6ff; color: #2563eb; }

.location-chip { display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.82rem; color: #64748b; }

.debt-amount { font-weight: 800; color: #0f172a; font-size: 0.9rem; font-variant-numeric: tabular-nums; }
.debt-amount.warning { color: #ef4444; }

.actions-stack-mini { display: flex; justify-content: flex-end; gap: 6px; }
.btn-act {
  border-radius: 8px; border: 1px solid #f1f5f9; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; background: white; color: #94a3b8; transition: 0.2s;
}
.btn-act.profile:hover { background: #f0fdf4; color: #059669; border-color: #bbf7d0; transform: translateY(-1px); }
.btn-act.edit:hover { background: #f0f9ff; color: #0284c7; border-color: #bfdbfe; transform: translateY(-1px); }
.btn-act.delete:hover { background: #fff1f2; color: #e11d48; border-color: #fecdd3; transform: translateY(-1px); }

.empty-state { padding: 80px 0; text-align: center; color: #94a3b8; }
.empty-state .icon-muted { color: #e2e8f0; }
.empty-state p { margin-top: 15px; font-weight: 600; font-size: 0.9rem; }

/* ===== MODAL (Glass Neumorphic) ===== */
.modal-overlay-glass { position: fixed; inset: 0; background: rgba(15,23,42,0.35); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-hub-card {
  background: white; width: 100%; max-width: 600px; border-radius: 24px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8);
  overflow: hidden; animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes popIn { from { opacity: 0; transform: scale(0.92) translateY(15px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.modal-hub-header { padding: 28px 30px; display: flex; align-items: center; gap: 18px; border-bottom: 1px solid #f1f5f9; position: relative; }
.header-icon-box {
  width: 52px; height: 52px; border-radius: 16px; background: #ecfdf5; color: #10b981;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: inset 0 2px 5px rgba(255,255,255,0.6), 0 2px 8px rgba(16,185,129,0.12);
}
.header-icon-box.edit { background: #eff6ff; color: #2563eb; box-shadow: inset 0 2px 5px rgba(255,255,255,0.6), 0 2px 8px rgba(37,99,235,0.12); }
.header-text h3 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; letter-spacing: -0.3px; }
.header-text p { font-size: 0.82rem; color: #94a3b8; font-weight: 500; margin: 0; }
.btn-close { position: absolute; top: 28px; right: 28px; background: #f8fafc; border: none; cursor: pointer; color: #94a3b8; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.btn-close:hover { background: #fee2e2; color: #ef4444; }

.modal-hub-body { padding: 28px 30px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.input-entry { display: flex; flex-direction: column; gap: 8px; }
.input-entry.full { grid-column: span 2; }
.input-entry label { font-size: 0.68rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }
.input-entry label .req { color: #ef4444; }

.input-wrap input, .input-wrap select {
  width: 100%; height: 48px; background: #f8fafc; border: 1.5px solid #f1f5f9;
  padding: 0 16px; border-radius: 12px; font-weight: 700; font-size: 0.9rem;
  color: #0f172a; outline: none; transition: 0.2s; box-sizing: border-box;
}
.input-wrap input:focus, .input-wrap select:focus { background: white; border-color: #10b981; box-shadow: 0 4px 15px rgba(16,185,129,0.1); }
.input-wrap input::placeholder { color: #cbd5e1; font-weight: 500; }

.alert-error-mini { background: #fff1f2; color: #e11d48; padding: 12px 16px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; margin-top: 18px; display: flex; align-items: center; gap: 8px; }
.form-footer-hub { margin-top: 28px; display: flex; justify-content: flex-end; gap: 12px; }
.btn-master.btn-ghost { background: transparent; color: #64748b; border: 1.5px solid #f1f5f9; }
.btn-master.btn-ghost:hover { background: #f8fafc; border-color: #e2e8f0; box-shadow: none; transform: none; }

/* ===== PAGINATION ===== */
.pagination-master { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 18px 28px; border-top: 1px solid #f1f5f9; background: #fafbfc; }
.btn-page { padding: 8px 16px; border-radius: 8px; border: 1.5px solid #f1f5f9; background: white; color: #64748b; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-page:hover:not(:disabled) { background: #ecfdf5; border-color: #10b981; color: #10b981; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { font-size: 0.82rem; font-weight: 700; color: #64748b; padding: 0 16px; min-width: 140px; text-align: center; }

/* ===== NOTIFICATION TOAST ===== */
.toast-notification { position: fixed; top: 24px; right: 24px; padding: 14px 20px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; z-index: 3000; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
.toast-notification.success { background: #ecfdf5; color: #059669; border: 1px solid #d1fae5; }
.toast-notification.error { background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(30px); }
.toast-leave-to { opacity: 0; transform: translateX(30px); }

/* ===== LOADING STATES ===== */
.btn-tool-ghost:disabled, .btn-master:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-tool-ghost.spin svg { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.spinner-mini { display: inline-block; width: 12px; height: 12px; border: 2px solid #94a3b8; border-top-color: #0f172a; border-radius: 50%; animation: spin 0.8s linear infinite; }
</style>
