<template>
  <div class="tc">

    <!-- ══ CONTEXT BANNER ══ -->
    <div class="ctx-card">

      <!-- Hexagon decoration -->
      <svg class="ctx-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <polygon id="tchx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
        </defs>
        <g stroke="#059669" stroke-width=".9" opacity=".13">
          <use href="#tchx" transform="translate(21,24)"/>  <use href="#tchx" transform="translate(62,24)"/>
          <use href="#tchx" transform="translate(103,24)"/> <use href="#tchx" transform="translate(144,24)"/>
          <use href="#tchx" transform="translate(185,24)"/> <use href="#tchx" transform="translate(226,24)"/>
          <use href="#tchx" transform="translate(267,24)"/>
          <use href="#tchx" transform="translate(0,60)"/>   <use href="#tchx" transform="translate(41,60)"/>
          <use href="#tchx" transform="translate(82,60)"/>  <use href="#tchx" transform="translate(123,60)"/>
          <use href="#tchx" transform="translate(164,60)"/> <use href="#tchx" transform="translate(205,60)"/>
          <use href="#tchx" transform="translate(246,60)"/> <use href="#tchx" transform="translate(287,60)"/>
          <use href="#tchx" transform="translate(21,96)"/>  <use href="#tchx" transform="translate(62,96)"/>
          <use href="#tchx" transform="translate(103,96)"/> <use href="#tchx" transform="translate(144,96)"/>
          <use href="#tchx" transform="translate(185,96)"/> <use href="#tchx" transform="translate(226,96)"/>
          <use href="#tchx" transform="translate(267,96)"/>
          <use href="#tchx" transform="translate(0,132)"/>  <use href="#tchx" transform="translate(41,132)"/>
          <use href="#tchx" transform="translate(82,132)"/> <use href="#tchx" transform="translate(123,132)"/>
          <use href="#tchx" transform="translate(164,132)"/><use href="#tchx" transform="translate(205,132)"/>
          <use href="#tchx" transform="translate(246,132)"/><use href="#tchx" transform="translate(287,132)"/>
        </g>
        <g stroke="#059669" stroke-width="1.2" opacity=".28">
          <use href="#tchx" transform="translate(144,60)"/>
          <use href="#tchx" transform="translate(185,24)"/>
          <use href="#tchx" transform="translate(226,96)"/>
        </g>
        <polygon points="144,36 164.8,48 164.8,72 144,84 123.2,72 123.2,48" fill="#059669" opacity=".07"/>
        <polygon points="185,0 205.8,12 205.8,36 185,48 164.2,36 164.2,12" fill="#047857" opacity=".06"/>
        <polygon points="226,72 246.8,84 246.8,108 226,120 205.2,108 205.2,84" fill="#059669" opacity=".06"/>
        <g fill="#059669" opacity=".5">
          <circle cx="144" cy="60" r="3.5"/><circle cx="185" cy="24" r="3"/><circle cx="226" cy="96" r="3"/>
        </g>
        <g stroke="#059669" stroke-width=".8" stroke-dasharray="3 4" opacity=".2">
          <line x1="144" y1="60" x2="185" y2="24"/>
          <line x1="144" y1="60" x2="226" y2="96"/>
        </g>
        <g fill="#047857" opacity=".3">
          <circle cx="62" cy="24" r="2"/><circle cx="267" cy="60" r="2"/><circle cx="103" cy="132" r="2"/>
        </g>
      </svg>

      <!-- Watermark icon: search + agent -->
      <svg class="ctx-wm" viewBox="0 0 100 90" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="38" cy="38" r="28"/>
        <line x1="58" y1="58" x2="88" y2="88"/>
        <circle cx="38" cy="30" r="9" stroke-width="3.5"/>
        <path d="M18 52c0-8 9-13 20-13s20 5 20 13" stroke-width="3.5"/>
      </svg>

      <div class="ctx-top">
        <div class="ctx-title-block">
          <p class="ctx-eyebrow">Nghiệp vụ · Công nợ đại lý</p>
          <h1 class="ctx-title">Tra Cứu Đại Lý</h1>
        </div>
        <div class="ctx-actions">
          <button class="btn-csv" @click="exportCSV"><Download :size="13"/> Xuất CSV</button>
          <button class="btn-p" @click="openCollect"><Plus :size="14"/> Lập phiếu thu</button>
        </div>
      </div>

      <div class="ctx-divider"></div>

      <div class="ctx-stats">

        <!-- KPI 1: Tổng đại lý -->
        <div class="cs-col">
          <strong class="cs-num">
            {{ daiLys.length }}
            <span class="cs-tag cs-tag-blue">đang hoạt động</span>
          </strong>
          <span class="cs-delta cs-up">↑ 1 so tháng 4</span>
          <span class="cs-lbl">Tổng đại lý</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 2: Tổng công nợ + sparkline -->
        <div class="cs-col">
          <strong class="cs-num">{{ totalDebtTr }} <span style="font-size:14px;font-weight:600;color:#94a3b8">Tr</span></strong>
          <span class="cs-delta cs-down">↑ 3% so tháng 4</span>
          <div class="spark-wrap">
            <div v-for="(h, i) in spark" :key="i"
                 class="spark-bar" :class="{ 'spark-active': i === spark.length - 1 }"
                 :style="{ height: (h / maxSpark * 100) + '%' }">
            </div>
          </div>
          <span class="cs-lbl">Tổng công nợ (Tr)</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 3: Đại lý còn nợ + donut -->
        <div class="cs-col cs-warn">
          <div class="cs-pending-row">
            <div class="donut-wrap">
              <div class="donut-ring" :style="{ background: donutGradient }"></div>
            </div>
            <div>
              <strong class="cs-num cs-amber" style="display:block;margin-bottom:2px">
                {{ agentsWithDebt }}
                <span class="cs-tag" v-if="agentsWithDebt > 0">còn nợ</span>
              </strong>
              <span class="cs-delta cs-ok">{{ daiLys.length - agentsWithDebt }} đã thanh toán</span>
            </div>
          </div>
          <div class="donut-legend">
            <span class="dl-dot" style="background:#10b981"></span> Sạch nợ {{ daiLys.length - agentsWithDebt }}
            <span class="dl-dot" style="background:#f59e0b;margin-left:6px"></span> Còn nợ {{ agentsWithDebt }}
          </div>
          <span class="cs-lbl" style="margin-top:4px">Đại lý còn dư nợ</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 4: Thu hôm nay -->
        <div class="cs-col">
          <strong class="cs-num">
            128.5 <span style="font-size:14px;font-weight:600;color:#94a3b8">Tr</span>
          </strong>
          <span class="cs-delta cs-up">↑ 12% hôm qua</span>
          <span class="cs-lbl">Thu tiền hôm nay</span>
        </div>
      </div>

      <!-- Month progress bar -->
      <div class="ctx-timeline">
        <div class="ctl-row">
          <span class="ctl-label">{{ monthName }} · Ngày {{ dayOfMonth }}/{{ daysInMonth }}</span>
          <span class="ctl-pct">{{ monthProgressPct }}% tiến độ tháng</span>
        </div>
        <div class="ctl-track">
          <div class="ctl-fill" :style="{ width: monthProgressPct + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- ══ MAIN LAYOUT ══ -->
    <div class="dl-flex">

      <!-- ════ LIST CARD ════ -->
      <div class="dl-card list-card">

        <!-- Toolbar -->
        <div class="lc-hd">
          <div class="lc-title-row">
            <h3 class="lc-title">Danh sách đại lý</h3>
            <span class="count-badge">{{ filteredDaiLys.length }} / {{ daiLys.length }}</span>
            <button v-if="hasFilter" class="clear-btn" @click="clearFilters">
              <X :size="11"/> Xóa lọc
            </button>
            <div class="stab-group">
              <button class="stab" :class="{ active: filterDebt === '' }" @click="filterDebt = ''">Tất cả</button>
              <button class="stab stab-red" :class="{ active: filterDebt === 'debt' }" @click="filterDebt = 'debt'">
                Còn nợ <span class="stab-n">{{ agentsWithDebt }}</span>
              </button>
              <button class="stab stab-green" :class="{ active: filterDebt === 'clean' }" @click="filterDebt = 'clean'">
                Sạch nợ <span class="stab-n">{{ daiLys.length - agentsWithDebt }}</span>
              </button>
            </div>
          </div>
          <div class="lc-tools">
            <div class="search-wrap">
              <Search :size="14" class="search-ic"/>
              <input v-model="searchText" class="search-inp" placeholder="Tìm mã, tên đại lý…"/>
            </div>
            <select v-model="filterQuan" class="psel">
              <option value="">Tất cả quận</option>
              <option v-for="q in quans" :key="q.MaQuan" :value="q.MaQuan">{{ q.TenQuan }}</option>
            </select>
            <select v-model="filterLoai" class="psel">
              <option value="">Tất cả loại</option>
              <option v-for="l in loaiDaiLys" :key="l.MaLoai" :value="l.MaLoai">{{ l.TenLoai }}</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="dl-table">
            <thead>
              <tr>
                <th style="width:110px">Mã đại lý</th>
                <th>Tên đại lý</th>
                <th style="width:130px">Quận / Huyện</th>
                <th style="width:120px">Loại</th>
                <th style="width:140px" class="text-right">Công nợ</th>
                <th style="width:90px" class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="dl in filteredDaiLys" :key="dl.MaDaiLy"
                class="tc-row" :class="{ selected: selectedDaiLy?.MaDaiLy === dl.MaDaiLy }"
                @click="selectDaiLy(dl)">
                <td><span class="tc-code">DL-{{ String(dl.MaDaiLy).padStart(4, '0') }}</span></td>
                <td>
                  <div class="agent-cell">
                    <div class="agent-av">
                      <img :src="agentBrand(dl.MaDaiLy).logo" class="av-logo" :alt="dl.TenDaiLy" @error="e => e.target.style.display='none'"/>
                      <span class="av-init" :style="{ background: agentBrand(dl.MaDaiLy).bg }">{{ dl.TenDaiLy?.charAt(0).toUpperCase() || '?' }}</span>
                    </div>
                    <div>
                      <span class="agent-name">{{ dl.TenDaiLy }}</span>
                      <span class="agent-sub">{{ dl.DiaChi }}</span>
                    </div>
                  </div>
                </td>
                <td class="muted">{{ dl.quan?.TenQuan || '—' }}</td>
                <td>
                  <span class="type-badge">{{ dl.loaiDaiLy?.TenLoai || '—' }}</span>
                </td>
                <td class="text-right">
                  <span class="debt-num" :class="dl.TienNo > 0 ? 'has-debt' : 'no-debt'">
                    {{ fmtCurrency(dl.TienNo) }}
                  </span>
                </td>
                <td class="col-actions">
                  <button class="act-btn view-btn" title="Chọn thu tiền" @click.stop="selectDaiLy(dl)"><Wallet :size="13"/></button>
                  <button class="act-btn edit-btn" title="Hồ sơ" @click.stop="goProfile(dl)"><ChevronRight :size="13"/></button>
                </td>
              </tr>
              <tr v-if="!filteredDaiLys.length">
                <td colspan="6" class="empty-row">
                  <Search :size="30" class="empty-ic"/><p>Không tìm thấy đại lý phù hợp</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="lc-foot" v-if="filteredDaiLys.length">
          Hiển thị {{ filteredDaiLys.length }} đại lý
          <span v-if="hasFilter"> (đã lọc từ {{ daiLys.length }})</span>
        </div>
      </div>

      <!-- ════ SIDE PANEL — Payment Form ════ -->
      <Transition name="panel">
      <div class="dl-card side-panel" v-if="panelVisible">
        <div class="ap-hd">
          <div v-if="selectedDaiLy" class="ap-avatar">
            <img :src="agentBrand(selectedDaiLy.MaDaiLy).logo" class="av-logo" :alt="selectedDaiLy.TenDaiLy" @error="e => e.target.style.display='none'"/>
            <span class="av-init" :style="{ background: agentBrand(selectedDaiLy.MaDaiLy).bg }">{{ selectedDaiLy.TenDaiLy?.charAt(0).toUpperCase() || '?' }}</span>
          </div>
          <div class="ap-title-block">
            <h3 class="ap-name">{{ selectedDaiLy?.TenDaiLy }}</h3>
            <div class="ap-badges">
              <span class="ap-id-badge">DL-{{ String(selectedDaiLy?.MaDaiLy ?? 0).padStart(4, '0') }}</span>
              <span class="ap-loai-badge">{{ selectedDaiLy?.loaiDaiLy?.TenLoai }}</span>
            </div>
          </div>
          <button class="ap-close" @click="closePanel"><X :size="16"/></button>
        </div>

        <!-- Info pills -->
        <div class="info-grid">
          <div class="ig-item">
            <MapPin :size="13" class="ig-ic"/>
            <div>
              <small>ĐỊA CHỈ</small>
              <p>{{ selectedDaiLy?.DiaChi || '—' }}</p>
            </div>
          </div>
          <div class="ig-item">
            <Phone :size="13" class="ig-ic"/>
            <div>
              <small>ĐIỆN THOẠI</small>
              <p>{{ selectedDaiLy?.DienThoai || '—' }}</p>
            </div>
          </div>
          <div class="ig-item ig-debt" v-if="selectedDaiLy?.TienNo > 0">
            <AlertCircle :size="13" class="ig-ic ig-ic-warn"/>
            <div>
              <small>CÔNG NỢ HIỆN TẠI</small>
              <p class="debt-val">{{ fmtCurrency(selectedDaiLy?.TienNo) }}</p>
            </div>
          </div>
        </div>

        <div class="ap-divider"></div>

        <!-- Payment form -->
        <h4 class="form-section-title"><Wallet :size="13"/> Lập phiếu thu tiền</h4>

        <div class="sf-group">
          <label>NGÀY THU TIỀN</label>
          <input v-model="payForm.NgayThu" type="date" class="sf-input"/>
        </div>

        <div class="sf-group">
          <label>SỐ TIỀN THU</label>
          <div class="sf-input-wrap">
            <input v-model.number="payForm.SoTienThu" type="number" min="0" :max="selectedAssetNo" class="sf-input" placeholder="0"/>
            <span class="sf-unit">VND</span>
          </div>
          <p v-if="payForm.SoTienThu > selectedAssetNo && selectedAssetNo > 0" class="sf-warn">
            <AlertCircle :size="11"/> Vượt quá nợ hiện tại ({{ fmtCurrency(selectedAssetNo) }})
          </p>
          <div v-if="selectedAssetNo > 0" class="debt-fill-bar">
            <div class="dfb-track">
              <div class="dfb-fill" :style="{ width: Math.min(payForm.SoTienThu / selectedAssetNo * 100, 100) + '%' }"></div>
            </div>
            <span class="dfb-pct">{{ Math.min(Math.round(payForm.SoTienThu / selectedAssetNo * 100), 100) }}% công nợ</span>
          </div>
        </div>

        <div class="sf-group">
          <label>PHƯƠNG THỨC</label>
          <select v-model="payForm.PhuongThuc" class="sf-input">
            <option value="Chuyển khoản">Chuyển khoản</option>
            <option value="Tiền mặt">Tiền mặt</option>
          </select>
        </div>

        <button class="btn-submit" @click="submitPayment" :disabled="paySubmitting || payForm.SoTienThu <= 0">
          <CheckCircle2 :size="14"/>
          {{ paySubmitting ? 'Đang xử lý…' : 'Hoàn tất thu tiền' }}
        </button>

        <div class="ap-divider"></div>

        <!-- Quick stats -->
        <div class="quick-stats">
          <div class="qs-card qs-blue">
            <span class="qs-lbl">THU HÔM NAY</span>
            <span class="qs-val">128.5M</span>
          </div>
          <div class="qs-card qs-teal">
            <span class="qs-lbl">GIAO DỊCH GẦN ĐÂY</span>
            <span class="qs-val">12</span>
          </div>
        </div>
      </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import {
  Search, Plus, Wallet, MapPin, Phone, AlertCircle,
  ChevronRight, X, Download, CheckCircle2
} from 'lucide-vue-next';

const router = useRouter();

const daiLys      = ref([]);
const quans       = ref([]);
const loaiDaiLys  = ref([]);

const searchText  = ref('');
const filterQuan  = ref('');
const filterLoai  = ref('');
const filterDebt  = ref('');

const selectedDaiLy  = ref(null);
const panelVisible   = ref(false);
const paySubmitting  = ref(false);
const payForm = ref({
  NgayThu: new Date().toISOString().split('T')[0],
  SoTienThu: 0,
  PhuongThuc: 'Chuyển khoản',
});

/* ── KPI helpers ── */
const _now = new Date();
const monthName = _now.toLocaleString('vi-VN', { month: 'long' });
const dayOfMonth = _now.getDate();
const daysInMonth = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate();
const monthProgressPct = Math.round(dayOfMonth / daysInMonth * 100);

const spark      = [42, 55, 48, 70, 65, 80, 128];
const maxSpark   = Math.max(...spark);
const sparkLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const totalDebtTr  = computed(() => {
  const sum = daiLys.value.reduce((acc, d) => acc + parseFloat(d.TienNo || 0), 0);
  return (sum / 1_000_000).toFixed(1);
});
const agentsWithDebt = computed(() => daiLys.value.filter(d => parseFloat(d.TienNo || 0) > 0).length);
const donutGradient  = computed(() => {
  const pct = daiLys.value.length ? Math.round(agentsWithDebt.value / daiLys.value.length * 100) : 0;
  return `conic-gradient(#f59e0b 0% ${pct}%, #10b981 ${pct}% 100%)`;
});

/* ── Filters ── */
const hasFilter = computed(() => !!(searchText.value || filterQuan.value || filterLoai.value || filterDebt.value));
const filteredDaiLys = computed(() => {
  return daiLys.value.filter(dl => {
    const s = searchText.value.toLowerCase();
    if (s && !dl.TenDaiLy?.toLowerCase().includes(s) && !String(dl.MaDaiLy).includes(s)) return false;
    if (filterQuan.value && dl.MaQuan != filterQuan.value) return false;
    if (filterLoai.value && dl.MaLoai != filterLoai.value) return false;
    if (filterDebt.value === 'debt'  && parseFloat(dl.TienNo || 0) <= 0) return false;
    if (filterDebt.value === 'clean' && parseFloat(dl.TienNo || 0) > 0)  return false;
    return true;
  });
});

const selectedAssetNo = computed(() => parseFloat(selectedDaiLy.value?.TienNo || 0));

/* ── Actions ── */
const clearFilters = () => { searchText.value = ''; filterQuan.value = ''; filterLoai.value = ''; filterDebt.value = ''; };

const BRANDS = [
  { bg:'#0066A1', logo:'https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg' },
  { bg:'#003087', logo:'/logos/panasonic.svg' },
  { bg:'#1428A0', logo:'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg' },
  { bg:'#A50034', logo:'https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg' },
  { bg:'#009999', logo:'https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg' },
  { bg:'#1b7a30', logo:'https://upload.wikimedia.org/wikipedia/commons/9/95/Schneider_Electric_2007.svg' },
  { bg:'#C8001A', logo:'https://iconape.com/wp-content/png_logo_vector/dien-quang-logo.png' },
  { bg:'#d97706', logo:'https://cdn.haitrieu.com/wp-content/uploads/2022/08/logo-rang-dong.png' },
]
const agentBrand = (id) => BRANDS[(id - 1 + BRANDS.length) % BRANDS.length]

const selectDaiLy = (dl) => {
  selectedDaiLy.value = dl;
  panelVisible.value  = true;
  payForm.value.SoTienThu = 0;
};
const closePanel = () => { panelVisible.value = false; selectedDaiLy.value = null; };

const goProfile = (dl) => router.push(`/dai-ly/${dl.MaDaiLy}`);

const openCollect = () => {
  if (!selectedDaiLy.value) { alert('Chọn đại lý trước'); return; }
  panelVisible.value = true;
};

const exportCSV = () => {
  const rows = [['Mã', 'Tên đại lý', 'Quận', 'Loại', 'Công nợ']];
  filteredDaiLys.value.forEach(dl => rows.push([
    `DL-${String(dl.MaDaiLy).padStart(4,'0')}`,
    dl.TenDaiLy, dl.quan?.TenQuan || '', dl.loaiDaiLy?.TenLoai || '',
    dl.TienNo || 0,
  ]));
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'tra-cuu-dai-ly.csv';
  a.click();
};

const submitPayment = async () => {
  if (payForm.value.SoTienThu <= 0) return;
  paySubmitting.value = true;
  try {
    await api.post('/phieu-thu', {
      MaDaiLy: selectedDaiLy.value.MaDaiLy,
      NgayThu: payForm.value.NgayThu,
      SoTienThu: payForm.value.SoTienThu,
    });
    alert('Thu tiền thành công!');
    await fetchData();
    closePanel();
  } catch (e) {
    alert(e.response?.data?.message || 'Lỗi khi lập phiếu thu');
  } finally {
    paySubmitting.value = false;
  }
};

const fetchData = async () => {
  try {
    const [dlR, qR, lR] = await Promise.all([
      api.get('/dai-ly'), api.get('/quan'), api.get('/loai-dai-ly'),
    ]);
    daiLys.value      = dlR.data.data;
    quans.value       = qR.data.data;
    loaiDaiLys.value  = lR.data.data;
  } catch (e) { console.error(e); }
};

function fmtCurrency(n) {
  return (parseFloat(n) || 0).toLocaleString('vi-VN') + 'đ';
}

onMounted(fetchData);
</script>

<style scoped>
/* ══ root ══ */
.tc { padding: 28px 32px 60px; }

/* ══ shared ctx-card (copied from global pattern) ══ */
.ctx-card {
  position: relative; overflow: hidden;
  background: linear-gradient(120deg,#ffffff 0%,#f0fdf8 45%,#eef9ff 100%);
  border-radius: 20px; padding: 28px 32px 20px;
  margin-bottom: 28px;
  border: 1px solid rgba(16,185,129,.14);
  box-shadow: 0 2px 16px rgba(5,150,105,.07),0 1px 3px rgba(15,23,42,.04);
}
.ctx-card::before {
  content:''; position:absolute; inset:0;
  background-image: radial-gradient(rgba(5,150,105,.1) 1px,transparent 1px);
  background-size: 22px 22px; pointer-events:none; z-index:0;
}
.ctx-card::after {
  content:''; position:absolute; top:0; left:0; right:0; height:2.5px;
  background: linear-gradient(90deg,transparent,#34d399 25%,#059669 50%,#34d399 75%,transparent);
  z-index:1;
}
.ctx-deco {
  position: absolute; right: -10px; top: 0;
  width: 300px; height: 155px; pointer-events: none; z-index: 0;
}
.ctx-wm {
  position: absolute; right: 260px; top: 20px;
  width: 80px; height: 80px; opacity: .07;
  color: #059669; pointer-events: none; z-index: 0;
}
.ctx-top { position: relative; z-index: 2; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.ctx-title-block { display: flex; flex-direction: column; gap: 2px; }
.ctx-eyebrow { margin: 0; font-size: 10.5px; font-weight: 700; color: #059669; letter-spacing: 1px; text-transform: uppercase; display: flex; align-items: center; gap: 7px; }
.ctx-eyebrow::before { content: ''; display: inline-block; width: 18px; height: 2.5px; background: linear-gradient(90deg,#10b981,#059669); border-radius: 2px; flex-shrink: 0; }
.ctx-title { font-size: 1.7rem; font-weight: 800; color: #0f172a; letter-spacing: -.5px; margin: 0; }
.ctx-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
.btn-csv { display: flex; align-items: center; gap: 6px; background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; padding: 7px 14px; border-radius: 10px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: background .15s; }
.btn-csv:hover { background: #e2e8f0; }
.btn-p { display: flex; align-items: center; gap: 6px; background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: background .15s; }
.btn-p:hover { background: #047857; }

.ctx-divider { height: 1px; background: rgba(16,185,129,.1); margin: 0 0 20px; position: relative; z-index: 2; }

/* KPI row */
.ctx-stats { position: relative; z-index: 2; display: flex; gap: 0; align-items: stretch; }
.cs-col { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 18px 20px; transition: background .15s; }
.cs-col:first-child { padding-left: 26px; }
.cs-col:hover { background: rgba(5,150,105,.04); }
.cs-sep { width: 1px; background: rgba(16,185,129,.12); margin: 12px 0; flex-shrink: 0; }
.cs-num { font-size: 1.6rem; font-weight: 800; color: #0f172a; display: flex; align-items: baseline; gap: 6px; line-height: 1.1; }
.cs-delta { font-size: 0.7rem; font-weight: 600; margin: 2px 0; }
.cs-up   { color: #10b981; }
.cs-down { color: #dc2626; }
.cs-ok   { color: #10b981; }
.cs-lbl  { font-size: 0.68rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
.cs-tag  { font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: #fffbeb; color: #b45309; border: 1px solid rgba(245,158,11,.25); }
.cs-tag-blue   { background: #ecfdf5; color: #059669; border-color: rgba(16,185,129,.18); }
.cs-amber { color: #d97706; }

/* sparkline */
.spark-wrap { display: flex; align-items: flex-end; gap: 3px; height: 28px; margin: 4px 0 2px; }
.spark-bar { flex: 1; background: #e2e8f0; border-radius: 2px 2px 0 0; min-height: 3px; transition: height .3s; }
.spark-active { background: linear-gradient(180deg,#34d399,#059669) !important; }

/* donut */
.cs-pending-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.donut-wrap { width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0; }
.donut-ring {
  width: 100%; height: 100%; border-radius: 50%;
  -webkit-mask: radial-gradient(circle,transparent 52%,black 53%);
  mask: radial-gradient(circle,transparent 52%,black 53%);
}
.donut-legend { font-size: 0.62rem; color: #64748b; display: flex; align-items: center; gap: 2px; margin-top: 4px; }
.dl-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

/* timeline */
.ctx-timeline { position: relative; z-index: 2; margin-top: 16px; }
.ctl-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
.ctl-label { font-size: 0.68rem; font-weight: 600; color: #64748b; }
.ctl-pct   { font-size: 0.68rem; font-weight: 700; color: #059669; }
.ctl-track { height: 4px; background: rgba(5,150,105,.1); border-radius: 99px; overflow: hidden; }
.ctl-fill  { height: 100%; background: linear-gradient(90deg, #34d399, #059669); border-radius: 99px; transition: width .8s ease; }

/* ══ main layout ══ */
.dl-flex { display: flex; gap: 20px; align-items: flex-start; }
.dl-card { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 12px rgba(0,0,0,.07); overflow: hidden; }
.list-card { flex: 1; min-width: 0; }
.side-panel {
  width: 320px;
  flex-shrink: 0;
  padding: 20px;
  background: linear-gradient(180deg,#f8fcff 0%,#f7fff9 100%);
}

/* toolbar */
.lc-hd { padding: 16px 20px 14px; border-bottom: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 10px; }
.lc-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.lc-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin: 0; }
.count-badge { background: #ecfdf5; color: #059669; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 20px; }
.clear-btn { display: flex; align-items: center; gap: 4px; font-size: 0.7rem; font-weight: 700; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 6px; cursor: pointer; }
.stab-group { display: flex; gap: 4px; margin-left: auto; }
.stab { font-size: 0.7rem; font-weight: 700; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
.stab.active { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
.stab-green.active { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.stab-red.active   { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
.stab-n { background: rgba(0,0,0,.08); padding: 1px 5px; border-radius: 10px; font-size: 0.65rem; }

.lc-tools { display: flex; gap: 8px; align-items: center; }
.search-wrap { position: relative; flex: 1; }
.search-ic { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
.search-inp { width: 100%; padding: 8px 12px 8px 34px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.82rem; background: #f8fafc; outline: none; box-sizing: border-box; }
.search-inp:focus { border-color: #6ee7b7; background: white; }
.psel { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.82rem; background: #f8fafc; outline: none; cursor: pointer; }

/* table */
.table-wrap { overflow-x: auto; }
.dl-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
.dl-table th { padding: 10px 14px; text-align: left; font-size: 0.65rem; font-weight: 800; color: #94a3b8; letter-spacing: .5px; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
.dl-table td { padding: 12px 14px; border-bottom: 1px solid #f8fafc; vertical-align: middle; color: #334155; }
.tc-row { cursor: pointer; transition: background .12s; }
.tc-row:hover { background: #f8fafc; }
.tc-row.selected { background: #ecfdf5; }
.tc-code { font-weight: 800; font-size: 0.78rem; color: #059669; font-family: monospace; }
.agent-cell { display: flex; align-items: center; gap: 10px; }
.agent-av {
  position: relative; width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12); box-shadow: 0 1px 4px rgba(0,0,0,.15);
  overflow: hidden; background: white;
}
.av-logo { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center; padding:5px; box-sizing:border-box; z-index:2; background:white; display:block; }
.av-init { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:white; letter-spacing:-.3px; }
.agent-name { display: block; font-weight: 700; font-size: 0.84rem; color: #0f172a; }
.agent-sub  { display: block; font-size: 0.7rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.type-badge { background: #f0f9ff; color: #0369a1; font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
.debt-num.has-debt { color: #dc2626; font-weight: 800; }
.debt-num.no-debt  { color: #16a34a; font-weight: 700; }
.muted { color: #64748b; }
.text-right { text-align: right; }
.text-center { text-align: center; }
.col-actions { white-space: nowrap; }
.act-btn { border: none; width: 28px; height: 28px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; margin-left: 4px; transition: background .12s; }
.view-btn { background: #ecfdf5; color: #059669; }
.view-btn:hover { background: #d1fae5; }
.edit-btn { background: #f0fdf4; color: #16a34a; }
.edit-btn:hover { background: #dcfce7; }
.empty-row { text-align: center; padding: 40px 0; color: #94a3b8; }
.empty-ic  { margin: 0 auto 10px; display: block; opacity: .4; }

.lc-foot { padding: 12px 20px; font-size: 0.72rem; color: #94a3b8; font-weight: 600; border-top: 1px solid #f1f5f9; }

/* ══ side panel ══ */
.ap-hd { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.ap-avatar {
  position: relative; width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12); box-shadow: 0 2px 6px rgba(0,0,0,.15);
  overflow: hidden; background: white;
}
.ap-title-block { flex: 1; min-width: 0; }
.ap-name { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
.ap-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.ap-id-badge   { background: #ecfdf5; color: #059669; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 6px; font-family: monospace; }
.ap-loai-badge { background: #f0fdf4; color: #16a34a; font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 6px; }
.ap-close { background: #f8fafc; border: 1px solid #e2e8f0; color: #94a3b8; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }

.info-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.ig-item { display: flex; align-items: flex-start; gap: 8px; background: rgba(255,255,255,.72); padding: 9px 12px; border-radius: 10px; border: 1px solid rgba(226,232,240,.72); }
.ig-ic { color: #059669; flex-shrink: 0; margin-top: 2px; }
.ig-ic-warn { color: #f59e0b; }
.ig-item small { display: block; font-size: 0.6rem; font-weight: 800; color: #94a3b8; letter-spacing: .4px; }
.ig-item p { font-size: 0.8rem; font-weight: 600; color: #0f172a; margin: 2px 0 0; }
.ig-debt { background: #fffbeb; border: 1px solid #fde68a; }
.debt-val { color: #d97706 !important; font-weight: 800 !important; }

.ap-divider { height: 1px; background: #f1f5f9; margin: 16px 0; }
.form-section-title { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 800; color: #0f172a; margin: 0 0 14px; }

.sf-group { margin-bottom: 14px; }
.sf-group label { display: block; font-size: 0.63rem; font-weight: 800; color: #94a3b8; letter-spacing: .5px; margin-bottom: 6px; }
.sf-input { width: 100%; padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.83rem; background: #f8fafc; outline: none; box-sizing: border-box; }
.sf-input:focus { border-color: #6ee7b7; background: white; }
.sf-input-wrap { position: relative; }
.sf-unit { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 0.68rem; font-weight: 700; color: #94a3b8; pointer-events: none; }
.sf-warn { display: flex; align-items: center; gap: 5px; font-size: 0.7rem; color: #f59e0b; font-weight: 600; margin: 5px 0 0; }

.debt-fill-bar { margin-top: 8px; }
.dfb-track { height: 5px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
.dfb-fill  { height: 100%; background: linear-gradient(90deg, #059669, #047857); border-radius: 3px; transition: width .4s; }
.dfb-pct   { font-size: 0.65rem; font-weight: 700; color: #059669; }

.btn-submit { width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px; background: #059669; color: white; border: none; padding: 11px 16px; border-radius: 12px; font-size: 0.87rem; font-weight: 800; cursor: pointer; transition: background .15s; }
.btn-submit:hover:not(:disabled) { background: #047857; }
.btn-submit:disabled { opacity: .55; cursor: not-allowed; }

.quick-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.qs-card { border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.qs-blue { background: linear-gradient(135deg, #059669, #047857); }
.qs-teal { background: linear-gradient(135deg, #059669, #047857); }
.qs-lbl { font-size: 0.58rem; font-weight: 700; color: rgba(255,255,255,.75); }
.qs-val { font-size: 1.1rem; font-weight: 800; color: white; }

/* ══ panel transition ══ */
.panel-enter-active, .panel-leave-active { transition: all .25s ease; }
.panel-enter-from, .panel-leave-to { opacity: 0; transform: translateX(20px); }
</style>
