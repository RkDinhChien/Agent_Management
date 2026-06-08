<template>
  <div class="pn">

    <!-- ══ CONTEXT BANNER ══ -->
    <div class="ctx-card">

      <!-- Hexagon decoration -->
      <svg class="ctx-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <polygon id="phx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
        </defs>
        <g stroke="#059669" stroke-width=".9" opacity=".13">
          <use href="#phx" transform="translate(21,24)"/> <use href="#phx" transform="translate(62,24)"/>
          <use href="#phx" transform="translate(103,24)"/><use href="#phx" transform="translate(144,24)"/>
          <use href="#phx" transform="translate(185,24)"/><use href="#phx" transform="translate(226,24)"/>
          <use href="#phx" transform="translate(267,24)"/>
          <use href="#phx" transform="translate(0,60)"/>  <use href="#phx" transform="translate(41,60)"/>
          <use href="#phx" transform="translate(82,60)"/> <use href="#phx" transform="translate(123,60)"/>
          <use href="#phx" transform="translate(164,60)"/><use href="#phx" transform="translate(205,60)"/>
          <use href="#phx" transform="translate(246,60)"/><use href="#phx" transform="translate(287,60)"/>
          <use href="#phx" transform="translate(21,96)"/> <use href="#phx" transform="translate(62,96)"/>
          <use href="#phx" transform="translate(103,96)"/><use href="#phx" transform="translate(144,96)"/>
          <use href="#phx" transform="translate(185,96)"/><use href="#phx" transform="translate(226,96)"/>
          <use href="#phx" transform="translate(267,96)"/>
          <use href="#phx" transform="translate(0,132)"/> <use href="#phx" transform="translate(41,132)"/>
          <use href="#phx" transform="translate(82,132)"/><use href="#phx" transform="translate(123,132)"/>
          <use href="#phx" transform="translate(164,132)"/><use href="#phx" transform="translate(205,132)"/>
          <use href="#phx" transform="translate(246,132)"/><use href="#phx" transform="translate(287,132)"/>
        </g>
        <g stroke="#059669" stroke-width="1.2" opacity=".28">
          <use href="#phx" transform="translate(144,60)"/>
          <use href="#phx" transform="translate(185,24)"/>
          <use href="#phx" transform="translate(226,96)"/>
        </g>
        <polygon points="144,36 164.8,48 164.8,72 144,84 123.2,72 123.2,48" fill="#10b981" opacity=".07"/>
        <polygon points="185,0 205.8,12 205.8,36 185,48 164.2,36 164.2,12" fill="#059669" opacity=".06"/>
        <g fill="#059669" opacity=".5">
          <circle cx="144" cy="60" r="3.5"/><circle cx="185" cy="24" r="3"/><circle cx="226" cy="96" r="3"/>
        </g>
        <g stroke="#059669" stroke-width=".8" stroke-dasharray="3 4" opacity=".2">
          <line x1="144" y1="60" x2="185" y2="24"/>
          <line x1="144" y1="60" x2="226" y2="96"/>
        </g>
        <g fill="#059669" opacity=".3">
          <circle cx="62" cy="24" r="2"/><circle cx="267" cy="60" r="2"/><circle cx="103" cy="132" r="2"/>
        </g>
      </svg>

      <svg class="ctx-wm" viewBox="0 0 100 95" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10 35L50 15l40 20v35L50 90 10 70V35z"/>
        <path d="M10 35l40 20 40-20"/>
        <line x1="50" y1="55" x2="50" y2="90"/>
        <path d="M30 25l20 10 20-10"/>
        <path d="M50 5v12M43 8l7 9 7-9" stroke-width="3.5"/>
      </svg>

      <div class="ctx-top">
        <div class="ctx-title-block">
          <p class="ctx-eyebrow">Nghiệp vụ · Quản lý nhập hàng</p>
          <h1 class="ctx-title">Phiếu Nhập Hàng</h1>
        </div>
        <div class="ctx-actions">
          <button class="btn-csv" @click="exportCSV"><Download :size="13"/> Xuất CSV</button>
          <button class="btn-p" @click="openCreate"><Plus :size="14"/> Tạo phiếu nhập</button>
        </div>
      </div>

      <div class="ctx-divider"></div>

      <div class="ctx-stats">

        <!-- KPI 1: Tổng phiếu -->
        <div class="cs-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><CheckCircle2 :size="11"/></span>
            <span class="cs-lbl">Tổng phiếu tháng này</span>
          </div>
          <div class="cs-num-row">
            <strong class="cs-num">{{ thisMonthCount }}</strong>
          </div>
          <div class="cs-delta" :class="countDelta >= 0 ? 'cs-up' : 'cs-down'">
            {{ countDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(countDelta) }} so với tháng trước
          </div>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 2: Giá trị + sparkline -->
        <div class="cs-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><TrendingUp :size="11"/></span>
            <span class="cs-lbl">Tổng giá trị đã duyệt</span>
          </div>
          <div class="cs-num-row">
            <strong class="cs-num">{{ fmtVND(thisMonthValue) }}</strong>
          </div>
          <div class="cs-delta" :class="valDelta >= 0 ? 'cs-up' : 'cs-down'">
            {{ valDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(valDelta).toFixed(1) }}% so với tháng trước
          </div>
          <div class="spark-wrap">
            <div v-for="(h, i) in spark" :key="i"
                 class="spark-bar" :class="{ 'spark-active': i === spark.length - 1 }"
                 :style="{ height: (h / maxSpark * 100) + '%' }"
                 :title="sparkLabels[i] + ': ' + h + ' Tr'">
            </div>
          </div>
        </div>
        <div class="cs-sep"></div>

        <!-- KPI 4: Phiếu mới -->
        <div class="cs-col">
          <div class="cs-lbl-row">
            <span class="cs-ic"><PackagePlus :size="11"/></span>
            <span class="cs-lbl">Phiếu mới tạo</span>
          </div>
          <div class="cs-num-row">
            <strong class="cs-num">
              {{ thisMonthCount }}
              <span class="cs-tag cs-tag-green" v-if="thisMonthCount > 0">tháng này</span>
            </strong>
          </div>
          <div class="cs-delta" :class="countDelta >= 0 ? 'cs-up' : 'cs-down'">
            {{ countDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(countDelta) }} so với tháng trước
          </div>
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
            <h3 class="lc-title">Danh sách phiếu nhập</h3>
            <span class="count-badge">{{ filteredList.length }} / {{ receipts.length }}</span>
            <button v-if="hasFilter" class="clear-btn" @click="clearFilters" title="Xóa bộ lọc">
              <X :size="11"/> Xóa lọc
            </button>

          </div>
          <div class="lc-tools">
            <div class="search-wrap">
              <Search :size="14" class="search-ic"/>
              <input v-model="searchQ" class="search-inp" placeholder="Tìm mã phiếu..."/>
            </div>

          </div>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="dl-table">
            <colgroup>
              <col class="col-code">
              <col class="col-date">
              <col class="col-items">
              <col class="col-total">
              <col class="col-act">
            </colgroup>
            <thead>
              <tr>
                <th><span class="sort-hd" @click="toggleSort('code')">Mã phiếu <SortIcon field="code" :sk="sk" :sd="sd"/></span></th>
                <th><span class="sort-hd" @click="toggleSort('rawDate')">Ngày lập <SortIcon field="rawDate" :sk="sk" :sd="sd"/></span></th>
                <th class="text-center">Số mặt hàng</th>
                <th class="text-right"><span class="sort-hd" @click="toggleSort('total')">Tổng giá trị <SortIcon field="total" :sk="sk" :sd="sd"/></span></th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in sortedList" :key="r.id"
                class="pn-row" :class="{ selected: selectedId === r.id }"
                @click="openView(r)">
                <td><span class="pn-code">{{ r.code }}</span></td>
                <td class="muted col-mono">{{ r.date }}</td>
                <td>
                  <span class="item-cnt-chip">{{ r.items.length }} mặt hàng</span>
                </td>
                <td class="text-right">
                  <span class="total-num">{{ fmtVND(r.total) }}</span>
                </td>
                <td class="col-actions" style="text-align: center; vertical-align: middle;">
                  <div class="act-group" style="display: inline-flex; align-items: center; gap: 8px;">
                    <button class="act-btn edit-btn" title="Sửa phiếu" @click.stop="openEdit(r)"><Edit2 :size="13"/></button>
                    <button class="act-btn del-btn" title="Xóa phiếu" @click.stop="askDelete(r)"><Trash2 :size="13"/></button>
                  </div>
                </td>
              </tr>
              <tr v-if="!sortedList.length">
                <td colspan="5" class="empty-row">
                  <PackageOpen :size="30" class="empty-ic"/><p>Không tìm thấy phiếu nhập phù hợp</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        

        <div class="lc-foot" v-if="sortedList.length">
          Hiển thị {{ sortedList.length }} phiếu nhập
          <span v-if="hasFilter"> (đã lọc từ {{ receipts.length }})</span>
        </div>
      </div>

      <!-- ════ SIDE PANEL ════ -->
      <Transition name="panel">
      <div class="dl-card side-panel" v-if="panelVisible">

        <!-- ─ VIEW MODE ─ -->
        <template v-if="panelMode === 'view' && selectedReceipt">
          <div class="ap-hd">
            <div class="ap-avatar-sq" style="background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;border-radius:10px">
              <Package :size="20"/>
            </div>
            <div class="ap-title-block">
              <h3 class="ap-name">{{ selectedReceipt.code }}</h3>
              <div class="ap-badges">
                <span class="dist-chip">{{ selectedReceipt.items.length }} mặt hàng</span>
              </div>
            </div>
            <div style="display:flex;gap:5px;align-self:flex-start;flex-shrink:0">
              <button class="act-btn" style="background:rgba(15,23,42,.04);color:var(--c-txt-3)" title="Đóng" @click="closePanel"><X :size="14"/></button>
            </div>
          </div>

          <!-- Value summary block -->
            <div class="val-summary">
              <div class="vs-main">
                <span class="vs-label">Tổng giá trị</span>
                <span class="vs-val">{{ fmtVND(selectedReceipt.total) }}</span>
              </div>
              <div class="vs-bar-wrap">
                <div class="vs-bar">
                  <div class="vs-fill" :style="{ width: totalBarPct(selectedReceipt) + '%', background: totalBarColor(selectedReceipt) }"></div>
                </div>
                <span class="vs-pct">{{ Math.round(totalBarPct(selectedReceipt)) }}% tháng</span>
              </div>
            </div>
          <!-- Info grid -->
          <div class="info-grid">
            <div class="ig-row">
              <CalendarDays :size="13" class="ig-ic"/>
              <span class="ig-lbl">Ngày lập</span>
              <span class="ig-val col-mono">{{ selectedReceipt.date }}</span>
            </div>
          </div>

          <!-- Items list -->
          <div class="items-section">
            <p class="recent-title">Danh sách mặt hàng</p>
            <div class="items-hd">
              <span style="flex:2">Mặt hàng</span>
              <span style="flex:.7;text-align:center">SL</span>
              <span style="flex:1;text-align:right">Thành tiền</span>
            </div>
            <div class="item-row" v-for="item in selectedReceipt.items" :key="item.name">
              <span class="item-name" style="flex:2">{{ item.name }}</span>
              <span style="flex:.7;text-align:center;color:#64748b;font-size:12px">{{ item.qty.toLocaleString('vi-VN') }}</span>
              <span style="flex:1;text-align:right;font-weight:700;font-size:12px;font-variant-numeric:tabular-nums">{{ fmtVND(item.qty * item.price) }}</span>
            </div>
            <div class="items-total">
              <span>Tổng cộng</span>
              <strong>{{ fmtVND(selectedReceipt.total) }}</strong>
            </div>
          </div>

          <!-- Actions -->
          <div class="quick-links">
            <button class="btn-danger-o" @click="askDelete(selectedReceipt)" style="width:100%;justify-content:center">
              <Trash2 :size="14"/>Xóa phiếu
            </button>
          </div>
        </template>

        <!-- ─ EDIT MODE ─ -->
        <template v-else-if="panelMode === 'edit'">
          <div class="fc-hd">
            <div>
              <h3 class="fc-title">Chỉnh sửa phiếu nhập</h3>
              <span class="fc-sub">{{ selectedReceipt?.code ?? '' }}</span>
            </div>
            <div style="display:flex;gap:5px;align-items:center">
              <span class="mode-chip edit-chip">Sửa</span>
              <button class="act-btn" style="background:rgba(15,23,42,.04);color:var(--c-txt-3)" title="Đóng" @click="panelMode = 'view'"><X :size="14"/></button>
            </div>
          </div>

          <div class="fc-body">
            <div class="field full">
              <label class="flabel">Ngày lập phiếu</label>
              <input v-model="form.date" type="date" class="finp" :max="today"/>
            </div>
            <div class="field full">
              <label class="flabel">Danh sách mặt hàng <span class="req">*</span></label>
              <div class="items-form-list">
                <div class="items-form-hd">
                  <span>Mặt hàng</span>
                  <span>SL</span>
                  <span>Giá</span>
                  <span></span>
                </div>
                <div v-for="(item, idx) in form.items" :key="idx" class="item-form-row">
                  <select v-model="item.name" class="finp finp-sm" @change="onItemProductChange(item, idx)">
                    <option value="">Chọn mặt hàng</option>
                    <option v-for="p in products" :key="p.name" :value="p.name">{{ p.name }}</option>
                  </select>
                  <input v-model.number="item.qty" type="number" min="1" class="finp finp-sm finp-num" placeholder="SL"/>
                  <MoneyInput v-model="item.price" :input-class="'finp finp-sm money-finp'" :suffix="''" placeholder="0"/>
                </div>
                <button type="button" class="add-item-btn" @click="addItem">
                  <Plus :size="13"/> Thêm mặt hàng
                </button>
              </div>
              <span class="err-msg" v-if="errors.items">{{ errors.items }}</span>
            </div>
            <div class="limit-row">
              <Package :size="11"/>
              Tổng cộng (ước tính): <strong>{{ fmtVND(formTotal) }}</strong>
            </div>
          </div>

          <div class="fc-footer">
            <button class="btn-ghost" @click="panelMode = 'view'"><X :size="12"/> Hủy</button>
            <button class="btn-p" @click="submitEdit"><Edit2 :size="13"/> Cập nhật</button>
          </div>
        </template>

        <!-- ─ CREATE MODE ─ -->
        <template v-else-if="panelMode === 'create'">
          <div class="fc-hd">
            <div>
              <h3 class="fc-title">Tạo phiếu nhập mới</h3>
              <span class="fc-sub">Điền thông tin và danh sách mặt hàng</span>
            </div>
            <span class="mode-chip add">Mới</span>
          </div>

          <div class="fc-body">

            <div class="field full">
              <label class="flabel">Ngày lập phiếu <span class="req">*</span></label>
              <input v-model="form.date" type="date" class="finp" :max="today"/>
            </div>

            <div class="field full">
              <label class="flabel">Danh sách mặt hàng <span class="req">*</span></label>
              <div class="items-form-list">
                <div class="items-form-hd">
                  <span>Mặt hàng</span>
                  <span>SL</span>
                  <span>Giá</span>
                  <span></span>
                </div>
                <div v-for="(item, idx) in form.items" :key="idx" class="item-form-row">
                  <select v-model="item.name" class="finp finp-sm" @change="onItemProductChange(item, idx)">
                    <option value="">Chọn mặt hàng</option>
                    <option v-for="p in products" :key="p.name" :value="p.name">{{ p.name }}</option>
                  </select>
                  <input v-model.number="item.qty" type="number" min="1" class="finp finp-sm finp-num" placeholder="SL"/>
                  <MoneyInput v-model="item.price" :input-class="'finp finp-sm money-finp'" :suffix="''" placeholder="0"/>
                </div>
                <button type="button" class="add-item-btn" @click="addItem">
                  <Plus :size="13"/> Thêm mặt hàng
                </button>
              </div>
              <span class="err-msg" v-if="errors.items">{{ errors.items }}</span>
            </div>

            <div class="limit-row">
              <Package :size="11"/>
              Tổng cộng (ước tính): <strong>{{ fmtVND(formTotal) }}</strong>
            </div>

          </div>

          <div class="fc-footer">
            <button class="btn-ghost" @click="closePanel"><X :size="12"/> Hủy</button>
            <button class="btn-p" @click="submitCreate">Tạo phiếu nhập</button>
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
            <div class="del-ncc-avatar" style="background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;border-radius:10px">
              <Package :size="20"/>
            </div>
            <div class="del-trash-badge"><Trash2 :size="13"/></div>
          </div>
          <h4 class="modal-title">Xác nhận xóa phiếu nhập</h4>
          <p class="modal-desc">
            Bạn có chắc muốn xóa <strong>{{ deleteTarget.code }}</strong>?<br/>
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
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { usePermission } from '../composables/usePermission';
import api from '../services/api';
import { parseError } from '../utils/errorMessages';
import MoneyInput from '../components/MoneyInput.vue';
import {
  Search, Plus, Download, X, Eye, CheckCircle, CheckCircle2, XCircle,
  Trash2, PackageOpen, Package, Building2, CalendarDays,
  UserRound, FileText, Clock, Edit2, TrendingUp, PackagePlus,
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
const products = ref([]);

const { canAdd, canEdit, canDelete } = usePermission('PhieuNhapView');

const loadProducts = async () => {
  try {
    const res = await api.get('/mat-hang');
    products.value = (res.data?.data || []).map(p => ({
      id: p.MaMatHang,
      name: p.TenMatHang,
      price: parseFloat(p.DonGiaHienTai) || 0
    }));
  } catch (err) {
    console.warn('Failed to load products', err);
  }
};

/* ── Data from API ── */
const receipts = ref([]);

const loadReceipts = async () => {
  try {
    const res = await api.get('/phieu-nhap');
    const raw = res.data?.data || res.data || [];
    receipts.value = raw.map(r => ({
      id: r.MaPhieuNhap,
      code: `PN-${String(r.MaPhieuNhap).padStart(3, '0')}`,
      date: new Date(r.NgayLapPhieu).toLocaleDateString('vi-VN'),
      rawDate: r.NgayLapPhieu,
      total: parseFloat(r.TongTien) || (r.chiTiets || []).reduce((s, ct) => s + (parseFloat(ct.ThanhTien) || (parseFloat(ct.SoLuongNhap) * parseFloat(ct.DonGiaNhap))), 0) || 0,
      items: (r.chiTiets || []).map(ct => {
        const prod = products.value.find(p => p.id === ct.MaMatHang);
        return {
          name: ct.matHang?.TenMatHang || prod?.name || '?',
          qty: ct.SoLuongNhap || 0,
          price: parseFloat(ct.DonGiaNhap) || prod?.price || 0
        };
      })
    }));
    // Re-calculate totals if they are 0
    receipts.value.forEach(r => {
      if (r.total === 0) {
        r.total = r.items.reduce((s, i) => s + (i.qty * i.price), 0);
      }
    });
  } catch (err) {
    console.warn('Failed to load receipts', err?.response?.status || err.message);
  }
};

onMounted(async () => {
  await loadProducts();
  await loadReceipts();
});

/* ── State ── */
const searchQ      = ref('');
const sk           = ref('rawDate');
const sd           = ref('desc');
const selectedId   = ref(null);
const panelMode    = ref('view');
const deleteTarget = ref(null);

/* ── Computed ── */
const hasFilter = computed(() => searchQ.value !== '');
const clearFilters = () => { searchQ.value = ''; };

const toggleSort = (key) => {
  if (sk.value === key) sd.value = sd.value === 'asc' ? 'desc' : 'asc';
  else { sk.value = key; sd.value = 'asc'; }
};

const filteredList = computed(() => {
  const q = searchQ.value.toLowerCase();
  return receipts.value.filter(r => {
    return !q || r.code.toLowerCase().includes(q);
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

const newThisMonth    = computed(() => receipts.value.length);
const totalApproved    = computed(() => receipts.value.reduce((s, r) => s + r.total, 0));
const monthMax        = computed(() => Math.max(...receipts.value.map(r => r.total), 1));
const donutGradient  = computed(() => `conic-gradient(#059669 0deg 100%)`);

/* ── Sparkline (mock last 6 months: Dec→May) ── */
const spark       = [128, 145, 112, 178, 165, 195];
const maxSpark    = Math.max(...spark);
const sparkLabels = ['Th.12', 'Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5'];

/* ── Month progress ── */
const _now          = new Date();
const daysInMonth   = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate();
const dayOfMonth    = _now.getDate();
const monthProgressPct = Math.round(dayOfMonth / daysInMonth * 100);
const monthName     = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                       'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'][_now.getMonth()];

/* ── KPI deltas ── */
const thisMonthCount = computed(() => {
  const now = _now;
  return receipts.value.filter(r => {
    const d = new Date(r.rawDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
});

const thisMonthValue = computed(() => {
  const now = _now;
  return receipts.value.filter(r => {
    const d = new Date(r.rawDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).reduce((s, r) => s + r.total, 0);
});

const countDelta = computed(() => {
  const now = _now;
  const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const lastMonthCount = receipts.value.filter(r => {
    const d = new Date(r.rawDate);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  }).length;
  return thisMonthCount.value - lastMonthCount;
});

const valDelta = computed(() => {
  const now = _now;
  const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const lastMonthVal = receipts.value.filter(r => {
    const d = new Date(r.rawDate);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  }).reduce((s, r) => s + r.total, 0);
  // Chỉ hiển thị delta khi tháng trước có dữ liệu thực sự
  if (lastMonthVal === 0) return 0;
  return ((thisMonthValue.value - lastMonthVal) / lastMonthVal) * 100;
});

/* ── Form ── */
const today = new Date().toISOString().split('T')[0];
const emptyForm = () => ({ date: today, items: [{ name: '', qty: 1, price: 0 }] });
const form   = ref(emptyForm());
const errors = reactive({ items: '' });

const formTotal = computed(() => form.value.items.reduce((s, i) => s + (i.qty || 0) * (i.price || 0), 0));
const addItem    = () => form.value.items.push({ name: '', qty: 1, price: 0 });

const hasDuplicateItems = (items) => {
  const selected = items.map(i => i.name).filter(Boolean);
  return selected.some((name, idx) => selected.indexOf(name) !== idx);
};

const onItemProductChange = (item, idx) => {
  errors.items = '';
  if (!item.name) return;
  const duplicated = form.value.items.some((other, otherIdx) => otherIdx !== idx && other.name === item.name);
  if (!duplicated) return;

  const message = `Mặt hàng "${item.name}" đã được chọn trong phiếu nhập.`;
  item.name = '';
  errors.items = message;
  showToast(message, 'danger');
};

/* ── Helpers ── */
/* ── Helpers ── */
const fmtVND = (v) => (parseFloat(v) || 0).toLocaleString('vi-VN') + ' ₫';
const fmtSummary = (v) => {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + ' Tỷ';
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + ' Triệu';
  return fmtVND(v);
};

const totalBarPct = (r) => Math.min((r.total / monthMax.value) * 100, 100);
const totalBarColor = (r) => '#059669';

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
  if (!canAdd.value) {
    showToast('Bạn không có quyền thực hiện chức năng này', 'danger');
    return;
  }
  selectedId.value = null;
  panelMode.value  = 'create';
  form.value       = emptyForm();
  errors.items = '';
};

const openEdit = (r) => {
  if (!canEdit.value) {
    showToast('Bạn không có quyền thực hiện chức năng này', 'danger');
    return;
  }
  selectedId.value = r.id;
  panelMode.value  = 'edit';
  form.value = { date: r.rawDate, items: r.items.map(i => ({ ...i })) };
  errors.items = '';
};

const closePanel = () => { selectedId.value = null; panelMode.value = 'view'; };



const askDelete     = (r) => {
  if (!canDelete.value) {
    showToast('Bạn không có quyền thực hiện chức năng này', 'danger');
    return;
  }
  deleteTarget.value = r;
};
const confirmDelete = async () => {
  const target = deleteTarget.value;
  deleteTarget.value = null;
  try {
    await api.delete(`/phieu-nhap/${target.id}`);
    if (selectedId.value === target.id) closePanel();
    showToast(`Đã xóa phiếu ${target.code}`, 'danger');
    await loadReceipts();
    await loadProducts();
  } catch (err) {
    showToast(err.response?.data?.message || 'Không thể xóa phiếu nhập', 'danger');
  }
};

const submitCreate = async () => {
  errors.items = '';
  const validItems = form.value.items.filter(i => i.name && i.qty > 0);
  if (!validItems.length) { errors.items = 'Thêm ít nhất 1 mặt hàng hợp lệ'; return; }
  if (hasDuplicateItems(validItems)) {
    errors.items = 'Mỗi mặt hàng chỉ được chọn một lần trong phiếu nhập.';
    showToast(errors.items, 'danger');
    return;
  }

  try {
    const payload = {
      NgayLapPhieu: form.value.date,
      chiTiets: validItems.map(i => {
        const prod = products.value.find(p => p.name === i.name);
        return {
          MaMatHang: prod?.id,
          SoLuongNhap: i.qty,
          DonGiaNhap: i.price
        };
      })
    };

    const res = await api.post('/phieu-nhap', payload);
    if (res.data?.status === 'success') {
      showToast(`Đã lập phiếu nhập thành công`);
      await loadReceipts();
      await loadProducts(); // Refresh stock
      closePanel();
    }
  } catch (err) {
    showToast(err.response?.data?.message || 'Lỗi khi lập phiếu nhập', 'danger');
  }
};

const submitEdit = async () => {
  errors.items = '';
  const validItems = form.value.items.filter(i => i.name && i.qty > 0);
  if (!validItems.length) { errors.items = 'Thêm ít nhất 1 mặt hàng hợp lệ'; return; }
  if (hasDuplicateItems(validItems)) {
    errors.items = 'Mỗi mặt hàng chỉ được chọn một lần trong phiếu nhập.';
    showToast(errors.items, 'danger');
    return;
  }
  try {
    const payload = {
      NgayLapPhieu: form.value.date,
      chiTiets: validItems.map(i => {
        const prod = products.value.find(p => p.name === i.name);
        return { MaMatHang: prod?.id, SoLuongNhap: i.qty, DonGiaNhap: i.price };
      }),
    };
    const res = await api.put(`/phieu-nhap/${selectedId.value}`, payload);
    if (res.data?.status === 'success') {
      showToast(`Đã cập nhật phiếu nhập thành công`);
      await loadReceipts();
      await loadProducts();
      panelMode.value = 'view';
    }
  } catch (err) {
    showToast(err.response?.data?.message || 'Lỗi khi cập nhật phiếu nhập', 'danger');
  }
};

const exportCSV = () => {
  const cols = ['Mã phiếu', 'Ngày lập', 'Tổng giá trị (Tr)'];
  const rows = sortedList.value.map(r => [r.code, r.date, r.total]);
  const csv = [cols, ...rows].map(row => row.map(v => `"${v ?? ''}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `phieu-nhap-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* ══ TOKENS ══ */
.pn {
  --c-primary:    #059669; --c-primary-d: #047857;
  --c-success:    #10B981; --c-success-bg:#ECFDF5;
  --c-danger:     #EF4444; --c-danger-bg: #FEF2F2;
  --c-info:       #3B82F6;
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
.ctx-deco { position:absolute; right:0; top:0; width:260px; height:100%; pointer-events:none; z-index:0; }
.ctx-wm   { position:absolute; right:310px; top:50%; transform:translateY(-50%); width:90px; height:90px; color:#059669; opacity:.07; pointer-events:none; z-index:0; }
.ctx-top  { display:flex; justify-content:space-between; align-items:center; padding:20px 26px 18px; gap:16px; position:relative; z-index:2; }
.ctx-title-row  { display:flex; align-items:center; gap:14px; }
.ctx-icon-badge {
  width:44px; height:44px; border-radius:12px; flex-shrink:0;
  background:linear-gradient(135deg,#059669,#10b981);
  display:flex; align-items:center; justify-content:center;
  color:#fff; box-shadow:0 4px 14px rgba(5,150,105,.35);
}
.ctx-title-block { display:flex; flex-direction:column; gap:2px; }
.ctx-eyebrow {
  margin:0; font-size:10.5px; font-weight:700;
  color:var(--c-primary); text-transform:uppercase; letter-spacing:1px;
  display:flex; align-items:center; gap:7px;
}
.ctx-eyebrow::before {
  content:''; display:inline-block;
  width:18px; height:2.5px;
  background:linear-gradient(90deg,#10b981,#059669);
  border-radius:2px; flex-shrink:0;
}
.ctx-title  { font-size:24px; font-weight:800; margin:0; letter-spacing:-.7px; color:var(--c-txt); }
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
.cs-tag { font-size:10px; font-weight:700; padding:2px 7px; border-radius:var(--r-pill); background:#fffbeb; color:#B45309; border:1px solid rgba(245,158,11,.25); letter-spacing:.2px; vertical-align:middle; }
.cs-tag-green { background:var(--c-success-bg); color:var(--c-primary); border-color:rgba(16,185,129,.18); }
.cs-lbl-row { display:flex; align-items:center; gap:5px; margin-bottom:2px; }
.cs-lbl { font-size:11px; color:var(--c-txt-3); font-weight:600; letter-spacing:.2px; }
.cs-num-row { display:flex; align-items:baseline; gap:8px; flex-wrap:wrap; }
.cs-ic {
  display:inline-flex; align-items:center; justify-content:center;
  width:18px; height:18px; border-radius:5px; flex-shrink:0;
  background:rgba(5,150,105,.09); color:#059669;
}
.cs-ic.cs-ic-warn { background:rgba(245,158,11,.1); color:#d97706; }

/* ── Delta ── */
.cs-delta { font-size:10.5px; font-weight:600; margin-top:-3px; }
.cs-up    { color: #10b981; }
.cs-ok    { color: #10b981; }
.cs-down  { color: var(--c-danger); }

/* ── Sparkline ── */
.spark-wrap { display:flex; align-items:flex-end; gap:3px; height:28px; margin:4px 0 2px; }
.spark-bar  { flex:1; background:#e2e8f0; border-radius:3px 3px 0 0; min-height:3px; transition:height .4s; }
.spark-bar.spark-active { background: linear-gradient(180deg,#34d399,#059669); }

/* ── Donut SVG ── */
.cs-pending-row { display:flex; align-items:center; gap:11px; }
.cs-donut-svg { flex-shrink:0; display:block; }
.donut-legend { display:flex; align-items:center; flex-wrap:wrap; gap:3px; margin-top:5px; font-size:10px; color:var(--c-txt-3); font-weight:600; }
.dl-dot { width:7px; height:7px; border-radius:50%; display:inline-block; flex-shrink:0; }

/* ── Month timeline bar ── */
.ctx-timeline { padding:10px 26px 14px; position:relative; z-index:2; }
.ctl-row  { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; }
.ctl-label { font-size:11px; font-weight:600; color:var(--c-txt-3); }
.ctl-pct   { font-size:11px; font-weight:700; color:var(--c-primary); }
.ctl-track { height:4px; background:rgba(5,150,105,.1); border-radius:99px; overflow:hidden; }
.ctl-fill  { height:100%; background:linear-gradient(90deg,#34d399,#059669); border-radius:99px; transition:width .8s ease; }

/* ══ MAIN LAYOUT ══ */
.dl-flex   { display:flex; gap:20px; align-items:flex-start; }
.list-card { flex:1 1 auto; min-width:0; }
.dl-card   { background:var(--c-surface); border-radius:var(--r-card); border:1px solid var(--c-border); box-shadow:var(--sh-card); overflow:hidden; }

/* ══ LIST CARD ══ */
.lc-hd { padding:16px 20px 14px; border-bottom:1px solid var(--c-border); display:flex; flex-direction:column; gap:10px; }
.lc-title-row { display:flex; align-items:center; gap:10px; }
.lc-title { font-size:15px; font-weight:700; margin:0; }
.count-badge { background:var(--c-success-bg); color:var(--c-primary); font-size:11px; font-weight:700; padding:2px 8px; border-radius:var(--r-pill); border:1px solid rgba(16,185,129,.15); }
.clear-btn { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; color:var(--c-danger); background:var(--c-danger-bg); border:1px solid rgba(239,68,68,.15); border-radius:var(--r-pill); padding:2px 8px; cursor:pointer; }
.lc-tools  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.search-wrap { position:relative; flex:1; min-width:160px; }
.search-ic  { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--c-txt-3); pointer-events:none; }
.search-inp { width:100%; padding:7px 10px 7px 32px; border:1px solid var(--c-border); border-radius:var(--r-md); font-size:13px; color:var(--c-txt); background:var(--c-bg); outline:none; box-sizing:border-box; transition:border-color var(--t); }
.search-inp:focus { border-color:var(--c-primary); background:#fff; }
.psel { border:1px solid var(--c-border); border-radius:var(--r-sm); padding:7px 10px; font-size:12px; font-weight:500; color:var(--c-txt-2); background:var(--c-bg); outline:none; cursor:pointer; }

/* ══ TABLE ══ */
.table-wrap { overflow-x:auto; }
.dl-table { width:100%; border-collapse:collapse; font-size:13px; table-layout:fixed; }
.dl-table thead tr { background:var(--c-bg); border-bottom:1px solid var(--c-border); }
.dl-table th { padding:10px 14px; text-align:left; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--c-txt-3); white-space:nowrap; }
.dl-table td { padding:11px 14px; border-bottom:1px solid var(--c-border-s); vertical-align:middle; }
.pn-row { cursor:pointer; transition:background var(--t); }
.pn-row:hover { background:rgba(15,23,42,.02); }
.pn-row.selected { background:var(--c-success-bg); }
.pn-row:last-child td { border-bottom:none; }
.sort-hd { display:inline-flex; align-items:center; gap:4px; cursor:pointer; user-select:none; }
.sort-arrow { display:inline-flex; align-items:center; }
.dl-table .text-right  { text-align:right !important; }
.dl-table .text-center { text-align:center !important; }
.col-mono { font-variant-numeric:tabular-nums; font-size:12px; }
.muted    { color:var(--c-txt-3); }
/* Colgroup widths */
col.col-code   { width: 130px; }
col.col-date   { width: 108px; }
col.col-ncc    { width: 190px; }
col.col-items  { width: 106px; }
col.col-total  { width: 116px; }
col.col-status { width: 106px; }
col.col-act    { width: 96px; }

.pn-code { font-size:12px; font-weight:700; color:var(--c-primary); background:var(--c-success-bg); padding:3px 8px; border-radius:6px; font-variant-numeric:tabular-nums; }
.ncc-cell { display:flex; align-items:center; gap:8px; min-width:0; }
.ncc-av {
  width:32px; height:32px; border-radius:8px; flex-shrink:0;
  position:relative; overflow:hidden;
  box-shadow:0 2px 6px rgba(15,23,42,.12);
}
.ncc-av-img {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:contain; padding:5px; box-sizing:border-box; z-index:2; background:white; display:block;
}
.ncc-av-abbr {
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  color:#fff; font-size:10px; font-weight:800; letter-spacing:-.3px; z-index:0;
}
.ncc-name { font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.item-cnt-chip { font-size:11.5px; font-weight:600; color:var(--c-txt-3); background:var(--c-bg); border:1px solid var(--c-border); padding:2px 8px; border-radius:var(--r-pill); }
.total-num { font-weight:700; font-size:13px; font-variant-numeric:tabular-nums; }

.status-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:var(--r-pill); font-size:11px; font-weight:700; white-space:nowrap; }
.status-badge.pending   { background:#fef3c7; color:#92400e; border:1px solid rgba(245,158,11,.2); }
.status-badge.approved  { background:var(--c-success-bg); color:#065f46; border:1px solid rgba(16,185,129,.2); }
.status-badge.cancelled { background:var(--c-bg); color:var(--c-txt-3); border:1px solid var(--c-border); }

.col-actions { white-space:nowrap; vertical-align:middle; }
.act-group { display:flex; align-items:center; gap:4px; }
.act-btn {
  width:30px; height:30px; display:inline-flex; align-items:center; justify-content:center;
  border:none; border-radius:8px; cursor:pointer; transition:all var(--t);
}
.view-btn { background:rgba(5,150,105,.08); color:#059669; }
.view-btn:hover { background:rgba(5,150,105,.18); transform:scale(1.1); }
.edit-btn { background:rgba(37,99,235,.08); color:#2563eb; }
.edit-btn:hover { background:rgba(37,99,235,.18); transform:scale(1.1); }
.ok-btn   { background:rgba(5,150,105,.1); color:#059669; }
.ok-btn:hover { background:#059669; color:white; transform:scale(1.1); }
.del-btn  { background:rgba(239,68,68,.08); color:#dc2626; }
.del-btn:hover { background:rgba(239,68,68,.16); transform:scale(1.1); }
.del-btn:disabled { opacity:.3; cursor:not-allowed; }

.empty-row { text-align:center; padding:40px 0; color:var(--c-txt-3); }
.empty-ic  { margin:0 auto 8px; display:block; opacity:.35; }
.lc-foot   { padding:10px 20px; font-size:11px; color:var(--c-txt-3); border-top:1px solid var(--c-border-s); }

/* ══ SIDE PANEL ══ */
.side-panel {
  display:flex;
  flex-direction:column;
  min-height:500px;
  width:min(460px,100%);
  min-width:320px;
  max-width:460px;
  flex-shrink:0;
  max-height:calc(100vh - 200px);
  position:sticky;
  top:16px;
  overflow:auto;
  background:linear-gradient(180deg,#f7fbff 0%,#f8fff9 100%);
}

/* Panel header */
.ap-hd { padding:16px 18px 14px; border-bottom:1px solid var(--c-border); display:flex; align-items:flex-start; gap:12px; background:rgba(255,255,255,.72); }
.ap-avatar-sq {
  width:54px; height:54px; border-radius:14px; flex-shrink:0;
  position:relative; overflow:hidden;
  box-shadow:0 3px 12px rgba(15,23,42,.15);
}
.ap-logo-img {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:contain; padding:8px; box-sizing:border-box; z-index:2; background:white; display:block;
}
.ap-logo-abbr {
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  color:#fff; font-size:14px; font-weight:800; letter-spacing:-.5px; z-index:0;
}
.ap-title-block { flex:1; min-width:0; }
.ap-name   { font-size:15px; font-weight:700; margin:0 0 2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ap-ncc    { font-size:11.5px; color:var(--c-txt-3); margin:0 0 6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ap-badges { display:flex; gap:5px; flex-wrap:wrap; }
.dist-chip { font-size:10px; font-weight:600; color:var(--c-txt-3); background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-pill); padding:3px 8px; }

/* Value summary */
.gauge-section { padding:14px 18px; border-bottom:1px solid var(--c-border); background:rgba(255,255,255,.48); }
.val-summary { display:flex; flex-direction:column; gap:8px; margin-bottom:10px; }
.vs-main  { display:flex; justify-content:space-between; align-items:baseline; }
.vs-label { font-size:11px; color:var(--c-txt-3); font-weight:600; text-transform:uppercase; letter-spacing:.4px; }
.vs-val   { font-size:22px; font-weight:900; color:var(--c-primary); letter-spacing:-.5px; font-variant-numeric:tabular-nums; }
.vs-bar-wrap { display:flex; align-items:center; gap:10px; }
.vs-bar   { flex:1; height:6px; background:#f1f5f9; border-radius:3px; overflow:hidden; }
.vs-fill  { height:100%; border-radius:3px; transition:width .5s ease; }
.vs-pct   { font-size:10px; color:var(--c-txt-3); font-weight:600; white-space:nowrap; }

.debt-status-bar { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; padding:7px 12px; border-radius:var(--r-md); }
.debt-status-bar.approved  { background:var(--c-success-bg); color:#065f46; }
.debt-status-bar.pending   { background:#fef3c7; color:#92400e; }
.debt-status-bar.cancelled { background:var(--c-bg); color:var(--c-txt-3); }

/* Info grid */
.info-grid { padding:14px 18px; border-bottom:1px solid var(--c-border); display:flex; flex-direction:column; gap:9px; background:rgba(255,255,255,.42); }
.ig-row { display:flex; align-items:flex-start; gap:8px; font-size:12px; }
.ig-ic  { color:var(--c-txt-3); flex-shrink:0; margin-top:1px; }
.ig-lbl { color:var(--c-txt-3); width:52px; flex-shrink:0; }
.ig-val { color:var(--c-txt-2); font-weight:500; flex:1; min-width:0; }

/* Items section */
.items-section { padding:14px 18px; flex:1; overflow-y:auto; border-bottom:1px solid var(--c-border); background:rgba(255,255,255,.36); }
.recent-title  { font-size:11px; font-weight:700; color:var(--c-txt-3); text-transform:uppercase; letter-spacing:.6px; margin:0 0 10px; }
.items-hd  { display:flex; gap:8px; font-size:10px; font-weight:700; color:var(--c-txt-3); text-transform:uppercase; padding-bottom:6px; border-bottom:1px solid var(--c-border-s); margin-bottom:4px; }
.item-row  { display:flex; align-items:center; gap:8px; padding:7px 0; border-bottom:1px solid var(--c-border-s); }
.item-row:last-of-type { border-bottom:none; }
.item-name { font-size:12.5px; font-weight:600; color:var(--c-txt); }
.items-total { display:flex; justify-content:space-between; align-items:center; padding:10px 12px; margin-top:8px; background:var(--c-success-bg); border-radius:var(--r-md); border:1px solid rgba(16,185,129,.12); }
.items-total span  { font-size:12px; font-weight:600; color:var(--c-primary); }
.items-total strong { font-size:15px; font-weight:900; color:var(--c-primary); font-variant-numeric:tabular-nums; }

/* Quick action row */
.quick-links { padding:14px 18px; display:flex; gap:8px; border-bottom:1px solid var(--c-border); }
.btn-danger-o { display:inline-flex; align-items:center; gap:6px; padding:9px 14px; border-radius:var(--r-md); border:1.5px solid rgba(239,68,68,.25); background:#fef2f2; color:#dc2626; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; transition:all var(--t); }
.btn-danger-o:hover { background:#fee2e2; }

.status-note { display:flex; align-items:center; gap:7px; padding:12px 18px; font-size:12.5px; font-weight:600; }
.status-note:not(.cancelled) { color:var(--c-primary); }
.status-note.cancelled { color:var(--c-txt-3); }

/* ── Status tabs ── */
.stab-group { display:flex; background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--r-md); padding:3px; gap:2px; margin-left:auto; flex-shrink:0; }
.stab { padding:4px 10px; border:none; border-radius:var(--r-sm); font-size:11px; font-weight:700; cursor:pointer; background:transparent; color:var(--c-txt-3); transition:all var(--t); font-family:inherit; display:inline-flex; align-items:center; gap:4px; white-space:nowrap; }
.stab:hover { background:#fff; color:var(--c-txt-2); }
.stab.active { background:#fff; color:var(--c-txt); box-shadow:0 1px 3px rgba(15,23,42,.08); }
.stab-warn.active  { background:#fef3c7; color:#b45309; }
.stab-green.active { background:var(--c-success-bg); color:#065f46; }
.stab-muted.active { background:#f8fafc; color:var(--c-txt-2); }
.stab-n { font-size:10px; background:rgba(15,23,42,.06); padding:0 5px; border-radius:3px; line-height:1.6; }

/* ── Toast snackbar ── */
.toast-snack {
  position:fixed; bottom:28px; right:28px; z-index:500;
  display:inline-flex; align-items:center; gap:9px;
  padding:11px 18px; border-radius:12px;
  font-size:13px; font-weight:600; font-family:inherit;
  box-shadow: 0 8px 32px rgba(15,23,42,.2), 0 2px 8px rgba(15,23,42,.1);
  min-width:240px;
}
.toast-snack.success { background:#ecfdf5; color:#065f46; border:1px solid rgba(16,185,129,.25); }
.toast-snack.danger  { background:#fef2f2; color:#991b1b; border:1px solid rgba(239,68,68,.2); }
.toast-snack.warn    { background:#fffbeb; color:#92400e; border:1px solid rgba(245,158,11,.2); }
.toast-enter-active { animation: toastIn .25s cubic-bezier(.2,.8,.2,1); }
.toast-leave-active { animation: toastIn .2s cubic-bezier(.2,.8,.2,1) reverse; }
@keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }

/* ══ FORM (create) ══ */
.fc-hd { padding:16px 18px; border-bottom:1px solid var(--c-border); display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
.fc-title { font-size:15px; font-weight:700; margin:0; }
.fc-sub   { font-size:11px; color:var(--c-txt-3); display:block; margin-top:2px; }
.mode-chip { font-size:10px; font-weight:700; padding:3px 9px; border-radius:var(--r-pill); flex-shrink:0; }
.mode-chip.add       { background:var(--c-success-bg); color:#065f46; border:1px solid rgba(16,185,129,.2); }
.mode-chip.edit-chip { background:var(--c-info-bg,rgba(59,130,246,.08)); color:#1e40af; border:1px solid rgba(59,130,246,.2); }

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
.finp:focus { border-color:var(--c-primary); box-shadow:0 0 0 3px rgba(5,150,105,.08); background:#fff; }
.finp.finp-err { border-color:var(--c-danger); }
.finp.ftarea { resize:none; }
.finp.finp-sm { min-height:32px; padding:6px 9px; font-size:12px; border-radius:7px; }
.finp.finp-num { text-align:center; }
.err-msg { font-size:11px; color:var(--c-danger); }

/* Items form */
.items-form-list  {
  display:flex;
  flex-direction:column;
  gap:8px;
  padding:10px;
  background:rgba(248,250,252,.75);
  border:1px solid var(--c-border);
  border-radius:10px;
}
.items-form-hd,
.item-form-row {
  display:grid;
  grid-template-columns:minmax(0, 1.8fr) minmax(0, 70px) minmax(0, 100px);
  gap:8px;
  align-items:center;
  width:100%;
  box-sizing:border-box;
}
.item-form-row {
  padding:6px;
  border:1px solid rgba(148,163,184,.22);
  border-radius:10px;
  background:#fff;
  overflow:visible;
}
.items-form-hd {
  font-size:9.5px;
  font-weight:700;
  color:var(--c-txt-3);
  text-transform:uppercase;
  padding:0 2px 1px;
  letter-spacing:.35px;
}
.items-form-hd span:nth-child(2),
.items-form-hd span:nth-child(3) { text-align:center; }
.item-form-row > * { min-width:0; }
.item-form-row .finp {
  background:#fff;
  border:1.5px solid rgba(148,163,184,.26);
  border-radius:8px;
}
.item-form-row .del-btn {
  width:32px;
  height:32px;
  border-radius:7px;
  flex-shrink:0;
  justify-self:center;
}
.item-form-row .finp-num {
  font-variant-numeric:tabular-nums;
}
.item-form-row .finp-sm,
.item-form-row .money-finp {
  width:100%;
}
.item-form-row :deep(.money-input-wrap) {
  width:100%;
  min-width:0;
}
.item-form-row :deep(.money-input-wrap input) {
  padding-left:8px;
  padding-right:8px;
}
@media (max-width: 860px) {
  .items-form-hd,
  .item-form-row {
    grid-template-columns: minmax(140px, 1.4fr) minmax(68px, 84px) minmax(90px, 1fr) 32px;
  }
}
@media (max-width: 760px) {
  .items-form-hd,
  .item-form-row {
    grid-template-columns: 1fr 72px 100px 32px;
  }
}
.add-item-btn {
  display:inline-flex; align-items:center; gap:6px;
  padding:7px 11px; border-radius:7px; align-self:flex-start;
  border:1.5px dashed rgba(5,150,105,.35); background:transparent; color:var(--c-primary);
  font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:all var(--t);
}
.add-item-btn:hover { background:var(--c-success-bg); border-color:var(--c-primary); }

.limit-row { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--c-txt-3); background:var(--c-bg); border-radius:var(--r-sm); padding:7px 10px; border:1px dashed var(--c-border); }
.limit-row strong { color:var(--c-primary); font-weight:800; margin-left:4px; }

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
  background:transparent; color:var(--c-primary); border:1.5px solid rgba(5,150,105,.3);
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
.del-ncc-avatar {
  width:72px; height:72px; border-radius:18px;
  position:relative; overflow:hidden;
  box-shadow:0 4px 18px rgba(15,23,42,.14);
}
.del-ncc-img {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:contain; padding:10px; box-sizing:border-box; z-index:2; background:white; display:block;
}
.del-ncc-abbr {
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
