<template>
  <div class="hosodaily-page">
    <!-- Back Button -->
    <div class="page-nav">
      <button class="btn-back" @click="$router.push('/dai-ly')">
        <ChevronLeft :size="18" /> Quay lại
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải hồ sơ...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="!daiLy" class="error-state">
      <AlertCircle :size="48" />
      <p>Không tìm thấy đại lý này</p>
      <button class="btn-primary" @click="$router.push('/dai-ly')">Quay lại danh sách</button>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Hero Section -->
      <div class="hero-card card-box shadow-sm">
        <div class="hero-container">
          <div class="hero-left">
            <div class="big-avatar" :style="{ background: getAvatarColor(daiLy.TenDaiLy) }">
              {{ daiLy.TenDaiLy.charAt(0).toUpperCase() }}
            </div>
            <div class="hero-info">
              <div class="hero-badges">
                <span class="badge" :class="daiLy.MaLoai === 1 ? 'badge-primary' : 'badge-secondary'">
                  {{ daiLy.MaLoai === 1 ? 'Loại 1' : 'Loại 2' }}
                </span>
                <span class="id-badge">#{{ String(daiLy.MaDaiLy).padStart(3, '0') }}</span>
              </div>
              <h1 class="hero-title">{{ daiLy.TenDaiLy }}</h1>
              <div class="hero-meta">
                <span><MapPin :size="16" /> {{ daiLy.quan?.TenQuan || 'N/A' }}</span>
                <span><Phone :size="16" /> {{ daiLy.DienThoai }}</span>
                <span v-if="daiLy.Email"><Mail :size="16" /> {{ daiLy.Email }}</span>
              </div>
            </div>
          </div>

          <div class="hero-stats">
            <div class="stat-box">
              <span class="stat-label">Doanh Thu</span>
              <span class="stat-value emerald">{{ fmtM(thongKe.tongDoanhThu) }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Đã Thu</span>
              <span class="stat-value blue">{{ fmtM(thongKe.tongDaThu) }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Còn Nợ</span>
              <span class="stat-value" :class="thongKe.conNo > 0 ? 'red' : 'emerald'">
                {{ fmtM(thongKe.conNo) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="info-section card-box shadow-sm">
        <h2 class="section-title">Thông Tin Chi Tiết</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Địa Chỉ</span>
            <span class="info-value">{{ daiLy.DiaChi || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Điện Thoại</span>
            <span class="info-value">{{ daiLy.DienThoai }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{ daiLy.Email || 'Chưa cập nhật' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Ngày Tiếp Nhận</span>
            <span class="info-value">{{ fmtDate(daiLy.NgayTiepNhan) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Khu Vực</span>
            <span class="info-value">{{ daiLy.quan?.TenQuan || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Loại Đại Lý</span>
            <span class="info-value">{{ daiLy.MaLoai === 1 ? 'Loại 1' : 'Loại 2' }}</span>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="stats-cards">
        <div class="stat-card card-box shadow-sm">
          <div class="sc-icon" style="background: #ecfdf5; color: #10b981;">
            <FileText :size="24" />
          </div>
          <div class="sc-content">
            <span class="sc-label">Phiếu Xuất</span>
            <h3 class="sc-value">{{ thongKe.tongPhieuXuat }}</h3>
          </div>
        </div>
        <div class="stat-card card-box shadow-sm">
          <div class="sc-icon" style="background: #eff6ff; color: #2563eb;">
            <Receipt :size="24" />
          </div>
          <div class="sc-content">
            <span class="sc-label">Phiếu Thu</span>
            <h3 class="sc-value">{{ thongKe.tongPhieuThu }}</h3>
          </div>
        </div>
        <div class="stat-card card-box shadow-sm">
          <div class="sc-icon" style="background: #fff7ed; color: #f97316;">
            <Wallet :size="24" />
          </div>
          <div class="sc-content">
            <span class="sc-label">Tỷ Lệ Thu Nợ</span>
            <h3 class="sc-value">{{ debtPct }}%</h3>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import {
  ChevronLeft, MapPin, Phone, Mail, Building2,
  FileText, Receipt, AlertCircle, Wallet
} from 'lucide-vue-next';

const route = useRoute();
const loading = ref(true);
const daiLy = ref(null);
const thongKe = ref({
  tongPhieuXuat: 0,
  tongDoanhThu: 0,
  tongPhieuThu: 0,
  tongDaThu: 0,
  conNo: 0
});

const debtPct = computed(() => {
  const total = thongKe.value.tongDoanhThu;
  if (!total) return 100;
  return Math.min(100, Math.round((thongKe.value.tongDaThu / total) * 100));
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/dai-ly/${route.params.id}/lich-su`);
    daiLy.value = res.data.data.daiLy;
    thongKe.value = res.data.data.thongKe;
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

const fmtM = (n) => {
  const v = parseFloat(n) || 0;
  if (v >= 1e9) return (v / 1e9).toFixed(1) + ' Tỷ';
  if (v >= 1e6) return (v / 1e6).toFixed(1) + ' Tr';
  return v.toLocaleString('vi-VN') + 'đ';
};

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

onMounted(fetchData);
</script>

<style scoped>
/* Base */
.hosodaily-page {
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

/* Page Navigation */
.page-nav {
  margin-bottom: 24px;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  background: white;
  color: #64748b;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;
}

.btn-back:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #0f172a;
}

/* Loading & Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f1f5f9;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-state svg {
  color: #f1f5f9;
  margin-bottom: 16px;
}

.error-state p,
.loading-state p {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 24px;
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
  transition: 0.3s;
  box-shadow: 0 10px 15px rgba(12, 74, 53, 0.15);
}

.btn-primary:hover {
  background: #093425;
  transform: translateY(-2px);
  box-shadow: 0 15px 25px rgba(12, 74, 53, 0.25);
}

/* Hero Card */
.hero-card {
  margin-bottom: 24px;
}

.hero-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.hero-left {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex: 1;
}

.big-avatar {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 2rem;
  flex-shrink: 0;
}

.hero-info {
  flex: 1;
}

.hero-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.7rem;
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

.id-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  font-size: 0.7rem;
}

.hero-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
}

.hero-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.95rem;
  color: #64748b;
}

.hero-meta span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-stats {
  display: flex;
  gap: 16px;
  flex: 0 0 auto;
}

.stat-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 20px;
  background: #fafbfc;
  border-radius: 12px;
  text-align: center;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.stat-value.emerald { color: #10b981; }
.stat-value.blue { color: #2563eb; }
.stat-value.red { color: #e11d48; }

/* Info Section */
.info-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 20px 0;
  letter-spacing: -0.3px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
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

.sc-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sc-content {
  flex: 1;
}

.sc-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 4px;
}

.sc-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.5px;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container {
    flex-direction: column;
    gap: 24px;
  }

  .hero-stats {
    width: 100%;
    flex-direction: row;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-left {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-meta {
    align-items: center;
  }

  .big-avatar {
    width: 80px;
    height: 80px;
    font-size: 1.5rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
