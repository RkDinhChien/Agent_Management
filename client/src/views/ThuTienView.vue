<template>
  <div class="tt">

    <!-- ══ CONTEXT BANNER ══ -->
    <div class="ctx-card">

      <!-- Hexagon decoration -->
      <svg class="ctx-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <polygon id="pthx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
        </defs>
        <g stroke="#059669" stroke-width=".9" opacity=".12">
          <use href="#pthx" transform="translate(21,24)"/>  <use href="#pthx" transform="translate(62,24)"/>
          <use href="#pthx" transform="translate(103,24)"/> <use href="#pthx" transform="translate(144,24)"/>
          <use href="#pthx" transform="translate(185,24)"/> <use href="#pthx" transform="translate(226,24)"/>
          <use href="#pthx" transform="translate(267,24)"/>
          <use href="#pthx" transform="translate(0,60)"/>   <use href="#pthx" transform="translate(41,60)"/>
          <use href="#pthx" transform="translate(82,60)"/>  <use href="#pthx" transform="translate(123,60)"/>
          <use href="#pthx" transform="translate(164,60)"/> <use href="#pthx" transform="translate(205,60)"/>
          <use href="#pthx" transform="translate(246,60)"/> <use href="#pthx" transform="translate(287,60)"/>
          <use href="#pthx" transform="translate(21,96)"/>  <use href="#pthx" transform="translate(62,96)"/>
          <use href="#pthx" transform="translate(103,96)"/> <use href="#pthx" transform="translate(144,96)"/>
          <use href="#pthx" transform="translate(185,96)"/> <use href="#pthx" transform="translate(226,96)"/>
          <use href="#pthx" transform="translate(267,96)"/>
          <use href="#pthx" transform="translate(0,132)"/>  <use href="#pthx" transform="translate(41,132)"/>
          <use href="#pthx" transform="translate(82,132)"/> <use href="#pthx" transform="translate(123,132)"/>
          <use href="#pthx" transform="translate(164,132)"/><use href="#pthx" transform="translate(205,132)"/>
          <use href="#pthx" transform="translate(246,132)"/><use href="#pthx" transform="translate(287,132)"/>
        </g>
        <g stroke="#059669" stroke-width="1.2" opacity=".26">
          <use href="#pthx" transform="translate(144,60)"/>
          <use href="#pthx" transform="translate(185,24)"/>
          <use href="#pthx" transform="translate(226,96)"/>
        </g>
        <polygon points="144,36 164.8,48 164.8,72 144,84 123.2,72 123.2,48" fill="#059669" opacity=".06"/>
        <polygon points="185,0 205.8,12 205.8,36 185,48 164.2,36 164.2,12" fill="#047857" opacity=".05"/>
        <g fill="#059669" opacity=".45">
          <circle cx="144" cy="60" r="3.5"/><circle cx="185" cy="24" r="3"/><circle cx="226" cy="96" r="3"/>
        </g>
        <g stroke="#059669" stroke-width=".8" stroke-dasharray="3 4" opacity=".18">
          <line x1="144" y1="60" x2="185" y2="24"/>
          <line x1="144" y1="60" x2="226" y2="96"/>
        </g>
        <g fill="#059669" opacity=".35">
          <circle cx="62" cy="24" r="2"/><circle cx="267" cy="60" r="2"/><circle cx="103" cy="132" r="2"/>
        </g>
      </svg>

      <svg class="ctx-wm" viewBox="0 0 105 85" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="5" y="28" width="95" height="54" rx="10"/>
        <ellipse cx="52" cy="28" rx="47" ry="14"/>
        <circle cx="78" cy="55" r="10"/>
        <path d="M73 55h10M78 50v10" stroke-width="3"/>
        <line x1="18" y1="60" x2="55" y2="60" stroke-width="3.5"/>
        <line x1="18" y1="70" x2="42" y2="70" stroke-width="3.5"/>
      </svg>

      <div class="ctx-top">
        <div>
          <h1 class="ctx-title">Thu Tiền Nợ</h1>
          <p class="ctx-sub">Không để đồng nợ nào chậm trễ — thu hồi nhanh từ từng đại lý · {{ monthName }}/{{ _now.getFullYear() }}</p>
        </div>
        <div class="ctx-actions">
          <button class="btn-csv" @click="exportCSV"><Download :size="13"/> Xuất CSV</button>
          <button class="btn-p" @click="openCreate"><Plus :size="14"/> Lập phiếu thu</button>
        </div>
      </div>

      <div class="ctx-divider"></div>

      <div class="ctx-stats">

        <!-- KPI 1: Tổng phiếu thu -->
        <div class="cs-col">
          <strong class="cs-num">{{ receipts.length }}</strong>
          <span class="cs-delta cs-up">↑ 2 so tháng 4</span>
          <span class="cs-lbl">Tổng phiếu tháng này</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 2: Tổng thu + sparkline -->
        <div class="cs-col">
          <strong class="cs-num">{{ totalCollected }} <span style="font-size:14px;font-weight:600;color:#94a3b8">Tr</span></strong>
          <span class="cs-delta cs-up">↑ 15% so tháng 4</span>
          <div class="spark-wrap">
            <div v-for="(h, i) in spark" :key="i"
                 class="spark-bar" :class="{ 'spark-active': i === spark.length - 1 }"
                 :style="{ height: (h / maxSpark * 100) + '%' }"
                 :title="sparkLabels[i] + ': ' + h + ' Tr'">
            </div>
          </div>
          <span class="cs-lbl">Tổng đã thu (xác nhận)</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 3: Chờ xử lý + donut -->
        <div class="cs-col cs-warn">
          <div class="cs-pending-row">
            <div class="donut-wrap">
              <div class="donut-ring" :style="{ background: donutGradient }"></div>
            </div>
            <div>
              <strong class="cs-num cs-amber" style="display:block;margin-bottom:2px">
                {{ pendingCount }}
                <span class="cs-tag" v-if="pendingCount > 0">đang xử lý</span>
              </strong>
              <span class="cs-delta cs-ok">↓ 1 so tháng 4</span>
            </div>
          </div>
          <div class="donut-legend">
            <span class="dl-dot" style="background:#10b981"></span> Xác nhận {{ confirmedCount }}
            <span class="dl-dot" style="background:#f59e0b;margin-left:6px"></span> Chờ {{ pendingCount }}
          </div>
          <span class="cs-lbl" style="margin-top:4px">Phiếu chờ xử lý</span>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 4: Đại lý còn nợ -->
        <div class="cs-col">
          <strong class="cs-num">
            {{ agentsWithDebt }}
            <span class="cs-tag cs-tag-green" v-if="agentsWithDebt > 0">còn nợ</span>
          </strong>
          <span class="cs-delta cs-down" v-if="agentsWithDebt > 0">↑ 1 so tháng 4</span>
          <span class="cs-delta cs-up" v-else>Tất cả đã trả nợ</span>
          <span class="cs-lbl">Đại lý còn dư nợ</span>
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
            <h3 class="lc-title">Danh sách phiếu thu</h3>
            <span class="count-badge">{{ filteredList.length }} / {{ receipts.length }}</span>
            <button v-if="hasFilter" class="clear-btn" @click="clearFilters">
              <X :size="11"/> Xóa lọc
            </button>
            <div class="stab-group">
              <button class="stab" :class="{ active: !filterStatus }" @click="filterStatus = ''">Tất cả</button>
              <button class="stab stab-green" :class="{ active: filterStatus === 'confirmed' }" @click="filterStatus = 'confirmed'">
                Đã xác nhận <span class="stab-n">{{ confirmedCount }}</span>
              </button>
              <button class="stab stab-warn" :class="{ active: filterStatus === 'pending' }" @click="filterStatus = 'pending'">
                Đang xử lý <span class="stab-n">{{ pendingCount }}</span>
              </button>
            </div>
          </div>
          <div class="lc-tools">
            <div class="search-wrap">
              <Search :size="14" class="search-ic"/>
              <input v-model="searchQ" class="search-inp" placeholder="Tìm mã phiếu, tên đại lý…"/>
            </div>
            <select v-model="filterAgent" class="psel">
              <option value="">Tất cả đại lý</option>
              <option v-for="a in agents" :key="a.id" :value="a.name">{{ a.name }}</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="dl-table">
            <colgroup>
              <col style="width:12%"/>
              <col style="width:10%"/>
              <col/>
              <col style="width:12%"/>
              <col style="width:11%"/>
              <col style="width:11%"/>
              <col style="width:13%"/>
            </colgroup>
            <thead>
              <tr>
                <th>
                  <span class="sort-hd" @click="toggleSort('code')">Mã phiếu <SortIcon field="code" :sk="sk" :sd="sd"/></span>
                </th>
                <th>
                  <span class="sort-hd" @click="toggleSort('rawDate')">Ngày thu <SortIcon field="rawDate" :sk="sk" :sd="sd"/></span>
                </th>
                <th>Đại lý</th>
                <th class="text-right">
                  <span class="sort-hd sort-hd-r" @click="toggleSort('amount')">Số tiền thu <SortIcon field="amount" :sk="sk" :sd="sd"/></span>
                </th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in sortedList" :key="r.id"
                class="tt-row" :class="{ selected: selectedId === r.id }"
                @click="openView(r)">
                <td><span class="tt-code">{{ r.code }}</span></td>
                <td class="muted col-mono">{{ r.date }}</td>
                <td>
                  <div class="agent-cell">
                    <div class="agent-av">
                      <img :src="agentBrand(r.agentId).logo" class="av-logo" :alt="r.agent" @error="e => e.target.style.display='none'"/>
                      <span class="av-init" :style="{ background: agentBrand(r.agentId).bg }">{{ avatarInit(r.agent) }}</span>
                    </div>
                    <div class="agent-info">
                      <span class="agent-name">{{ r.agent }}</span>
                      <span class="agent-debt" :class="debtClass(r.agentId)">
                        Nợ: {{ fmtMoney(getAgent(r.agentId)?.debt) }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="text-right">
                  <span class="total-num">{{ fmtTr(r.amount) }}</span>
                </td>
                <td>
                  <span class="method-badge">{{ r.method }}</span>
                </td>
                <td>
                  <span class="status-badge" :class="r.status">{{ STATUS[r.status] }}</span>
                </td>
                <td class="col-actions">
                  <button class="act-btn view-btn" title="Xem" @click.stop="openView(r)"><Eye :size="13"/></button>
                  <button v-if="r.status === 'pending'" class="act-btn ok-btn" title="Xác nhận" @click.stop="confirmReceipt(r)"><CheckCircle :size="13"/></button>
                  <button class="act-btn del-btn" title="Xóa" @click.stop="askDelete(r)"><Trash2 :size="13"/></button>
                </td>
              </tr>
              <tr v-if="!sortedList.length">
                <td colspan="7" class="empty-row">
                  <PackageOpen :size="30" class="empty-ic"/><p>Không tìm thấy phiếu thu phù hợp</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="lc-foot" v-if="sortedList.length">
          Hiển thị {{ sortedList.length }} phiếu thu
          <span v-if="hasFilter"> (đã lọc từ {{ receipts.length }})</span>
        </div>
      </div>

      <!-- ════ SIDE PANEL ════ -->
      <Transition name="panel">
      <div class="dl-card side-panel" v-if="panelVisible">

        <!-- ─ VIEW MODE ─ -->
        <template v-if="panelMode === 'view' && selectedReceipt">
          <div class="ap-hd">
            <div class="ap-avatar">
              <img :src="agentBrand(selectedReceipt.agentId).logo" class="av-logo" :alt="selectedReceipt.agent" @error="e => e.target.style.display='none'"/>
              <span class="av-init" :style="{ background: agentBrand(selectedReceipt.agentId).bg }">{{ avatarInit(selectedReceipt.agent) }}</span>
            </div>
            <div class="ap-title-block">
              <h3 class="ap-name">{{ selectedReceipt.code }}</h3>
              <div class="ap-badges">
                <span class="status-badge" :class="selectedReceipt.status">{{ STATUS[selectedReceipt.status] }}</span>
                <span class="dist-chip">{{ selectedReceipt.method }}</span>
              </div>
            </div>
            <div style="display:flex;gap:5px">
              <button class="act-btn" style="background:rgba(15,23,42,.04);color:var(--c-txt-3)" title="Đóng" @click="closePanel"><X :size="14"/></button>
            </div>
          </div>

          <!-- Amount display section -->
          <div class="gauge-section">
            <div class="amt-display">
              <span class="amt-label">Số tiền thu</span>
              <div class="amt-value">{{ fmtTr(selectedReceipt.amount) }}</div>
              <div class="amt-sub">{{ (selectedReceipt.amount * 1_000_000).toLocaleString('vi-VN') }} đồng</div>
            </div>

            <!-- Debt remain bar -->
            <div class="debt-section">
              <div class="debt-hd">
                <span class="debt-lbl">Nợ còn lại sau thu</span>
                <span class="debt-val" :class="debtRemainClass(selectedReceipt)">
                  {{ fmtMoney(Math.max(0, debtAfterPayment(selectedReceipt))) }}
                  / {{ fmtMoney(getAgent(selectedReceipt.agentId)?.limit) }}
                </span>
              </div>
              <div class="debt-bar-wrap">
                <div class="debt-bar">
                  <div class="debt-fill" :style="{ width: debtRemainPct(selectedReceipt) + '%', background: debtRemainBarColor(selectedReceipt) }"></div>
                </div>
                <span class="debt-pct-lbl" :class="debtRemainClass(selectedReceipt)">{{ Math.round(debtRemainPct(selectedReceipt)) }}%</span>
              </div>
            </div>

            <div class="debt-status-bar" :class="selectedReceipt.status">
              <CheckCircle v-if="selectedReceipt.status === 'confirmed'" :size="12"/>
              <Clock v-else :size="12"/>
              {{ STATUS_DESC[selectedReceipt.status] }}
            </div>
          </div>

          <!-- Info grid -->
          <div class="info-grid">
            <div class="ig-row">
              <Building2 :size="13" class="ig-ic"/>
              <span class="ig-lbl">Đại lý</span>
              <span class="ig-val">{{ selectedReceipt.agent }}</span>
            </div>
            <div class="ig-row">
              <CalendarDays :size="13" class="ig-ic"/>
              <span class="ig-lbl">Ngày thu</span>
              <span class="ig-val col-mono">{{ selectedReceipt.date }}</span>
            </div>
            <div class="ig-row">
              <UserRound :size="13" class="ig-ic"/>
              <span class="ig-lbl">Người thu</span>
              <span class="ig-val">{{ selectedReceipt.collector }}</span>
            </div>
            <div class="ig-row">
              <Wallet :size="13" class="ig-ic"/>
              <span class="ig-lbl">Phương thức</span>
              <span class="ig-val">{{ selectedReceipt.method }}</span>
            </div>
            <div class="ig-row" v-if="selectedReceipt.note">
              <FileText :size="13" class="ig-ic"/>
              <span class="ig-lbl">Ghi chú</span>
              <span class="ig-val" style="font-style:italic;color:#64748b">{{ selectedReceipt.note }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="quick-links" v-if="selectedReceipt.status === 'pending'">
            <button class="btn-p" style="flex:1;justify-content:center" @click="confirmReceipt(selectedReceipt)">
              <CheckCircle :size="14"/>Xác nhận thu tiền
            </button>
            <button class="btn-danger-o" @click="askDelete(selectedReceipt)">
              <XCircle :size="14"/>Hủy
            </button>
          </div>
          <div class="status-note" v-else>
            <CheckCircle :size="13"/> Đã xác nhận thu tiền
          </div>
        </template>

        <!-- ─ CREATE MODE ─ -->
        <template v-else-if="panelMode === 'create'">
          <div class="fc-hd">
            <div>
              <h3 class="fc-title">Lập phiếu thu tiền</h3>
              <span class="fc-sub">Điền thông tin thu tiền nợ đại lý</span>
            </div>
            <span class="mode-chip add">Mới</span>
          </div>
          <div class="fc-body">

            <div class="field full">
              <label class="flabel">Đại lý <span class="req">*</span></label>
              <select v-model="form.agentId" class="finp" :class="{ 'finp-err': errors.agent }" @change="onAgentChange">
                <option value="">— Chọn đại lý —</option>
                <option v-for="a in agents" :key="a.id" :value="a.id">{{ a.name }} (Nợ: {{ fmtMoney(a.debt) }})</option>
              </select>
              <span class="err-msg" v-if="errors.agent">{{ errors.agent }}</span>
            </div>

            <!-- Debt hint when agent selected -->
            <div class="debt-hint" v-if="formAgent">
              <div class="dh-row">
                <span>Nợ hiện tại</span>
                <strong :class="debtClass(formAgent.id)">{{ fmtMoney(formAgent.debt) }} / {{ fmtMoney(formAgent.limit) }}</strong>
              </div>
              <div class="dh-bar"><div class="dh-fill" :style="{ width: agentDebtPct(formAgent.id)+'%', background: debtBarColor(formAgent.id) }"></div></div>
              <span class="dh-warn" v-if="agentDebtPct(formAgent.id) >= 80">
                ⚠ Đại lý gần đạt hạn mức nợ
              </span>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Ngày thu <span class="req">*</span></label>
                <input v-model="form.date" type="date" class="finp" :max="today"/>
              </div>
              <div class="field">
                <label class="flabel">Người thu</label>
                <input v-model="form.collector" class="finp" placeholder="Tên người thu tiền"/>
              </div>
            </div>

            <div class="field full">
              <label class="flabel">Số tiền thu (Tr) <span class="req">*</span></label>
              <input v-model.number="form.amount" type="number" min="0" step="0.1" class="finp" :class="{ 'finp-err': errors.amount }" placeholder="0.0"/>
              <span class="err-msg" v-if="errors.amount">{{ errors.amount }}</span>
              <!-- Mini progress bar: amount vs debt -->
              <div class="amt-hint" v-if="formAgent && form.amount > 0">
                <div class="amt-hint-bar">
                  <div class="amt-hint-fill" :style="{ width: Math.min(form.amount / (formAgent.debt / 1_000_000) * 100, 100) + '%' }"></div>
                </div>
                <span class="amt-hint-txt">
                  Thu {{ fmtTr(form.amount) }} / {{ fmtMoney(formAgent.debt) }} nợ
                  ({{ Math.round(Math.min(form.amount / (formAgent.debt / 1_000_000) * 100, 100)) }}%)
                </span>
              </div>
            </div>

            <div class="field full">
              <label class="flabel">Phương thức <span class="req">*</span></label>
              <select v-model="form.method" class="finp" :class="{ 'finp-err': errors.method }">
                <option value="">— Chọn phương thức —</option>
                <option>Tiền mặt</option>
                <option>Chuyển khoản</option>
                <option>Ví điện tử</option>
              </select>
              <span class="err-msg" v-if="errors.method">{{ errors.method }}</span>
            </div>

            <div class="field full">
              <label class="flabel">Ghi chú</label>
              <textarea v-model="form.note" class="finp ftarea" rows="2" placeholder="Ghi chú thêm (VD: MB Bank, MoMo…)"></textarea>
            </div>
          </div>
          <div class="fc-footer">
            <button class="btn-ghost" @click="closePanel"><X :size="12"/> Hủy</button>
            <button class="btn-p" @click="submitCreate">Lập phiếu thu</button>
          </div>
        </template>

      </div>
      </Transition>
    </div>

    <!-- ══ TOAST ══ -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="toast-snack" :class="toast.type">
          <CheckCircle v-if="toast.type === 'success'" :size="15"/>
          <XCircle     v-else-if="toast.type === 'danger'" :size="15"/>
          <Clock       v-else :size="15"/>
          {{ toast.msg }}
        </div>
      </Transition>
    </Teleport>

    <!-- ══ DELETE MODAL ══ -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-bg" @click="deleteTarget = null">
        <div class="modal-box" @click.stop>
          <div class="del-avatar-wrap">
            <div class="del-agent-avatar" :style="{ background: agentBrand(deleteTarget.agentId).bg }">
              <img :src="agentBrand(deleteTarget.agentId).logo" class="del-avatar-img" :alt="deleteTarget.agent" @error="e => e.target.style.display='none'"/>
              <span class="del-avatar-abbr">{{ avatarInit(deleteTarget.agent) }}</span>
            </div>
            <div class="del-trash-badge"><Trash2 :size="13"/></div>
          </div>
          <h4 class="modal-title">Xác nhận xóa phiếu thu</h4>
          <p class="modal-desc">
            Bạn có chắc muốn xóa <strong>{{ deleteTarget.code }}</strong>?<br/>
            <span style="color:#94a3b8">{{ deleteTarget.agent }}</span><br/>
            Hành động này không thể hoàn tác.
          </p>
          <div class="modal-actions">
            <button class="btn-o" @click="deleteTarget = null">Hủy</button>
            <button class="btn-danger" @click="confirmDelete">Xóa</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import {
  Search, Plus, Download, X, Eye, XCircle, CheckCircle,
  Trash2, PackageOpen, CalendarDays, UserRound, FileText,
  Clock, Wallet, Building2,
} from 'lucide-vue-next';

/* ── Sort icon ── */
const SortIcon = {
  props: ['field', 'sk', 'sd'],
  template: `<span class="sort-arrow"><svg width="8" height="10" viewBox="0 0 8 10" fill="none">
    <path d="M4 0L7 3.5H1L4 0Z" :fill="sk===field && sd==='asc' ? '#059669' : '#cbd5e1'"/>
    <path d="M4 10L1 6.5H7L4 10Z" :fill="sk===field && sd==='desc' ? '#059669' : '#cbd5e1'"/>
  </svg></span>`,
};

/* ── Constants ── */
const STATUS = { confirmed: 'Đã xác nhận', pending: 'Đang xử lý' };
const STATUS_DESC = {
  confirmed: 'Đã xác nhận thu tiền',
  pending:   'Đang chờ xử lý',
};

const AGENT_CLR = [
  'linear-gradient(135deg,#059669,#34d399)',
  'linear-gradient(135deg,#0d9488,#2dd4bf)',
  'linear-gradient(135deg,#0284c7,#38bdf8)',
  'linear-gradient(135deg,#4f46e5,#818cf8)',
  'linear-gradient(135deg,#0891b2,#22d3ee)',
  'linear-gradient(135deg,#059669,#059669)',
];
const agentColor = (id) => AGENT_CLR[id % AGENT_CLR.length];

const agents = [
  { id:1, name:'Đại lý Tuấn Phát',  debt:8_500_000, limit:10_000_000 },
  { id:2, name:'Đại lý Lan Anh',    debt:3_200_000, limit:5_000_000  },
  { id:3, name:'Đại lý Quốc Khánh', debt:6_700_000, limit:10_000_000 },
  { id:4, name:'Đại lý Minh Châu',  debt:1_800_000, limit:5_000_000  },
  { id:5, name:'Đại lý Hoa Phượng', debt:9_100_000, limit:10_000_000 },
  { id:6, name:'Đại lý Thanh Bình', debt:5_800_000, limit:10_000_000 },
  { id:7, name:'Đại lý Phú Quý',    debt:2_300_000, limit:5_000_000  },
  { id:8, name:'Đại lý Bảo Châu',   debt:4_900_000, limit:5_000_000  },
];

/* ── Mock data ── */
const receipts = ref([
  { id:1, code:'PT-2026-001', date:'05/05/2026', rawDate:'2026-05-05', agent:'Đại lý Tuấn Phát',   agentId:1, amount:2.5,  method:'Tiền mặt',     collector:'Nguyễn Admin', note:'',            status:'confirmed' },
  { id:2, code:'PT-2026-002', date:'10/05/2026', rawDate:'2026-05-10', agent:'Đại lý Hoa Phượng',  agentId:5, amount:5.0,  method:'Chuyển khoản', collector:'Trần Kế Toán', note:'MB Bank',     status:'confirmed' },
  { id:3, code:'PT-2026-003', date:'12/05/2026', rawDate:'2026-05-12', agent:'Đại lý Quốc Khánh',  agentId:3, amount:1.8,  method:'Tiền mặt',     collector:'Nguyễn Admin', note:'',            status:'confirmed' },
  { id:4, code:'PT-2026-004', date:'15/05/2026', rawDate:'2026-05-15', agent:'Đại lý Lan Anh',     agentId:2, amount:1.5,  method:'Ví điện tử',   collector:'Nguyễn Admin', note:'MoMo',        status:'confirmed' },
  { id:5, code:'PT-2026-005', date:'17/05/2026', rawDate:'2026-05-17', agent:'Đại lý Bảo Châu',    agentId:8, amount:3.8,  method:'Chuyển khoản', collector:'Trần Kế Toán', note:'Vietcombank', status:'pending'   },
  { id:6, code:'PT-2026-006', date:'18/05/2026', rawDate:'2026-05-18', agent:'Đại lý Phú Quý',     agentId:7, amount:1.2,  method:'Tiền mặt',     collector:'Nguyễn Admin', note:'',            status:'confirmed' },
]);

/* ── State ── */
const searchQ      = ref('');
const filterAgent  = ref('');
const filterStatus = ref('');
const sk           = ref('rawDate');
const sd           = ref('desc');

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
const selectedId   = ref(null);
const panelMode    = ref('view');
const deleteTarget = ref(null);

/* ── Computed ── */
const hasFilter = computed(() => searchQ.value || filterAgent.value || filterStatus.value);
const clearFilters = () => { searchQ.value = ''; filterAgent.value = ''; filterStatus.value = ''; };
const toggleSort = (key) => {
  if (sk.value === key) sd.value = sd.value === 'asc' ? 'desc' : 'asc';
  else { sk.value = key; sd.value = 'asc'; }
};

const filteredList = computed(() => {
  const q = searchQ.value.toLowerCase();
  return receipts.value.filter(r => {
    const matchQ = !q || r.code.toLowerCase().includes(q) || r.agent.toLowerCase().includes(q);
    const matchA = !filterAgent.value  || r.agent  === filterAgent.value;
    const matchS = !filterStatus.value || r.status === filterStatus.value;
    return matchQ && matchA && matchS;
  });
});

const sortedList = computed(() => {
  const list = [...filteredList.value];
  list.sort((a, b) => {
    let va = a[sk.value], vb = b[sk.value];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return sd.value === 'asc' ? -1 : 1;
    if (va > vb) return sd.value === 'asc' ?  1 : -1;
    return 0;
  });
  return list;
});

const selectedReceipt = computed(() => receipts.value.find(r => r.id === selectedId.value) ?? null);
const panelVisible    = computed(() => selectedReceipt.value !== null || panelMode.value === 'create');

const confirmedCount  = computed(() => receipts.value.filter(r => r.status === 'confirmed').length);
const pendingCount    = computed(() => receipts.value.filter(r => r.status === 'pending').length);
const totalCollected  = computed(() => receipts.value.filter(r => r.status === 'confirmed').reduce((s, r) => s + r.amount, 0).toFixed(1));
const agentsWithDebt  = computed(() => agents.filter(a => a.debt > 0).length);

/* ── Donut ── */
const donutGradient = computed(() => {
  const total = receipts.value.length || 1;
  const c = Math.round(confirmedCount.value / total * 100);
  return `conic-gradient(#10b981 0% ${c}%, #f59e0b ${c}% 100%)`;
});

/* ── Sparkline ── */
const spark       = [35, 42, 28, 58, 47, 64];
const maxSpark    = Math.max(...spark);
const sparkLabels = ['Th.12', 'Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5'];

/* ── Month progress ── */
const _now           = new Date();
const daysInMonth    = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate();
const dayOfMonth     = _now.getDate();
const monthProgressPct = Math.round(dayOfMonth / daysInMonth * 100);
const monthName      = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                        'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'][_now.getMonth()];

/* ── Helpers ── */
const getAgent     = (id) => agents.find(a => a.id === id);
const fmtTr        = (v) => v >= 1 ? `${Number(v).toFixed(1)} Tr` : `${(Number(v) * 1000).toFixed(0)} K`;
const fmtMoney     = (v) => ((v || 0) / 1_000_000).toFixed(1) + ' Tr';

const agentDebtPct = (id) => {
  const a = getAgent(id); if (!a) return 0;
  return Math.min((a.debt / a.limit) * 100, 100);
};
const debtBarColor = (id) => {
  const p = agentDebtPct(id);
  return p >= 100 ? '#ef4444' : p >= 80 ? '#f59e0b' : '#10b981';
};
const debtClass = (id) => {
  const p = agentDebtPct(id);
  return p >= 100 ? 'debt-over' : p >= 80 ? 'debt-warn' : 'debt-ok';
};

const debtAfterPayment = (r) => {
  const a = getAgent(r.agentId);
  if (!a) return 0;
  return a.debt - r.amount * 1_000_000;
};
const debtRemainPct = (r) => {
  const a = getAgent(r.agentId);
  if (!a || a.limit === 0) return 0;
  return Math.min(Math.max(debtAfterPayment(r), 0) / a.limit * 100, 100);
};
const debtRemainBarColor = (r) => {
  const p = debtRemainPct(r);
  return p >= 80 ? '#ef4444' : p >= 50 ? '#f59e0b' : '#10b981';
};
const debtRemainClass = (r) => {
  const p = debtRemainPct(r);
  return p >= 80 ? 'debt-over' : p >= 50 ? 'debt-warn' : 'debt-ok';
};

/* ── Form ── */
const today     = new Date().toISOString().split('T')[0];
const emptyForm = () => ({ agentId: '', date: today, collector: 'Nguyễn Admin', amount: '', method: '', note: '' });
const form      = ref(emptyForm());
const errors    = reactive({ agent: '', amount: '', method: '' });
const formAgent = computed(() => form.value.agentId ? getAgent(Number(form.value.agentId)) : null);

const onAgentChange = () => {};

/* ── Toast ── */
const toast = ref({ show: false, msg: '', type: 'success' });
let _toastTimer = null;
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, msg, type };
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { toast.value.show = false; }, 2800);
};

/* ── Actions ── */
const openView = (r) => { selectedId.value = r.id; panelMode.value = 'view'; };

const openCreate = () => {
  selectedId.value = null;
  panelMode.value  = 'create';
  form.value       = emptyForm();
  errors.agent = ''; errors.amount = ''; errors.method = '';
};

const closePanel = () => { selectedId.value = null; panelMode.value = 'view'; };

const confirmReceipt = (r) => {
  const found = receipts.value.find(x => x.id === r.id);
  if (found) { found.status = 'confirmed'; showToast(`Phiếu ${found.code} đã xác nhận thu tiền`); }
};

const askDelete     = (r) => { deleteTarget.value = r; };
const confirmDelete = () => {
  const code = deleteTarget.value.code;
  receipts.value = receipts.value.filter(r => r.id !== deleteTarget.value.id);
  if (selectedId.value === deleteTarget.value.id) closePanel();
  deleteTarget.value = null;
  showToast(`Đã xóa phiếu ${code}`, 'danger');
};

const submitCreate = () => {
  errors.agent = ''; errors.amount = ''; errors.method = '';
  if (!form.value.agentId) { errors.agent = 'Vui lòng chọn đại lý'; return; }
  const agnt = getAgent(Number(form.value.agentId));
  const amt  = Number(form.value.amount);
  if (!amt || amt <= 0) { errors.amount = 'Vui lòng nhập số tiền hợp lệ'; return; }
  if (agnt && amt * 1_000_000 > agnt.debt) { errors.amount = `Số tiền vượt quá nợ hiện tại (${fmtMoney(agnt.debt)})`; return; }
  if (!form.value.method) { errors.method = 'Vui lòng chọn phương thức thanh toán'; return; }

  const newId = Math.max(...receipts.value.map(r => r.id)) + 1;
  const d = new Date(form.value.date);
  const code = `PT-2026-${String(newId).padStart(3, '0')}`;
  receipts.value.unshift({
    id: newId, code,
    date: d.toLocaleDateString('vi-VN'),
    rawDate: form.value.date,
    agent: agnt?.name ?? '',
    agentId: Number(form.value.agentId),
    amount: amt,
    method: form.value.method,
    collector: form.value.collector || 'Nguyễn Admin',
    note: form.value.note,
    status: 'pending',
  });
  showToast(`Đã lập phiếu thu ${code}`);
  closePanel();
};

const exportCSV = () => {
  const cols = ['Mã phiếu', 'Ngày thu', 'Đại lý', 'Số tiền thu (Tr)', 'Phương thức', 'Người thu', 'Trạng thái', 'Ghi chú'];
  const rows = sortedList.value.map(r => [r.code, r.date, r.agent, r.amount, r.method, r.collector, STATUS[r.status], r.note]);
  const csv = [cols, ...rows].map(row => row.map(v => `"${v ?? ''}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `thu-tien-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* ══ TOKENS ══ */
.tt {
  --c-primary:    #059669; --c-primary-d: #047857;
  --c-success:    #059669; --c-success-bg:#f0fdf4;
  --c-danger:     #EF4444; --c-danger-bg: #FEF2F2;
  --c-info:       #047857;
  --c-surface:    #ffffff; --c-bg:        #f8fafc;
  --c-border:     rgba(15,23,42,.07); --c-border-s: rgba(15,23,42,.04);
  --c-txt:        #0f172a; --c-txt-2:     #475569; --c-txt-3: #94a3b8;
  --r-card: 12px; --r-md: 8px; --r-sm: 6px; --r-pill: 999px;
  --sh-card:  0 1px 3px rgba(15,23,42,.05),0 1px 2px rgba(15,23,42,.04);
  --sh-hover: 0 4px 16px rgba(15,23,42,.08);
  --sh-modal: 0 20px 60px rgba(15,23,42,.18);
  --t: .15s ease;
  padding: 4px 0 32px;
  font-family: 'Inter','Be Vietnam Pro',ui-sans-serif,system-ui,sans-serif;
  color: var(--c-txt); font-size: 14px; line-height: 1.5;
}

/* ══ CONTEXT BANNER ══ */
.ctx-card {
  background: linear-gradient(120deg,#ffffff 0%,#f0fdf8 45%,#eef9ff 100%);
  border: 1px solid rgba(16,185,129,.14);
  border-radius: var(--r-card);
  box-shadow: 0 2px 16px rgba(5,150,105,.07),0 1px 3px rgba(15,23,42,.04);
  margin-bottom: 18px; overflow: hidden; position: relative;
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
.ctx-deco  { position:absolute; right:0; top:0; width:260px; height:100%; pointer-events:none; z-index:0; }
.ctx-wm    { position:absolute; right:300px; top:50%; transform:translateY(-50%); width:90px; height:90px; color:var(--c-primary); opacity:.08; pointer-events:none; }
.ctx-top   { display:flex; justify-content:space-between; align-items:center; padding:20px 26px 18px; gap:16px; position:relative; z-index:2; }
.ctx-title { font-size:22px; font-weight:800; margin:0; letter-spacing:-.6px; color:var(--c-txt); }
.ctx-sub   { font-size:12px; color:var(--c-txt-3); margin:4px 0 0; }
.ctx-actions { display:flex; gap:8px; align-items:center; flex-shrink:0; }
.ctx-divider { height:1px; background:rgba(16,185,129,.1); position:relative; z-index:2; }

.ctx-stats { display:flex; align-items:stretch; position:relative; z-index:2; }
.cs-col { flex:1; display:flex; flex-direction:column; gap:6px; padding:18px 26px; transition:background var(--t); }
.cs-col:hover { background:rgba(5,150,105,.04); }
.cs-warn { background:rgba(245,158,11,.04); }
.cs-warn:hover { background:rgba(245,158,11,.09); }
.cs-sep { width:1px; background:rgba(16,185,129,.12); flex-shrink:0; margin:12px 0; }
.cs-num { font-size:30px; font-weight:900; letter-spacing:-1.2px; color:var(--c-txt); line-height:1; display:flex; align-items:baseline; gap:7px; font-variant-numeric:tabular-nums; }
.cs-amber { color:#D97706; }
.cs-tag { font-size:10px; font-weight:700; padding:2px 7px; border-radius:var(--r-pill); background:#fffbeb; color:#B45309; border:1px solid rgba(245,158,11,.25); }
.cs-tag-green { background:var(--c-success-bg); color:#047857; border:1px solid rgba(16,185,129,.18); }
.cs-lbl { font-size:11px; color:var(--c-txt-3); font-weight:600; letter-spacing:.2px; }

/* ── Delta ── */
.cs-delta { font-size:10.5px; font-weight:600; margin-top:-3px; }
.cs-up    { color:#10b981; }
.cs-ok    { color:#10b981; }
.cs-down  { color:var(--c-danger); }

/* ── Sparkline ── */
.spark-wrap { display:flex; align-items:flex-end; gap:3px; height:28px; margin:4px 0 2px; }
.spark-bar  { flex:1; background:#e2e8f0; border-radius:3px 3px 0 0; min-height:3px; transition:height .4s; }
.spark-bar.spark-active { background:linear-gradient(180deg,#34d399,#059669); }

/* ── Donut ── */
.cs-pending-row { display:flex; align-items:center; gap:11px; }
.donut-wrap { flex-shrink:0; }
.donut-ring {
  width:46px; height:46px; border-radius:50%;
  -webkit-mask: radial-gradient(circle,transparent 52%,black 53%);
  mask: radial-gradient(circle,transparent 52%,black 53%);
}
.donut-legend { display:flex; align-items:center; flex-wrap:wrap; gap:3px; margin-top:5px; font-size:10px; color:var(--c-txt-3); font-weight:600; }
.dl-dot { width:7px; height:7px; border-radius:50%; display:inline-block; flex-shrink:0; }

/* ── Timeline ── */
.ctx-timeline { padding:10px 26px 14px; position:relative; z-index:2; }
.ctl-row  { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; }
.ctl-label { font-size:11px; font-weight:600; color:var(--c-txt-3); }
.ctl-pct   { font-size:11px; font-weight:700; color:var(--c-primary); }
.ctl-track { height:4px; background:rgba(155,114,245,.1); border-radius:99px; overflow:hidden; }
.ctl-fill  { height:100%; background:linear-gradient(90deg,#dcfce7,#059669); border-radius:99px; transition:width .8s ease; }

/* ══ MAIN LAYOUT ══ */
.dl-flex   { display:flex; gap:20px; align-items:flex-start; }
.list-card { flex:1 1 auto; min-width:0; }
.dl-card   { background:var(--c-surface); border-radius:var(--r-card); border:1px solid var(--c-border); box-shadow:var(--sh-card); overflow:hidden; }

/* ══ LIST CARD ══ */
.lc-hd { padding:16px 20px 14px; border-bottom:1px solid var(--c-border); display:flex; flex-direction:column; gap:10px; }
.lc-title-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.lc-title { font-size:15px; font-weight:700; margin:0; }
.count-badge { background:var(--c-success-bg); color:var(--c-primary); font-size:11px; font-weight:700; padding:2px 8px; border-radius:var(--r-pill); border:1px solid rgba(155,114,245,.15); }
.clear-btn { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; color:var(--c-danger); background:var(--c-danger-bg); border:1px solid rgba(239,68,68,.15); border-radius:var(--r-pill); padding:2px 8px; cursor:pointer; }
.lc-tools  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.search-wrap { position:relative; flex:1; min-width:160px; }
.search-ic   { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--c-txt-3); pointer-events:none; }
.search-inp  { width:100%; padding:7px 10px 7px 32px; border:1px solid var(--c-border); border-radius:var(--r-md); font-size:13px; color:var(--c-txt); background:var(--c-bg); outline:none; box-sizing:border-box; transition:border-color var(--t); }
.search-inp:focus { border-color:var(--c-primary); background:#fff; }
.psel { border:1px solid var(--c-border); border-radius:var(--r-sm); padding:7px 10px; font-size:12px; font-weight:500; color:var(--c-txt-2); background:var(--c-bg); outline:none; cursor:pointer; }

/* ── Status tabs ── */
.stab-group { display:flex; background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md); padding:3px; gap:2px; margin-left:auto; flex-shrink:0; }
.stab { padding:4px 10px; border:none; border-radius:var(--r-sm); font-size:11px; font-weight:700; cursor:pointer; background:transparent; color:var(--c-txt-3); transition:all var(--t); font-family:inherit; display:inline-flex; align-items:center; gap:4px; white-space:nowrap; }
.stab:hover { background:#fff; color:var(--c-txt-2); }
.stab.active { background:#fff; color:var(--c-txt); box-shadow:0 1px 3px rgba(15,23,42,.08); }
.stab-green.active { background:var(--c-success-bg); color:#047857; }
.stab-warn.active   { background:#fef3c7; color:#b45309; }
.stab-n { font-size:10px; background:rgba(15,23,42,.06); padding:0 5px; border-radius:3px; line-height:1.6; }

/* ══ TABLE ══ */
.table-wrap { overflow-x:auto; }
.dl-table { width:100%; border-collapse:collapse; font-size:13px; table-layout:fixed; }
.dl-table thead tr { background:var(--c-bg); border-bottom:1px solid var(--c-border); }
.dl-table th { padding:10px 14px; text-align:left; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--c-txt-3); white-space:nowrap; overflow:hidden; }
.dl-table td { padding:11px 14px; border-bottom:1px solid var(--c-border-s); vertical-align:middle; }
.sort-hd-r { display:flex !important; justify-content:flex-end; }
.tt-row { cursor:pointer; transition:background var(--t); }
.tt-row:hover { background:rgba(15,23,42,.02); }
.tt-row.selected { background:var(--c-success-bg); }
.tt-row:last-child td { border-bottom:none; }
.sort-hd { display:inline-flex; align-items:center; gap:4px; cursor:pointer; user-select:none; }
.sort-arrow { display:inline-flex; align-items:center; }
.text-right  { text-align:right; }
.text-center { text-align:center; }
.col-mono { font-variant-numeric:tabular-nums; font-size:12px; }
.muted    { color:var(--c-txt-3); }

.tt-code { font-size:12px; font-weight:700; color:var(--c-primary); background:var(--c-success-bg); padding:3px 8px; border-radius:6px; font-variant-numeric:tabular-nums; }
.agent-cell { display:flex; align-items:center; gap:9px; min-width:0; }
.agent-info { min-width:0; flex:1; }
.agent-av   {
  position: relative; width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12); box-shadow: 0 1px 4px rgba(0,0,0,.15);
  overflow: hidden; background: white;
}
.av-logo { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center; padding:5px; box-sizing:border-box; z-index:2; background:white; display:block; }
.av-init { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:white; letter-spacing:-.3px; }
.agent-name { display:block; font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.agent-debt { display:block; font-size:10.5px; font-weight:600; margin-top:1px; }
.debt-ok   { color:#10b981; }
.debt-warn { color:#f59e0b; }
.debt-over { color:var(--c-danger); }

.method-badge { font-size:11px; font-weight:600; color:var(--c-txt-2); background:var(--c-bg); border:1px solid var(--c-border); padding:2px 8px; border-radius:var(--r-pill); white-space:nowrap; }
.total-num { font-weight:700; font-size:13px; font-variant-numeric:tabular-nums; }

.status-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:var(--r-pill); font-size:11px; font-weight:700; white-space:nowrap; }
.status-badge.confirmed { background:var(--c-success-bg); color:#047857; border:1px solid rgba(155,114,245,.2); }
.status-badge.pending   { background:#fef3c7; color:#92400e; border:1px solid rgba(245,158,11,.2); }

.col-actions { text-align:center; white-space:nowrap; }
.act-btn  { width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border:none; border-radius:var(--r-sm); cursor:pointer; transition:background var(--t); }
.view-btn { background:rgba(155,114,245,.08); color:var(--c-primary); }
.view-btn:hover { background:rgba(155,114,245,.18); }
.ok-btn   { background:rgba(16,185,129,.1); color:#059669; }
.ok-btn:hover { background:rgba(16,185,129,.2); }
.del-btn  { background:rgba(239,68,68,.08); color:var(--c-danger); }
.del-btn:hover { background:rgba(239,68,68,.18); }
.del-btn:disabled { opacity:.3; cursor:not-allowed; }

.empty-row { text-align:center; padding:40px 0; color:var(--c-txt-3); }
.empty-ic  { margin:0 auto 8px; display:block; opacity:.35; }
.lc-foot   { padding:10px 20px; font-size:11px; color:var(--c-txt-3); border-top:1px solid var(--c-border-s); }

/* ══ SIDE PANEL ══ */
.side-panel { display:flex; flex-direction:column; width:360px; flex-shrink:0; max-height:calc(100vh - 200px); position:sticky; top:16px; overflow:hidden; }

.ap-hd { padding:18px 18px 14px; border-bottom:1px solid var(--c-border); display:flex; align-items:flex-start; gap:12px; }
.ap-avatar {
  position: relative; width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.12); box-shadow: 0 2px 6px rgba(0,0,0,.15);
  overflow: hidden; background: white;
}
.ap-title-block { flex:1; min-width:0; }
.ap-name   { font-size:15px; font-weight:700; margin:0 0 5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ap-badges { display:flex; gap:5px; flex-wrap:wrap; }
.dist-chip { font-size:10px; font-weight:600; color:var(--c-txt-3); background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-pill); padding:3px 8px; }

/* Gauge section */
.gauge-section { padding:14px 18px; border-bottom:1px solid var(--c-border); display:flex; flex-direction:column; gap:10px; overflow-y:auto; flex:1; }

/* Amount display */
.amt-display { text-align:center; padding:16px; background:var(--c-success-bg); border-radius:var(--r-md); border:1px solid rgba(155,114,245,.1); }
.amt-label { font-size:10px; font-weight:700; color:var(--c-txt-3); text-transform:uppercase; letter-spacing:.5px; display:block; margin-bottom:6px; }
.amt-value { font-size:32px; font-weight:900; color:var(--c-primary); letter-spacing:-1.5px; font-variant-numeric:tabular-nums; line-height:1; }
.amt-sub   { font-size:11px; color:#8b5cf6; font-weight:600; margin-top:4px; }

/* Debt section in panel */
.debt-section { display:flex; flex-direction:column; gap:5px; padding:10px 12px; background:var(--c-bg); border-radius:var(--r-md); border:1px solid var(--c-border); }
.debt-hd { display:flex; justify-content:space-between; align-items:center; }
.debt-lbl { font-size:11px; color:var(--c-txt-3); font-weight:600; text-transform:uppercase; letter-spacing:.3px; }
.debt-val { font-size:12px; font-weight:700; font-variant-numeric:tabular-nums; }
.debt-bar-wrap { display:flex; align-items:center; gap:8px; }
.debt-bar { flex:1; height:5px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.debt-fill { height:100%; border-radius:3px; transition:width .5s; }
.debt-pct-lbl { font-size:10px; font-weight:700; white-space:nowrap; }

.debt-status-bar { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; padding:7px 12px; border-radius:var(--r-md); }
.debt-status-bar.confirmed { background:var(--c-success-bg); color:#047857; }
.debt-status-bar.pending   { background:#fef3c7; color:#92400e; }

/* Info grid */
.info-grid { padding:14px 18px; border-bottom:1px solid var(--c-border); display:flex; flex-direction:column; gap:9px; }
.ig-row { display:flex; align-items:flex-start; gap:8px; font-size:12px; }
.ig-ic  { color:var(--c-txt-3); flex-shrink:0; margin-top:1px; }
.ig-lbl { color:var(--c-txt-3); width:72px; flex-shrink:0; }
.ig-val { color:var(--c-txt-2); font-weight:500; flex:1; min-width:0; }

/* Quick actions */
.quick-links  { padding:14px 18px; display:flex; gap:8px; border-bottom:1px solid var(--c-border); }
.btn-danger-o { display:inline-flex; align-items:center; gap:6px; padding:9px 14px; border-radius:var(--r-md); border:1.5px solid rgba(239,68,68,.25); background:#fef2f2; color:#dc2626; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; transition:all var(--t); }
.btn-danger-o:hover { background:#fee2e2; }
.status-note  { display:flex; align-items:center; gap:7px; padding:12px 18px; font-size:12.5px; font-weight:600; color:var(--c-primary); }

/* ══ FORM ══ */
.fc-hd { padding:16px 18px; border-bottom:1px solid var(--c-border); display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
.fc-title { font-size:15px; font-weight:700; margin:0; }
.fc-sub   { font-size:11px; color:var(--c-txt-3); display:block; margin-top:2px; }
.mode-chip { font-size:10px; font-weight:700; padding:3px 9px; border-radius:var(--r-pill); flex-shrink:0; }
.mode-chip.add { background:var(--c-success-bg); color:#047857; border:1px solid rgba(155,114,245,.2); }

.fc-body { flex:1; padding:16px 18px; display:flex; flex-direction:column; gap:13px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#e2e8f0 transparent; }
.field     { display:flex; flex-direction:column; gap:5px; flex:1; min-width:0; }
.field.full { width:100%; }
.field-row  { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.flabel { font-size:11px; font-weight:700; color:var(--c-txt-2); }
.req    { color:var(--c-danger); }

.finp {
  padding:8px 11px; border:1px solid var(--c-border); border-radius:var(--r-md);
  font-size:13px; color:var(--c-txt); background:var(--c-bg);
  outline:none; width:100%; box-sizing:border-box;
  transition:border-color var(--t),box-shadow var(--t); font-family:inherit;
}
.finp:focus { border-color:var(--c-primary); box-shadow:0 0 0 3px rgba(155,114,245,.08); background:#fff; }
.finp.finp-err { border-color:var(--c-danger); }
.finp.ftarea { resize:none; }
.err-msg { font-size:11px; color:var(--c-danger); }

/* Debt hint in form */
.debt-hint { background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md); padding:10px 12px; display:flex; flex-direction:column; gap:6px; }
.dh-row { display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--c-txt-3); font-weight:600; }
.dh-bar { height:5px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.dh-fill { height:100%; border-radius:3px; transition:width .4s; }
.dh-warn { font-size:10.5px; font-weight:700; color:#b45309; }

/* Amount hint bar */
.amt-hint { display:flex; flex-direction:column; gap:5px; margin-top:4px; }
.amt-hint-bar { height:4px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.amt-hint-fill { height:100%; background:linear-gradient(90deg,#dcfce7,#059669); border-radius:3px; transition:width .3s; }
.amt-hint-txt { font-size:10.5px; color:var(--c-primary); font-weight:600; }

.fc-footer { padding:14px 18px; border-top:1px solid var(--c-border); display:flex; justify-content:space-between; align-items:center; gap:8px; }

/* ══ BUTTONS ══ */
.btn-p {
  background:var(--c-primary); color:#fff; border:none; border-radius:var(--r-md);
  padding:9px 16px; font-size:13px; font-weight:600; cursor:pointer;
  transition:background var(--t),transform var(--t); font-family:inherit;
  display:inline-flex; align-items:center; gap:6px;
}
.btn-p:hover { background:var(--c-primary-d); transform:translateY(-1px); }
.btn-o {
  background:transparent; color:var(--c-primary); border:1.5px solid rgba(155,114,245,.3);
  border-radius:var(--r-md); padding:9px 16px; font-size:13px; font-weight:600;
  cursor:pointer; transition:all var(--t); font-family:inherit;
}
.btn-o:hover { background:var(--c-success-bg); }
.btn-ghost {
  background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md);
  padding:8px 14px; font-size:12px; font-weight:600; color:var(--c-txt-2);
  cursor:pointer; transition:all var(--t); display:flex; align-items:center; gap:5px; font-family:inherit;
}
.btn-ghost:hover { background:#fff; box-shadow:var(--sh-card); }
.btn-danger { background:var(--c-danger); color:#fff; border:none; border-radius:var(--r-md); padding:9px 16px; font-size:13px; font-weight:600; cursor:pointer; transition:background var(--t); font-family:inherit; }
.btn-danger:hover { background:#dc2626; }
.btn-csv {
  background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md);
  padding:8px 14px; font-size:12px; font-weight:600; color:var(--c-txt-2);
  cursor:pointer; transition:all var(--t); display:inline-flex; align-items:center; gap:5px; font-family:inherit;
}
.btn-csv:hover { background:#fff; box-shadow:var(--sh-card); }

/* ══ TOAST ══ */
.toast-snack {
  position:fixed; bottom:28px; right:28px; z-index:500;
  display:inline-flex; align-items:center; gap:9px;
  padding:11px 18px; border-radius:12px;
  font-size:13px; font-weight:600; font-family:inherit;
  box-shadow:0 8px 32px rgba(15,23,42,.2),0 2px 8px rgba(15,23,42,.1);
  min-width:240px;
}
.toast-snack.success { background:var(--c-success-bg); color:#047857; border:1px solid rgba(155,114,245,.2); }
.toast-snack.danger  { background:#fef2f2; color:#991b1b; border:1px solid rgba(239,68,68,.2); }
.toast-snack.warn    { background:#fffbeb; color:#92400e; border:1px solid rgba(245,158,11,.2); }
.toast-enter-active { animation:toastIn .25s cubic-bezier(.2,.8,.2,1); }
.toast-leave-active { animation:toastIn .2s cubic-bezier(.2,.8,.2,1) reverse; }
@keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }

/* ══ MODAL ══ */
.modal-bg {
  --c-primary:#059669; --c-success-bg:#ECFDF5;
  --c-danger:#EF4444; --c-danger-bg:#FEF2F2;
  --c-surface:#ffffff; --c-border:rgba(15,23,42,.07);
  --c-txt:#0f172a; --c-txt-2:#475569;
  --r-md:8px; --t:.15s ease;
  position:fixed; inset:0; z-index:200;
  background:rgba(15,23,42,.5); backdrop-filter:blur(3px);
  display:flex; align-items:center; justify-content:center; padding:20px;
  font-family:'Inter','Be Vietnam Pro',ui-sans-serif,system-ui,sans-serif;
}
.modal-box {
  width:min(420px,100%);
  background:linear-gradient(170deg,#fff5f5 0%,#fffafa 45%,#ffffff 100%);
  border-radius:20px; border:1px solid rgba(239,68,68,.13);
  box-shadow:0 8px 40px rgba(239,68,68,.1),0 2px 14px rgba(15,23,42,.08);
  padding:32px 28px 24px;
  display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px;
}
.del-avatar-wrap { position:relative; margin-bottom:4px; }
.del-agent-avatar {
  width:72px; height:72px; border-radius:18px;
  position:relative; overflow:hidden;
  box-shadow:0 4px 18px rgba(15,23,42,.14);
}
.del-avatar-img {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:contain; padding:10px; box-sizing:border-box; z-index:2; background:white; display:block;
}
.del-avatar-abbr {
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  color:#fff; font-size:18px; font-weight:800; letter-spacing:-.5px; z-index:0;
}
.del-trash-badge {
  position:absolute; bottom:-7px; right:-7px;
  width:28px; height:28px; border-radius:50%;
  background:#fee2e2; border:2.5px solid #fff;
  color:#ef4444;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 2px 6px rgba(239,68,68,.2);
}
.modal-title  { font-size:17px; font-weight:700; margin:0; color:#0f172a; }
.modal-desc   { font-size:13px; color:#475569; margin:0; line-height:1.6; }
.modal-actions { display:flex; gap:10px; margin-top:8px; }
.modal-actions .btn-o {
  background:transparent; color:#059669; border:1.5px solid rgba(5,150,105,.3);
  border-radius:8px; padding:9px 20px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;
}
.modal-actions .btn-o:hover { background:#ecfdf5; }
.modal-actions .btn-danger {
  background:#EF4444; color:#fff; border:none;
  border-radius:8px; padding:9px 20px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;
}
.modal-actions .btn-danger:hover { background:#dc2626; }

/* ── Panel slide ── */
.panel-enter-active { animation:panelIn .22s cubic-bezier(.4,0,.2,1); }
.panel-leave-active { animation:panelOut .18s cubic-bezier(.4,0,.2,1); }
@keyframes panelIn  { from { opacity:0; transform:translateX(18px); } to { opacity:1; transform:translateX(0); } }
@keyframes panelOut { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(18px); } }

/* ══ RESPONSIVE ══ */
@media (max-width:1100px) { .dl-flex { flex-direction:column; } .side-panel { width:100%; max-height:none; position:static; } }
@media (max-width:700px)  { .field-row { grid-template-columns:1fr; } .lc-tools { flex-direction:column; align-items:stretch; } }
</style>
