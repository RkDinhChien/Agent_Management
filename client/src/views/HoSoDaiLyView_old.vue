<template>
  <div class="hosodaily-page">
    <!-- Back + Header -->
    <div class="page-topbar">
      <button class="btn-back" @click="$router.push('/dai-ly')">
        <ChevronLeft :size="18" /> Danh sách đại lý
      </button>
    </div>

    <div v-if="loading" class="loading-box">
      <div class="spinner"></div>
      <p>Đang tải hồ sơ...</p>
    </div>

    <div v-else-if="!daiLy" class="error-box">
      <AlertCircle :size="48" />
      <p>Không tìm thấy đại lý này.</p>
      <button class="btn-master btn-emerald" @click="$router.push('/dai-ly')">Quay lại</button>
    </div>

    <template v-else>
      <!-- Hero Card -->
      <div class="hero-card">
        <div class="hero-left">
          <div class="big-avatar" :style="{ background: getAvatarColor(daiLy.TenDaiLy) }">
            {{ daiLy.TenDaiLy.charAt(0).toUpperCase() }}
          </div>
          <div class="hero-info">
            <div class="hero-badges">
              <span class="type-badge" :class="daiLy.loaiDaiLy?.TenLoai === 'Loại 1' ? 't1' : 't2'">
                {{ daiLy.loaiDaiLy?.TenLoai }}
              </span>
              <span class="id-badge">#{{ String(daiLy.MaDaiLy).padStart(3, '0') }}</span>
            </div>
            <h1>{{ daiLy.TenDaiLy }}</h1>
            <div class="hero-meta-row">
              <span><MapPin :size="14" /> {{ daiLy.quan?.TenQuan }}</span>
              <span><Phone :size="14" /> {{ daiLy.DienThoai }}</span>
              <span v-if="daiLy.Email"><Mail :size="14" /> {{ daiLy.Email }}</span>
            </div>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-stat">
            <span class="hs-label">DOANH THU</span>
            <span class="hs-val emerald">{{ fmtM(thongKe.tongDoanhThu) }}</span>
          </div>
          <div class="hero-stat">
            <span class="hs-label">ĐÃ THU</span>
            <span class="hs-val blue">{{ fmtM(thongKe.tongDaThu) }}</span>
          </div>
          <div class="hero-stat">
            <span class="hs-label">CÒN NỢ</span>
            <span class="hs-val" :class="thongKe.conNo > 0 ? 'red' : 'emerald'">{{ fmtM(thongKe.conNo) }}</span>
          </div>
          <div class="hero-stat">
            <span class="hs-label">SỐ PXH</span>
            <span class="hs-val purple">{{ thongKe.tongPhieuXuat }}</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button
          v-for="tab in tabs" :key="tab.id"
          class="tab-btn" :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" :size="16" />
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Tab: Thông tin -->
      <div v-if="activeTab === 'info'" class="tab-content">
        <div class="info-grid">
          <div class="info-card">
            <div class="ic-header"><Building2 :size="18" /> Thông tin cơ bản</div>
            <div class="ic-body">
              <div class="info-row">
                <span class="ir-label">Tên đại lý</span>
                <span class="ir-val">{{ daiLy.TenDaiLy }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">Loại đại lý</span>
                <span class="ir-val">
                  <span class="type-badge sm" :class="daiLy.loaiDaiLy?.TenLoai === 'Loại 1' ? 't1' : 't2'">{{ daiLy.loaiDaiLy?.TenLoai }}</span>
                </span>
              </div>
              <div class="info-row">
                <span class="ir-label">Khu vực</span>
                <span class="ir-val"><MapPin :size="14" class="inline-icon" /> {{ daiLy.quan?.TenQuan }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">Ngày tiếp nhận</span>
                <span class="ir-val">{{ fmtDate(daiLy.NgayTiepNhan) }}</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="ic-header"><ContactRound :size="18" /> Liên hệ</div>
            <div class="ic-body">
              <div class="info-row">
                <span class="ir-label">Số điện thoại</span>
                <span class="ir-val">{{ daiLy.DienThoai || '—' }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">Email</span>
                <span class="ir-val">{{ daiLy.Email || '—' }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">Địa chỉ</span>
                <span class="ir-val">{{ daiLy.DiaChi || '—' }}</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="ic-header"><Wallet :size="18" /> Tình hình công nợ</div>
            <div class="ic-body">
              <div class="info-row">
                <span class="ir-label">Tổng doanh thu</span>
                <span class="ir-val fw">{{ fmtCurrency(thongKe.tongDoanhThu) }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">Tổng đã thu</span>
                <span class="ir-val fw blue">{{ fmtCurrency(thongKe.tongDaThu) }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">Dư nợ hiện tại</span>
                <span class="ir-val fw" :class="thongKe.conNo > 0 ? 'red' : 'emerald'">{{ fmtCurrency(thongKe.conNo) }}</span>
              </div>
              <div class="debt-bar-wrap">
                <div class="debt-bar-track">
                  <div class="debt-bar-fill" :style="{ width: debtPct + '%' }"></div>
                </div>
                <span class="debt-pct-label">{{ debtPct }}% đã thu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Phiếu xuất hàng -->
      <div v-if="activeTab === 'xuat'" class="tab-content">
        <div class="data-card">
          <div class="dc-header">
            <span class="dc-title"><FileText :size="16" /> Lịch sử phiếu xuất hàng</span>
            <span class="dc-badge">{{ phieuXuats.length }} phiếu</span>
          </div>
          <div class="table-wrap">
            <table v-if="phieuXuats.length > 0">
              <thead>
                <tr>
                  <th>MÃ PXH</th>
                  <th>NGÀY XUẤT</th>
                  <th style="text-align:right">TỔNG TIỀN</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="px in phieuXuats" :key="px.MaPX">
                  <td><span class="mono-badge">#{{ String(px.MaPX).padStart(4,'0') }}</span></td>
                  <td>{{ fmtDate(px.NgayXuat) }}</td>
                  <td style="text-align:right"><span class="amt-val">{{ fmtCurrency(px.TongTien) }}</span></td>
                </tr>
              </tbody>
            </table>
            <div v-else class="empty-tab">
              <FileX :size="40" /> <p>Chưa có phiếu xuất hàng nào.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Phiếu thu tiền -->
      <div v-if="activeTab === 'thu'" class="tab-content">
        <div class="data-card">
          <div class="dc-header">
            <span class="dc-title"><Receipt :size="16" /> Lịch sử thu tiền</span>
            <span class="dc-badge">{{ phieuThus.length }} phiếu</span>
          </div>
          <div class="table-wrap">
            <table v-if="phieuThus.length > 0">
              <thead>
                <tr>
                  <th>MÃ PT</th>
                  <th>NGÀY THU</th>
                  <th style="text-align:right">SỐ TIỀN THU</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pt in phieuThus" :key="pt.MaPT">
                  <td><span class="mono-badge">#{{ String(pt.MaPT).padStart(4,'0') }}</span></td>
                  <td>{{ fmtDate(pt.NgayThu) }}</td>
                  <td style="text-align:right"><span class="amt-val blue">{{ fmtCurrency(pt.SoTienThu) }}</span></td>
                </tr>
              </tbody>
            </table>
            <div v-else class="empty-tab">
              <FileX :size="40" /> <p>Chưa có phiếu thu tiền nào.</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import {
  ChevronLeft, MapPin, Phone, Mail, Wallet, Building2,
  FileText, Receipt, FileX, AlertCircle, ContactRound
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const daiLy = ref(null);
const phieuXuats = ref([]);
const phieuThus = ref([]);
const thongKe = ref({ tongDoanhThu: 0, tongDaThu: 0, conNo: 0, tongPhieuXuat: 0, tongPhieuThu: 0 });
const activeTab = ref('info');

const tabs = computed(() => [
  { id: 'info', label: 'Thông tin', icon: Building2 },
  { id: 'xuat', label: 'Phiếu xuất hàng', icon: FileText, count: phieuXuats.value.length },
  { id: 'thu', label: 'Thu tiền', icon: Receipt, count: phieuThus.value.length },
]);

const debtPct = computed(() => {
  const total = thongKe.value.tongDoanhThu;
  if (!total) return 100;
  return Math.min(100, Math.round((thongKe.value.tongDaThu / total) * 100));
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/dai-ly/${route.params.id}/lich-su`);
    const d = res.data.data;
    daiLy.value = d.daiLy;
    phieuXuats.value = d.phieuXuats;
    phieuThus.value = d.phieuThus;
    thongKe.value = d.thongKe;
  } catch (e) {
    console.error(e);
    daiLy.value = null;
  } finally {
    loading.value = false;
  }
};

const getAvatarColor = (name) => {
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#0ea5e9'];
  return colors[name.length % colors.length];
};

const fmtCurrency = (n) => (parseFloat(n) || 0).toLocaleString('vi-VN') + 'đ';
const fmtM = (n) => {
  const v = parseFloat(n) || 0;
  if (v >= 1e9) return (v / 1e9).toFixed(1) + ' Tỷ';
  if (v >= 1e6) return (v / 1e6).toFixed(1) + ' Tr';
  return v.toLocaleString('vi-VN') + 'đ';
};
const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

onMounted(fetchData);
</script>

<style scoped>
.hosodaily-page { padding: 10px 0; }

/* Topbar */
.page-topbar { margin-bottom: 24px; }
.btn-back {
  display: inline-flex; align-items: center; gap: 6px;
  background: white; border: 1px solid #f1f5f9; padding: 9px 18px;
  border-radius: 99px; font-weight: 700; font-size: 0.83rem; color: #64748b;
  cursor: pointer; transition: 0.2s;
  box-shadow: -3px -3px 8px rgba(255,255,255,1), 3px 3px 8px rgba(15,23,42,0.04);
}
.btn-back:hover { color: #0f172a; transform: translateX(-2px); }

/* Loading / Error */
.loading-box, .error-box {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  padding: 100px 0; color: #94a3b8;
}
.spinner {
  width: 40px; height: 40px; border: 3px solid #f1f5f9;
  border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Hero Card */
.hero-card {
  background: white; border-radius: 24px; padding: 32px 36px;
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: -5px -5px 15px rgba(255,255,255,1), 5px 5px 15px rgba(15,23,42,0.05);
  display: flex; align-items: center; justify-content: space-between; gap: 32px;
  margin-bottom: 24px; flex-wrap: wrap;
}
.hero-left { display: flex; align-items: center; gap: 24px; }
.big-avatar {
  width: 80px; height: 80px; border-radius: 22px; display: flex; align-items: center;
  justify-content: center; color: white; font-weight: 900; font-size: 2rem; flex-shrink: 0;
  box-shadow: inset 0 3px 8px rgba(255,255,255,0.3), 0 8px 20px rgba(0,0,0,0.12);
}
.hero-badges { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
.id-badge { background: #f1f5f9; color: #475569; font-weight: 800; font-size: 0.72rem; padding: 3px 10px; border-radius: 6px; font-family: monospace; }
.hero-info h1 { font-size: 1.6rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0; letter-spacing: -0.5px; }
.hero-meta-row { display: flex; gap: 20px; flex-wrap: wrap; }
.hero-meta-row span { display: flex; align-items: center; gap: 5px; font-size: 0.83rem; color: #64748b; font-weight: 600; }
.hero-right { display: flex; gap: 20px; flex-wrap: wrap; }
.hero-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; background: #f8fafc; border-radius: 16px; padding: 16px 24px; border: 1px solid #f1f5f9; min-width: 90px; }
.hs-label { font-size: 0.62rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }
.hs-val { font-size: 1.2rem; font-weight: 900; color: #0f172a; letter-spacing: -0.3px; }
.hs-val.emerald { color: #059669; }
.hs-val.blue { color: #2563eb; }
.hs-val.red { color: #e11d48; }
.hs-val.purple { color: #7c3aed; }

/* Type badges */
.type-badge { font-size: 0.68rem; font-weight: 800; padding: 4px 12px; border-radius: 99px; letter-spacing: 0.3px; }
.type-badge.t1 { background: #ecfdf5; color: #059669; }
.type-badge.t2 { background: #eff6ff; color: #2563eb; }
.type-badge.sm { padding: 2px 10px; font-size: 0.65rem; }

/* Tabs */
.tabs-bar {
  display: flex; gap: 6px; background: white; border-radius: 16px;
  padding: 6px; margin-bottom: 20px; width: fit-content;
  box-shadow: -3px -3px 8px rgba(255,255,255,1), 3px 3px 8px rgba(15,23,42,0.04);
  border: 1px solid rgba(255,255,255,0.8);
}
.tab-btn {
  display: flex; align-items: center; gap: 7px; padding: 9px 18px;
  border-radius: 11px; border: none; font-weight: 700; font-size: 0.83rem;
  color: #64748b; background: transparent; cursor: pointer; transition: 0.2s; white-space: nowrap;
}
.tab-btn:hover { background: #f8fafc; color: #0f172a; }
.tab-btn.active { background: #0c4a35; color: white; box-shadow: 0 4px 12px rgba(12,74,53,0.2); }
.tab-count { background: rgba(255,255,255,0.2); border-radius: 99px; padding: 1px 8px; font-size: 0.72rem; font-weight: 800; }
.tab-btn:not(.active) .tab-count { background: #f1f5f9; color: #64748b; }

/* Info grid */
.info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.info-card {
  background: white; border-radius: 20px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: -4px -4px 12px rgba(255,255,255,1), 4px 4px 12px rgba(15,23,42,0.04);
}
.ic-header {
  display: flex; align-items: center; gap: 10px; padding: 18px 22px;
  border-bottom: 1px solid #f1f5f9; font-weight: 800; font-size: 0.85rem; color: #0f172a;
  background: #fafbfc;
}
.ic-body { padding: 8px 0; }
.info-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 22px; gap: 12px; border-bottom: 1px solid #f8fafc; }
.info-row:last-child { border-bottom: none; }
.ir-label { font-size: 0.78rem; font-weight: 700; color: #94a3b8; flex-shrink: 0; }
.ir-val { font-size: 0.88rem; font-weight: 700; color: #0f172a; text-align: right; display: flex; align-items: center; gap: 4px; }
.ir-val.fw { font-size: 0.95rem; }
.ir-val.emerald { color: #059669; }
.ir-val.blue { color: #2563eb; }
.ir-val.red { color: #e11d48; }
.inline-icon { opacity: 0.5; flex-shrink: 0; }

/* Debt bar */
.debt-bar-wrap { padding: 4px 22px 16px; }
.debt-bar-track { background: #f1f5f9; border-radius: 99px; height: 6px; overflow: hidden; margin-bottom: 6px; }
.debt-bar-fill { height: 100%; background: linear-gradient(90deg, #10b981, #059669); border-radius: 99px; transition: width 0.6s ease; }
.debt-pct-label { font-size: 0.72rem; font-weight: 700; color: #94a3b8; }

/* Data card for tables */
.data-card {
  background: white; border-radius: 20px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: -4px -4px 12px rgba(255,255,255,1), 4px 4px 12px rgba(15,23,42,0.04);
}
.dc-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 28px; background: #fafbfc; border-bottom: 1px solid #f1f5f9;
}
.dc-title { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 0.88rem; color: #0f172a; }
.dc-badge { background: #ecfdf5; color: #059669; font-weight: 800; font-size: 0.72rem; padding: 4px 12px; border-radius: 99px; }

.table-wrap { overflow-x: auto; }
.table-wrap table { width: 100%; border-collapse: collapse; }
.table-wrap th {
  background: #fafbfc; text-align: left; padding: 14px 28px;
  font-size: 0.68rem; font-weight: 800; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9;
}
.table-wrap td { padding: 15px 28px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.table-wrap tbody tr { transition: 0.15s; }
.table-wrap tbody tr:hover { background: #fafbfc; }
.table-wrap tbody tr:last-child td { border-bottom: none; }

.mono-badge { background: #f1f5f9; color: #475569; font-weight: 800; font-size: 0.72rem; padding: 4px 10px; border-radius: 6px; font-family: monospace; }
.amt-val { font-weight: 800; font-size: 0.9rem; color: #0f172a; font-variant-numeric: tabular-nums; }
.amt-val.blue { color: #2563eb; }

.empty-tab { padding: 70px 0; text-align: center; color: #cbd5e1; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-tab p { font-weight: 600; font-size: 0.88rem; color: #94a3b8; }

.btn-master { padding: 10px 24px; border-radius: 99px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; border: none; }
.btn-master.btn-emerald { background: #0c4a35; color: white; }
</style>
