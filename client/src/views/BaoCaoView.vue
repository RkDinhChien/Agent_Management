<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="design-title">Agency Performance & Control</h1>
        <p class="design-sub">Analyze regional sales, monitor debt exposure, and refine system parameters.</p>
      </div>
      <div class="header-right">
        <div class="header-nav-pills">
          <button class="pill-btn active">Reports</button>
          <button class="pill-btn">Parameters</button>
          <button class="pill-btn">System Logs</button>
        </div>
      </div>
    </div>

    <!-- Main Grid Cluster -->
    <div class="perf-grid">
      <!-- Top Row -->
      <div class="perf-row">
        <!-- Sales Report BM6.1 -->
        <div class="card shadow-soft border-none perf-card-main">
          <div class="card-header border-none">
            <h3 class="card-title-small">Sales Report (BM6.1)</h3>
            <div class="card-actions-row">
              <button class="btn-ghost">EXPORT PDF</button>
              <button class="btn-navy-sm">VIEW ALL</button>
            </div>
          </div>
          <div class="card-body" style="padding: 0 30px 30px;">
            <p class="card-desc-top">Monthly breakdown of agency productivity</p>
            <div class="table-minimal">
              <table>
                <thead>
                  <tr>
                    <th>AGENCY NAME</th>
                    <th>REGION</th>
                    <th>TRANSACTIONS</th>
                    <th>REVENUE</th>
                    <th>EFFICIENCY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ds in doanhSoData" :key="ds.MaDaiLy">
                    <td class="text-bold-ds">{{ ds.daiLy?.TenDaiLy }}</td>
                    <td class="text-muted-ds">District {{ ds.daiLy?.MaQuan }}</td>
                    <td class="text-center-ds">{{ ds.SoPhieuXuat }}</td>
                    <td class="text-bold-ds">{{ fmtCurrency(ds.TongTriGia) }}</td>
                    <td><span class="badge-percent">{{ Number(ds.TyLe).toFixed(1) }}%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Market Share (Donut Chart placeholder) -->
        <div class="card shadow-soft border-none market-card">
          <div class="card-header border-none"><h3 class="card-title-small">Market Share</h3></div>
          <div class="card-body centered-flex">
            <div class="donut-wrap">
              <svg viewBox="0 0 100 100" class="donut">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" stroke-width="12" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0891b2" stroke-width="12" stroke-dasharray="160 251" stroke-dashoffset="0" />
              </svg>
              <div class="donut-info">
                <span class="d-pct">64%</span>
                <span class="d-label">DOMINANCE</span>
              </div>
            </div>
            <div class="legend-list">
              <div class="leg-item"><span class="dot d-teal"></span> Internal Agents <span class="val">64%</span></div>
              <div class="leg-item"><span class="dot d-blue"></span> Third Party <span class="val">22%</span></div>
              <div class="leg-item"><span class="dot d-gray"></span> Freelance <span class="val">14%</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="perf-row">
        <!-- Debt Report BM6.2 -->
        <div class="card shadow-soft border-none perf-card-main">
          <div class="card-header border-none">
            <h3 class="card-title-small">Debt Report (BM6.2)</h3>
            <div class="card-actions-row"><Filter :size="16" class="icon-muted" /></div>
          </div>
          <div class="card-body" style="padding: 0 30px 30px;">
            <p class="card-desc-top">Monitoring agent debt exposure and incurred balances</p>
            <div class="debt-summary-pills">
              <div class="debt-pill"><small>TOTAL OPENING</small><p>$1.24M</p></div>
              <div class="debt-pill"><small>TOTAL INCURRED</small><p>$420K</p></div>
              <div class="debt-pill border-teal"><small>CLOSING BALANCE</small><p class="text-teal">$1.66M</p></div>
            </div>
            <div class="debt-list">
              <div class="debt-item-row" v-for="cn in congNoData.slice(0, 2)" :key="cn.MaDaiLy">
                <div class="debt-icon-box"><Box :size="16" /></div>
                <div class="debt-info">
                  <strong>{{ cn.daiLy?.TenDaiLy }}</strong>
                  <p>District {{ cn.daiLy?.MaQuan }} • Account ID: #GL204</p>
                </div>
                <div class="debt-val-box">
                  <span class="val-red">{{ fmtCurrency(cn.NoCuoi) }}</span>
                  <span class="val-sub">Closing Debt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Parameters QĐ7 -->
        <div class="card shadow-soft border-none parameters-card">
          <div class="card-header border-none">
            <h3 class="card-title-small"><Settings2 :size="18" /> System Parameters (QĐ7)</h3>
          </div>
          <div class="card-body" style="padding-top: 0">
            <div class="param-input-group">
              <label>MAX AGENTS PER DISTRICT</label>
              <div class="input-wrap-perf"><input type="text" value="15" /></div>
            </div>
            <div class="param-input-group">
              <label>MAXIMUM PERMISSIBLE DEBT</label>
              <div class="input-wrap-perf"><span class="prefix">$</span><input type="text" value="50,000" /></div>
            </div>
            <div class="agent-types-config">
              <label>AGENT TYPES CONFIGURATION</label>
              <div class="check-pill active"><CheckCircle :size="14" /> Tier 1: Exclusive Agent</div>
              <div class="check-pill active"><CheckCircle :size="14" /> Tier 2: Standard Partner</div>
              <button class="add-cat-btn">+ ADD NEW CATEGORY</button>
            </div>
            <button class="btn btn-primary btn-full-perf">SAVE PARAMETERS</button>
          </div>
        </div>
      </div>
    </div>

    <!-- System Health Footer Banner -->
    <div class="health-footer teal-grad">
      <div class="health-info">
        <small>SYSTEM HEALTH</small>
        <h3>99.9% Uptime</h3>
        <div class="uptime-bar"></div>
      </div>
      <div class="health-icon"><CheckCircle :size="60" /></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { Filter, Box, Settings2, CheckCircle } from 'lucide-vue-next';

const doanhSoData = ref([]); const congNoData = ref([]);

const fetchData = async () => {
  try {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const [dsR, cnR] = await Promise.all([
      api.get(`/bao-cao/doanh-so?thang=${month}&nam=${year}`),
      api.get(`/bao-cao/cong-no?thang=${month}&nam=${year}`)
    ]);
    doanhSoData.value = dsR.data.data || [];
    congNoData.value = cnR.data.data || [];
  } catch (e) { console.error(e); }
};

function fmtCurrency(n) { return (parseFloat(n) || 0).toLocaleString('vi-VN') + 'đ'; }
onMounted(fetchData);
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.design-title { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.design-sub { color: var(--text-muted); font-size: 0.95rem; }

.header-nav-pills { display: flex; gap: 20px; border-bottom: 1px solid #f1f5f9; }
.pill-btn { border: none; background: transparent; padding: 10px 0; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); cursor: pointer; position: relative; }
.pill-btn.active { color: #0284c7; }
.pill-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #0284c7; }

.perf-grid { display: flex; flex-direction: column; gap: 30px; }
.perf-row { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }

.card-title-small { font-size: 1.1rem; font-weight: 800; color: #0f172a; }
.card-actions-row { display: flex; gap: 10px; }
.btn-ghost { background: #f1f5f9; border: none; font-size: 0.65rem; font-weight: 800; padding: 8px 16px; border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.btn-navy-sm { background: #0c4a6e; border: none; font-size: 0.65rem; font-weight: 800; padding: 8px 16px; border-radius: 8px; color: white; cursor: pointer; }

.card-desc-top { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 20px; padding: 0 30px; }

.table-minimal th { font-size: 0.65rem; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9; color: var(--text-muted); }
.text-bold-ds { font-weight: 700; color: #0f172a; font-size: 0.88rem; }
.text-muted-ds { color: var(--text-muted); font-size: 0.82rem; }
.text-center-ds { text-align: center; font-weight: 700; color: #64748b; }
.badge-percent { background: #ccfbf1; color: #0d9488; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.75rem; }

/* Donut */
.centered-flex { display: flex; flex-direction: column; align-items: center; gap: 30px; }
.donut-wrap { position: relative; width: 160px; height: 160px; }
.donut { width: 100%; height: 100%; transform: rotate(-90deg); }
.donut-info { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.d-pct { font-size: 1.8rem; font-weight: 800; color: #0f172a; display: block; line-height: 1; }
.d-label { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; }

.legend-list { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.leg-item { display: flex; align-items: center; font-size: 0.82rem; color: var(--text-muted); font-weight: 600; }
.leg-item .dot { width: 8px; height: 8px; border-radius: 50%; margin-right: 12px; }
.d-teal { background: #0891b2; } .d-blue { background: #0ea5e9; } .d-gray { background: #cbd5e1; }
.leg-item .val { margin-left: auto; color: #0f172a; font-weight: 700; }

/* Debt Table/Cards */
.debt-summary-pills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 0 30px 20px; }
.debt-pill { background: #f8fafc; padding: 16px; border-radius: 16px; border: 1px solid transparent; }
.debt-pill small { display: block; font-size: 0.58rem; font-weight: 800; color: var(--text-muted); margin-bottom: 4px; }
.debt-pill p { font-size: 1.1rem; font-weight: 800; color: #0f172a; }
.border-teal { border-color: #0c4a6e; border-width: 2px; }
.text-teal { color: #0c4a6e !important; }

.debt-item-row { display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #f8fafc; border-radius: 16px; margin: 0 30px 12px; }
.debt-icon-box { background: #eff6ff; color: #3b82f6; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.debt-info strong { display: block; font-size: 0.88rem; color: #1e293b; }
.debt-info p { font-size: 0.75rem; color: var(--text-muted); }
.debt-val-box { margin-left: auto; text-align: right; }
.val-red { display: block; font-size: 0.95rem; font-weight: 800; color: #ef4444; }
.val-sub { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }

/* Parameters */
.param-input-group { margin-bottom: 20px; }
.param-input-group label { display: block; font-size: 0.6rem; font-weight: 800; color: var(--text-muted); margin-bottom: 10px; }
.input-wrap-perf { background: #f8fafc; border-radius: 12px; padding: 12px 18px; display: flex; align-items: center; gap: 8px; }
.input-wrap-perf input { border: none; background: transparent; font-weight: 700; color: #1e293b; width: 100%; outline: none; }
.input-wrap-perf .prefix { color: var(--text-muted); font-weight: 700; }

.agent-types-config label { display: block; font-size: 0.6rem; font-weight: 800; color: var(--text-muted); margin-bottom: 12px; }
.check-pill { background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px 16px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.check-pill.active { border-color: #10b981; color: #064e3b; }
.check-pill.active svg { color: #10b981; }
.add-cat-btn { background: none; border: none; color: #0369a1; font-weight: 800; font-size: 0.72rem; cursor: pointer; }
.btn-full-perf { width: 100%; margin-top: 20px; background: #0c4a6e; }

/* Health Footer */
.health-footer { margin-top: 40px; border-radius: 24px; padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; color: white; position: relative; overflow: hidden; }
.teal-grad { background: #0891b2; }
.health-info small { font-size: 0.6rem; font-weight: 800; opacity: 0.8; letter-spacing: 1px; }
.health-info h3 { font-size: 1.8rem; font-weight: 800; margin: 4px 0 16px; }
.uptime-bar { width: 240px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; position: relative; }
.uptime-bar::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 90%; background: white; border-radius: 2px; }
.health-icon { opacity: 0.3; }
</style>
