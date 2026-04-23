<template>
  <div class="dai-ly-page-master">
    <!-- Clean Page Header -->
    <div class="master-view-title">
      <div class="v-left">
        <h1>Danh sách Đại lý</h1>
        <p>Quản lý và theo dõi thông tin đối tác trên toàn hệ thống (BM1)</p>
      </div>
      <div class="v-right">
        <button class="btn-tool-ghost" @click="fetchData"><RefreshCcw :size="18" /></button>
        <button class="btn-master btn-emerald" @click="showAddModal = true">
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
            <tr v-for="dl in filteredDaiLys" :key="dl.MaDaiLy">
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
                  <button class="btn-act edit" @click="editDaiLy(dl)"><Pencil :size="14" /></button>
                  <button class="btn-act delete" @click="deleteDaiLy(dl)"><Trash2 :size="14" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredDaiLys.length === 0" class="empty-state">
          <Search :size="48" class="icon-muted" />
          <p>Không tìm thấy đại lý nào phù hợp.</p>
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
import api from '../services/api';
import { 
  Plus, Search, RefreshCcw, Pencil, Trash2, X, 
  Users, MapPin, Wallet, UserPlus, Filter, Check 
} from 'lucide-vue-next';

// State
const daiLys = ref([]); const quans = ref([]); const loaiDaiLys = ref([]);
const searchText = ref(''); const filterQuan = ref('');
const showAddModal = ref(false); const editingId = ref(null);
const submitting = ref(false); const formError = ref('');

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
    return matchesSearch && matchesQuan;
  });
});

// Methods
const fetchData = async () => {
  try {
    const [dl, q, l] = await Promise.all([
      api.get('/dai-ly'), api.get('/quan'), api.get('/loai-dai-ly')
    ]);
    daiLys.value = dl.data.data; 
    quans.value = q.data.data; 
    loaiDaiLys.value = l.data.data;
  } catch (e) { console.error(e); }
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
    await fetchData(); closeModal();
  } catch (e) { 
    formError.value = e.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.'; 
  } finally { submitting.value = false; }
};

const deleteDaiLy = async (dl) => {
  if (!confirm(`Bạn có chắc chắn muốn xóa đại lý ${dl.TenDaiLy}?`)) return;
  try { 
    await api.delete(`/dai-ly/${dl.MaDaiLy}`); 
    await fetchData(); 
  } catch (e) { alert('Không thể xóa đại lý này (có thể do đang có phiếu nợ hoặc đơn hàng).'); }
};

const getAvatarColor = (name) => {
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#0ea5e9'];
  return colors[name.length % colors.length];
};

const fmtCurrency = (n) => (parseFloat(n) || 0).toLocaleString('vi-VN') + 'đ';

onMounted(fetchData);
</script>

<style scoped>
.dai-ly-page-master { padding: 40px; }

/* Header Master */
.master-view-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.v-left h1 { font-size: 2rem; font-weight: 800; color: var(--navy-900); letter-spacing: -1px; }
.v-left p { color: var(--text-dim); font-size: 1rem; margin-top: 4px; }
.v-right { display: flex; gap: 15px; }

.btn-tool-ghost { background: white; border: 1px solid #f1f5f9; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-dim); cursor: pointer; transition: 0.2s; }
.btn-tool-ghost:hover { background: #f8fafc; color: var(--emerald-500); }

/* Stats Modern */
.stats-master-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 35px; }
.stat-card-master-lite { padding: 25px; border-radius: var(--radius-xl); display: flex; align-items: center; gap: 20px; transition: var(--transition); }
.sl-icon { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
.sl-icon.indigo { background: #eef2ff; color: #6366f1; }
.sl-icon.emerald { background: #ecfdf5; color: #10b981; }
.sl-icon.orange { background: #fff7ed; color: #f97316; }
.sl-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; display: block; }
.sl-val { font-size: 1.5rem; font-weight: 800; color: var(--navy-900); }
.sl-val span { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-left: 4px; }

/* Data Card Primary */
.master-data-card { padding: 0; min-height: 500px; display: flex; flex-direction: column; }
.data-header { padding: 25px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8fafc; }

.search-box-pill-master { background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px 20px; border-radius: 12px; display: flex; align-items: center; gap: 12px; width: 350px; }
.search-box-pill-master input { border: none; background: transparent; outline: none; flex: 1; font-weight: 600; font-size: 0.9rem; }

.filter-item { display: flex; align-items: center; gap: 10px; background: white; border: 1px solid #f1f5f9; padding: 0 15px; border-radius: 12px; height: 44px; }
.filter-item select { border: none; outline: none; font-weight: 700; font-size: 0.85rem; color: var(--navy-800); background: transparent; cursor: pointer; }

/* Table Airy Design */
.table-container-airy { flex: 1; }
.table-container-airy table { width: 100%; border-collapse: collapse; }
.table-container-airy th { background: #fcfdfe; text-align: left; padding: 18px 30px; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f8fafc; }
.table-container-airy td { padding: 20px 30px; border-bottom: 1px solid #fcfdfe; vertical-align: middle; }

.agent-id-badge { background: #f1f5f9; color: #475569; font-weight: 800; font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; }

.agent-meta { display: flex; align-items: center; gap: 14px; }
.avatar-letter { width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 0.9rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.meta-text { display: flex; flex-direction: column; }
.meta-text strong { font-size: 0.95rem; color: var(--navy-900); }
.meta-text span { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }

.type-pill-master { font-size: 0.7rem; font-weight: 800; padding: 4px 12px; border-radius: 99px; }
.type-pill-master.t1 { background: #ecfdf5; color: #059669; }
.type-pill-master.t2 { background: #eff6ff; color: #2563eb; }

.location-chip { display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.85rem; color: var(--text-dim); }

.debt-amount { font-weight: 800; color: var(--navy-800); font-size: 0.95rem; }
.debt-amount.warning { color: #f43f5e; }

.actions-stack-mini { display: flex; justify-content: flex-end; gap: 8px; }
.btn-act { border-radius: 8px; border: 1px solid #f1f5f9; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: white; color: var(--text-muted); transition: 0.2s; }
.btn-act.edit:hover { background: #f0f9ff; color: #0284c7; border-color: #0284c7; }
.btn-act.delete:hover { background: #fff1f2; color: #e11d48; border-color: #e11d48; }

.empty-state { padding: 100px 0; text-align: center; color: var(--text-muted); }
.empty-state p { margin-top: 15px; font-weight: 600; }

/* HUB MODAL GLASS STYLE */
.modal-overlay-glass { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-hub-card { background: white; width: 100%; max-width: 600px; border-radius: var(--radius-xxl); box-shadow: 0 30px 60px rgba(0,0,0,0.2); overflow: hidden; animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.modal-hub-header { padding: 30px; display: flex; align-items: center; gap: 20px; border-bottom: 1px solid #f8fafc; position: relative; }
.header-icon-box { width: 56px; height: 56px; border-radius: 18px; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center; }
.header-icon-box.edit { background: #eff6ff; color: #2563eb; }
.header-text h3 { font-size: 1.35rem; font-weight: 800; color: var(--navy-900); margin-bottom: 4px; }
.header-text p { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
.btn-close { position: absolute; top: 30px; right: 30px; background: none; border: none; cursor: pointer; color: var(--text-muted); }

.modal-hub-body { padding: 30px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.input-entry { display: flex; flex-direction: column; gap: 8px; }
.input-entry.full { grid-column: span 2; }
.input-entry label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.5px; }
.input-entry label .req { color: #f43f5e; }

.input-wrap input, .input-wrap select { width: 100%; height: 50px; background: #f8fafc; border: 1.5px solid #f1f5f9; padding: 0 16px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; color: var(--navy-900); outline: none; transition: 0.2s; }
.input-wrap input:focus, .input-wrap select:focus { background: white; border-color: var(--emerald-500); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1); }

.alert-error-mini { background: #fff1f2; color: #e11d48; padding: 12px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; margin-top: 20px; }
.form-footer-hub { margin-top: 30px; display: flex; justify-content: flex-end; gap: 15px; }
.btn-ghost { background: transparent; color: var(--text-muted); border: 1px solid #f1f5f9; }
.btn-ghost:hover { background: #f8fafc; }
</style>
