<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="design-title">Tra cứu & Thu tiền</h1>
        <p class="design-sub">Quản lý công nợ và lịch sử thu tiền đại lý</p>
      </div>
      <div class="header-right">
        <button class="btn btn-navy" @click="router.push('/dai-ly')">
          <Plus :size="16" /> Tiếp nhận đại lý
        </button>
      </div>
    </div>

    <!-- Main Content Cluster -->
    <div class="main-split-layout">
      <!-- Left: Search & Table -->
      <div class="content-main">
        <div class="card filter-card border-none shadow-soft">
          <div class="card-body grid-filters">
            <div class="filter-item flex-2">
              <label>MÃ / TÊN ĐẠI LÝ</label>
              <div class="search-box">
                <Search :size="16" />
                <input v-model="searchText" type="text" placeholder="Tìm kiếm mã hoặc tên..." />
              </div>
            </div>
            <div class="filter-item">
              <label>QUẬN / HUYỆN</label>
              <select v-model="filterQuan" class="design-select">
                <option value="">Tất cả Quận</option>
                <option v-for="q in quans" :key="q.MaQuan" :value="q.MaQuan">{{ q.TenQuan }}</option>
              </select>
            </div>
            <div class="filter-item">
              <label>LOẠI ĐẠI LÝ</label>
              <select v-model="filterLoai" class="design-select">
                <option value="">Tất cả Loại</option>
                <option v-for="l in loaiDaiLys" :key="l.MaLoai" :value="l.MaLoai">{{ l.TenLoai }}</option>
              </select>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th width="100">MÃ</th>
                  <th>TÊN ĐẠI LÝ</th>
                  <th>QUẬN</th>
                  <th>CÔNG NỢ</th>
                  <th width="80"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dl in filteredDaiLys" :key="dl.MaDaiLy" :class="{ 'tr-active': selectedDaiLy?.MaDaiLy === dl.MaDaiLy }" @click="selectDaiLy(dl)">
                  <td><span class="id-text">DL-{{ String(dl.MaDaiLy).padStart(4, '0') }}</span></td>
                  <td>
                    <div class="name-box">
                      <strong>{{ dl.TenDaiLy }}</strong>
                      <span class="type-tag">{{ dl.loaiDaiLy?.TenLoai }}</span>
                    </div>
                  </td>
                  <td>{{ dl.quan?.TenQuan || '-' }}</td>
                  <td><span class="debt-text">{{ fmtCurrency(dl.TienNo) }}</span></td>
                  <td><button class="icon-view-btn"><ChevronRight :size="18" /></button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Horizontal Summary Cards (As in design) -->
        <div class="bottom-stats-row">
          <div class="mini-card">
            <div class="mini-label">Nợ khó đòi</div>
            <div class="mini-val">1.2B <span class="trend-red">+4.2%</span></div>
          </div>
          <div class="mini-card">
            <div class="mini-label">Đại lý vượt hạn mức</div>
            <div class="mini-val">15 <span class="trend-green">(-2)</span></div>
          </div>
          <div class="mini-card">
            <div class="mini-label">Hiệu suất thu nợ</div>
            <div class="mini-val">94.8%</div>
          </div>
        </div>
      </div>

      <!-- Right: Sticky Receipt Form -->
      <div class="content-side">
        <div class="card payment-sticky-card shadow-lg border-none">
          <div class="card-header border-none">
            <h3 class="side-title"><Wallet :size="18" /> Phiếu thu tiền</h3>
          </div>
          <div class="card-body" style="padding-top: 0;">
            <div v-if="!selectedDaiLy" class="empty-side-state">
              <div class="empty-icon"><Users :size="40" /></div>
              <p>Chọn đại lý để lập phiếu thu</p>
            </div>

            <template v-else>
              <div class="side-form-group">
                <label>CHỌN ĐẠI LÝ</label>
                <div class="readonly-pill">{{ selectedDaiLy.TenDaiLy }}</div>
              </div>

              <!-- Contact Info Pills -->
              <div class="info-pills">
                <div class="pill-item">
                  <MapPin :size="14" />
                  <div><small>ĐỊA CHỈ</small><p>{{ selectedDaiLy.DiaChi }}</p></div>
                </div>
                <div class="pill-item">
                  <Phone :size="14" />
                  <div><small>ĐIỆN THOẠI</small><p>{{ selectedDaiLy.DienThoai }}</p></div>
                </div>
                <div class="pill-item">
                  <Mail :size="14" />
                  <div><small>EMAIL</small><p>{{ selectedDaiLy.Email }}</p></div>
                </div>
              </div>

              <div class="side-form-group">
                <label>NGÀY THU TIỀN</label>
                <input v-model="payForm.NgayThu" type="date" class="form-input" />
              </div>

              <div class="side-form-group">
                <label>SỐ TIỀN THU</label>
                <div class="input-wrap">
                  <input v-model.number="payForm.SoTienThu" type="number" class="form-input" />
                  <span class="currency-tag">VND</span>
                </div>
                <p v-if="payForm.SoTienThu > selectedAssetNo" class="warning-text">
                  <AlertCircle :size="12" /> Vượt quá nợ ({{ fmtCurrency(selectedAssetNo) }})
                </p>
              </div>

              <button class="btn btn-navy btn-full" @click="submitPayment" :disabled="paySubmitting">
                Hoàn tất thu tiền
              </button>
            </template>
          </div>
        </div>

        <div class="day-stats" v-if="selectedDaiLy">
          <div class="day-card teal-grad">
            <span class="d-label">TỔNG THU HÔM NAY</span>
            <span class="d-val">128.5M</span>
          </div>
          <div class="day-card orange-grad">
            <span class="d-label">GIAO DỊCH GẦN ĐÂY</span>
            <span class="d-val">12</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Banner (As in design) -->
    <div class="bottom-banner">
      <div class="banner-content">
        <h3>Hệ thống Quản lý Tài chính Skyline</h3>
        <p>Nâng cao hiệu suất vận hành với công cụ quản lý công nợ thông minh, minh bạch và tối ưu hóa dòng tiền cho chuỗi đại lý.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { Search, Plus, Wallet, MapPin, Phone, Mail, AlertCircle, Users, ChevronRight } from 'lucide-vue-next';

const router = useRouter();
const daiLys = ref([]); const quans = ref([]); const loaiDaiLys = ref([]);
const searchText = ref(''); const filterQuan = ref(''); const filterLoai = ref('');
const selectedDaiLy = ref(null);
const payForm = ref({ NgayThu: new Date().toISOString().split('T')[0], SoTienThu: 0 });
const paySubmitting = ref(false);

const filteredDaiLys = computed(() => {
  return daiLys.value.filter(dl => {
    const s = searchText.value.toLowerCase();
    const matchSearch = !s || dl.TenDaiLy.toLowerCase().includes(s) || String(dl.MaDaiLy).includes(s);
    const matchQuan = !filterQuan.value || dl.MaQuan == filterQuan.value;
    const matchLoai = !filterLoai.value || dl.MaLoai == filterLoai.value;
    return matchSearch && matchQuan && matchLoai;
  });
});

const selectedAssetNo = computed(() => parseFloat(selectedDaiLy.value?.TienNo || 0));

const selectDaiLy = (dl) => { selectedDaiLy.value = dl; payForm.value.SoTienThu = 0; };

const submitPayment = async () => {
  if (payForm.value.SoTienThu <= 0) return;
  paySubmitting.value = true;
  try {
    await api.post('/phieu-thu', { MaDaiLy: selectedDaiLy.value.MaDaiLy, NgayThu: payForm.value.NgayThu, SoTienThu: payForm.value.SoTienThu });
    alert('Thu tiền thành công!');
    fetchData();
    selectedDaiLy.value = null;
  } catch (e) { alert(e.response?.data?.message || 'Lỗi'); } finally { paySubmitting.value = false; }
};

const fetchData = async () => {
  try {
    const [dlR, qR, lR] = await Promise.all([api.get('/dai-ly'), api.get('/quan'), api.get('/loai-dai-ly')]);
    daiLys.value = dlR.data.data; quans.value = qR.data.data; loaiDaiLys.value = lR.data.data;
  } catch (e) { console.error(e); }
};

function fmtCurrency(n) { return (parseFloat(n) || 0).toLocaleString('vi-VN') + 'đ'; }
onMounted(fetchData);
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
.design-title { font-size: 1.8rem; font-weight: 800; color: var(--text-navy); margin-bottom: 4px; }
.design-sub { color: var(--text-muted); font-size: 0.9rem; }
.btn-navy { background: #0c4a6e; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }

.main-split-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }

.grid-filters { display: flex; gap: 16px; margin-bottom: 20px; }
.filter-item { display: flex; flex-direction: column; gap: 6px; }
.flex-2 { flex: 2; }
.filter-item label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.5px; }
.search-box { display: flex; align-items: center; gap: 10px; background: #f1f5f9; padding: 10px 16px; border-radius: 12px; position: relative; }
.search-box input { border: none; background: transparent; outline: none; flex: 1; font-size: 0.88rem; font-weight: 500; }
.design-select { background: #f1f5f9; border: none; padding: 10px 16px; border-radius: 12px; font-size: 0.88rem; font-weight: 500; appearance: none; }

.tr-active { background: #f0f7ff !important; border-left: 4px solid var(--primary-500); }
.id-text { color: #0284c7; font-weight: 800; font-size: 0.8rem; }
.name-box { display: flex; flex-direction: column; gap: 2px; }
.type-tag { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; }
.debt-text { color: #dc2626; font-weight: 700; }
.icon-view-btn { border: none; background: #f8fafc; width: 32px; height: 32px; border-radius: 8px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; }

.bottom-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }
.mini-card { background: white; padding: 20px; border-radius: 20px; border: 1px solid var(--gray-100); }
.mini-label { font-size: 0.72rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; }
.mini-val { font-size: 1.25rem; font-weight: 800; color: var(--text-navy); display: flex; align-items: baseline; gap: 8px; }
.trend-red { color: #ef4444; font-size: 0.75rem; }
.trend-green { color: #10b981; font-size: 0.75rem; }

.payment-sticky-card { position: sticky; top: 20px; background: #f0f7ff; }
.side-title { display: flex; align-items: center; gap: 10px; font-size: 1rem; color: var(--text-navy); font-weight: 800; }
.empty-side-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
.empty-icon { margin-bottom: 12px; opacity: 0.3; }

.readonly-pill { background: white; padding: 10px 16px; border-radius: 12px; font-weight: 600; color: var(--text-navy); border: 1px solid var(--gray-200); }
.info-pills { display: flex; flex-direction: column; gap: 12px; margin: 20px 0; }
.pill-item { display: flex; align-items: center; gap: 12px; background: white; padding: 12px; border-radius: 16px; }
.pill-item svg { color: var(--primary-500); }
.pill-item small { display: block; font-size: 0.6rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.5px; }
.pill-item p { font-size: 0.8rem; font-weight: 600; color: var(--text-navy); margin: 0; }

.side-form-group { margin-bottom: 16px; }
.side-form-group label { display: block; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); margin-bottom: 8px; }
.input-wrap { position: relative; }
.currency-tag { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }
.btn-full { width: 100%; margin-top: 10px; background: #0c4271; }

.day-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
.day-card { border-radius: 16px; padding: 16px; display: flex; flex-direction: column; color: white; }
.teal-grad { background: linear-gradient(135deg, #14b8a6, #0d9488); }
.orange-grad { background: linear-gradient(135deg, #f97316, #ea580c); }
.d-label { font-size: 0.58rem; font-weight: 700; opacity: 0.8; margin-bottom: 4px; }
.d-val { font-size: 1rem; font-weight: 800; }

.bottom-banner { margin-top: 40px; border-radius: 24px; height: 300px; background: url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center; position: relative; overflow: hidden; display: flex; align-items: flex-end; padding: 40px; }
.bottom-banner::before { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(15, 23, 42, 0.8) 0%, transparent 60%); }
.banner-content { position: relative; z-index: 1; color: white; max-width: 500px; }
.banner-content h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 10px; }
.banner-content p { font-size: 0.9rem; opacity: 0.8; line-height: 1.5; }
</style>
