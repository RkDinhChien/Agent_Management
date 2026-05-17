<template>
  <div class="dl">

    <!-- ══ Context banner (title + stats in one card) ══ -->
    <div class="ctx-card">

      <!-- hexagon grid decoration — right side -->
      <svg class="ctx-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <!-- base hex outline — r=24, pointy-top -->
          <polygon id="hx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
          <filter id="hglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- === base grid: stroke only, low opacity === -->
        <g stroke="#059669" stroke-width=".9" opacity=".13">
          <!-- row 0  y=24 -->
          <use href="#hx" transform="translate(21,24)"/>
          <use href="#hx" transform="translate(62,24)"/>
          <use href="#hx" transform="translate(103,24)"/>
          <use href="#hx" transform="translate(144,24)"/>
          <use href="#hx" transform="translate(185,24)"/>
          <use href="#hx" transform="translate(226,24)"/>
          <use href="#hx" transform="translate(267,24)"/>
          <!-- row 1  y=60 (offset) -->
          <use href="#hx" transform="translate(0,60)"/>
          <use href="#hx" transform="translate(41,60)"/>
          <use href="#hx" transform="translate(82,60)"/>
          <use href="#hx" transform="translate(123,60)"/>
          <use href="#hx" transform="translate(164,60)"/>
          <use href="#hx" transform="translate(205,60)"/>
          <use href="#hx" transform="translate(246,60)"/>
          <use href="#hx" transform="translate(287,60)"/>
          <!-- row 2  y=96 -->
          <use href="#hx" transform="translate(21,96)"/>
          <use href="#hx" transform="translate(62,96)"/>
          <use href="#hx" transform="translate(103,96)"/>
          <use href="#hx" transform="translate(144,96)"/>
          <use href="#hx" transform="translate(185,96)"/>
          <use href="#hx" transform="translate(226,96)"/>
          <use href="#hx" transform="translate(267,96)"/>
          <!-- row 3  y=132 (offset) -->
          <use href="#hx" transform="translate(0,132)"/>
          <use href="#hx" transform="translate(41,132)"/>
          <use href="#hx" transform="translate(82,132)"/>
          <use href="#hx" transform="translate(123,132)"/>
          <use href="#hx" transform="translate(164,132)"/>
          <use href="#hx" transform="translate(205,132)"/>
          <use href="#hx" transform="translate(246,132)"/>
          <use href="#hx" transform="translate(287,132)"/>
        </g>

        <!-- === accented hexagons — slightly more visible === -->
        <g stroke="#059669" stroke-width="1.2" opacity=".28">
          <use href="#hx" transform="translate(144,60)"/>
          <use href="#hx" transform="translate(185,24)"/>
          <use href="#hx" transform="translate(226,96)"/>
        </g>

        <!-- === filled hexagons — subtle colored fill === -->
        <polygon points="144,36 164.8,48 164.8,72 144,84 123.2,72 123.2,48"
                 fill="#059669" opacity=".07"/>
        <polygon points="185,0 205.8,12 205.8,36 185,48 164.2,36 164.2,12"
                 fill="#3B82F6" opacity=".06"/>
        <polygon points="226,72 246.8,84 246.8,108 226,120 205.2,108 205.2,84"
                 fill="#059669" opacity=".06"/>

        <!-- === center dot on each accented hex === -->
        <g fill="#059669" filter="url(#hglow)" opacity=".55">
          <circle cx="144" cy="60" r="3.5"/>
          <circle cx="185" cy="24" r="3"/>
          <circle cx="226" cy="96" r="3"/>
        </g>

        <!-- === connector lines between accent hexes === -->
        <g stroke="#059669" stroke-width=".8" stroke-dasharray="3 4" opacity=".2">
          <line x1="144" y1="60" x2="185" y2="24"/>
          <line x1="144" y1="60" x2="226" y2="96"/>
        </g>

        <!-- === small floating dots === -->
        <g fill="#3B82F6" opacity=".35">
          <circle cx="62"  cy="24"  r="2"/>
          <circle cx="267" cy="60"  r="2"/>
          <circle cx="103" cy="132" r="2"/>
        </g>
        <g fill="#059669" opacity=".3">
          <circle cx="21"  cy="96"  r="1.5"/>
          <circle cx="287" cy="132" r="1.5"/>
        </g>
      </svg>

      <div class="ctx-top">
        <div>
          <h1 class="ctx-title">Đại lý</h1>
          <p class="ctx-sub">Quản lý thông tin và công nợ các đại lý phân phối</p>
        </div>
        <div class="ctx-actions">
          <button class="btn-csv" @click="exportCSV"><Download :size="13"/> Xuất CSV</button>
          <button class="btn-p" @click="startAdd"><Plus :size="14"/> Thêm đại lý</button>
        </div>
      </div>

      <div class="ctx-divider"></div>

      <div class="ctx-stats">
        <div class="cs-col">
          <strong class="cs-num">{{ agents.length }}</strong>
          <span class="cs-lbl">Tổng đại lý</span>
        </div>
        <div class="cs-sep"></div>
        <div class="cs-col cs-warn">
          <strong class="cs-num cs-red">
            {{ overLimitCount }}
            <span class="cs-tag" v-if="overLimitCount > 0">cần xử lý</span>
          </strong>
          <span class="cs-lbl">Vượt hạn mức nợ</span>
        </div>
        <div class="cs-sep"></div>
        <div class="cs-col">
          <strong class="cs-num">{{ fmtMoneyShort(totalDebt) }}</strong>
          <span class="cs-lbl">Tổng công nợ</span>
        </div>
        <div class="cs-sep"></div>
        <div class="cs-col">
          <strong class="cs-num">
            {{ newThisMonth }}
            <span class="cs-tag cs-tag-green" v-if="newThisMonth > 0">tháng này</span>
          </strong>
          <span class="cs-lbl">Mới tiếp nhận</span>
        </div>
      </div>
    </div>

    <!-- ══ Main layout ══ -->
    <div class="dl-flex">

      <!-- ════ LEFT — List ════ -->
      <div class="dl-card list-card">

        <!-- toolbar -->
        <div class="lc-hd">
          <div class="lc-title-row">
            <h3 class="lc-title">Danh sách đại lý</h3>
            <span class="count-badge">{{ filteredAgents.length }} / {{ agents.length }}</span>
            <button v-if="hasActiveFilter" class="clear-btn" @click="clearFilters" title="Xóa bộ lọc">
              <X :size="11"/> Xóa lọc
            </button>
          </div>
          <div class="lc-tools">
            <div class="search-wrap">
              <Search :size="14" class="search-ic"/>
              <input v-model="searchQ" class="search-inp" placeholder="Tìm tên, SĐT, email…"/>
            </div>
            <select v-model="filterQuan" class="psel">
              <option value="">Tất cả quận</option>
              <option v-for="q in quanOptions" :key="q.id" :value="q.id">{{ q.ten }}</option>
            </select>
            <select v-model="filterLoai" class="psel">
              <option value="">Tất cả loại</option>
              <option v-for="l in loaiOptions" :key="l.id" :value="l.id">{{ l.ten }}</option>
            </select>
          </div>
        </div>

        <!-- table -->
        <div class="table-wrap">
          <table class="dl-table">
            <thead>
              <tr>
                <th style="width:44px">
                  <span class="sort-hd" @click="toggleSort('MaDaiLy')">
                    Mã <SortIcon field="MaDaiLy" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th>
                  <span class="sort-hd" @click="toggleSort('TenDaiLy')">
                    Tên đại lý <SortIcon field="TenDaiLy" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th style="width:72px">Loại</th>
                <th style="width:100px">
                  <span class="sort-hd" @click="toggleSort('MaQuan')">
                    Quận <SortIcon field="MaQuan" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th style="width:110px">SĐT</th>
                <th style="width:108px">
                  <span class="sort-hd" @click="toggleSort('NgayTiepNhan')">
                    Ngày tiếp nhận <SortIcon field="NgayTiepNhan" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th style="width:130px" class="text-right">
                  <span class="sort-hd" @click="toggleSort('TongNo')">
                    Tổng nợ <SortIcon field="TongNo" :sortKey="sortKey" :sortDir="sortDir"/>
                  </span>
                </th>
                <th style="width:72px" class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="a in sortedAgents"
                :key="a.MaDaiLy"
                class="agent-row"
                :class="{ selected: selectedId === a.MaDaiLy }"
                @click="viewAgent(a)"
              >
                <td class="col-mono muted">#{{ a.MaDaiLy }}</td>
                <td class="col-name">
                  <span class="a-name">{{ a.TenDaiLy }}</span>
                  <span class="a-email">{{ a.Email }}</span>
                </td>
                <td>
                  <span class="loai-chip" :class="a.MaLoaiDaiLy === 1 ? 'l1' : 'l2'">
                    {{ loaiLabel(a.MaLoaiDaiLy) }}
                  </span>
                </td>
                <td class="muted">{{ quanLabel(a.MaQuan) }}</td>
                <td class="col-mono">{{ a.SDT }}</td>
                <td class="col-mono muted">{{ fmtDate(a.NgayTiepNhan) }}</td>
                <td class="col-debt-cell">
                  <span class="debt-num" :class="{ 'over': isOverLimit(a) }">{{ fmtMoney(a.TongNo) }}</span>
                  <div class="debt-bar">
                    <div class="debt-fill" :style="{ width: debtPct(a) + '%', background: debtColor(a) }"></div>
                  </div>
                </td>
                <td class="col-actions">
                  <button class="act-btn edit-btn" title="Sửa" @click.stop="editAgent(a)">
                    <Edit2 :size="13"/>
                  </button>
                  <button class="act-btn del-btn" title="Xóa" @click.stop="askDelete(a)">
                    <Trash2 :size="13"/>
                  </button>
                </td>
              </tr>
              <tr v-if="sortedAgents.length === 0">
                <td colspan="8" class="empty-row">
                  <SearchX :size="28" class="empty-ic"/>
                  <p>Không tìm thấy đại lý phù hợp</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- footer: row count -->
        <div class="lc-foot" v-if="sortedAgents.length > 0">
          Hiển thị {{ sortedAgents.length }} đại lý
          <span v-if="hasActiveFilter"> (đã lọc từ {{ agents.length }})</span>
        </div>
      </div>

      <!-- ════ RIGHT — Side panel ════ -->
      <Transition name="panel">
      <div class="dl-card side-panel" v-if="panelVisible">

        <!-- ── VIEW mode: agent detail ── -->
        <template v-if="panelMode === 'view' && selectedAgent">
          <div class="ap-hd">
            <div class="ap-avatar">{{ selectedAgent.TenDaiLy.charAt(0) }}</div>
            <div class="ap-title-block">
              <h3 class="ap-name">{{ selectedAgent.TenDaiLy }}</h3>
              <div class="ap-badges">
                <span class="loai-chip" :class="selectedAgent.MaLoaiDaiLy === 1 ? 'l1' : 'l2'">
                  {{ loaiLabel(selectedAgent.MaLoaiDaiLy) }}
                </span>
                <span class="dist-chip">{{ quanLabel(selectedAgent.MaQuan) }}</span>
              </div>
            </div>
            <button class="act-btn edit-btn ap-edit-btn" @click="editAgent(selectedAgent)" title="Sửa">
              <Edit2 :size="14"/>
            </button>
          </div>

          <!-- Debt gauge -->
          <div class="gauge-section">
            <div class="gauge-wrap">
              <svg class="gauge-svg" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" stroke-width="7"/>
                <circle
                  cx="36" cy="36" r="28" fill="none"
                  :stroke="debtColor(selectedAgent)"
                  stroke-width="7"
                  stroke-linecap="round"
                  :stroke-dasharray="175.9"
                  :stroke-dashoffset="175.9 * (1 - debtPct(selectedAgent) / 100)"
                  transform="rotate(-90 36 36)"
                  style="transition: stroke-dashoffset .5s ease, stroke .3s ease"
                />
                <text x="36" y="33" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a">
                  {{ Math.round(debtPct(selectedAgent)) }}%
                </text>
                <text x="36" y="45" text-anchor="middle" font-size="7.5" fill="#94a3b8">Nợ</text>
              </svg>
              <div class="gauge-info">
                <div class="gi-row">
                  <span class="gi-lbl">Tổng nợ</span>
                  <strong :class="{ red: isOverLimit(selectedAgent) }">{{ fmtMoney(selectedAgent.TongNo) }}</strong>
                </div>
                <div class="gi-row">
                  <span class="gi-lbl">Hạn mức</span>
                  <strong>{{ fmtMoney(agentLimit(selectedAgent)) }}</strong>
                </div>
                <div class="gi-row">
                  <span class="gi-lbl">Còn lại</span>
                  <strong :class="isOverLimit(selectedAgent) ? 'red' : 'green'">
                    {{ isOverLimit(selectedAgent) ? '−' : '' }}{{ fmtMoney(Math.abs(agentLimit(selectedAgent) - selectedAgent.TongNo)) }}
                  </strong>
                </div>
              </div>
            </div>
            <div class="debt-status-bar" :class="debtStatusClass(selectedAgent)">
              <AlertCircle v-if="isOverLimit(selectedAgent)" :size="12"/>
              <CheckCircle2 v-else :size="12"/>
              {{ debtStatusText(selectedAgent) }}
            </div>
          </div>

          <!-- Info grid -->
          <div class="info-grid">
            <div class="ig-row">
              <Phone :size="13" class="ig-ic"/>
              <span class="ig-lbl">SĐT</span>
              <span class="ig-val">{{ selectedAgent.SDT || '—' }}</span>
            </div>
            <div class="ig-row">
              <Mail :size="13" class="ig-ic"/>
              <span class="ig-lbl">Email</span>
              <span class="ig-val ellipsis">{{ selectedAgent.Email || '—' }}</span>
            </div>
            <div class="ig-row">
              <MapPin :size="13" class="ig-ic"/>
              <span class="ig-lbl">Địa chỉ</span>
              <span class="ig-val">{{ selectedAgent.DiaChi || '—' }}</span>
            </div>
            <div class="ig-row">
              <Calendar :size="13" class="ig-ic"/>
              <span class="ig-lbl">Tiếp nhận</span>
              <span class="ig-val">{{ fmtDate(selectedAgent.NgayTiepNhan) }}</span>
            </div>
            <div class="ig-row">
              <Hash :size="13" class="ig-ic"/>
              <span class="ig-lbl">Mã đại lý</span>
              <span class="ig-val col-mono">#{{ selectedAgent.MaDaiLy }}</span>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="quick-links">
            <button class="ql-btn" @click="$router.push('/phieu-xuat')">
              <PackageMinus :size="14"/>
              <span>Lập phiếu xuất</span>
              <ChevronRight :size="12" class="ql-arrow"/>
            </button>
            <button class="ql-btn" @click="$router.push('/thu-tien')">
              <Wallet :size="14"/>
              <span>Thu tiền nợ</span>
              <ChevronRight :size="12" class="ql-arrow"/>
            </button>
          </div>

          <!-- Recent activity (mock) -->
          <div class="recent-section">
            <p class="recent-title">Hoạt động gần đây</p>
            <div class="recent-list">
              <div class="recent-row" v-for="tx in mockActivity(selectedAgent)" :key="tx.id">
                <div class="rec-dot" :style="{ background: tx.color }"></div>
                <div class="rec-body">
                  <span class="rec-lbl">{{ tx.label }}</span>
                  <span class="rec-date">{{ tx.date }}</span>
                </div>
                <span class="rec-amt" :class="tx.type">{{ tx.amt }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- ── ADD / EDIT form ── -->
        <template v-else>
          <div class="fc-hd">
            <div>
              <h3 class="fc-title">{{ panelMode === 'edit' ? 'Sửa thông tin' : 'Thêm đại lý' }}</h3>
              <span class="fc-sub">{{ panelMode === 'edit' ? selectedAgent?.TenDaiLy : 'Điền thông tin đại lý mới' }}</span>
            </div>
            <span class="mode-chip" :class="panelMode">{{ panelMode === 'edit' ? 'Sửa' : 'Mới' }}</span>
          </div>

          <div class="fc-body">
            <div class="field full">
              <label class="flabel">Tên đại lý <span class="req">*</span></label>
              <input v-model="form.TenDaiLy" class="finp" placeholder="Nhập tên đại lý" :class="{ 'finp-err': errors.TenDaiLy }"/>
              <span class="err-msg" v-if="errors.TenDaiLy">{{ errors.TenDaiLy }}</span>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Loại đại lý <span class="req">*</span></label>
                <select v-model="form.MaLoaiDaiLy" class="finp" :class="{ 'finp-err': errors.MaLoaiDaiLy }">
                  <option value="">Chọn loại</option>
                  <option v-for="l in loaiOptions" :key="l.id" :value="l.id">{{ l.ten }}</option>
                </select>
              </div>
              <div class="field">
                <label class="flabel">Quận <span class="req">*</span></label>
                <select v-model="form.MaQuan" class="finp" :class="{ 'finp-err': errors.MaQuan }">
                  <option value="">Chọn quận</option>
                  <option v-for="q in quanOptions" :key="q.id" :value="q.id">{{ q.ten }}</option>
                </select>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Số điện thoại</label>
                <input v-model="form.SDT" class="finp" placeholder="09xx xxx xxx" :class="{ 'finp-err': errors.SDT }"/>
                <span class="err-msg" v-if="errors.SDT">{{ errors.SDT }}</span>
              </div>
              <div class="field">
                <label class="flabel">Email</label>
                <input v-model="form.Email" class="finp" placeholder="email@example.com" :class="{ 'finp-err': errors.Email }"/>
                <span class="err-msg" v-if="errors.Email">{{ errors.Email }}</span>
              </div>
            </div>

            <div class="field full">
              <label class="flabel">Địa chỉ</label>
              <input v-model="form.DiaChi" class="finp" placeholder="Số nhà, tên đường, phường…"/>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="flabel">Ngày tiếp nhận <span class="req">*</span></label>
                <input v-model="form.NgayTiepNhan" type="date" class="finp" :max="today" :class="{ 'finp-err': errors.NgayTiepNhan }"/>
                <span class="err-msg" v-if="errors.NgayTiepNhan">{{ errors.NgayTiepNhan }}</span>
              </div>
              <div class="field" v-if="panelMode === 'edit'">
                <label class="flabel">Tổng nợ <span class="readonly-tag">Chỉ xem</span></label>
                <div class="finp finp-ro" :class="{ 'debt-over': isOverLimitForm }">
                  {{ fmtMoney(form.TongNo) }}
                </div>
              </div>
            </div>

            <div class="limit-row" v-if="form.MaLoaiDaiLy">
              <Info :size="11"/>
              Hạn mức nợ: <strong>{{ fmtMoney(currentLimit) }}</strong>
            </div>
          </div>

          <div class="fc-footer">
            <button class="btn-ghost" @click="cancelForm">
              <X :size="12"/> Hủy
            </button>
            <button class="btn-p" @click="submitForm">
              {{ panelMode === 'edit' ? 'Lưu thay đổi' : 'Thêm đại lý' }}
            </button>
          </div>
        </template>

      </div><!-- /side-panel -->
      </Transition>
    </div><!-- /dl-flex -->

    <!-- ══ Delete confirm modal ══ -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-bg" @click="deleteTarget = null">
        <div class="modal-box" @click.stop>
          <div class="del-icon-wrap"><Trash2 :size="24"/></div>
          <h4 class="modal-title">Xác nhận xóa đại lý</h4>
          <p class="modal-desc">
            Bạn có chắc muốn xóa <strong>{{ deleteTarget.TenDaiLy }}</strong>?<br/>
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
import { ref, computed } from 'vue';
import {
  Search, Edit2, Trash2, Plus, Download, X, Info,
  AlertCircle,
  Phone, Mail, MapPin, Calendar, Hash,
  PackageMinus, Wallet, ChevronRight,
  CheckCircle2, SearchX
} from 'lucide-vue-next';

/* ─── Sort icon helper component ─── */
const SortIcon = {
  props: ['field', 'sortKey', 'sortDir'],
  template: `<span class="sort-arrow">
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
      <path d="M4 0L7 3.5H1L4 0Z" :fill="sortKey===field && sortDir==='asc' ? '#059669' : '#cbd5e1'"/>
      <path d="M4 10L1 6.5H7L4 10Z" :fill="sortKey===field && sortDir==='desc' ? '#059669' : '#cbd5e1'"/>
    </svg>
  </span>`,
};

/* ─── Reference data ─── */
const loaiOptions = [
  { id: 1, ten: 'Loại 1', noToiDa: 10_000_000 },
  { id: 2, ten: 'Loại 2', noToiDa: 5_000_000 },
];
const quanOptions = [
  { id: 1, ten: 'Quận 1' },
  { id: 2, ten: 'Quận 3' },
  { id: 3, ten: 'Quận 5' },
  { id: 4, ten: 'Quận 10' },
  { id: 5, ten: 'Bình Thạnh' },
  { id: 6, ten: 'Gò Vấp' },
];

/* ─── Mock data ─── */
const agents = ref([
  { MaDaiLy: 1, TenDaiLy: 'Đại lý Tuấn Phát',   MaLoaiDaiLy: 1, MaQuan: 1, SDT: '0901234567', DiaChi: '12 Nguyễn Huệ, Q.1',              Email: 'tuanphat@gmail.com',   NgayTiepNhan: '2024-01-15', TongNo: 8_500_000 },
  { MaDaiLy: 2, TenDaiLy: 'Đại lý Lan Anh',      MaLoaiDaiLy: 2, MaQuan: 2, SDT: '0912345678', DiaChi: '45 Lê Lợi, Q.3',                  Email: 'lananh@gmail.com',     NgayTiepNhan: '2024-02-20', TongNo: 3_200_000 },
  { MaDaiLy: 3, TenDaiLy: 'Đại lý Quốc Khánh',  MaLoaiDaiLy: 1, MaQuan: 3, SDT: '0923456789', DiaChi: '78 Trần Hưng Đạo, Q.5',           Email: 'quockhanh@gmail.com',  NgayTiepNhan: '2024-03-10', TongNo: 6_700_000 },
  { MaDaiLy: 4, TenDaiLy: 'Đại lý Minh Châu',   MaLoaiDaiLy: 2, MaQuan: 4, SDT: '0934567890', DiaChi: '101 Nguyễn Trãi, Q.10',           Email: 'minhchau@gmail.com',   NgayTiepNhan: '2024-04-05', TongNo: 1_800_000 },
  { MaDaiLy: 5, TenDaiLy: 'Đại lý Hoa Phượng',  MaLoaiDaiLy: 1, MaQuan: 5, SDT: '0945678901', DiaChi: '23 Đinh Tiên Hoàng, Bình Thạnh',  Email: 'hoaphuong@gmail.com',  NgayTiepNhan: '2026-05-03', TongNo: 9_100_000 },
  { MaDaiLy: 6, TenDaiLy: 'Đại lý Thanh Bình',  MaLoaiDaiLy: 2, MaQuan: 6, SDT: '0956789012', DiaChi: '55 Phan Văn Trị, Gò Vấp',         Email: 'thanhbinh@gmail.com',  NgayTiepNhan: '2026-05-10', TongNo: 5_800_000 },
  { MaDaiLy: 7, TenDaiLy: 'Đại lý Phú Quý',     MaLoaiDaiLy: 1, MaQuan: 1, SDT: '0967890123', DiaChi: '9 Hai Bà Trưng, Q.1',             Email: 'phuquy@gmail.com',     NgayTiepNhan: '2024-07-22', TongNo: 2_300_000 },
  { MaDaiLy: 8, TenDaiLy: 'Đại lý Bảo Châu',    MaLoaiDaiLy: 2, MaQuan: 3, SDT: '0978901234', DiaChi: '33 Võ Văn Tần, Q.3',             Email: 'baochau@gmail.com',    NgayTiepNhan: '2024-09-15', TongNo: 4_900_000 },
]);

/* ─── Filter & sort state ─── */
const searchQ     = ref('');
const filterQuan  = ref('');
const filterLoai  = ref('');
const sortKey     = ref('MaDaiLy');
const sortDir     = ref('asc');

const hasActiveFilter = computed(() => searchQ.value || filterQuan.value || filterLoai.value);

const clearFilters = () => { searchQ.value = ''; filterQuan.value = ''; filterLoai.value = ''; };

const toggleSort = (key) => {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  else { sortKey.value = key; sortDir.value = 'asc'; }
};

/* ─── Panel state ─── */
const panelMode    = ref('view');   // 'view' | 'add' | 'edit'
const selectedId   = ref(null);
const selectedAgent = computed(() => agents.value.find(a => a.MaDaiLy === selectedId.value) ?? null);
const panelVisible  = computed(() => selectedAgent.value !== null || panelMode.value !== 'view');
const deleteTarget = ref(null);

/* ─── Form ─── */
const today = new Date().toISOString().split('T')[0];
const emptyForm = () => ({ TenDaiLy: '', MaLoaiDaiLy: '', MaQuan: '', SDT: '', DiaChi: '', Email: '', NgayTiepNhan: '', TongNo: 0 });
const form   = ref(emptyForm());
const errors = ref({});

/* ─── KPI ─── */
const overLimitCount = computed(() => agents.value.filter(a => isOverLimit(a)).length);
const totalDebt      = computed(() => agents.value.reduce((s, a) => s + a.TongNo, 0));
const newThisMonth   = computed(() => {
  const now = new Date();
  return agents.value.filter(a => {
    const d = new Date(a.NgayTiepNhan);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
});

/* ─── Helpers ─── */
const loaiLabel = (id) => loaiOptions.find(l => l.id === id)?.ten ?? '—';
const quanLabel = (id) => quanOptions.find(q => q.id === id)?.ten ?? '—';
const fmtDate   = (d)  => d ? new Date(d + 'T00:00:00').toLocaleDateString('vi-VN') : '—';
const fmtMoney  = (n)  => n != null ? n.toLocaleString('vi-VN') + ' ₫' : '—';
const fmtMoneyShort = (n) => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' Tỷ';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + ' Tr';
  return n.toLocaleString('vi-VN') + ' ₫';
};

const agentLimit = (a) => loaiOptions.find(l => l.id === a.MaLoaiDaiLy)?.noToiDa ?? 0;
const isOverLimit = (a) => a.TongNo > agentLimit(a);
const debtPct     = (a) => { const lim = agentLimit(a); return lim ? Math.min((a.TongNo / lim) * 100, 100) : 0; };
const debtColor   = (a) => { const p = debtPct(a); return p >= 100 ? '#EF4444' : p >= 80 ? '#F59E0B' : '#10B981'; };
const debtStatusClass = (a) => isOverLimit(a) ? 'status-over' : debtPct(a) >= 80 ? 'status-warn' : 'status-ok';
const debtStatusText  = (a) => isOverLimit(a) ? 'Vượt hạn mức nợ' : debtPct(a) >= 80 ? 'Gần đến hạn mức' : 'Trong hạn mức';

const currentLimit    = computed(() => loaiOptions.find(l => l.id === Number(form.value.MaLoaiDaiLy))?.noToiDa ?? 0);
const isOverLimitForm = computed(() => currentLimit.value > 0 && form.value.TongNo > currentLimit.value);

/* ─── Mock activity ─── */
const mockActivity = (a) => [
  { id: 1, label: 'Phiếu xuất hàng',  date: '12/05/2026', amt: '−2,4 Tr', type: 'neg', color: '#3B82F6' },
  { id: 2, label: 'Thu tiền nợ',      date: '08/05/2026', amt: '+1,0 Tr', type: 'pos', color: '#10B981' },
  { id: 3, label: 'Phiếu xuất hàng',  date: '01/05/2026', amt: '−3,8 Tr', type: 'neg', color: '#3B82F6' },
];

/* ─── Computed list ─── */
const filteredAgents = computed(() => {
  const q = searchQ.value.toLowerCase();
  return agents.value.filter(a => {
    const matchTxt  = !q || a.TenDaiLy.toLowerCase().includes(q) || a.SDT.includes(q) || a.Email.toLowerCase().includes(q);
    const matchQuan = !filterQuan.value || a.MaQuan === Number(filterQuan.value);
    const matchLoai = !filterLoai.value || a.MaLoaiDaiLy === Number(filterLoai.value);
    return matchTxt && matchQuan && matchLoai;
  });
});

const sortedAgents = computed(() => {
  const list = [...filteredAgents.value];
  list.sort((a, b) => {
    let va = a[sortKey.value], vb = b[sortKey.value];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return sortDir.value === 'asc' ? -1 : 1;
    if (va > vb) return sortDir.value === 'asc' ? 1 : -1;
    return 0;
  });
  return list;
});

/* ─── Panel actions ─── */
const viewAgent = (a) => {
  selectedId.value = a.MaDaiLy;
  panelMode.value  = 'view';
  errors.value     = {};
};

const startAdd = () => {
  selectedId.value = null;
  panelMode.value  = 'add';
  form.value       = emptyForm();
  errors.value     = {};
};

const editAgent = (a) => {
  selectedId.value = a.MaDaiLy;
  panelMode.value  = 'edit';
  form.value       = { ...a };
  errors.value     = {};
};

const cancelForm = () => {
  panelMode.value = selectedId.value ? 'view' : 'view';
  errors.value = {};
};

/* ─── Validation & submit ─── */
const validate = () => {
  const e = {};
  if (!form.value.TenDaiLy.trim())   e.TenDaiLy    = 'Bắt buộc nhập tên đại lý';
  if (!form.value.MaLoaiDaiLy)       e.MaLoaiDaiLy = 'Chọn loại đại lý';
  if (!form.value.MaQuan)            e.MaQuan       = 'Chọn quận';
  if (!form.value.NgayTiepNhan)      e.NgayTiepNhan = 'Bắt buộc nhập ngày tiếp nhận';
  else if (form.value.NgayTiepNhan > today) e.NgayTiepNhan = 'Ngày không được vượt hôm nay';
  if (form.value.SDT && !/^0[3-9]\d{8}$/.test(form.value.SDT))                e.SDT   = 'Số điện thoại không hợp lệ';
  if (form.value.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.Email)) e.Email = 'Email không hợp lệ';
  errors.value = e;
  return Object.keys(e).length === 0;
};

const submitForm = () => {
  if (!validate()) return;
  const payload = { ...form.value, MaLoaiDaiLy: Number(form.value.MaLoaiDaiLy), MaQuan: Number(form.value.MaQuan) };
  if (panelMode.value === 'add') {
    const newId = agents.value.length ? Math.max(...agents.value.map(a => a.MaDaiLy)) + 1 : 1;
    agents.value.push({ ...payload, MaDaiLy: newId, TongNo: 0 });
    selectedId.value = newId;
  } else {
    const idx = agents.value.findIndex(a => a.MaDaiLy === selectedId.value);
    if (idx !== -1) agents.value[idx] = payload;
  }
  panelMode.value = 'view';
};

/* ─── Delete ─── */
const askDelete     = (a) => { deleteTarget.value = a; };
const confirmDelete = () => {
  agents.value = agents.value.filter(a => a.MaDaiLy !== deleteTarget.value.MaDaiLy);
  if (selectedId.value === deleteTarget.value.MaDaiLy) { selectedId.value = null; panelMode.value = 'view'; }
  deleteTarget.value = null;
};

/* ─── Export CSV ─── */
const exportCSV = () => {
  const cols = ['Mã', 'Tên đại lý', 'Loại', 'Quận', 'SĐT', 'Email', 'Địa chỉ', 'Ngày tiếp nhận', 'Tổng nợ (VNĐ)'];
  const rows = sortedAgents.value.map(a => [
    a.MaDaiLy, a.TenDaiLy, loaiLabel(a.MaLoaiDaiLy), quanLabel(a.MaQuan),
    a.SDT, a.Email, a.DiaChi, a.NgayTiepNhan, a.TongNo,
  ]);
  const csv = [cols, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `dai-ly-${Date.now()}.csv`; link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* ══ TOKENS ══ */
.dl {
  --c-primary:    #059669; --c-primary-d: #047857;
  --c-success:    #10B981; --c-success-bg:#ECFDF5;
  --c-danger:     #EF4444; --c-danger-bg: #FEF2F2;
  --c-info:       #3B82F6; --c-info-bg:   #EFF6FF;
  --c-warning:    #F59E0B;
  --c-surface:    #ffffff; --c-bg:        #f8fafc;
  --c-border:     rgba(15,23,42,.07); --c-border-s: rgba(15,23,42,.04);
  --c-txt:        #0f172a; --c-txt-2:     #475569; --c-txt-3: #94a3b8;
  --r-card: 12px; --r-md: 8px; --r-sm: 6px; --r-pill: 999px;
  --sh-card:  0 1px 3px rgba(15,23,42,.05),0 1px 2px rgba(15,23,42,.04);
  --sh-hover: 0 4px 16px rgba(15,23,42,.08);
  --sh-modal: 0 20px 60px rgba(15,23,42,.18);
  --t: .15s ease;
  padding: 4px 0 32px;
  font-family: 'Inter','Outfit',ui-sans-serif,system-ui,sans-serif;
  color: var(--c-txt); font-size: 14px; line-height: 1.5;
}

/* ══ CONTEXT BANNER ══ */
.ctx-card {
  background: linear-gradient(120deg, #ffffff 0%, #f0fdf8 45%, #eef9ff 100%);
  border: 1px solid rgba(16,185,129,.14);
  border-radius: var(--r-card);
  box-shadow: 0 2px 16px rgba(5,150,105,.07), 0 1px 3px rgba(15,23,42,.04);
  margin-bottom: 18px;
  overflow: hidden;
  position: relative;
}

/* subtle dot grid */
.ctx-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(5,150,105,.1) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none;
  z-index: 0;
}

/* emerald top border */
.ctx-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 2.5px;
  background: linear-gradient(90deg, transparent, #34d399 25%, #059669 50%, #34d399 75%, transparent);
  z-index: 1;
}

/* decorative SVG */
.ctx-deco {
  position: absolute;
  right: 0; top: 0;
  width: 260px; height: 100%;
  pointer-events: none;
  z-index: 0;
}

.ctx-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 26px 18px;
  gap: 16px;
  position: relative;
  z-index: 2;
}
.ctx-title { font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -.6px; color: var(--c-txt); }
.ctx-sub   { font-size: 12px; color: var(--c-txt-3); margin: 4px 0 0; }
.ctx-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }

.ctx-divider { height: 1px; background: rgba(16,185,129,.1); position: relative; z-index: 2; }

.ctx-stats {
  display: flex;
  align-items: stretch;
  position: relative;
  z-index: 2;
}
.cs-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 26px;
  transition: background var(--t);
}
.cs-col:hover { background: rgba(5,150,105,.04); }
.cs-warn { background: rgba(245,158,11,.04); }
.cs-warn:hover { background: rgba(245,158,11,.09); }

.cs-sep {
  width: 1px;
  background: rgba(16,185,129,.12);
  flex-shrink: 0;
  margin: 12px 0;
}

.cs-num {
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -1.2px;
  color: var(--c-txt);
  line-height: 1;
  display: flex;
  align-items: baseline;
  gap: 7px;
  font-variant-numeric: tabular-nums;
}
.cs-red { color: #D97706; }

.cs-tag {
  font-size: 10px; font-weight: 700;
  padding: 2px 7px; border-radius: var(--r-pill);
  background: #fffbeb; color: #B45309;
  border: 1px solid rgba(245,158,11,.25);
  letter-spacing: .2px; vertical-align: middle;
}
.cs-tag-green {
  background: var(--c-success-bg); color: var(--c-primary);
  border-color: rgba(16,185,129,.18);
}

.cs-lbl {
  font-size: 11px;
  color: var(--c-txt-3);
  font-weight: 600;
  letter-spacing: .2px;
}

/* ══ MAIN LAYOUT ══ */
.dl-flex { display: flex; gap: 20px; align-items: flex-start; }
.list-card { flex: 1 1 auto; min-width: 0; }
.dl-card { background: var(--c-surface); border-radius: var(--r-card); border: 1px solid var(--c-border); box-shadow: var(--sh-card); overflow: hidden; }

/* ══ LIST CARD ══ */
.lc-hd { padding: 16px 20px 14px; border-bottom: 1px solid var(--c-border); display: flex; flex-direction: column; gap: 10px; }
.lc-title-row { display: flex; align-items: center; gap: 10px; }
.lc-title { font-size: 15px; font-weight: 700; margin: 0; }
.count-badge {
  background: var(--c-success-bg); color: var(--c-primary);
  font-size: 11px; font-weight: 700; padding: 2px 8px;
  border-radius: var(--r-pill); border: 1px solid rgba(16,185,129,.15);
}
.clear-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600; color: var(--c-danger);
  background: var(--c-danger-bg); border: 1px solid rgba(239,68,68,.15);
  border-radius: var(--r-pill); padding: 2px 8px; cursor: pointer;
  transition: background var(--t);
}
.clear-btn:hover { background: rgba(239,68,68,.15); }

.lc-tools { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; min-width: 160px; }
.search-ic { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--c-txt-3); pointer-events: none; }
.search-inp {
  width: 100%; padding: 7px 10px 7px 32px;
  border: 1px solid var(--c-border); border-radius: var(--r-md);
  font-size: 13px; color: var(--c-txt); background: var(--c-bg);
  outline: none; box-sizing: border-box; transition: border-color var(--t);
}
.search-inp:focus { border-color: var(--c-primary); background: #fff; }
.psel {
  border: 1px solid var(--c-border); border-radius: var(--r-sm);
  padding: 7px 10px; font-size: 12px; font-weight: 500;
  color: var(--c-txt-2); background: var(--c-bg); outline: none; cursor: pointer;
}
.psel:focus { border-color: var(--c-primary); }

/* ══ TABLE ══ */
.table-wrap { overflow-x: auto; }
.dl-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.dl-table thead tr { background: var(--c-bg); border-bottom: 1px solid var(--c-border); }
.dl-table th {
  padding: 10px 14px; text-align: left;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .5px; color: var(--c-txt-3); white-space: nowrap;
}
.dl-table td { padding: 10px 14px; border-bottom: 1px solid var(--c-border-s); vertical-align: middle; }
.agent-row { cursor: pointer; transition: background var(--t); }
.agent-row:hover { background: rgba(15,23,42,.02); }
.agent-row.selected { background: var(--c-success-bg); }
.agent-row:last-child td { border-bottom: none; }

.sort-hd { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }
.sort-hd:hover { color: var(--c-txt-2); }
.sort-arrow { display: inline-flex; align-items: center; }

.col-name { min-width: 150px; }
.a-name   { display: block; font-weight: 600; }
.a-email  { display: block; font-size: 11px; color: var(--c-txt-3); margin-top: 1px; }
.col-mono { font-variant-numeric: tabular-nums; font-size: 12px; }
.muted    { color: var(--c-txt-3); }
.text-right { text-align: right; }
.text-center { text-align: center; }

.col-debt-cell { text-align: right; }
.debt-num { font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; display: block; }
.debt-num.over { color: var(--c-danger); }
.debt-bar { height: 3px; background: #f1f5f9; border-radius: 2px; margin-top: 5px; overflow: hidden; min-width: 60px; }
.debt-fill { height: 100%; border-radius: 2px; transition: width .4s ease; }

.loai-chip { display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: var(--r-pill); white-space: nowrap; }
.loai-chip.l1 { background: var(--c-success-bg); color: #065f46; border: 1px solid rgba(16,185,129,.2); }
.loai-chip.l2 { background: var(--c-info-bg); color: #1e40af; border: 1px solid rgba(59,130,246,.2); }

.col-actions { text-align: center; white-space: nowrap; }
.act-btn { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: var(--r-sm); cursor: pointer; transition: background var(--t); }
.edit-btn { background: rgba(59,130,246,.08); color: var(--c-info); }
.edit-btn:hover { background: rgba(59,130,246,.18); }
.del-btn  { background: rgba(239,68,68,.08); color: var(--c-danger); }
.del-btn:hover { background: rgba(239,68,68,.18); }

.empty-row { text-align: center; padding: 40px 0; color: var(--c-txt-3); }
.empty-ic  { margin: 0 auto 8px; display: block; opacity: .35; }

.lc-foot { padding: 10px 20px; font-size: 11px; color: var(--c-txt-3); border-top: 1px solid var(--c-border-s); }

/* ══ SIDE PANEL ══ */
.side-panel { display: flex; flex-direction: column; min-height: 500px; width: 360px; flex-shrink: 0; }

/* — Agent detail — */
.ap-hd {
  padding: 18px 18px 14px;
  border-bottom: 1px solid var(--c-border);
  display: flex; align-items: flex-start; gap: 12px;
}
.ap-avatar {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #059669, #10b981);
  color: #fff; font-size: 18px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.ap-title-block { flex: 1; min-width: 0; }
.ap-name   { font-size: 15px; font-weight: 700; margin: 0 0 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ap-badges { display: flex; gap: 5px; flex-wrap: wrap; }
.dist-chip { font-size: 10px; font-weight: 600; color: var(--c-txt-3); background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-pill); padding: 3px 8px; }
.ap-edit-btn { flex-shrink: 0; }

/* — Gauge section — */
.gauge-section { padding: 16px 18px; border-bottom: 1px solid var(--c-border); }
.gauge-wrap { display: flex; align-items: center; gap: 16px; margin-bottom: 10px; }
.gauge-svg  { width: 72px; height: 72px; flex-shrink: 0; }
.gauge-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.gi-row { display: flex; justify-content: space-between; font-size: 12px; }
.gi-row .gi-lbl { color: var(--c-txt-3); }
.gi-row strong { font-weight: 700; font-variant-numeric: tabular-nums; }
.red   { color: var(--c-danger)  !important; }
.green { color: var(--c-success) !important; }

.debt-status-bar {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; padding: 7px 12px;
  border-radius: var(--r-md);
}
.status-ok   { background: var(--c-success-bg); color: #065f46; }
.status-warn { background: #fffbeb; color: #92400e; }
.status-over { background: var(--c-danger-bg);  color: #991b1b; }

/* — Info grid — */
.info-grid { padding: 14px 18px; border-bottom: 1px solid var(--c-border); display: flex; flex-direction: column; gap: 9px; }
.ig-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.ig-ic  { color: var(--c-txt-3); flex-shrink: 0; }
.ig-lbl { color: var(--c-txt-3); width: 58px; flex-shrink: 0; }
.ig-val { color: var(--c-txt-2); font-weight: 500; flex: 1; min-width: 0; }
.ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* — Quick links — */
.quick-links { padding: 12px 18px; border-bottom: 1px solid var(--c-border); display: flex; flex-direction: column; gap: 6px; }
.ql-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 12px; border-radius: var(--r-md);
  border: 1px solid var(--c-border); background: var(--c-bg);
  color: var(--c-txt-2); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all var(--t); font-family: inherit;
}
.ql-btn:hover { background: var(--c-success-bg); border-color: var(--c-primary); color: var(--c-primary); }
.ql-arrow { margin-left: auto; color: var(--c-txt-3); }
.ql-btn:hover .ql-arrow { color: var(--c-primary); }

/* — Recent activity — */
.recent-section { padding: 14px 18px; flex: 1; }
.recent-title { font-size: 11px; font-weight: 700; color: var(--c-txt-3); text-transform: uppercase; letter-spacing: .6px; margin: 0 0 10px; }
.recent-list { display: flex; flex-direction: column; gap: 8px; }
.recent-row { display: flex; align-items: center; gap: 10px; }
.rec-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.rec-body { flex: 1; min-width: 0; }
.rec-lbl  { display: block; font-size: 12px; font-weight: 600; }
.rec-date { font-size: 10px; color: var(--c-txt-3); }
.rec-amt  { font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
.rec-amt.pos { color: var(--c-success); }
.rec-amt.neg { color: var(--c-danger); }

/* — Empty panel — */
.empty-panel { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; gap: 8px; }
.ep-ic    { color: var(--c-txt-3); opacity: .4; }
.ep-title { font-size: 15px; font-weight: 700; margin: 0; color: var(--c-txt-2); }
.ep-sub   { font-size: 12px; color: var(--c-txt-3); margin: 0; line-height: 1.6; }
.mt16 { margin-top: 8px; }

/* ══ FORM (add/edit) ══ */
.fc-hd { padding: 16px 18px; border-bottom: 1px solid var(--c-border); display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.fc-title { font-size: 15px; font-weight: 700; margin: 0; }
.fc-sub   { font-size: 11px; color: var(--c-txt-3); display: block; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.mode-chip { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: var(--r-pill); flex-shrink: 0; }
.mode-chip.add  { background: var(--c-success-bg); color: #065f46; border: 1px solid rgba(16,185,129,.2); }
.mode-chip.edit { background: var(--c-info-bg); color: #1e40af; border: 1px solid rgba(59,130,246,.2); }

.fc-body { flex: 1; padding: 16px 18px; display: flex; flex-direction: column; gap: 13px; overflow-y: auto; }
.field     { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 0; }
.field.full { width: 100%; }
.field-row  { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.flabel { font-size: 11px; font-weight: 700; color: var(--c-txt-2); }
.req    { color: var(--c-danger); }
.finp {
  padding: 8px 11px; border: 1px solid var(--c-border); border-radius: var(--r-md);
  font-size: 13px; color: var(--c-txt); background: var(--c-bg);
  outline: none; width: 100%; box-sizing: border-box;
  transition: border-color var(--t), box-shadow var(--t); font-family: inherit;
}
.finp:focus   { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(5,150,105,.08); background: #fff; }
.finp.finp-err { border-color: var(--c-danger); }
.finp-ro {
  background: var(--c-bg); border-color: var(--c-border-s);
  color: var(--c-txt-2); font-weight: 700; cursor: default;
  font-variant-numeric: tabular-nums;
  display: flex; align-items: center; min-height: 38px;
}
.finp-ro.debt-over { color: var(--c-danger); background: var(--c-danger-bg); }
.readonly-tag { font-size: 9px; font-weight: 600; color: var(--c-txt-3); background: var(--c-bg); border: 1px solid var(--c-border); padding: 1px 5px; border-radius: 4px; margin-left: 4px; text-transform: uppercase; }
.err-msg { font-size: 11px; color: var(--c-danger); }
.limit-row { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--c-txt-3); background: var(--c-bg); border-radius: var(--r-sm); padding: 7px 10px; border: 1px dashed var(--c-border); }
.limit-row strong { color: var(--c-txt-2); font-weight: 700; }
.fc-footer { padding: 14px 18px; border-top: 1px solid var(--c-border); display: flex; justify-content: space-between; align-items: center; gap: 8px; }

/* ══ BUTTONS ══ */
.btn-p {
  background: var(--c-primary); color: #fff; border: none; border-radius: var(--r-md);
  padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
  transition: background var(--t), transform var(--t); font-family: inherit;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn-p:hover { background: var(--c-primary-d); transform: translateY(-1px); }
.btn-o {
  background: transparent; color: var(--c-primary); border: 1.5px solid rgba(5,150,105,.3);
  border-radius: var(--r-md); padding: 9px 16px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all var(--t); font-family: inherit;
}
.btn-o:hover { background: var(--c-success-bg); border-color: var(--c-primary); }
.btn-ghost {
  background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-md);
  padding: 8px 14px; font-size: 12px; font-weight: 600; color: var(--c-txt-2);
  cursor: pointer; transition: all var(--t); display: flex; align-items: center; gap: 5px; font-family: inherit;
}
.btn-ghost:hover { background: #fff; box-shadow: var(--sh-card); }
.btn-danger {
  background: var(--c-danger); color: #fff; border: none; border-radius: var(--r-md);
  padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
  transition: background var(--t); font-family: inherit;
}
.btn-danger:hover { background: #dc2626; }
.btn-csv {
  background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-md);
  padding: 8px 14px; font-size: 12px; font-weight: 600; color: var(--c-txt-2);
  cursor: pointer; transition: all var(--t); display: inline-flex; align-items: center; gap: 5px;
  font-family: inherit;
}
.btn-csv:hover { background: #fff; box-shadow: var(--sh-card); color: var(--c-txt); }

/* ══ MODAL ══ */
.modal-bg {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(15,23,42,.45); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-box {
  width: min(420px,100%); background: var(--c-surface);
  border-radius: 16px; border: 1px solid var(--c-border);
  box-shadow: var(--sh-modal); padding: 32px 28px 24px;
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;
}
.del-icon-wrap { width: 52px; height: 52px; border-radius: 50%; background: var(--c-danger-bg); color: var(--c-danger); display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.modal-title  { font-size: 17px; font-weight: 700; margin: 0; }
.modal-desc   { font-size: 13px; color: var(--c-txt-2); margin: 0; line-height: 1.6; }
.modal-actions { display: flex; gap: 10px; margin-top: 8px; }

/* ── Panel slide transition ── */
.panel-enter-active { animation: panelIn .22s cubic-bezier(.4,0,.2,1); }
.panel-leave-active { animation: panelOut .18s cubic-bezier(.4,0,.2,1); }
@keyframes panelIn  { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
@keyframes panelOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(18px); } }

/* ══ RESPONSIVE ══ */
@media (max-width: 1100px) {
  .dl-flex { flex-direction: column; }
  .side-panel { width: 100%; }
}
@media (max-width: 700px) {
  .field-row { grid-template-columns: 1fr; }
  .lc-tools  { flex-direction: column; align-items: stretch; }
}
</style>
