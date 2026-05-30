<template>
  <div class="bc">

    <!-- ══ CONTEXT BANNER ══ -->
    <div class="ctx-card">

      <!-- Hexagon decoration -->
      <svg class="ctx-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <polygon id="bchx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
        </defs>
        <g stroke="#059669" stroke-width=".9" opacity=".13">
          <use href="#bchx" transform="translate(21,24)"/>  <use href="#bchx" transform="translate(62,24)"/>
          <use href="#bchx" transform="translate(103,24)"/> <use href="#bchx" transform="translate(144,24)"/>
          <use href="#bchx" transform="translate(185,24)"/> <use href="#bchx" transform="translate(226,24)"/>
          <use href="#bchx" transform="translate(267,24)"/>
          <use href="#bchx" transform="translate(0,60)"/>   <use href="#bchx" transform="translate(41,60)"/>
          <use href="#bchx" transform="translate(82,60)"/>  <use href="#bchx" transform="translate(123,60)"/>
          <use href="#bchx" transform="translate(164,60)"/> <use href="#bchx" transform="translate(205,60)"/>
          <use href="#bchx" transform="translate(246,60)"/> <use href="#bchx" transform="translate(287,60)"/>
          <use href="#bchx" transform="translate(21,96)"/>  <use href="#bchx" transform="translate(62,96)"/>
          <use href="#bchx" transform="translate(103,96)"/> <use href="#bchx" transform="translate(144,96)"/>
          <use href="#bchx" transform="translate(185,96)"/> <use href="#bchx" transform="translate(226,96)"/>
          <use href="#bchx" transform="translate(267,96)"/>
          <use href="#bchx" transform="translate(0,132)"/>  <use href="#bchx" transform="translate(41,132)"/>
          <use href="#bchx" transform="translate(82,132)"/> <use href="#bchx" transform="translate(123,132)"/>
          <use href="#bchx" transform="translate(164,132)"/><use href="#bchx" transform="translate(205,132)"/>
          <use href="#bchx" transform="translate(246,132)"/><use href="#bchx" transform="translate(287,132)"/>
        </g>
        <g stroke="#059669" stroke-width="1.2" opacity=".28">
          <use href="#bchx" transform="translate(144,60)"/>
          <use href="#bchx" transform="translate(185,24)"/>
          <use href="#bchx" transform="translate(226,96)"/>
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

      <!-- Watermark icon: bar chart -->
      <svg class="ctx-wm" viewBox="0 0 100 85" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="6" y="45" width="20" height="35" rx="4"/>
        <rect x="38" y="22" width="20" height="58" rx="4"/>
        <rect x="70" y="8" width="20" height="72" rx="4"/>
        <line x1="3" y1="80" x2="97" y2="80"/>
        <path d="M16 40 L48 18 L80 5" stroke-width="3" stroke-dasharray="4 3"/>
      </svg>

      <div class="ctx-top">
        <div class="ctx-title-block">
          <p class="ctx-eyebrow">Nghiệp vụ · Báo cáo kinh doanh</p>
          <h1 class="ctx-title">Hiệu Suất Kinh Doanh</h1>
        </div>
        <div class="ctx-actions">
          <select class="sel-month" v-model="filterMonth">
            <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
          </select>
          <select class="sel-month" v-model="filterYear">
            <option v-for="y in [2024,2025,2026]" :key="y" :value="y">{{ y }}</option>
          </select>
          <button class="btn-csv" @click="exportCSV"><Download :size="13"/> Xuất CSV</button>
          <button class="btn-p" @click="exportPrint"><Printer :size="14"/> In báo cáo</button>
        </div>
      </div>

      <div class="ctx-divider"></div>

      <!-- KPI Row — cs-col pattern (integrated in dark banner) -->
      <div class="ctx-stats">

        <div class="cs-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><BarChart2 :size="11"/></span>
            <span class="cs-lbl">Tổng doanh thu</span>
          </div>
          <strong class="cs-num">
            {{ fmtSummary(totalRevenue) }}
          </strong>
          <span class="cs-delta" v-if="revDelta !== 0" :class="revDelta >= 0 ? 'cs-up' : 'cs-down'">
            <TrendingUp v-if="revDelta >= 0" :size="10"/>
            <TrendingDown v-else :size="10"/>
            {{ Math.abs(revDelta).toFixed(1) }}% so với tháng trước
          </span>
          <span class="cs-delta cs-up" v-else>
            Không thay đổi so với tháng trước
          </span>
          <div class="spark-wrap">
            <div v-for="(h,i) in revSpark" :key="i"
                 class="spark-bar" :class="{ 'spark-active': i === revSpark.length-1 }"
                 :style="{ height: (h/maxRevSpark*100)+'%' }"></div>
          </div>
          <span class="cs-lbl" style="margin-top:2px">Số liệu tháng {{ filterMonth }}/{{ filterYear }}</span>
        </div>
        <div class="cs-sep"></div>

        <div class="cs-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><CircleDollarSign :size="11"/></span>
            <span class="cs-lbl">Tổng thu tiền</span>
          </div>
          <strong class="cs-num">
            {{ fmtSummary(totalCollected) }}
          </strong>
          <span class="cs-delta cs-up" v-if="collectDelta !== 0">
            <TrendingUp :size="10"/> {{ Math.abs(collectDelta).toFixed(1) }}% so với tháng trước
          </span>
          <span class="cs-delta cs-up" v-else>
            Tương đương tháng trước
          </span>
          <div class="spark-wrap">
            <div v-for="(h,i) in colSpark" :key="i"
                 class="spark-bar" :class="{ 'spark-active': i === colSpark.length-1 }"
                 :style="{ height: (h/maxColSpark*100)+'%' }"></div>
          </div>
          <span class="cs-lbl" style="margin-top:2px">Thực thu ghi nhận</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 3: Tỉ lệ thu nợ / donut -->
        <div class="cs-col cs-warn">
          <div class="cs-pending-row">
            <div class="donut-wrap">
              <div class="donut-ring" :style="{ background: debtDonutGradient }"></div>
            </div>
            <div>
              <strong class="cs-num" style="display:block;margin-bottom:2px">
                {{ collectRatePct }}<span style="font-size:14px;font-weight:600;color:#94a3b8">%</span>
              </strong>
              <span class="cs-delta cs-up">{{ fmtVND(totalCollected) }} / {{ fmtVND(totalDebt) }}</span>
            </div>
          </div>
          <div class="donut-legend">
            <span class="dl-dot" style="background:#059669"></span> Đã thu {{ collectRatePct }}%
            <span class="dl-dot" style="background:#f59e0b;margin-left:6px"></span> Còn {{ 100-collectRatePct }}%
          </div>
          <span class="cs-lbl" style="margin-top:4px">Tỉ lệ thu nợ</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 4: Đại lý vượt nợ -->
        <div class="cs-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><AlertTriangle :size="11"/></span>
            <span class="cs-lbl">Đại lý vượt nợ</span>
          </div>
          <strong class="cs-num" :style="overDebtAgents > 0 ? { color:'#f87171' } : {}">
            {{ overDebtAgents }}
            <span class="cs-tag" v-if="overDebtAgents > 0">cần xử lý</span>
            <span class="cs-tag cs-tag-green" v-else>trong hạn</span>
          </strong>
          <span class="cs-delta" :class="overDebtAgents > 0 ? 'cs-down' : 'cs-up'">
            {{ overDebtAgents > 0 ? '↑ Cần ưu tiên thu hồi' : '✓ Tất cả trong hạn mức' }}
          </span>
          <div class="ctl-track" style="margin-top:8px">
            <div class="ctl-fill" :style="{
              width: (overDebtAgents / debtRows.length * 100) + '%',
              background: overDebtAgents > 0 ? '#f87171' : '#059669'
            }"></div>
          </div>
          <span class="cs-lbl" style="margin-top:4px">{{ overDebtAgents }}/{{ debtRows.length }} đại lý</span>
        </div>

      </div>

      <!-- Month progress -->
      <div class="ctx-timeline">
        <div class="ctl-row">
          <span class="ctl-label">Tháng {{ filterMonth }} · Ngày {{ _now.getDate() }}/{{ new Date(_now.getFullYear(), filterMonth, 0).getDate() }}</span>
          <span class="ctl-pct">{{ monthProgressPct }}% tiến độ tháng</span>
        </div>
        <div class="ctl-track">
          <div class="ctl-fill" :style="{ width: monthProgressPct + '%' }"></div>
        </div>
      </div>
    </div>
    <!-- ════════════════════════════════ -->

    <!-- ══ TAB BAR ══ -->
    <div class="stab-wrap">
      <div class="stab-group">
        <button class="stab" :class="{ 'stab-active': reportTab==='doanh-so' }" @click="reportTab='doanh-so'; selected=null">
          <BarChart2 :size="14"/> Doanh số <span class="stab-code">BM6.1</span>
        </button>
        <button class="stab" :class="{ 'stab-active': reportTab==='cong-no' }" @click="reportTab='cong-no'; selected=null">
          <Landmark :size="14"/> Công nợ <span class="stab-code">BM6.2</span>
        </button>
      </div>
      <span class="stab-meta" v-if="reportTab==='doanh-so'">
        {{ filteredDs.length }} đại lý &nbsp;·&nbsp; T{{ filterMonth }}/{{ filterYear }} &nbsp;·&nbsp; Tổng <strong>{{ fmtVND(totalRevenue) }}</strong>
      </span>
      <span class="stab-meta" v-else>
        {{ filteredCn.length }} đại lý &nbsp;·&nbsp;
        <span :class="overDebtAgents > 0 ? 'text-red' : 'text-green'">
          {{ overDebtAgents > 0 ? overDebtAgents + ' vượt hạn mức' : 'Tất cả trong hạn mức' }}
        </span>
      </span>
    </div>

    <!-- ══ DEBT OVERVIEW (cong-no) ══ -->
    <div class="debt-ov-strip" v-if="reportTab==='cong-no'">
      <div class="dov-cell">
        <span class="dov-num text-green">{{ filteredCn.length - overDebtAgents }}</span>
        <span class="dov-lbl">Trong hạn mức</span>
      </div>
      <div class="dov-sep"></div>
      <div class="dov-cell">
        <span class="dov-num" :class="overDebtAgents > 0 ? 'text-red' : 'text-green'">{{ overDebtAgents }}</span>
        <span class="dov-lbl">Vượt hạn mức</span>
      </div>
      <div class="dov-sep"></div>
      <div class="dov-cell">
        <span class="dov-num">{{ fmtVND(totalDebt) }}</span>
        <span class="dov-lbl">Tổng nợ cuối kỳ</span>
      </div>
      <div class="dov-sep"></div>
      <div class="dov-cell dov-cell-bar">
        <div class="dov-bar-track">
          <div class="dov-bar-fill" :style="{ width: collectRatePct+'%' }"></div>
        </div>
        <span class="dov-lbl"><strong>{{ collectRatePct }}%</strong> đã thu trong kỳ</span>
      </div>
    </div>

    <!-- ══ MAIN CONTENT AREA ══ -->
    <div class="list-wrap" :class="{ 'panel-open': selected !== null }">

      <!-- ── TABLE ── -->
      <div class="list-card">
        <div class="lc-head">
          <div class="lc-search">
            <Search :size="14" class="lc-search-icon"/>
            <input v-model="search" class="lc-search-input" placeholder="Tìm đại lý..."/>
          </div>
          <div class="lc-sort">
            <span class="sort-label">Sắp xếp:</span>
            <button class="sort-btn" :class="{ 'sort-active': sortKey==='name' }" @click="setSort('name')">
              Tên <SortIcon :dir="sortKey==='name' ? sortDir : 0"/>
            </button>
            <button class="sort-btn" :class="{ 'sort-active': sortKey==='val' }" @click="setSort('val')"
                    v-if="reportTab==='doanh-so'">
              Doanh thu <SortIcon :dir="sortKey==='val' ? sortDir : 0"/>
            </button>
            <button class="sort-btn" :class="{ 'sort-active': sortKey==='val' }" @click="setSort('val')"
                    v-if="reportTab==='cong-no'">
              Nợ cuối <SortIcon :dir="sortKey==='val' ? sortDir : 0"/>
            </button>
          </div>
        </div>

        <!-- ─ Doanh số table ─ -->
        <template v-if="reportTab==='doanh-so'">
          <table class="bc-table">
            <thead>
              <tr>
                <th>Đại lý</th>
                <th class="num">SL phiếu xuất</th>
                <th class="num">Tổng trị giá</th>
                <th class="num">Tỉ lệ</th>
                <th class="num">Xếp hạng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in filteredDs" :key="r.id"
                  :class="{ 'row-sel': selected?.id === r.id && selected?.tab === 'doanh-so' }"
                  @click="selectRow(r, 'doanh-so')">
                <td>
                  <div class="row-av-wrap">
                    <div class="row-av">
                      <img :src="agentBrand(r.id).logo" class="av-logo" :alt="r.name" @error="e => e.target.style.display='none'"/>
                      <span class="av-init" :style="{ background: agentBrand(r.id).bg }">{{ avatarInit(r.name) }}</span>
                    </div>
                    <div>
                      <div class="row-name">{{ r.name }}</div>
                      <div class="row-sub">{{ r.district }}</div>
                    </div>
                  </div>
                </td>
                <td class="num">{{ r.slPhieuXuat }}</td>
                <td class="num fw-700">{{ fmtVND(r.tongTriGia) }}</td>
                <td class="num">
                  <div class="pct-bar-wrap">
                    <div class="pct-bar" :style="{ width: r.tyLe+'%', background: 'var(--c-primary)' }"></div>
                    <span class="pct-txt">{{ r.tyLe }}%</span>
                  </div>
                </td>
                <td class="num">
                  <span class="rank-badge" :class="rankClass(i+1)">
                    {{ i+1 === 1 ? '🥇' : i+1 === 2 ? '🥈' : i+1 === 3 ? '🥉' : '#'+( i+1) }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredDs.length === 0">
                <td colspan="5" class="empty-row">Không có dữ liệu</td>
              </tr>
            </tbody>
          </table>
        </template>

        <!-- ─ Công nợ table ─ -->
        <template v-if="reportTab==='cong-no'">
          <table class="bc-table">
            <thead>
              <tr>
                <th>Đại lý</th>
                <th class="num">Nợ đầu kỳ</th>
                <th class="num">Phát sinh</th>
                <th class="num">Đã thu</th>
                <th class="num">Nợ cuối kỳ</th>
                <th class="num">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in filteredCn" :key="r.id"
                  :class="{ 'row-sel': selected?.id === r.id && selected?.tab === 'cong-no' }"
                  @click="selectRow(r, 'cong-no')">
                <td>
                  <div class="row-av-wrap">
                    <div class="row-av">
                      <img :src="agentBrand(r.id).logo" class="av-logo" :alt="r.name" @error="e => e.target.style.display='none'"/>
                      <span class="av-init" :style="{ background: agentBrand(r.id).bg }">{{ avatarInit(r.name) }}</span>
                    </div>
                    <div>
                      <div class="row-name">{{ r.name }}</div>
                      <div class="row-sub">{{ r.district }}</div>
                    </div>
                  </div>
                </td>
                <td class="num">{{ fmtVND(r.noDau) }}</td>
                <td class="num text-amber">+{{ fmtVND(r.phatSinh) }}</td>
                <td class="num text-green">-{{ fmtVND(r.daThu) }}</td>
                <td class="num fw-700" :class="r.noCuoi > r.hanMuc ? 'text-red' : ''">{{ fmtVND(r.noCuoi) }}</td>
                <td class="num">
                  <span class="no-badge" :class="debtStatusClass(r)">{{ debtStatusLabel(r) }}</span>
                </td>
              </tr>
              <tr v-if="filteredCn.length === 0">
                <td colspan="6" class="empty-row">Không có dữ liệu</td>
              </tr>
            </tbody>
          </table>
        </template>

        <!-- Footer summary -->
        <div class="lc-footer">
          <span class="foot-count">
            {{ reportTab==='doanh-so' ? filteredDs.length : filteredCn.length }} đại lý
          </span>
          <span class="foot-total" v-if="reportTab==='doanh-so'">
            Tổng doanh số: <strong>{{ fmtVND(totalRevenue) }}</strong>
          </span>
          <span class="foot-total" v-else>
            Tổng nợ cuối kỳ: <strong :class="overDebtAgents > 0 ? 'text-red' : ''">{{ fmtVND(totalDebt) }}</strong>
          </span>
        </div>
      </div>

      <!-- ══ SIDE PANEL ══ -->
      <Transition name="panel">
        <div v-if="selected" class="side-panel">
          <div class="sp-header">
            <div class="ap-avatar">
              <img :src="agentBrand(selected.id).logo" class="av-logo" :alt="selected.name" @error="e => e.target.style.display='none'"/>
              <span class="av-init" :style="{ background: agentBrand(selected.id).bg }">{{ avatarInit(selected.name) }}</span>
            </div>
            <div class="sp-id-block">
              <div class="sp-name">{{ selected.name }}</div>
              <div class="sp-sub">{{ selected.district }}</div>
            </div>
            <button class="sp-close" @click="selected=null"><X :size="16"/></button>
          </div>

          <!-- Doanh số detail -->
          <template v-if="selected.tab === 'doanh-so'">
            <div class="sp-section-label">Doanh số tháng {{ filterMonth }}/{{ filterYear }}</div>
            <dl class="dl-flex">
              <dt>Số phiếu xuất</dt><dd>{{ selected.slPhieuXuat }} phiếu</dd>
              <dt>Tổng trị giá</dt><dd class="fw-700">{{ fmtVND(selected.tongTriGia) }}</dd>
              <dt>Tỉ lệ doanh thu</dt><dd>{{ selected.tyLe }}%</dd>
            </dl>
            <!-- Tỉ lệ bar -->
            <div class="sp-section-label" style="margin-top:16px;">Tỉ trọng doanh thu</div>
            <div class="ds-bar-wrap">
              <div class="ds-bar" :style="{ width: selected.tyLe+'%', background: agentColor(selected.id) }"></div>
              <span class="ds-bar-pct">{{ selected.tyLe }}%</span>
            </div>
          </template>

          <!-- Công nợ detail -->
          <template v-if="selected.tab === 'cong-no'">
            <div class="sp-section-label">Báo cáo công nợ tháng {{ filterMonth }}/{{ filterYear }}</div>
            <dl class="dl-flex">
              <dt>Nợ đầu kỳ</dt><dd>{{ fmtVND(selected.noDau) }}</dd>
              <dt>Phát sinh thêm</dt><dd class="text-amber">+{{ fmtVND(selected.phatSinh) }}</dd>
              <dt>Đã thu trong kỳ</dt><dd class="text-green">-{{ fmtVND(selected.daThu) }}</dd>
              <dt>Nợ cuối kỳ</dt><dd class="fw-700" :class="selected.noCuoi > selected.hanMuc ? 'text-red':''">{{ fmtVND(selected.noCuoi) }}</dd>
              <dt>Hạn mức nợ</dt><dd>{{ fmtVND(selected.hanMuc) }}</dd>
            </dl>
            <!-- Debt bar -->
            <div class="sp-section-label" style="margin-top:16px;">Mức độ nợ / hạn mức</div>
            <div class="debt-bar-track">
              <div class="debt-bar-fill" :style="{ width: Math.min(selected.noCuoi/selected.hanMuc*100,100)+'%', background: selected.noCuoi>selected.hanMuc ? '#dc2626' : selected.noCuoi/selected.hanMuc > 0.7 ? '#f59e0b' : '#059669' }"></div>
            </div>
            <div class="debt-bar-labels">
              <span>0</span>
              <span :class="selected.noCuoi > selected.hanMuc ? 'text-red' : ''">
                {{ Math.round(selected.noCuoi/selected.hanMuc*100) }}% hạn mức
              </span>
              <span>{{ fmtVND(selected.hanMuc) }}</span>
            </div>
            <div class="debt-over-hint" v-if="selected.noCuoi > selected.hanMuc">
              <AlertTriangle :size="13"/> Vượt hạn mức {{ fmtVND(selected.noCuoi - selected.hanMuc) }} — cần ưu tiên thu hồi
            </div>
          </template>

          <div class="sp-divider"></div>
          <div class="sp-info-grid">
            <div class="sig-item"><div class="sig-label">Quận</div><div class="sig-val">{{ selected.district }}</div></div>
            <div class="sig-item"><div class="sig-label">Mã ĐL</div><div class="sig-val">ĐL-{{ String(selected.id).padStart(3,'0') }}</div></div>
            <div class="sig-item"><div class="sig-label">Tháng BC</div><div class="sig-val">T{{ filterMonth }}/{{ filterYear }}</div></div>
            <div class="sig-item"><div class="sig-label">Trạng thái</div>
              <div class="sig-val">
                <span v-if="selected.tab==='cong-no'" class="no-badge" :class="debtStatusClass(selected)">{{ debtStatusLabel(selected) }}</span>
                <span v-else class="no-badge badge-ok">Hoạt động</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

    </div><!-- /list-wrap -->

    <!-- Toast -->
    <Teleport to="body">
      <div v-if="toast.show" class="toast-snack" :class="'toast-'+toast.type">
        <CheckCircle v-if="toast.type==='ok'" :size="15"/>
        <AlertTriangle v-else :size="15"/>
        {{ toast.msg }}
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../services/api';
import {
  Download, Printer, BarChart2, CircleDollarSign, PieChart, AlertTriangle,
  TrendingUp, TrendingDown, CheckCircle, Search, X, Landmark
} from 'lucide-vue-next';

// ── page scope ──────────────────────────────────────────────────
const _now = new Date();
const filterMonth = ref(_now.getMonth() + 1);
const filterYear  = ref(_now.getFullYear());
const reportTab   = ref('doanh-so');
const search      = ref('');
const sortKey     = ref('val');
const sortDir     = ref(-1);
const selected    = ref(null);

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
const avatarInit = (name) => name.replace(/^Đại lý\s*/i,'').trim().charAt(0).toUpperCase();

const SortIcon = {
  props: ['dir'],
  template: `<span style="font-size:.65rem;opacity:.5;margin-left:2px;">{{ dir===1?'▲':dir===-1?'▼':'⇅' }}</span>`
};

// ── gradient palette ─────────────────────────────────────────────
const AGENT_CLR = [
  'linear-gradient(135deg,#059669,#34d399)',
  'linear-gradient(135deg,#0d9488,#2dd4bf)',
  'linear-gradient(135deg,#0284c7,#38bdf8)',
  'linear-gradient(135deg,#4f46e5,#818cf8)',
  'linear-gradient(135deg,#0891b2,#22d3ee)',
  'linear-gradient(135deg,#7c3aed,#a78bfa)',
];
const agentColor = (id) => AGENT_CLR[id % AGENT_CLR.length];
const initials   = (name) => name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase().slice(0,2);

// ── Data from API ────────────────────────────────────────────────────
const dsRows = ref([]);
const debtRows = ref([]);

const loadReports = async () => {
  try {
    console.log(`[BaoCao] Loading reports for T${filterMonth.value}/${filterYear.value}`);
    const [dsRes, cnRes] = await Promise.all([
      api.get(`/bao-cao/doanh-so?thang=${filterMonth.value}&nam=${filterYear.value}`),
      api.get(`/bao-cao/cong-no?thang=${filterMonth.value}&nam=${filterYear.value}`),
    ]);
    
    console.log('[BaoCao] DS Response:', dsRes.data);
    console.log('[BaoCao] CN Response:', cnRes.data);

    // Map Doanh so
    const dsResult = dsRes.data?.data;
    const rawDs = dsResult?.chiTiet || [];
    dsRows.value = rawDs.map(r => ({
      id: r.MaDaiLy,
      name: r.TenDaiLy,
      district: r.Quan || 'Quận',
      slPhieuXuat: r.SoPhieuXuat || r.SoLuongPhieuXuat || 0,
      tongTriGia: parseFloat(r.TongTriGia) || 0,
      tyLe: parseFloat(r.TiLe) || 0
    }));

    // Map Cong no
    const cnResult = cnRes.data?.data;
    const rawCn = cnResult?.chiTiet || [];
    debtRows.value = rawCn.map(r => ({
      id: r.MaDaiLy,
      name: r.TenDaiLy,
      district: r.Quan || 'Quận',
      noDau: parseFloat(r.NoDau) || 0,
      phatSinh: parseFloat(r.PhatSinh) || 0,
      daThu: parseFloat(r.DaThu) || 0,
      noCuoi: parseFloat(r.NoCuoi) || 0,
      hanMuc: parseFloat(r.HanMuc) || 0
    }));

    console.log(`[BaoCao] Mapped ${dsRows.value.length} DS rows and ${debtRows.value.length} CN rows`);
  } catch (err) {
    console.error('[BaoCao] Failed to load reports:', err?.response?.data || err.message);
  }
};

onMounted(() => {
  loadReports();
});

watch([filterMonth, filterYear], () => {
  loadReports();
});

// ── KPI computeds ─────────────────────────────────────────────────
const totalRevenue   = computed(() => dsRows.value.reduce((s,r) => s + r.tongTriGia, 0));
const totalCollected = computed(() => debtRows.value.reduce((s,r) => s + r.daThu, 0));
const totalDebt      = computed(() => debtRows.value.reduce((s,r) => s + r.noCuoi, 0));
const overDebtAgents = computed(() => debtRows.value.filter(r => r.noCuoi > r.hanMuc).length);
// ── Delta calculations ──────────────────────────────────────────────
const revDelta      = ref(0);
const collectDelta  = ref(0);

const calculateDeltas = async () => {
  try {
    const prevMonth = filterMonth.value === 1 ? 12 : filterMonth.value - 1;
    const prevYear = filterMonth.value === 1 ? filterYear.value - 1 : filterYear.value;
    
    const [dsRes, cnRes] = await Promise.all([
      api.get(`/bao-cao/doanh-so?thang=${prevMonth}&nam=${prevYear}`),
      api.get(`/bao-cao/cong-no?thang=${prevMonth}&nam=${prevYear}`),
    ]);

    const prevRevenue = parseFloat(dsRes.data?.data?.TongDoanhSo) || 0;
    const prevCollected = (cnRes.data?.data?.chiTiet || []).reduce((s, r) => s + (parseFloat(r.DaThu) || 0), 0);

    // Only show delta if previous month actually had data
    if (prevRevenue > 0) {
      revDelta.value = ((totalRevenue.value - prevRevenue) / prevRevenue) * 100;
    } else {
      revDelta.value = 0; // no prev data → don't show misleading 100%
    }

    if (prevCollected > 0) {
      collectDelta.value = ((totalCollected.value - prevCollected) / prevCollected) * 100;
    } else {
      collectDelta.value = 0;
    }
  } catch (err) {
    revDelta.value = 0;
    collectDelta.value = 0;
  }
};

watch([totalRevenue, totalCollected], () => {
  calculateDeltas();
});

// Month progress for current month
const monthProgressPct = computed(() => {
  const now = _now;
  // For selected month == current month: use today's date
  if (filterMonth.value === (now.getMonth() + 1) && filterYear.value === now.getFullYear()) {
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Math.round((now.getDate() / days) * 100);
  }
  // For past months: 100%; future months: 0%
  const selDate = new Date(filterYear.value, filterMonth.value - 1, 1);
  return selDate < new Date(now.getFullYear(), now.getMonth(), 1) ? 100 : 0;
});

const collectRatePct = computed(() => {
  const totalPhatSinh = debtRows.value.reduce((s,r) => s + r.phatSinh, 0);
  if (totalPhatSinh <= 0) return 0;
  return Math.round((totalCollected.value / totalPhatSinh) * 100);
});

const revSpark    = computed(() => {
  const base = [158, 174, 162, 198, 217];
  return [...base, +(totalRevenue.value / 1_000_000).toFixed(1)];
});
const maxRevSpark = computed(() => Math.max(...revSpark.value, 1));
const colSpark    = computed(() => {
  const base = [120, 135, 128, 155, 168];
  return [...base, +(totalCollected.value / 1_000_000).toFixed(1)];
});
const maxColSpark = computed(() => Math.max(...colSpark.value, 1));

const debtDonutGradient = computed(() => {
  const pct = collectRatePct.value;
  const deg = pct * 3.6;
  return `conic-gradient(#059669 0deg ${deg}deg, #f59e0b ${deg}deg 360deg)`;
});

// ── filter & sort ─────────────────────────────────────────────────
function setSort(key) {
  if (sortKey.value === key) sortDir.value *= -1;
  else { sortKey.value = key; sortDir.value = -1; }
}

const filteredDs = computed(() => {
  let rows = dsRows.value.filter(r => r.name.toLowerCase().includes(search.value.toLowerCase()));
  rows = [...rows].sort((a,b) => {
    if (sortKey.value === 'name') return sortDir.value * a.name.localeCompare(b.name, 'vi');
    return sortDir.value * (b.tongTriGia - a.tongTriGia);
  });
  return rows;
});

const filteredCn = computed(() => {
  let rows = debtRows.value.filter(r => r.name.toLowerCase().includes(search.value.toLowerCase()));
  rows = [...rows].sort((a,b) => {
    if (sortKey.value === 'name') return sortDir.value * a.name.localeCompare(b.name, 'vi');
    return sortDir.value * (b.noCuoi - a.noCuoi);
  });
  return rows;
});

// ── helpers ───────────────────────────────────────────────────────
/* ── Helpers ─────────────────────────────────────────────────────── */
const fmtVND    = (v) => (parseFloat(v) || 0).toLocaleString('vi-VN') + ' ₫';
const fmtSummary = (v) => fmtVND(v);

const rankClass = (i) => i === 1 ? 'rank-gold' : i === 2 ? 'rank-silver' : i === 3 ? 'rank-bronze' : 'rank-other';

const debtStatusClass = (r) => {
  if (r.noCuoi > r.hanMuc) return 'badge-danger';
  if (r.noCuoi / r.hanMuc > 0.7) return 'badge-warn';
  return 'badge-ok';
};
const debtStatusLabel = (r) => {
  if (r.noCuoi > r.hanMuc) return 'Vượt hạn';
  if (r.noCuoi / r.hanMuc > 0.7) return 'Gần giới hạn';
  return 'Bình thường';
};

// ── actions ───────────────────────────────────────────────────────
const selectRow = (r, tab) => {
  if (selected.value?.id === r.id && selected.value?.tab === tab) {
    selected.value = null;
  } else {
    selected.value = { ...r, tab };
  }
};

const toast = ref({ show: false, msg: '', type: 'ok' });
let _toastTimer = null;
const showToast = (msg, type='ok') => {
  if (_toastTimer) clearTimeout(_toastTimer);
  toast.value = { show: true, msg, type };
  _toastTimer = setTimeout(() => { toast.value.show = false; }, 3000);
};

const exportCSV = () => {
  const rows = reportTab.value === 'doanh-so'
    ? [['Tên ĐL','Quận','SL Phiếu','Tổng trị giá','Tỉ lệ (%)'],
       ...dsRows.value.map(r => [r.name, r.district, r.slPhieuXuat, r.tongTriGia, r.tyLe])]
    : [['Tên ĐL','Quận','Nợ đầu','Phát sinh','Đã thu','Nợ cuối','Hạn mức'],
       ...debtRows.value.map(r => [r.name, r.district, r.noDau, r.phatSinh, r.daThu, r.noCuoi, r.hanMuc])];
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent('﻿' + csv);
  a.download = `bao-cao-${reportTab.value}-t${filterMonth.value}-${filterYear.value}.csv`;
  a.click();
  showToast('Đã xuất file CSV thành công');
};

const exportPrint = () => {
  showToast('Đang chuẩn bị bản in...', 'ok');
  setTimeout(() => window.print(), 400);
};
</script>

<style scoped>
.bc {
  --c-primary: #059669;
  --c-primary-bg: #f0fdf4;
  --c-primary-light: #34d399;
  padding: 28px 32px;
  min-height: 100vh;
  background: #f8fafc;
}

/* ══ BANNER ══ */
.ctx-card {
  background: linear-gradient(120deg,#ffffff 0%,#f0fdf8 45%,#eef9ff 100%);
  border: 1px solid rgba(16,185,129,.14);
  border-radius: 24px;
  padding: 36px 40px 30px;
  margin-bottom: 24px;
  box-shadow: 0 4px 24px rgba(5,150,105,.09),0 1px 4px rgba(15,23,42,.05);
  position: relative;
  overflow: hidden;
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
  position: absolute;
  right: 0; top: 0;
  width: 300px; height: 155px;
  pointer-events: none;
}
.ctx-wm {
  position: absolute;
  right: 320px; top: 50%;
  transform: translateY(-50%);
  width: 92px; height: 92px;
  color: #059669; opacity: .07;
  pointer-events: none; z-index: 0;
}
.ctx-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
}
.ctx-title { font-size: 1.85rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -.8px; }
.ctx-title-block { display: flex; flex-direction: column; gap: 2px; }
.ctx-eyebrow {
  margin: 0; font-size: 10.5px; font-weight: 700; color: #059669;
  text-transform: uppercase; letter-spacing: 1px;
  display: flex; align-items: center; gap: 7px;
}
.ctx-eyebrow::before {
  content: ''; display: inline-block; width: 18px; height: 2.5px;
  background: linear-gradient(90deg, #10b981, #059669); border-radius: 2px; flex-shrink: 0;
}
.ctx-sub   { font-size: .82rem; color: #64748b; margin: 0; }
.ctx-actions { display: flex; gap: 10px; align-items: center; }

.btn-csv {
  display: flex; align-items: center; gap: 6px;
  background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 10px;
  padding: 8px 14px; font-size: .75rem; font-weight: 700;
  color: #475569; cursor: pointer;
}
.btn-csv:hover { background: #e2e8f0; }
.btn-p {
  display: flex; align-items: center; gap: 6px;
  background: var(--c-primary); border: none; border-radius: 10px;
  padding: 8px 16px; font-size: .78rem; font-weight: 700;
  color: white; cursor: pointer;
}
.btn-p:hover { opacity: .9; }

.sel-month {
  background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 10px;
  padding: 8px 12px; font-size: .78rem; font-weight: 600; color: #374151;
  cursor: pointer; outline: none;
}
.sel-month:focus { border-color: var(--c-primary); }

.ctx-divider { height: 1px; background: rgba(16,185,129,.1); margin-bottom: 20px; position: relative; z-index: 2; }

/* ── KPI strip (cs-col pattern) ── */
.ctx-stats {
  display: flex; align-items: stretch; gap: 0;
  margin-bottom: 0; position: relative; z-index: 2;
}
.cs-col {
  flex: 1; padding: 22px 28px; display: flex; flex-direction: column; gap: 6px;
  transition: background .15s;
}
.cs-col:hover { background: rgba(5,150,105,.04); }
.cs-warn { background: rgba(245,158,11,.04); }
.cs-warn:hover { background: rgba(245,158,11,.09); }
.cs-sep {
  width: 1px; background: rgba(16,185,129,.12); flex-shrink: 0; margin: 12px 0;
}
.cs-lbl-row {
  display: flex; align-items: center; gap: 5px; margin-bottom: 2px;
}
.cs-ic {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
  background: rgba(5,150,105,.09); color: #059669;
}
.cs-lbl { font-size: 11px; color: #64748b; font-weight: 600; letter-spacing: .2px; }
.cs-num {
  font-size: 30px; font-weight: 900; letter-spacing: -1.2px; color: #0f172a; line-height: 1;
  display: flex; align-items: baseline; gap: 7px; font-variant-numeric: tabular-nums;
}
.cs-tag {
  font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 99px;
  background: #fffbeb; color: #B45309; border: 1px solid rgba(245,158,11,.25); letter-spacing: .2px;
  vertical-align: middle;
}
.cs-tag-green { background: #ecfdf5; color: #059669; border-color: rgba(16,185,129,.18); }
.cs-delta {
  font-size: 10.5px; font-weight: 600; display: flex; align-items: center; gap: 4px;
  margin-top: -3px;
}
.cs-up   { color: #10b981; }
.cs-down { color: #dc2626; }
.cs-warn .cs-num { color: #D97706; }
.cs-pending-row { display: flex; align-items: center; gap: 12px; }
.donut-wrap { flex-shrink: 0; }

/* Sparkline */
.spark-wrap {
  display: flex; align-items: flex-end; gap: 3px; height: 28px;
}
.spark-bar {
  flex: 1; border-radius: 3px 3px 0 0;
  background: #e2e8f0; min-height: 4px; transition: height .3s;
}
.spark-bar.spark-active { background: var(--c-primary); }

/* Donut */
.donut-ring {
  width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
  mask: radial-gradient(circle, transparent 52%, black 53%);
  -webkit-mask: radial-gradient(circle, transparent 52%, black 53%);
}
.donut-legend {
  display: flex; align-items: center; font-size: .66rem; color: #64748b;
  flex-wrap: wrap; gap: 2px; margin-top: 4px;
}
.dl-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }

/* Month progress */
.ctx-timeline { padding: 10px 0 0; position: relative; z-index: 2; }
.ctl-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 5px;
}
.ctl-label { font-size: 11px; font-weight: 600; color: #64748b; }
.ctl-pct   { font-size: 11px; font-weight: 700; color: #059669; }
.ctl-track {
  height: 4px; background: rgba(5,150,105,.1); border-radius: 99px; overflow: hidden;
}
.ctl-fill {
  height: 100%; background: linear-gradient(90deg, #34d399, #059669); border-radius: 99px; transition: width .8s ease;
}

/* ══ TABS ══ */
.stab-wrap {
  display: flex; align-items: center; gap: 16px; margin-bottom: 18px;
}
.stab-group {
  display: flex; gap: 0; padding: 5px;
  background: white; border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04);
}
.stab {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 22px; border-radius: 12px; border: none;
  background: none; font-size: .82rem; font-weight: 700; color: #64748b;
  cursor: pointer; transition: all .18s; white-space: nowrap;
}
.stab:hover { color: var(--c-primary); }
.stab-active {
  background: var(--c-primary); color: white;
  box-shadow: 0 3px 10px rgba(5,150,105,.35);
}
.stab-active:hover { color: white; }
.stab-code {
  font-size: .68rem; font-weight: 800; opacity: .7;
  background: rgba(0,0,0,.1); border-radius: 4px; padding: 1px 5px;
}
.stab-active .stab-code { background: rgba(255,255,255,.2); opacity: 1; }
.stab-meta {
  font-size: .78rem; color: #94a3b8; font-weight: 500;
}
.stab-meta strong { color: #0f172a; font-weight: 700; }

/* ══ LAYOUT ══ */
.list-wrap {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  transition: grid-template-columns .25s;
}
.list-wrap.panel-open { grid-template-columns: 1fr 340px; }

/* ══ LIST CARD ══ */
.list-card {
  background: white; border-radius: 12px;
  border: 1px solid rgba(15,23,42,.07);
  box-shadow: 0 1px 3px rgba(15,23,42,.05), 0 1px 2px rgba(15,23,42,.04);
  overflow: hidden;
}
.lc-head {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; border-bottom: 1px solid rgba(15,23,42,.06);
  background: #fafcff;
}
.lc-search {
  display: flex; align-items: center; gap: 8px;
  background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px;
  padding: 8px 12px; flex: 1; max-width: 300px;
}
.lc-search-icon { color: #94a3b8; }
.lc-search-input { border: none; background: none; outline: none; font-size: .83rem; color: #1e293b; width: 100%; }
.lc-sort { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.sort-label { font-size: .68rem; font-weight: 700; color: #94a3b8; }
.sort-btn {
  background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px;
  padding: 5px 10px; font-size: .72rem; font-weight: 700; color: #64748b; cursor: pointer;
}
.sort-btn:hover, .sort-active { border-color: var(--c-primary); color: var(--c-primary); background: var(--c-primary-bg); }

/* Table */
.bc-table { width: 100%; border-collapse: collapse; }
.bc-table th {
  font-size: .65rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: .6px; color: #94a3b8;
  padding: 10px 24px; text-align: left;
  background: #fafcff; border-bottom: 2px solid #f1f5f9;
}
.bc-table th.num { text-align: right; }
.bc-table td { padding: 14px 24px; border-bottom: 1px solid #f8fafc; font-size: .84rem; color: #1e293b; }
.bc-table td.num { text-align: right; }
.bc-table tbody tr { cursor: pointer; transition: background .12s; }
.bc-table tbody tr:hover { background: #fafafa; }
.bc-table tbody tr.row-sel { background: var(--c-primary-bg); }
.fw-700 { font-weight: 700; }
.text-amber { color: #d97706; }
.text-green { color: #059669; }
.text-red   { color: #dc2626; }

.row-av-wrap { display: flex; align-items: center; gap: 10px; }
.row-av {
  position: relative; width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12); box-shadow: 0 1px 4px rgba(0,0,0,.15);
  overflow: hidden; background: white;
}
.av-logo { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center; padding:5px; box-sizing:border-box; z-index:2; background:white; display:block; }
.av-init { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:white; letter-spacing:-.3px; }
.row-name { font-weight: 700; font-size: .85rem; color: #1e293b; }
.row-sub  { font-size: .72rem; color: #94a3b8; }

/* Percent bar */
.pct-bar-wrap { display: flex; align-items: center; gap: 8px; }
.pct-bar { height: 7px; border-radius: 4px; min-width: 4px; background: linear-gradient(90deg,#34d399,#059669) !important; }
.pct-txt { font-size: .75rem; font-weight: 700; color: #475569; white-space: nowrap; }

/* Rank badges */
.rank-badge { font-size: .8rem; font-weight: 700; }
.rank-gold   { color: #d97706; }
.rank-silver { color: #94a3b8; }
.rank-bronze { color: #b45309; }
.rank-other  { color: #94a3b8; font-size: .72rem; }

/* Status badges */
.no-badge {
  padding: 3px 10px; border-radius: 6px; font-size: .7rem; font-weight: 700;
}
.badge-ok      { background: #dcfce7; color: #166534; }
.badge-warn    { background: #fef3c7; color: #92400e; }
.badge-danger  { background: #fee2e2; color: #991b1b; }

/* Footer */
.lc-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px; border-top: 1px solid #f1f5f9;
  font-size: .75rem; color: #64748b;
}
.foot-count { font-weight: 600; }
.foot-total { font-weight: 600; }
.empty-row { text-align: center; color: #94a3b8; padding: 32px !important; font-size: .82rem; }

/* ══ SIDE PANEL ══ */
.side-panel {
  background: linear-gradient(180deg,#fbfdff 0%,#fffaf5 100%); border-radius: 12px;
  border: 1px solid rgba(15,23,42,.07);
  box-shadow: 0 1px 3px rgba(15,23,42,.05), 0 1px 2px rgba(15,23,42,.04);
  overflow-y: auto; max-height: 76vh;
}
.sp-header {
  display: flex; align-items: center; gap: 12px;
  padding: 20px 20px 16px; border-bottom: 1px solid #f1f5f9;
  background: rgba(255,255,255,.72);
}
.ap-avatar {
  position: relative; width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12); box-shadow: 0 2px 6px rgba(0,0,0,.15);
  overflow: hidden; background: white;
}
.sp-name { font-size: .92rem; font-weight: 800; color: #1e293b; }
.sp-sub  { font-size: .72rem; color: #94a3b8; }
.sp-close {
  margin-left: auto; background: #f1f5f9; border: none; border-radius: 8px;
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #475569;
}
.sp-close:hover { background: #e2e8f0; }

.sp-section-label {
  font-size: .65rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: .6px; color: #94a3b8; padding: 14px 20px 6px;
}
.sp-id-block { flex: 1; min-width: 0; }
.dl-flex {
  display: grid; grid-template-columns: auto 1fr;
  gap: 4px 16px; padding: 0 20px;
}
.dl-flex dt { font-size: .73rem; font-weight: 600; color: #94a3b8; align-self: center; }
.dl-flex dd { font-size: .83rem; font-weight: 600; color: #1e293b; text-align: right; margin: 0; }

/* Doanh số bar */
.ds-bar-wrap {
  margin: 0 20px 4px;
  background: #f1f5f9; border-radius: 6px; height: 10px; overflow: hidden;
  position: relative;
}
.ds-bar { height: 100%; border-radius: 6px; transition: width .4s; }
.ds-bar-pct { position: absolute; right: 6px; top: -1px; font-size: .65rem; font-weight: 700; color: #475569; }

/* Mini sparkline */
.mini-spark {
  display: flex; gap: 4px; align-items: flex-end;
  padding: 0 20px 16px; height: 80px;
}
.ms-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; height: 100%; }
.ms-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.ms-bar { width: 100%; border-radius: 3px 3px 0 0; min-height: 4px; transition: height .3s; }
.ms-label { font-size: .6rem; color: #94a3b8; font-weight: 600; }
.ms-val   { font-size: .62rem; color: #475569; font-weight: 700; }

/* Debt bar */
.debt-bar-track {
  margin: 6px 20px 4px; height: 10px; background: #f1f5f9; border-radius: 6px; overflow: hidden;
}
.debt-bar-fill { height: 100%; border-radius: 6px; transition: width .4s; }
.debt-bar-labels {
  display: flex; justify-content: space-between; padding: 2px 20px 0;
  font-size: .65rem; color: #94a3b8;
}
.debt-over-hint {
  margin: 10px 20px 0; background: #fee2e2; color: #991b1b;
  border-radius: 10px; padding: 10px 14px; font-size: .75rem; font-weight: 700;
  display: flex; align-items: center; gap: 6px;
}

.sp-divider { height: 1px; background: #f1f5f9; margin: 16px 0 0; }
.sp-info-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1px; background: rgba(226,232,240,.72); margin: 0;
}
.sig-item {
  background: rgba(255,255,255,.76); padding: 12px 20px;
}
.sig-label { font-size: .62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 3px; }
.sig-val   { font-size: .82rem; font-weight: 700; color: #1e293b; }

/* ══ PANEL ANIMATION ══ */
.panel-enter-active, .panel-leave-active { transition: opacity .2s, transform .2s; }
.panel-enter-from, .panel-leave-to { opacity: 0; transform: translateX(20px); }

/* ══ DEBT OVERVIEW STRIP ══ */
.debt-ov-strip {
  display: flex; align-items: center; gap: 0;
  background: white; border-radius: 12px;
  box-shadow: 0 1px 3px rgba(15,23,42,.05), 0 1px 2px rgba(15,23,42,.04);
  border: 1px solid rgba(15,23,42,.07);
  margin-bottom: 18px; overflow: hidden;
}
.dov-cell {
  flex: 1; padding: 18px 24px; display: flex; flex-direction: column; gap: 5px;
}
.dov-cell-bar { flex: 2; }
.dov-sep { width: 1px; background: #f1f5f9; flex-shrink: 0; margin: 14px 0; }
.dov-num {
  font-size: 1.55rem; font-weight: 900; letter-spacing: -.5px; color: #0f172a;
  line-height: 1;
}
.dov-lbl { font-size: .7rem; font-weight: 600; color: #94a3b8; }
.dov-bar-track {
  height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 6px;
}
.dov-bar-fill {
  height: 100%; background: linear-gradient(90deg,#34d399,#059669); border-radius: 99px;
  transition: width .8s ease;
}

/* ══ LIST CARD ══ */
.toast-snack {
  position: fixed; bottom: 28px; right: 32px; z-index: 9999;
  display: flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 12px;
  font-size: .82rem; font-weight: 700; color: white;
  box-shadow: 0 8px 24px rgba(0,0,0,.15);
  animation: toast-in .22s ease;
}
@keyframes toast-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
.toast-ok  { background: #059669; }
.toast-err { background: #dc2626; }

/* ══ TIMELINE / MONTH PROGRESS ══ */
.ctx-timeline {
  margin-top: 20px; position: relative; z-index: 2;
}
.ctl-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 6px;
}
.ctl-label {
  font-size: .72rem; font-weight: 700; color: #334155; letter-spacing: .2px;
}
.ctl-pct {
  font-size: .7rem; font-weight: 700; color: #059669;
}
.ctl-track {
  height: 5px; background: rgba(5,150,105,.12); border-radius: 99px; overflow: hidden;
}
.ctl-fill {
  height: 100%;
  background: linear-gradient(90deg, #34d399, #059669);
  border-radius: 99px;
  transition: width .8s ease;
}

</style>
