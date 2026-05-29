<template>
  <div class="dv">
    <div class="dv-grid">

      <!-- ════════════════════════════════════
           LEFT AREA
      ════════════════════════════════════ -->
      <section class="dv-left">

        <!-- Row 1 : Chart + 3 KPI stats -->
        <div class="dv-r1">

          <CardShell card-id="chart" class="chart-card">
            <div class="chart-hd">
              <div class="ch-kpi">
                <h2 class="ch-num">1.245,0 <span class="ch-unit">triệu ₫</span></h2>
                <p class="ch-sub">Doanh số &amp; công nợ toàn hệ thống</p>
              </div>
              <div class="ch-ctrl">
                <select class="psel"><option>7 Ngày</option></select>
                <div class="ch-type">
                  <button class="ctype-btn active"><BarChart2 :size="14"/></button>
                  <button class="ctype-btn"><LineChart :size="14"/></button>
                </div>
              </div>
            </div>

            <div class="ch-legend">
              <span class="leg"><i class="ldot" style="background:#3B82F6"></i>Tiền thu nợ</span>
              <span class="leg"><i class="ldot" style="background:#10B981"></i>Doanh số giao đi</span>
              <span class="leg"><i class="ldot" style="background:#7C3AED"></i>Chiết khấu trao trả</span>
            </div>

            <div class="ch-stage">
              <div class="ch-yaxis">
                <span>300</span><span>200</span><span>100</span><span>0</span><span class="neg-lbl">−100</span>
              </div>
              <div class="ch-bars">
                <div class="barcol"><div class="bpos" style="height:40%"></div><div class="bneg" style="height:10%"></div><span class="blbl">T2</span></div>
                <div class="barcol"><div class="bpos" style="height:45%"></div><div class="bneg" style="height:12%"></div><span class="blbl">T3</span></div>
                <div class="barcol"><div class="bpos" style="height:60%"></div><span class="blbl">T4</span></div>
                <div class="barcol today-col">
                  <span class="today-tag">Hôm nay</span>
                  <div class="bstack" style="height:75%">
                    <div class="bslice" style="height:20%;background:#3B82F6;border-radius:4px 4px 0 0"></div>
                    <div class="bslice" style="height:80%;background:#10B981;border-radius:0 0 4px 4px"></div>
                  </div>
                  <div class="bneg" style="height:25%;background:rgba(124,58,237,.35)"></div>
                  <span class="blbl blbl-active">T5</span>
                  <div class="bar-tooltip">
                    <p class="btt-title">Đại lý Quận 1 &amp; Quận 3</p>
                    <div class="btt-row"><i class="ldot" style="background:#3B82F6"></i>Tổng thu nợ <strong>24,0 Tr</strong></div>
                    <div class="btt-row"><i class="ldot" style="background:#10B981"></i>Tổng tiền xuất <strong>70,0 Tr</strong></div>
                    <div class="btt-row"><i class="ldot" style="background:#7C3AED"></i>Chiết khấu <strong>12,0 Tr</strong></div>
                  </div>
                </div>
                <div class="barcol"><div class="bpos" style="height:65%"></div><div class="bneg" style="height:10%"></div><span class="blbl">T6</span></div>
                <div class="barcol"><div class="bpos" style="height:35%"></div><span class="blbl">T7</span></div>
                <div class="barcol"><div class="bpos" style="height:50%"></div><div class="bneg" style="height:20%"></div><span class="blbl">CN</span></div>
              </div>
            </div>
          </CardShell>

          <!-- 3 KPI stat cards -->
          <div class="kpi-col">
            <CardShell card-id="stat-revenue" class="kpi-card">
              <p class="kpi-lbl">Doanh số (tiền bán hàng)</p>
              <h3 class="kpi-val">1.500 triệu</h3>
              <span class="trend up"><ArrowUpRight :size="12"/>Đang đà tăng từ T2</span>
            </CardShell>
            <CardShell card-id="stat-avg" class="kpi-card">
              <p class="kpi-lbl">Trung bình doanh thu / đại lý</p>
              <h3 class="kpi-val">12,5 triệu</h3>
              <span class="trend up"><ArrowUpRight :size="12"/>Khá hơn mức sàn 10 Tr</span>
            </CardShell>
            <CardShell card-id="stat-collected" class="kpi-card">
              <p class="kpi-lbl">Lượng tiền đã thu hồi</p>
              <h3 class="kpi-val">830 triệu</h3>
              <span class="trend down"><ArrowDownRight :size="12"/>Nhiều đại lý chưa thanh toán</span>
            </CardShell>
          </div>
        </div>

        <!-- Row 2 : Debt alert + District rules -->
        <div class="dv-r2">

          <CardShell card-id="debt-alert" class="debt-card">
            <div class="dc-head">
              <div class="dc-title-wrap">
                <span class="dc-accent"></span>
                <h3 class="dc-title">Cảnh báo nợ của đại lý</h3>
              </div>
              <div class="dc-controls">
                <select v-model="selectedDistrict" class="psel sm">
                  <option>Tất cả quận</option>
                  <option v-for="d in districtOptions" :key="d">{{ d }}</option>
                </select>
                <Edit2 :size="13" class="icon-muted"/>
              </div>
            </div>
            <p class="dc-sub">25 đại lý đang vượt hạn mức nợ theo QĐ-1 • Cập nhật: Hôm nay</p>

            <div class="dc-progress">
              <div class="prog-track">
                <div class="prog-fill" style="width:25%"></div>
              </div>
              <div class="prog-labels">
                <span class="danger-txt">Vi phạm: <strong>25</strong> đại lý</span>
                <span class="muted-txt">Tổng: 100 đại lý</span>
              </div>
            </div>

            <div class="offender-list">
              <div
                v-for="o in visibleOffenders"
                :key="`${o.name}-${o.district}`"
                class="offender-row"
                @click="openModal(o)"
              >
                <span class="of-name">{{ o.name }}</span>
                <span class="of-dist">{{ o.district }}</span>
                <span class="of-amt">+{{ o.overLimit }} Tr</span>
              </div>
            </div>

            <div class="dc-footer">
              <button class="btn-p" @click="openModal(visibleOffenders[0])">Xem chi tiết</button>
              <button class="btn-o" @click="sendReminder(visibleOffenders[0])">Gửi nhắc</button>
            </div>
          </CardShell>

          <CardShell card-id="district-rules" class="rules-card">
            <div class="rc-body">
              <div class="rc-title-row">
                <h4 class="rc-title">Quy định mở đại lý — trạng thái khu vực</h4>
                <span class="badge-full">Đã đầy</span>
              </div>
              <p class="rc-desc">Quận 1 đã đạt giới hạn mở đại lý theo QĐ-1. Xem hồ sơ chờ hoặc đề xuất quận thay thế.</p>
              <div class="rc-btns">
                <button class="btn-p">Kiểm tra hồ sơ chờ</button>
                <button class="btn-o">Đề xuất quận khác</button>
              </div>
            </div>
            <div class="rc-art">
              <div class="rc-grid">
                <div class="rg" style="background:#34d399"></div>
                <div class="rg" style="background:#93c5fd"></div>
                <div class="rg" style="background:#64748b"></div>
                <div class="rg" style="background:#34d399"></div>
              </div>
            </div>
          </CardShell>
        </div>

        <!-- Row 3 : Pie + Gauge + Goal -->
        <div class="dv-r3">

          <CardShell card-id="agent-dist" class="bot-card">
            <div class="bc-head">
              <h4 class="bc-title">Phân bố loại đại lý</h4>
              <select class="psel sm"><option>Thành phố</option></select>
            </div>
            <div class="bc-macro">120 ĐL</div>
            <div class="pie-wrap">
              <div class="pie-legend">
                <div class="ple"><i class="ldot" style="background:#10B981"></i>Đại lý loại 1 <strong>33%</strong></div>
                <div class="ple"><i class="ldot" style="background:#3B82F6"></i>Đại lý loại 2 <strong>45%</strong></div>
                <div class="ple"><i class="ldot" style="background:#F59E0B"></i>Đại lý loại 3 <strong>22%</strong></div>
              </div>
              <div class="pie-circle"></div>
            </div>
          </CardShell>

          <CardShell card-id="collection-rate" class="bot-card">
            <div class="bc-head">
              <div>
                <h4 class="bc-title">Tỷ lệ thu tiền</h4>
                <span class="bc-sub">Hiện tại</span>
              </div>
              <select class="psel sm"><option>Trong tháng</option></select>
            </div>
            <div class="bc-macro">75%</div>
            <span class="trend up"><ArrowUpRight :size="12"/>17,5% so với tháng trước</span>
            <div class="gauge-block">
              <div class="gauge-meta">
                <span>Tỷ lệ hoàn nợ</span>
                <strong>75%</strong>
              </div>
              <div class="gauge-track">
                <div class="gauge-fill" style="width:75%"></div>
              </div>
            </div>
            <p class="gauge-note">Tính bằng Tổng Thu chia cho Tổng Nợ phát sinh đầu kỳ.</p>
          </CardShell>

          <CardShell card-id="expansion" class="bot-card">
            <div class="bc-head">
              <h4 class="bc-title">Mở rộng đại lý</h4>
              <button class="ghost-btn">+ Thêm</button>
            </div>
            <div class="goal-list">
              <span class="goal-yr">Năm nay</span>
              <div class="goal-row">
                <div class="goal-icon g-green"><Store :size="14"/></div>
                <div class="goal-info">
                  <div class="gi-top"><strong>Quận Bình Thạnh</strong><span>12 / 15 CH</span></div>
                  <div class="gi-bar"><div class="gi-fill" style="width:80%;background:#84cc16"></div></div>
                  <span class="gi-note">Còn 3 đại lý nữa để đạt KPI</span>
                </div>
              </div>
              <span class="goal-yr mt12">Dự kiến tương lai</span>
              <div class="goal-row">
                <div class="goal-icon g-blue"><Truck :size="14"/></div>
                <div class="goal-info">
                  <div class="gi-top"><strong>Tuyến giao hàng mới</strong><span>4 / 10 Xe</span></div>
                  <div class="gi-bar"><div class="gi-fill" style="width:40%;background:#fb923c"></div></div>
                  <span class="gi-note">Chuẩn bị hồ sơ sau 3 tháng</span>
                </div>
              </div>
            </div>
          </CardShell>
        </div>
      </section>

      <!-- ════════════════════════════════════
           RIGHT PANEL
      ════════════════════════════════════ -->
      <aside class="dv-right">

        <CardShell card-id="transactions" class="panel-card tx-panel">
          <div class="panel-hd">
            <h4 class="panel-title">Lịch sử giao dịch</h4>
            <select class="psel sm"><option>7 Ngày</option></select>
          </div>
          <div class="tx-list">
            <div class="tx-row">
              <div class="tx-icon i-green"><ArrowUpRight :size="13"/></div>
              <div class="tx-info"><strong>Phiếu thu tiền nợ</strong><span>Đại lý Tân Bình · 25/02/2026</span></div>
              <span class="tx-val c-green">+15,0 Tr</span>
            </div>
            <div class="tx-row">
              <div class="tx-icon i-blue"><Package :size="13"/></div>
              <div class="tx-info"><strong>Phiếu xuất hàng mới</strong><span>Đại lý Quận 1 · 25/02/2026</span></div>
              <span class="tx-val c-red">−32,4 Tr</span>
            </div>
            <div class="tx-row">
              <div class="tx-icon i-slate"><FileText :size="13"/></div>
              <div class="tx-info"><strong>Hóa đơn nhập hàng</strong><span>NCC Philips · 21/02/2026</span></div>
              <span class="tx-val c-muted">−90,0 Tr</span>
            </div>
            <div class="tx-row">
              <div class="tx-icon i-amber"><Store :size="13"/></div>
              <div class="tx-info"><strong>Tiếp nhận đại lý</strong><span>Hồ sơ Quận 3 · 21/02/2026</span></div>
              <span class="tx-val c-muted">Hoạt động</span>
            </div>
            <div class="tx-row last-row">
              <div class="tx-icon i-green"><Users :size="13"/></div>
              <div class="tx-info"><strong>Phiếu thu tiền nợ</strong><span>Đại lý Hóc Môn · 15/02/2026</span></div>
              <span class="tx-val c-green">+12,6 Tr</span>
            </div>
          </div>
        </CardShell>

        <CardShell card-id="leaderboard" class="panel-card lb-panel">
          <div class="panel-hd lb-hd">
            <div class="lb-title-group">
              <Award :size="17" class="award-ic"/>
              <div>
                <h4 class="panel-title">Vinh danh</h4>
                <span class="panel-sub">Top đại lý nổi bật trong tháng</span>
              </div>
            </div>
            <span class="month-chip">Tháng 2</span>
          </div>
          <div class="lb-list">
            <div class="lb-row">
              <div class="lb-rank gold">1</div>
              <div class="lb-av">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg" class="av-logo" alt="Philips" @error="e => e.target.style.display='none'"/>
                <span class="av-init" style="background:#0066A1">T</span>
              </div>
              <div class="lb-info">
                <strong>Đại lý Tuấn Phát</strong>
                <div class="lb-meta">
                  <span class="lb-tag">Q.1</span>
                  <div class="lb-bar"><div class="lb-fill gold-fill" style="width:88%"></div></div>
                  <span class="lb-pct">88%</span>
                </div>
              </div>
              <div class="lb-right">
                <span class="lb-score">120 Tr</span>
                <Award :size="13" class="award-gold"/>
              </div>
            </div>
            <div class="lb-row">
              <div class="lb-rank green">2</div>
              <div class="lb-av">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg" class="av-logo" alt="LG" @error="e => e.target.style.display='none'"/>
                <span class="av-init" style="background:#A50034">L</span>
              </div>
              <div class="lb-info">
                <strong>Đại lý Lan Anh</strong>
                <div class="lb-meta">
                  <span class="lb-tag">Q.3</span>
                  <div class="lb-bar"><div class="lb-fill green-fill" style="width:82%"></div></div>
                  <span class="lb-pct">82%</span>
                </div>
              </div>
              <div class="lb-right">
                <span class="lb-score">95 Tr</span>
                <Award :size="13" class="award-green"/>
              </div>
            </div>
            <div class="lb-row last-row">
              <div class="lb-rank red">3</div>
              <div class="lb-av">
                <img src="/logos/panasonic.svg" class="av-logo" alt="Panasonic" @error="e => e.target.style.display='none'"/>
                <span class="av-init" style="background:#003087">Q</span>
              </div>
              <div class="lb-info">
                <strong>Đại lý Quốc Khánh</strong>
                <div class="lb-meta">
                  <span class="lb-tag">Q.5</span>
                  <div class="lb-bar"><div class="lb-fill red-fill" style="width:78%"></div></div>
                  <span class="lb-pct">78%</span>
                </div>
              </div>
              <div class="lb-right">
                <span class="lb-score">82 Tr</span>
                <Award :size="13" class="award-red"/>
              </div>
            </div>
          </div>
        </CardShell>

        <CardShell card-id="admin" class="panel-card admin-panel">
          <div class="panel-hd">
            <div>
              <h4 class="panel-title">Quản trị hệ thống</h4>
              <span class="panel-sub">Hạn mức nợ &amp; hành động</span>
            </div>
            <button class="ghost-btn">Tùy chỉnh</button>
          </div>
          <div class="cm-mock">
            <div class="cm-top-row">
              <span class="cm-lbl">Hạn mức nợ tối đa</span>
              <span class="cm-badge">Q.Định Số 1</span>
            </div>
            <div class="cm-value">32,5 / 50,0 Tr</div>
            <div class="cm-track"><div class="cm-fill" style="width:65%"></div></div>
            <p class="cm-note">Đã sử dụng 65% • Còn 17,5 Tr</p>
            <div class="cm-bot-row">
              <span class="cm-muted">Áp dụng toàn hệ thống</span>
              <span class="cm-active-badge">Hoạt động</span>
            </div>
          </div>
          <div class="quick-actions">
            <div class="qa-btn qa-green" @click="$router.push('/dai-ly')">
              <div class="qa-icon"><Plus :size="15"/></div>
              <span>Thêm đại lý</span>
            </div>
            <div class="qa-btn qa-teal" @click="$router.push('/tra-cuu')">
              <div class="qa-icon"><FileText :size="15"/></div>
              <span>Phiếu thu</span>
            </div>
          </div>
        </CardShell>

      </aside>
    </div>

    <!-- ════ Debt Detail Modal ════ -->
    <Teleport to="body">
      <div v-if="modalOpen" class="modal-bg" @click="closeModal">
        <div class="modal-box" @click.stop>
          <div class="modal-hd">
            <div class="modal-agent-info">
              <strong>{{ activeOffender.name }}</strong>
              <span>{{ activeOffender.district }} · Vượt hạn mức +{{ activeOffender.overLimit }} Tr</span>
            </div>
            <button class="btn-o sm" @click="closeModal">Đóng</button>
          </div>
          <div class="modal-body">
            <div class="modal-stats">
              <div class="mstat"><span>Quận</span><strong>{{ activeOffender.district }}</strong></div>
              <div class="mstat"><span>Nợ vượt</span><strong class="danger-txt">+{{ activeOffender.overLimit }} Tr</strong></div>
              <div class="mstat"><span>Trạng thái</span><strong>Cần theo dõi</strong></div>
            </div>
            <p class="modal-note">{{ activeOffender.note }}</p>
            <div v-if="actionFeedback" class="modal-feedback">{{ actionFeedback }}</div>
            <div class="modal-actions">
              <button class="btn-p" @click="sendReminder(activeOffender)">Gửi nhắc nhở</button>
              <button class="btn-danger" @click="lockAccount(activeOffender)">Khoá tạm thời</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import api from '../services/api';
import {
  BarChart2, LineChart, ArrowUpRight, ArrowDownRight, Edit2,
  Users, Truck, Store, Plus, FileText, Package, Award
} from 'lucide-vue-next';
import CardShell from '../components/CardShell.vue';

/* ─── Data ─── */
const districtOptions = ref([]);

const loadDistricts = async () => {
  try {
    const res = await api.get('/quan');
    districtOptions.value = (res.data || res || []).map(q => q.ten);
  } catch (err) {
    console.warn('Failed to load quan', err?.response?.status || err.message);
  }
};

onMounted(() => {
  loadDashboard();
  loadDistricts();
});
const debtOffenders = ref([]);

/* ─── State ─── */
const selectedDistrict = ref('Tất cả quận');
const activeOffender   = ref(null);
const modalOpen        = ref(false);
const actionFeedback   = ref('');

/* ─── Computed ─── */
const visibleOffenders = computed(() => {
  const list = selectedDistrict.value === 'Tất cả quận'
    ? debtOffenders
    : debtOffenders.filter(o => o.district === selectedDistrict.value);
  return list.slice(0, 3);
});

/* ─── Actions ─── */
const openModal = (o) => {
  if (!o) return;
  activeOffender.value  = o;
  modalOpen.value       = true;
  actionFeedback.value  = '';
};
const closeModal = () => { modalOpen.value = false; };

const sendReminder = (o) => {
  if (!o) return;
  activeOffender.value  = o;
  modalOpen.value       = true;
  actionFeedback.value  = `Đã ghi nhận gửi nhắc cho ${o.name}.`;
};
const lockAccount = (o) => {
  if (!o) return;
  activeOffender.value  = o;
  modalOpen.value       = true;
  actionFeedback.value  = `Đã đề xuất khoá tạm thời cho ${o.name}.`;
};
</script>

<style scoped>
/* ╔══════════════════════════════════════════╗
   ║          DESIGN TOKENS                   ║
   ╚══════════════════════════════════════════╝ */
.dv {
  --c-primary:    #059669;
  --c-primary-d:  #047857;
  --c-info:       #3B82F6;
  --c-info-bg:    #EFF6FF;
  --c-success:    #10B981;
  --c-success-bg: #ECFDF5;
  --c-warning:    #F59E0B;
  --c-danger:     #EF4444;
  --c-danger-bg:  #FEF2F2;
  --c-discount:   #7C3AED;
  --c-surface:    #ffffff;
  --c-bg:         #f8fafc;
  --c-border:     rgba(15,23,42,.07);
  --c-border-s:   rgba(15,23,42,.04);
  --c-txt:        #0f172a;
  --c-txt-2:      #475569;
  --c-txt-3:      #94a3b8;
  --r-card:       12px;
  --r-md:         8px;
  --r-sm:         6px;
  --r-pill:       999px;
  --sh-card:      0 1px 3px rgba(15,23,42,.05), 0 1px 2px rgba(15,23,42,.04);
  --sh-hover:     0 4px 16px rgba(15,23,42,.08);
  --sh-modal:     0 20px 60px rgba(15,23,42,.18);
  --t-base:       .16s ease;

  min-height: 100vh;
  background: var(--c-bg);
  font-family: 'Inter', 'Be Vietnam Pro', ui-sans-serif, system-ui, -apple-system, sans-serif;
  color: var(--c-txt);
  font-size: 14px;
  line-height: 1.5;
  padding: 4px 0 32px;
}

/* ╔══════════════════════════════════════════╗
   ║          MASTER GRID                     ║
   ╚══════════════════════════════════════════╝ */
.dv-grid {
  display: grid;
  grid-template-columns: 1fr 312px;
  gap: 20px;
  align-items: start;
  max-width: 1560px;
  margin: 0 auto;
}

.dv-left  { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.dv-right { display: flex; flex-direction: column; gap: 16px; }

/* Row grids */
.dv-r1 { display: grid; grid-template-columns: 2fr .8fr; gap: 18px; align-items: stretch; }
.dv-r2 { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; align-items: stretch; }
.dv-r3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; align-items: stretch; }

/* ── KPI stat column ── */
.kpi-col { display: flex; flex-direction: column; gap: 12px; }

/* ╔══════════════════════════════════════════╗
   ║          CARD BASE                       ║
   ╚══════════════════════════════════════════╝ */
/* CardShell inherits these classes on its root div */
.chart-card,
.kpi-card,
.debt-card,
.rules-card,
.bot-card,
.panel-card {
  background: var(--c-surface);
  border-radius: var(--r-card);
  border: 1px solid var(--c-border);
  box-shadow: var(--sh-card);
  transition: box-shadow var(--t-base), transform var(--t-base);
  position: relative; /* needed for CardShell overlay */
}
.chart-card:hover,
.kpi-card:hover,
.debt-card:hover,
.rules-card:hover,
.bot-card:hover,
.panel-card:hover {
  box-shadow: var(--sh-hover);
  transform: translateY(-1px);
}

/* ╔══════════════════════════════════════════╗
   ║          SHARED UTILITIES                ║
   ╚══════════════════════════════════════════╝ */
.psel {
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-txt-2);
  background: var(--c-bg);
  outline: none;
  cursor: pointer;
}
.psel.sm { padding: 4px 8px; font-size: 11px; }

.ldot { display: inline-block; width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }

.trend { font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 3px; }
.trend.up   { color: var(--c-success); }
.trend.down { color: var(--c-danger); }

.danger-txt { color: var(--c-danger); }
.muted-txt  { color: var(--c-txt-3); }

.btn-p {
  background: var(--c-primary);
  color: #fff;
  border: none;
  border-radius: var(--r-md);
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--t-base), transform var(--t-base);
}
.btn-p:hover { background: var(--c-primary-d); transform: translateY(-1px); }

.btn-o {
  background: transparent;
  color: var(--c-primary);
  border: 1.5px solid rgba(5,150,105,.35);
  border-radius: var(--r-md);
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t-base);
}
.btn-o:hover { background: var(--c-success-bg); border-color: var(--c-primary); }
.btn-o.sm { padding: 6px 12px; font-size: 12px; }

.btn-danger {
  background: var(--c-danger);
  color: #fff;
  border: none;
  border-radius: var(--r-md);
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--t-base);
}
.btn-danger:hover { background: #dc2626; }

.ghost-btn {
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-txt-2);
  cursor: pointer;
  transition: all var(--t-base);
}
.ghost-btn:hover { background: #fff; box-shadow: var(--sh-card); }

.icon-muted { color: var(--c-txt-3); cursor: pointer; flex-shrink: 0; }

/* ╔══════════════════════════════════════════╗
   ║          CHART CARD                      ║
   ╚══════════════════════════════════════════╝ */
.chart-card {
  display: flex;
  flex-direction: column;
  padding: 20px 22px;
  min-height: 290px;
}

.chart-hd {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.ch-num {
  font-size: 32px;
  font-weight: 900;
  color: var(--c-primary);
  margin: 0;
  letter-spacing: -1px;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.ch-unit { font-size: 14px; font-weight: 500; color: var(--c-txt-3); margin-left: 4px; }
.ch-sub  { font-size: 12px; color: var(--c-txt-3); margin: 4px 0 0; }

.ch-ctrl { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.ch-type { display: flex; gap: 2px; background: var(--c-bg); border-radius: var(--r-sm); padding: 2px; }
.ctype-btn {
  width: 28px; height: 28px; border: none; background: transparent; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  color: var(--c-txt-3); cursor: pointer; transition: all var(--t-base);
}
.ctype-btn.active { background: #fff; color: var(--c-primary); box-shadow: var(--sh-card); }

.ch-legend {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.leg { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--c-txt-3); font-weight: 500; }

/* Bar chart stage */
.ch-stage {
  position: relative;
  flex: 1;
  margin-top: 18px;
  display: flex;
  min-height: 130px;
}
.ch-yaxis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
  width: 36px;
  flex-shrink: 0;
}
.ch-yaxis span {
  font-size: 10px;
  color: var(--c-txt-3);
  font-variant-numeric: tabular-nums;
  text-align: right;
  padding-right: 6px;
}
.neg-lbl { color: rgba(124,58,237,.6) !important; }

.ch-bars {
  flex: 1;
  height: 150px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 20px;
  border-left: 1px dashed var(--c-border);
  position: relative;
}
/* horizontal grid lines */
.ch-bars::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent calc(25% - .5px),
      var(--c-border-s) calc(25% - .5px),
      var(--c-border-s) 25%
    );
  pointer-events: none;
}

.barcol {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  cursor: pointer;
  gap: 3px;
}
.bpos {
  width: 12px;
  background: rgba(16,185,129,.32);
  border-radius: 3px 3px 0 0;
  transition: background var(--t-base);
}
.barcol:hover .bpos { background: rgba(16,185,129,.55); }
.bneg {
  width: 12px;
  background: rgba(124,58,237,.2);
  border-radius: 0 0 3px 3px;
  margin-top: 2px;
}
.bstack { width: 12px; display: flex; flex-direction: column; }
.bslice { width: 100%; }
.blbl {
  position: absolute;
  bottom: -18px;
  font-size: 10px;
  color: var(--c-txt-3);
  font-weight: 500;
  white-space: nowrap;
}
.blbl-active { color: var(--c-txt); font-weight: 700; }

/* Today highlight */
.today-col { background: rgba(15,23,42,.02); border-radius: 8px; padding: 4px 2px 0; }
.today-tag {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--c-primary);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--r-pill);
  white-space: nowrap;
  letter-spacing: .3px;
}

/* Bar tooltip on hover */
.bar-tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid var(--c-border);
  box-shadow: var(--sh-hover);
  border-radius: var(--r-md);
  padding: 10px 12px;
  min-width: 176px;
  z-index: 30;
  gap: 5px;
  flex-direction: column;
}
.barcol:hover .bar-tooltip { display: flex; }
.btt-title { font-size: 11px; color: var(--c-txt-3); border-bottom: 1px solid var(--c-border); padding-bottom: 5px; margin-bottom: 2px; text-align: center; }
.btt-row   { font-size: 11px; color: var(--c-txt-2); display: flex; align-items: center; gap: 5px; }
.btt-row strong { margin-left: auto; color: var(--c-txt); font-weight: 700; }

/* ╔══════════════════════════════════════════╗
   ║          KPI STAT CARD                   ║
   ╚══════════════════════════════════════════╝ */
.kpi-card {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  flex: 1;
  cursor: default;
}
.kpi-lbl {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .7px;
  color: var(--c-txt-3);
  margin: 0;
}
.kpi-val {
  font-size: 20px;
  font-weight: 800;
  color: var(--c-txt);
  margin: 2px 0 0;
  font-variant-numeric: tabular-nums;
  letter-spacing: -.5px;
}

/* ╔══════════════════════════════════════════╗
   ║          DEBT ALERT CARD                 ║
   ╚══════════════════════════════════════════╝ */
.debt-card {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-left: 3px solid var(--c-danger);
}

.dc-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.dc-title-wrap { display: flex; align-items: center; gap: 6px; }
.dc-accent      { width: 4px; height: 18px; background: var(--c-danger); border-radius: 2px; flex-shrink: 0; display: none; }
.dc-title       { font-size: 15px; font-weight: 700; margin: 0; }
.dc-controls    { display: flex; align-items: center; gap: 6px; }
.dc-sub         { font-size: 11px; color: var(--c-txt-3); margin: 0; }

.dc-progress { display: flex; flex-direction: column; gap: 5px; }
.prog-track  { height: 8px; background: var(--c-danger-bg); border-radius: var(--r-pill); overflow: hidden; }
.prog-fill   { height: 100%; background: var(--c-danger); border-radius: var(--r-pill); }
.prog-labels { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; }

.offender-list { display: flex; flex-direction: column; border-top: 1px solid var(--c-border-s); }
.offender-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--c-border-s);
  cursor: pointer;
  border-radius: var(--r-sm);
  transition: background var(--t-base);
  padding-left: 4px;
}
.offender-row:hover { background: var(--c-bg); }
.offender-row:last-child { border-bottom: none; }
.of-name { font-size: 13px; font-weight: 600; }
.of-dist { font-size: 11px; color: var(--c-txt-3); }
.of-amt  { font-size: 13px; font-weight: 800; color: var(--c-danger); font-variant-numeric: tabular-nums; }

.dc-footer { display: flex; gap: 8px; margin-top: 4px; }

/* ╔══════════════════════════════════════════╗
   ║          DISTRICT RULES CARD             ║
   ╚══════════════════════════════════════════╝ */
.rules-card {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 20px;
  gap: 14px;
}
.rc-body     { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.rc-title-row{ display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.rc-title    { font-size: 14px; font-weight: 700; margin: 0; line-height: 1.3; }
.rc-desc     { font-size: 12px; color: var(--c-txt-2); line-height: 1.55; margin: 0; flex: 1; }
.rc-btns     { display: flex; gap: 8px; flex-wrap: wrap; }
.rc-btns .btn-p,
.rc-btns .btn-o { flex: 1; font-size: 12px; padding: 8px 10px; }

.badge-full {
  background: var(--c-danger-bg);
  color: var(--c-danger);
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--r-pill);
  border: 1px solid rgba(239,68,68,.12);
  white-space: nowrap;
  flex-shrink: 0;
}

.rc-art  { width: 68px; display: flex; align-items: center; flex-shrink: 0; }
.rc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; transform: rotate(45deg); }
.rg      { width: 16px; height: 16px; border-radius: 4px; }

/* ╔══════════════════════════════════════════╗
   ║          BOTTOM CARDS (Row 3)            ║
   ╚══════════════════════════════════════════╝ */
.bot-card {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bc-head   { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.bc-title  { font-size: 14px; font-weight: 700; margin: 0; }
.bc-sub    { font-size: 11px; color: var(--c-txt-3); display: block; }
.bc-macro  { font-size: 28px; font-weight: 900; color: var(--c-primary); letter-spacing: -1px; margin: 0; font-variant-numeric: tabular-nums; }

/* Pie */
.pie-wrap   { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.pie-legend { display: flex; flex-direction: column; gap: 7px; }
.ple        { font-size: 11px; color: var(--c-txt-2); display: flex; align-items: center; gap: 5px; font-weight: 500; }
.ple strong { margin-left: auto; color: var(--c-txt); font-weight: 700; }
.pie-circle {
  width: 74px; height: 74px; border-radius: 50%; flex-shrink: 0;
  background: conic-gradient(
    #10B981 0 33%,
    #f8fafc 33% 34.5%,
    #3B82F6 34.5% 79%,
    #f8fafc 79% 80.5%,
    #F59E0B 80.5% 100%
  );
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
}

/* Gauge */
.gauge-block { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
.gauge-meta  { display: flex; justify-content: space-between; font-size: 11px; color: var(--c-txt-3); font-weight: 600; }
.gauge-meta strong { font-size: 14px; color: var(--c-txt); }
.gauge-track { height: 8px; border-radius: var(--r-pill); background: var(--c-bg); overflow: hidden; }
.gauge-fill  { height: 100%; border-radius: var(--r-pill); background: linear-gradient(90deg, #34d399, #059669); }
.gauge-note  { font-size: 10px; color: var(--c-txt-3); margin: 0; border-top: 1px dashed var(--c-border); padding-top: 8px; line-height: 1.4; }

/* Goal tracker */
.goal-list { display: flex; flex-direction: column; gap: 8px; }
.goal-yr   { font-size: 10px; font-weight: 700; color: rgba(15,23,42,.18); text-transform: uppercase; letter-spacing: .5px; }
.mt12      { margin-top: 4px; }
.goal-row  { display: flex; gap: 10px; align-items: flex-start; padding: 6px; border-radius: var(--r-md); transition: background var(--t-base); cursor: pointer; }
.goal-row:hover { background: var(--c-bg); }
.goal-icon { width: 36px; height: 36px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; }
.g-green   { background: var(--c-success); }
.g-blue    { background: var(--c-info); }
.goal-info { flex: 1; min-width: 0; }
.gi-top    { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
.gi-top span { color: var(--c-txt-3); font-weight: 500; }
.gi-bar    { height: 5px; background: var(--c-bg); border-radius: var(--r-pill); overflow: hidden; }
.gi-fill   { height: 100%; border-radius: var(--r-pill); }
.gi-note   { font-size: 10px; color: var(--c-txt-3); display: block; margin-top: 4px; }

/* ╔══════════════════════════════════════════╗
   ║          RIGHT PANEL CARDS               ║
   ╚══════════════════════════════════════════╝ */
.panel-card { overflow: hidden; }

.panel-hd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--c-border);
}
.panel-title { font-size: 14px; font-weight: 700; margin: 0; }
.panel-sub   { font-size: 11px; color: var(--c-txt-3); display: block; margin-top: 1px; }

/* Transaction list */
.tx-list { display: flex; flex-direction: column; }
.tx-row {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--c-border-s);
  transition: background var(--t-base);
}
.tx-row:hover { background: var(--c-bg); }
.tx-row.last-row { border-bottom: none; }
.tx-icon {
  width: 32px; height: 32px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.i-green { background: var(--c-success-bg); color: var(--c-success); }
.i-blue  { background: var(--c-info-bg); color: var(--c-info); }
.i-slate { background: #f1f5f9; color: #64748b; }
.i-amber { background: #fffbeb; color: var(--c-warning); }
.tx-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.tx-info strong { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tx-info span   { font-size: 10px; color: var(--c-txt-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tx-val { font-size: 12px; font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; }
.c-green { color: var(--c-success); }
.c-red   { color: var(--c-danger); }
.c-muted { color: var(--c-txt-3); }

/* Leaderboard */
.lb-hd { align-items: flex-start; }
.lb-title-group { display: flex; align-items: center; gap: 8px; }
.award-ic { color: var(--c-primary); flex-shrink: 0; }
.month-chip {
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  color: var(--c-txt-3);
  white-space: nowrap;
  flex-shrink: 0;
}
.lb-list { display: flex; flex-direction: column; }
.lb-row {
  display: grid;
  grid-template-columns: 34px 38px 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--c-border-s);
  transition: background var(--t-base);
}
.lb-row:hover { background: var(--c-bg); }
.lb-row.last-row { border-bottom: none; }
.lb-rank {
  width: 26px; height: 26px; border-radius: var(--r-pill);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 900; flex-shrink: 0;
}
.lb-rank.gold   { background: #fef3c7; color: #92400e; }
.lb-rank.green  { background: #dcfce7; color: #166534; }
.lb-rank.red    { background: #fee2e2; color: #991b1b; }
.lb-av {
  position: relative; width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12); box-shadow: 0 1px 4px rgba(0,0,0,.15);
  overflow: hidden; background: white;
}
.av-logo { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center; padding:5px; box-sizing:border-box; z-index:2; background:white; display:block; }
.av-init { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:white; letter-spacing:-.3px; }
.lb-info { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.lb-info strong { font-size: 12px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lb-meta { display: flex; align-items: center; gap: 6px; }
.lb-tag  { font-size: 10px; font-weight: 700; background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-pill); padding: 2px 6px; color: var(--c-txt-3); flex-shrink: 0; }
.lb-bar  { flex: 1; height: 5px; background: #e2e8f0; border-radius: var(--r-pill); overflow: hidden; min-width: 30px; }
.lb-fill { height: 100%; border-radius: inherit; }
.gold-fill  { background: linear-gradient(90deg, #fcd34d, #f59e0b); }
.green-fill { background: linear-gradient(90deg, #6ee7b7, #10b981); }
.red-fill   { background: linear-gradient(90deg, #fca5a5, #ef4444); }
.lb-pct  { font-size: 10px; font-weight: 700; color: var(--c-txt-3); white-space: nowrap; font-variant-numeric: tabular-nums; }
.lb-right { display: flex; align-items: center; gap: 4px; justify-content: flex-end; }
.lb-score { font-size: 12px; font-weight: 800; color: #064e3b; background: rgba(5,150,105,.06); padding: 3px 8px; border-radius: var(--r-pill); font-variant-numeric: tabular-nums; white-space: nowrap; }
.award-gold  { color: #b45309; }
.award-green { color: var(--c-success); }
.award-red   { color: var(--c-danger); }

/* Admin card */
.admin-panel .panel-hd { border-bottom: none; }
.cm-mock {
  margin: 0 14px 14px;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.cm-top-row  { display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
.cm-lbl      { color: var(--c-txt-2); font-weight: 500; }
.cm-badge    { background: var(--c-primary); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: var(--r-pill); }
.cm-value    { font-size: 20px; font-weight: 800; color: var(--c-primary); letter-spacing: -.5px; font-variant-numeric: tabular-nums; }
.cm-track    { height: 7px; background: #e2e8f0; border-radius: var(--r-pill); overflow: hidden; }
.cm-fill     { height: 100%; background: linear-gradient(90deg, #34d399, #059669); border-radius: var(--r-pill); }
.cm-note     { font-size: 10px; color: var(--c-txt-3); margin: 0; font-weight: 600; }
.cm-bot-row  { display: flex; justify-content: space-between; align-items: center; font-size: 10px; }
.cm-muted    { color: var(--c-txt-3); }
.cm-active-badge { background: #fff; color: var(--c-success); font-weight: 700; border: 1px solid rgba(16,185,129,.2); padding: 2px 8px; border-radius: var(--r-pill); }

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 0 14px 14px;
  gap: 8px;
}
.qa-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-txt-2);
  transition: color var(--t-base);
  background: none;
  border: none;
  padding: 0;
}
.qa-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  transition: transform var(--t-base), box-shadow var(--t-base);
}
.qa-btn:hover .qa-icon { transform: translateY(-3px); }
.qa-green .qa-icon { background: var(--c-success-bg); color: var(--c-success); border: 1px solid rgba(16,185,129,.12); }
.qa-green:hover { color: var(--c-success); }
.qa-green:hover .qa-icon { box-shadow: 0 6px 16px rgba(16,185,129,.2); }
.qa-teal .qa-icon { background: #f0fdf9; color: var(--c-primary); border: 1px solid rgba(5,150,105,.12); }
.qa-teal:hover { color: var(--c-primary); }
.qa-teal:hover .qa-icon { box-shadow: 0 6px 16px rgba(5,150,105,.2); }

/* ╔══════════════════════════════════════════╗
   ║          MODAL                           ║
   ╚══════════════════════════════════════════╝ */
.modal-bg {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(15,23,42,.45);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-box {
  width: min(500px, 100%);
  background: var(--c-surface);
  border-radius: 16px;
  border: 1px solid var(--c-border);
  box-shadow: var(--sh-modal);
  overflow: hidden;
}
.modal-hd {
  padding: 16px 20px;
  border-bottom: 1px solid var(--c-border);
  display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
}
.modal-agent-info { display: flex; flex-direction: column; gap: 3px; }
.modal-agent-info strong { font-size: 15px; font-weight: 700; }
.modal-agent-info span   { font-size: 12px; color: var(--c-txt-3); }
.modal-body  { padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }
.modal-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.mstat { background: var(--c-bg); border-radius: var(--r-md); padding: 10px 12px; }
.mstat span   { display: block; font-size: 10px; color: var(--c-txt-3); margin-bottom: 3px; }
.mstat strong { font-size: 14px; font-weight: 700; }
.modal-note     { font-size: 12px; color: var(--c-txt-2); line-height: 1.55; margin: 0; }
.modal-feedback { font-size: 12px; color: var(--c-success); background: var(--c-success-bg); border: 1px solid rgba(16,185,129,.15); padding: 10px 12px; border-radius: var(--r-md); }
.modal-actions  { display: flex; gap: 10px; flex-wrap: wrap; }

/* ╔══════════════════════════════════════════╗
   ║          RESPONSIVE                      ║
   ╚══════════════════════════════════════════╝ */
@media (max-width: 1200px) {
  .dv-grid { grid-template-columns: 1fr; }
  .dv-right { flex-direction: row; flex-wrap: wrap; }
  .panel-card { flex: 1 1 280px; }
}
@media (max-width: 900px) {
  .dv-r1 { grid-template-columns: 1fr; }
  .kpi-col { flex-direction: row; }
  .dv-r2 { grid-template-columns: 1fr; }
  .dv-r3 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .dv-r3 { grid-template-columns: 1fr; }
  .dv-right { flex-direction: column; }
}
</style>
