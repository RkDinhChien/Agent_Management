<template>
  <div class="cd">

    <!-- ══ Context banner ══ -->
    <div class="ctx-card">

      <!-- Hexagon decoration -->
      <svg class="ctx-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <polygon id="cdhx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
        </defs>
        <g stroke="#059669" stroke-width=".9" opacity=".18">
          <use href="#cdhx" transform="translate(21,24)"/>  <use href="#cdhx" transform="translate(62,24)"/>
          <use href="#cdhx" transform="translate(103,24)"/> <use href="#cdhx" transform="translate(144,24)"/>
          <use href="#cdhx" transform="translate(185,24)"/> <use href="#cdhx" transform="translate(226,24)"/>
          <use href="#cdhx" transform="translate(267,24)"/>
          <use href="#cdhx" transform="translate(0,60)"/>   <use href="#cdhx" transform="translate(41,60)"/>
          <use href="#cdhx" transform="translate(82,60)"/>  <use href="#cdhx" transform="translate(123,60)"/>
          <use href="#cdhx" transform="translate(164,60)"/> <use href="#cdhx" transform="translate(205,60)"/>
          <use href="#cdhx" transform="translate(246,60)"/> <use href="#cdhx" transform="translate(287,60)"/>
          <use href="#cdhx" transform="translate(21,96)"/>  <use href="#cdhx" transform="translate(62,96)"/>
          <use href="#cdhx" transform="translate(103,96)"/> <use href="#cdhx" transform="translate(144,96)"/>
          <use href="#cdhx" transform="translate(185,96)"/> <use href="#cdhx" transform="translate(226,96)"/>
          <use href="#cdhx" transform="translate(267,96)"/>
          <use href="#cdhx" transform="translate(0,132)"/>  <use href="#cdhx" transform="translate(41,132)"/>
          <use href="#cdhx" transform="translate(82,132)"/> <use href="#cdhx" transform="translate(123,132)"/>
          <use href="#cdhx" transform="translate(164,132)"/><use href="#cdhx" transform="translate(205,132)"/>
          <use href="#cdhx" transform="translate(246,132)"/><use href="#cdhx" transform="translate(287,132)"/>
        </g>
        <g stroke="#047857" stroke-width="1.2" opacity=".28">
          <use href="#cdhx" transform="translate(144,60)"/>
          <use href="#cdhx" transform="translate(185,24)"/>
          <use href="#cdhx" transform="translate(226,96)"/>
        </g>
        <polygon points="144,36 164.8,48 164.8,72 144,84 123.2,72 123.2,48" fill="#059669" opacity=".07"/>
        <polygon points="185,0 205.8,12 205.8,36 185,48 164.2,36 164.2,12" fill="#047857" opacity=".06"/>
        <g fill="#047857" opacity=".5">
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

      <!-- Watermark icon: settings gear -->
      <svg class="ctx-wm" viewBox="0 0 100 90" fill="none" stroke="currentColor"
           stroke-width="4.5" stroke-linecap="round" aria-hidden="true">
        <circle cx="50" cy="45" r="18"/>
        <circle cx="50" cy="45" r="7"/>
        <line x1="50" y1="8"  x2="50" y2="20"/>
        <line x1="50" y1="70" x2="50" y2="82"/>
        <line x1="13" y1="45" x2="25" y2="45"/>
        <line x1="75" y1="45" x2="87" y2="45"/>
        <line x1="24" y1="19" x2="33" y2="28"/>
        <line x1="67" y1="62" x2="76" y2="71"/>
        <line x1="76" y1="19" x2="67" y2="28"/>
        <line x1="33" y1="62" x2="24" y2="71"/>
      </svg>

      <div class="ctx-top">
        <div class="ctx-title-block">
          <p class="ctx-eyebrow">Quản trị · Hệ thống</p>
          <h1 class="ctx-title">Cài Đặt</h1>
        </div>
      </div>

      <div class="ctx-divider"></div>

      <div class="ctx-stats">
        <div class="cs-col">
          <strong class="cs-num">{{ loais.length }}<span class="cs-tag">loại</span></strong>
          <span class="cs-lbl">Loại đại lý</span>
        </div>
        <div class="cs-sep"></div>
        <div class="cs-col">
          <strong class="cs-num">{{ dvts.length }}<span class="cs-tag">DVT</span></strong>
          <span class="cs-lbl">Đơn vị tính</span>
        </div>
        <div class="cs-sep"></div>
        <div class="cs-col">
          <strong class="cs-num">{{ quans.length }}<span class="cs-tag">quận</span></strong>
          <span class="cs-lbl">Quận / Huyện</span>
        </div>
        <div class="cs-sep"></div>
        <div class="cs-col">
          <strong class="cs-num">{{ params.soDaiLyToiDa }}<span class="cs-tag">đại lý / quận</span></strong>
          <span class="cs-lbl">Giới hạn hiện tại</span>
        </div>
      </div>
    </div>

    <!-- ══ Tab nav ══ -->
    <div class="cd-tabs">
      <button
        v-for="t in TABS" :key="t.key"
        class="cd-tab" :class="{ active: tab === t.key }"
        @click="tab = t.key"
      >
        <component :is="t.icon" :size="14"/>{{ t.label }}
      </button>
    </div>

    <!-- ══════════════════════ TAB: THAM SỐ HỆ THỐNG ══════════════════════ -->
    <div class="cd-body" v-if="tab === 'thamso'">
      <div class="cd-card">
        <h3 class="card-title">Tham số hệ thống</h3>
        <p class="card-sub">Theo quy định QĐ7 — Thay đổi có hiệu lực ngay khi lưu</p>

        <div class="param-grid">

          <div class="param-row">
            <div class="param-info">
              <div class="param-icon-wrap" style="background:#eff6ff">
                <Building :size="17" color="#3b82f6"/>
              </div>
              <div>
                <p class="param-name">Số đại lý tối đa trong quận</p>
                <p class="param-desc">Giới hạn số đại lý được phép tiếp nhận trong mỗi quận</p>
              </div>
            </div>
            <div class="param-input-wrap">
              <input v-model.number="params.soDaiLyToiDa" type="number" min="1" class="finp param-inp"/>
              <span class="param-unit">đại lý</span>
            </div>
          </div>

          <div class="param-row">
            <div class="param-info">
              <div class="param-icon-wrap" style="background:#f0fdf4">
                <Percent :size="17" color="#059669"/>
              </div>
              <div>
                <p class="param-name">Tỉ lệ tính đơn giá xuất</p>
                <p class="param-desc">Giá xuất = Giá nhập × (1 + tỉ lệ). Ví dụ: 2% → giá xuất tăng thêm 2%</p>
              </div>
            </div>
            <div class="param-input-wrap">
              <input v-model.number="params.tiLeGiaXuat" type="number" min="0" max="100" step="0.1" class="finp param-inp"/>
              <span class="param-unit">%</span>
            </div>
          </div>

          <div class="param-row">
            <div class="param-info">
              <div class="param-icon-wrap" style="background:#fefce8">
                <Coins :size="17" color="#ca8a04"/>
              </div>
              <div>
                <p class="param-name">Áp dụng KTQĐ số tiền thu</p>
                <p class="param-desc">Số tiền thu không vượt quá tiền nợ đại lý</p>
              </div>
            </div>
            <div class="param-input-wrap">
              <input v-model="params.apDungQDKiemTraSoTienThu" type="checkbox" class="param-check"/>
              <span class="param-unit">{{ params.apDungQDKiemTraSoTienThu ? 'Đang bật' : 'Đang tắt' }}</span>
            </div>
          </div>

        </div>

        <div class="param-footer">
          <span class="save-hint" v-if="paramSaved">✓ Đã lưu tham số</span>
          <button class="btn-p" @click="saveParams"><Save :size="14"/> Lưu lại chỉnh sửa</button>
        </div>
        <p class="form-error" v-if="errors.params">{{ errors.params }}</p>
      </div>
    </div>

    <!-- ══════════════════════ TAB: LOẠI ĐẠI LÝ ══════════════════════ -->
    <div class="cd-body" v-if="tab === 'loaidaily'">
      <div class="cd-card">
        <h3 class="card-title">{{ loaiForm.id ? 'Sửa loại đại lý' : 'Thêm loại đại lý mới' }}</h3>
        <div class="inline-form">
          <div class="if-field">
            <label>Tên loại đại lý <span class="req">*</span></label>
            <input v-model="loaiForm.ten" class="finp" placeholder="VD: Loại 1, Loại 2..."/>
          </div>
          <div class="if-field">
            <label>Hạn mức nợ (VNĐ) <span class="req">*</span></label>
            <MoneyInput v-model="loaiForm.hanMucNo" input-class="finp" placeholder="VD: 10.000.000"/>
          </div>
          <div class="if-actions">
            <button class="btn-sec" @click="resetLoai" v-if="loaiForm.id"><X :size="14"/> Hủy</button>
            <button class="btn-p" @click="submitLoai">
              <component :is="loaiForm.id ? Save : Plus" :size="14"/>
              {{ loaiForm.id ? 'Lưu sửa' : 'Thêm' }}
            </button>
          </div>
        </div>
        <p class="form-error" v-if="errors.loai">{{ errors.loai }}</p>
      </div>

      <div class="cd-card">
        <div class="list-hd">
          <h3 class="card-title">Danh sách loại đại lý</h3>
          <span class="count-badge">{{ loais.length }} loại</span>
        </div>
        <table class="cd-table">
          <thead><tr>
            <th style="width:48px">STT</th>
            <th>Tên loại</th>
            <th style="width:180px" class="text-right">Hạn mức nợ</th>
            <th style="width:110px">Thao tác</th>
          </tr></thead>
          <tbody>
            <tr v-for="(l, i) in loais" :key="l.id" :class="{ 'row-editing': loaiForm.id === l.id }">
              <td class="mono muted">{{ i + 1 }}</td>
              <td class="fw-6">{{ l.ten }}</td>
              <td class="text-right mono">{{ fmtMoney(l.hanMucNo) }}</td>
              <td class="actions-cell">
                <button class="act-btn edit-btn" @click="editLoai(l)"><Pencil :size="13"/></button>
                <button class="act-btn del-btn"  @click="deleteLoai(l.id)"><Trash2 :size="13"/></button>
              </td>
            </tr>
            <tr v-if="!loais.length"><td colspan="4" class="empty">Chưa có loại đại lý nào</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════════════════ TAB: ĐƠN VỊ TÍNH ══════════════════════ -->
    <div class="cd-body" v-if="tab === 'dvt'">
      <div class="cd-card">
        <h3 class="card-title">{{ dvtForm.id ? 'Sửa đơn vị tính' : 'Thêm đơn vị tính mới' }}</h3>
        <div class="inline-form">
          <div class="if-field">
            <label>Tên đơn vị tính <span class="req">*</span></label>
            <input v-model="dvtForm.ten" class="finp" placeholder="VD: Cái, Bộ, Hộp, Mét..." @keydown.enter="submitDvt"/>
          </div>
          <div class="if-actions">
            <button class="btn-sec" @click="resetDvt" v-if="dvtForm.id"><X :size="14"/> Hủy</button>
            <button class="btn-p" @click="submitDvt">
              <component :is="dvtForm.id ? Save : Plus" :size="14"/>
              {{ dvtForm.id ? 'Lưu sửa' : 'Thêm' }}
            </button>
          </div>
        </div>
        <p class="form-error" v-if="errors.dvt">{{ errors.dvt }}</p>
      </div>

      <div class="cd-card">
        <div class="list-hd">
          <h3 class="card-title">Danh sách đơn vị tính</h3>
          <span class="count-badge">{{ dvts.length }} DVT</span>
        </div>
        <table class="cd-table">
          <thead><tr>
            <th style="width:48px">STT</th>
            <th>Tên đơn vị tính</th>
            <th style="width:110px">Thao tác</th>
          </tr></thead>
          <tbody>
            <tr v-for="(d, i) in dvts" :key="d.id" :class="{ 'row-editing': dvtForm.id === d.id }">
              <td class="mono muted">{{ i + 1 }}</td>
              <td class="fw-6">{{ d.ten }}</td>
              <td class="actions-cell">
                <button class="act-btn edit-btn" @click="editDvt(d)"><Pencil :size="13"/></button>
                <button class="act-btn del-btn"  @click="deleteDvt(d.id)"><Trash2 :size="13"/></button>
              </td>
            </tr>
            <tr v-if="!dvts.length"><td colspan="3" class="empty">Chưa có đơn vị tính nào</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════════════════ TAB: QUẬN ══════════════════════ -->
    <div class="cd-body" v-if="tab === 'quan'">
      <div class="cd-card">
        <h3 class="card-title">{{ quanForm.id ? 'Sửa quận' : 'Thêm quận mới' }}</h3>
        <div class="inline-form">
          <div class="if-field">
            <label>Tên quận / khu vực <span class="req">*</span></label>
            <input v-model="quanForm.ten" class="finp" placeholder="VD: Quận 1, Bình Thạnh..." @keydown.enter="submitQuan"/>
          </div>
          <div class="if-actions">
            <button class="btn-sec" @click="resetQuan" v-if="quanForm.id"><X :size="14"/> Hủy</button>
            <button class="btn-p" @click="submitQuan">
              <component :is="quanForm.id ? Save : Plus" :size="14"/>
              {{ quanForm.id ? 'Lưu sửa' : 'Thêm' }}
            </button>
          </div>
        </div>
        <p class="form-error" v-if="errors.quan">{{ errors.quan }}</p>
      </div>

      <div class="cd-card">
        <div class="list-hd">
          <h3 class="card-title">Danh sách quận</h3>
          <span class="count-badge">{{ quans.length }} quận</span>
        </div>
        <table class="cd-table">
          <thead><tr>
            <th style="width:48px">STT</th>
            <th>Tên quận / khu vực</th>
            <th style="width:110px">Thao tác</th>
          </tr></thead>
          <tbody>
            <tr v-for="(q, i) in quans" :key="q.id" :class="{ 'row-editing': quanForm.id === q.id }">
              <td class="mono muted">{{ i + 1 }}</td>
              <td class="fw-6">{{ q.ten }}</td>
              <td class="actions-cell">
                <button class="act-btn edit-btn" @click="editQuan(q)"><Pencil :size="13"/></button>
                <button class="act-btn del-btn"  @click="deleteQuan(q.id)"><Trash2 :size="13"/></button>
              </td>
            </tr>
            <tr v-if="!quans.length"><td colspan="3" class="empty">Chưa có quận nào</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="confirm-modal" v-if="deleteConfirm.open">
      <div class="confirm-backdrop" @click="closeDeleteConfirm"></div>
      <div class="confirm-sheet">
        <h3>Xác nhận xóa</h3>
        <p>{{ deleteConfirm.message }}</p>
        <div class="confirm-actions">
          <button class="btn-sec" @click="closeDeleteConfirm">Hủy</button>
          <button class="btn-p" @click="performDelete">Xác nhận</button>
        </div>
      </div>
    </div>
    <!-- Toast snackbar (top-right) rendered into document body -->
    <teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="toast-snack" :class="toast.type">
          <div class="toast-left">
            <CheckCircle v-if="toast.type === 'success'" :size="15"/>
            <XCircle v-else-if="toast.type === 'danger'" :size="15"/>
          </div>
          <span class="toast-msg">{{ toast.msg }}</span>
          <button class="toast-close" @click="closeToast">×</button>
        </div>
      </Transition>
    </teleport>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../services/api';
import { parseError } from '../utils/errorMessages';
import MoneyInput from '../components/MoneyInput.vue';
import {
  SlidersHorizontal, Users, Ruler, MapPin,
  Plus, Save, X, Pencil, Trash2,
  Building, Percent, DollarSign as Coins,
  CheckCircle, XCircle
} from 'lucide-vue-next';

const TABS = [
  { key: 'thamso',    label: 'Tham số hệ thống', icon: SlidersHorizontal },
  { key: 'loaidaily', label: 'Loại đại lý',       icon: Users },
  { key: 'dvt',       label: 'Đơn vị tính',       icon: Ruler },
  { key: 'quan',      label: 'Quận',              icon: MapPin },
];
const tab = ref('thamso');

const fmtMoney = (v) => Number(v).toLocaleString('vi-VN') + ' đ';
const errors = reactive({ params: '', loai: '', dvt: '', quan: '' });
const deleteConfirm = reactive({ open: false, type: '', id: null, title: '', message: '' });
// Toast snackbar (top-right)
const toast = ref({ show: false, msg: '', type: 'success' });
let _toastTimer = null;
const showToast = (msg, type = 'success', duration = 3600) => {
  clearTimeout(_toastTimer);
  toast.value = { show: true, msg, type };
  _toastTimer = setTimeout(() => { toast.value.show = false; }, duration);
};
const closeToast = () => {
  clearTimeout(_toastTimer);
  toast.value = { show: false, msg: '', type: 'success' };
};

/* ── Tham số hệ thống ── */
const params = reactive({ soDaiLyToiDa: 4, tiLeGiaXuat: 2, apDungQDKiemTraSoTienThu: false });
const paramSaved = ref(false);

const loadParams = async () => {
  try {
    const res = await api.get('/tham-so');
    const data = res.data?.data;
    if (data) {
      params.soDaiLyToiDa = data.SoDaiLyToiDa;
      // Convert multiplier (e.g. 1.02) to percentage (e.g. 2)
      params.tiLeGiaXuat = Math.round((parseFloat(data.TiLeTinhDonGiaXuat) - 1) * 100 * 10) / 10;
      params.apDungQDKiemTraSoTienThu = !!data.ApDungQDKiemTraSoTienThu;
    }
  } catch (err) {
    console.warn('Failed to load params', err);
  }
};

const saveParams = async () => {
  try {
    const payload = {
      SoDaiLyToiDa: Number(params.soDaiLyToiDa),
      // Convert percentage (e.g. 2) to multiplier (e.g. 1.02)
      TiLeTinhDonGiaXuat: 1 + (params.tiLeGiaXuat / 100),
      ApDungQDKiemTraSoTienThu: params.apDungQDKiemTraSoTienThu
    };
    await api.put('/tham-so', payload);
    errors.params = '';
    paramSaved.value = true;
    setTimeout(() => paramSaved.value = false, 2500);
  } catch (err) {
    errors.params = parseError(err, 'lưu tham số');
  }
};

/* ── Loại đại lý ── */
const loais = ref([]);
let loaiNextId = 100;

const loadLoais = async () => {
  try {
    const res = await api.get('/loai-dai-ly');
    const data = res.data?.data || res.data || res || [];
    loais.value = data.map(l => ({ id: l.MaLoaiDaiLy, ten: l.TenLoaiDaiLy, hanMucNo: l.TienNoToiDa }));
    loaiNextId = Math.max(...loais.value.map(l => l.id), 0) + 1;
  } catch (err) {
    console.warn('Failed to load loai-dai-ly', err?.response?.status || err.message);
  }
};
const loaiForm = reactive({ id: null, ten: '', hanMucNo: '' });
const resetLoai  = () => { loaiForm.id = null; loaiForm.ten = ''; loaiForm.hanMucNo = ''; };
const editLoai   = (l) => { loaiForm.id = l.id; loaiForm.ten = l.ten; loaiForm.hanMucNo = l.hanMucNo; };
const openDeleteConfirm = (type, item) => {
  if (!item || !item.id) return;
  deleteConfirm.open = true;
  deleteConfirm.type = type;
  deleteConfirm.id = item.id;
  deleteConfirm.title = item.ten;
  deleteConfirm.message = `Bạn có chắc muốn xóa ${type === 'loai' ? 'loại đại lý' : type === 'dvt' ? 'đơn vị tính' : 'quận'} "${item.ten}"?`;
  if (type === 'loai') errors.loai = '';
  if (type === 'dvt') errors.dvt = '';
  if (type === 'quan') errors.quan = '';
};

const closeDeleteConfirm = () => {
  deleteConfirm.open = false;
  deleteConfirm.type = '';
  deleteConfirm.id = null;
  deleteConfirm.title = '';
  deleteConfirm.message = '';
};

const performDelete = async () => {
  const { type, id, title } = deleteConfirm;
  closeDeleteConfirm();
  try {
    if (type === 'loai') {
      await api.delete(`/loai-dai-ly/${id}`);
      await loadLoais();
      errors.loai = '';
      showToast(`Đã xóa "${title}"`, 'success');
    } else if (type === 'dvt') {
      await api.delete(`/don-vi-tinh/${id}`);
      await loadDvts();
      errors.dvt = '';
      showToast(`Đã xóa "${title}"`, 'success');
    } else if (type === 'quan') {
      await api.delete(`/quan/${id}`);
      await loadQuans();
      errors.quan = '';
      showToast(`Đã xóa "${title}"`, 'success');
    }
  } catch (err) {
    if (type === 'loai') {
      errors.loai = parseError(err, 'xóa loại đại lý');
      showToast(errors.loai, 'danger');
    } else if (type === 'dvt') {
      errors.dvt = parseError(err, 'xóa đơn vị tính');
      showToast(errors.dvt, 'danger');
    } else if (type === 'quan') {
      errors.quan = parseError(err, 'xóa quận');
      showToast(errors.quan, 'danger');
    }
  }
};

const deleteLoai = (id) => {
  const loai = loais.value.find(l => l.id === id);
  openDeleteConfirm('loai', loai);
};
const submitLoai = async () => {
  errors.loai = '';
  const ten = loaiForm.ten.trim();
  if (!ten || !loaiForm.hanMucNo) {
    errors.loai = 'Vui lòng nhập đầy đủ tên loại và hạn mức nợ.';
    return;
  }
  const hanMuc = Number(loaiForm.hanMucNo);

  const dupTen = loais.value.find(l => l.ten.toLowerCase() === ten.toLowerCase() && l.id !== loaiForm.id);
  if (dupTen) {
    errors.loai = `Loại đại lý "${ten}" đã tồn tại.`;
    return;
  }

  const dupHan = loais.value.find(l => Number(l.hanMucNo) === hanMuc && l.id !== loaiForm.id && l.ten.toLowerCase() !== ten.toLowerCase());
  if (dupHan) {
    errors.loai = `Đã tồn tại "${dupHan.ten}" có mức nợ trùng (${hanMuc.toLocaleString('vi-VN')} đ).`;
    return;
  }

  const payload = { TenLoaiDaiLy: ten, TienNoToiDa: hanMuc };
  try {
    if (loaiForm.id) {
      await api.put(`/loai-dai-ly/${loaiForm.id}`, payload);
    } else {
      await api.post('/loai-dai-ly', payload);
    }
    await loadLoais();
    resetLoai();
    errors.loai = '';
  } catch (err) {
    errors.loai = parseError(err, 'lưu loại đại lý');
  }
};

/* ── Đơn vị tính ── */
const dvts = ref([]);
let dvtNextId = 100;

const loadDvts = async () => {
  try {
    const res = await api.get('/don-vi-tinh');
    const data = res.data?.data || res.data || res || [];
    dvts.value = data.map(d => ({ id: d.MaDVT, ten: d.TenDVT }));
    dvtNextId = Math.max(...dvts.value.map(d => d.id), 0) + 1;
  } catch (err) {
    console.warn('Failed to load don-vi-tinh', err?.response?.status || err.message);
  }
};
const dvtForm = reactive({ id: null, ten: '' });
const resetDvt  = () => { dvtForm.id = null; dvtForm.ten = ''; };
const editDvt   = (d) => { dvtForm.id = d.id; dvtForm.ten = d.ten; };
const deleteDvt = (id) => {
  const dvt = dvts.value.find(d => d.id === id);
  openDeleteConfirm('dvt', dvt);
};
const submitDvt = async () => {
  errors.dvt = '';
  const ten = dvtForm.ten.trim();
  if (!ten) {
    errors.dvt = 'Vui lòng nhập tên đơn vị tính.';
    return;
  }

  const dup = dvts.value.find(d => d.ten.toLowerCase() === ten.toLowerCase() && d.id !== dvtForm.id);
  if (dup) {
    errors.dvt = `Đơn vị tính "${ten}" đã tồn tại.`;
    return;
  }

  const payload = { TenDVT: ten };
  try {
    if (dvtForm.id) {
      await api.put(`/don-vi-tinh/${dvtForm.id}`, payload);
    } else {
      await api.post('/don-vi-tinh', payload);
    }
    await loadDvts();
    resetDvt();
    errors.dvt = '';
  } catch (err) {
    errors.dvt = parseError(err, 'lưu đơn vị tính');
  }
};

/* ── Quận ── */
const quans = ref([]);
let quanNextId = 100;

const loadQuans = async () => {
  try {
    const res = await api.get('/quan');
    const data = res.data?.data || res.data || res || [];
    quans.value = data.map(q => ({ id: q.MaQuan, ten: q.TenQuan }));
    quanNextId = Math.max(...quans.value.map(q => q.id), 0) + 1;
  } catch (err) {
    console.warn('Failed to load quan', err?.response?.status || err.message);
  }
};

onMounted(() => {
  loadParams();
  loadLoais();
  loadDvts();
  loadQuans();
});
const quanForm = reactive({ id: null, ten: '' });
const resetQuan  = () => { quanForm.id = null; quanForm.ten = ''; };
const editQuan   = (q) => { quanForm.id = q.id; quanForm.ten = q.ten; };
const deleteQuan = (id) => {
  const quan = quans.value.find(q => q.id === id);
  openDeleteConfirm('quan', quan);
};
const submitQuan = async () => {
  errors.quan = '';
  const ten = quanForm.ten.trim();
  if (!ten) {
    errors.quan = 'Vui lòng nhập tên quận/khu vực.';
    return;
  }

  const dup = quans.value.find(q => q.ten.toLowerCase() === ten.toLowerCase() && q.id !== quanForm.id);
  if (dup) {
    errors.quan = `Quận "${ten}" đã tồn tại.`;
    return;
  }

  const payload = { TenQuan: ten };
  try {
    if (quanForm.id) {
      await api.put(`/quan/${quanForm.id}`, payload);
    } else {
      await api.post('/quan', payload);
    }
    await loadQuans();
    resetQuan();
    errors.quan = '';
  } catch (err) {
    errors.quan = parseError(err, 'lưu quận');
  }
};
</script>

<style scoped>
/* ── Design tokens (same as rest of app) ── */
.cd {
  --c-primary:   #059669; --c-primary-d: #047857;
  --c-success-bg:#ECFDF5;
  --c-danger:    #EF4444; --c-danger-bg: #FEF2F2;
  --c-info:      #047857;
  --c-surface:   #ffffff; --c-bg:        #f8fafc;
  --c-border:    rgba(15,23,42,.07); --c-border-s:  rgba(15,23,42,.04);
  --c-txt:       #0f172a; --c-txt-2:     #475569; --c-txt-3: #047857;
  --r-card: 12px; --r-md: 8px; --r-sm: 6px; --r-pill: 999px;
  --sh-card: 0 1px 3px rgba(15,23,42,.05), 0 1px 2px rgba(15,23,42,.04);
  --t: .15s ease;
  display: flex; flex-direction: column; gap: 0;
  color: var(--c-txt); font-size: 14px;
}

.form-error {
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--c-danger-bg);
  color: var(--c-danger);
  border: 1px solid rgba(239,68,68,.15);
  font-size: 13px;
}

.confirm-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 20px;
}
.confirm-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15,23,42,.48);
  backdrop-filter: blur(1px);
}
.confirm-sheet {
  position: relative;
  background: white;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(15,23,42,.18);
  padding: 26px 24px;
  max-width: 420px;
  width: 100%;
  z-index: 1;
}
.confirm-sheet h3 {
  margin: 0 0 10px;
  font-size: 18px;
}
.confirm-sheet p {
  margin: 0 0 20px;
  color: var(--c-txt-2);
  line-height: 1.6;
}
.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ── Toast (top-right) ── */
.toast-snack {
  position: fixed; bottom: 28px; right: 28px; z-index: 500;
  display: inline-flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 12px; min-width: 280px;
  font-size: 13px; font-weight:600; box-shadow: 0 10px 30px rgba(2,6,23,.18);
}
.toast-left { display:inline-flex; align-items:center; margin-right:6px; }
.toast-close {
  background: transparent; border: none; color: inherit; font-size: 18px; line-height: 1;
  padding: 4px 8px; margin-left: 10px; border-radius: 8px; cursor: pointer;
}
.toast-close:hover { background: rgba(0,0,0,0.04); }
.toast-snack.success { background: #ecfdf5; color: #065f46; border:1px solid rgba(16,185,129,.18); }
.toast-snack.danger  { background: #fef2f2; color: #991b1b; border:1px solid rgba(239,68,68,.18); }
.toast-msg { flex:1; }
.toast-enter-active { animation: toastIn .22s ease; }
.toast-leave-active { animation: toastIn .18s ease reverse; }
@keyframes toastIn { from { opacity:0; transform:translateY(-8px) scale(.98); } to { opacity:1; transform:none; } }

/* ── Context banner ── */
.ctx-card {
  position: relative; overflow: hidden;
  background: linear-gradient(120deg,#ffffff 0%,#f0fdf8 45%,#eef9ff 100%);
  border-radius: 20px; padding: 28px 32px 20px;
  margin-bottom: 6px;
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
  width: 80px; height: 80px; opacity: .07; color: var(--c-primary); pointer-events: none; z-index: 0;
}
.ctx-top { position: relative; z-index: 2; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.ctx-title-block { display: flex; flex-direction: column; gap: 2px; }
.ctx-eyebrow {
  margin: 0; font-size: 10.5px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: var(--c-primary);
  display: flex; align-items: center; gap: 7px;
}
.ctx-eyebrow::before {
  content: ''; display: inline-block; width: 18px; height: 2.5px;
  background: linear-gradient(90deg,#10b981,#059669); border-radius: 2px; flex-shrink: 0;
}
.ctx-title {
  font-size: 1.7rem; font-weight: 800; color: var(--c-txt);
  margin: 0; letter-spacing: -.5px;
}
.ctx-sub {
  font-size: 12px; color: var(--c-txt-3); margin: 6px 0 0;
}
.ctx-divider { height: 1px; background: rgba(16,185,129,.1); margin: 0 0 18px; position: relative; z-index: 2; }

/* KPI row */
.ctx-stats { position: relative; z-index: 2; display: flex; gap: 0; align-items: stretch; }
.cs-col { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 18px 20px; transition: background .15s; }
.cs-col:hover { background: rgba(5,150,105,.04); }
.cs-col:first-child { padding-left: 26px; }
.cs-sep { width: 1px; background: rgba(16,185,129,.12); margin: 12px 0; flex-shrink: 0; }
.cs-num { font-size: 1.5rem; font-weight: 800; color: var(--c-txt); display: flex; align-items: baseline; gap: 7px; line-height: 1.1; }
.cs-tag { font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: #ecfdf5; color: var(--c-primary); border: 1px solid rgba(16,185,129,.18); }
.cs-lbl { font-size: 0.65rem; font-weight: 600; color: var(--c-txt-3); text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }

/* ── Tab nav ── */
.cd-tabs {
  display: flex; gap: 2px;
  padding: 14px 0 0;
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 18px;
}
.cd-tab {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: var(--r-md) var(--r-md) 0 0;
  border: none; background: transparent; cursor: pointer;
  font-size: 13px; font-weight: 600; color: var(--c-txt-3);
  border-bottom: 2px solid transparent;
  transition: color var(--t), border-color var(--t), background var(--t);
}
.cd-tab:hover { color: var(--c-txt-2); background: var(--c-bg); }
.cd-tab.active {
  color: var(--c-primary);
  border-bottom-color: var(--c-primary);
  background: var(--c-success-bg);
}

/* ── Body & cards ── */
.cd-body { display: flex; flex-direction: column; gap: 12px; }
.cd-card {
  background: var(--c-surface);
  border-radius: var(--r-card);
  border: 1px solid var(--c-border);
  box-shadow: var(--sh-card);
  padding: 20px 24px;
}
.card-title { font-size: 15px; font-weight: 700; color: var(--c-txt); margin: 0 0 4px; }
.card-sub   { font-size: 12px; color: var(--c-txt-3); margin: 0 0 20px; }
.list-hd { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.list-hd .card-title { margin: 0; }
.count-badge {
  background: var(--c-success-bg); color: var(--c-primary);
  font-size: 11px; font-weight: 700; border-radius: var(--r-pill);
  padding: 2px 10px; border: 1px solid rgba(16,185,129,.15);
}

/* ── Param rows ── */
.param-grid { display: flex; flex-direction: column; }
.param-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0; border-bottom: 1px solid var(--c-border-s); gap: 16px;
}
.param-row:last-child { border-bottom: none; }
.param-info { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
.param-icon-wrap {
  width: 42px; height: 42px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.param-name { font-size: 13.5px; font-weight: 700; color: var(--c-txt); margin: 0 0 3px; }
.param-desc { font-size: 12px; color: var(--c-txt-3); margin: 0; }
.param-input-wrap { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.param-inp { width: 140px !important; text-align: right; }
.param-check {
  width: 18px; height: 18px; cursor: pointer;
  accent-color: var(--c-primary);
}
.param-unit { font-size: 12px; font-weight: 600; color: var(--c-txt-3); white-space: nowrap; }
.param-footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 12px; margin-top: 20px; padding-top: 16px;
  border-top: 1px solid var(--c-border);
}
.save-hint { font-size: 12px; font-weight: 600; color: var(--c-primary); }

/* ── Inline form ── */
.inline-form { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
.if-field { display: flex; flex-direction: column; gap: 5px; min-width: 200px; flex: 1; }
.if-field label { font-size: 12px; font-weight: 600; color: var(--c-txt-2); }
.req { color: var(--c-danger); }
.if-actions { display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0; }

/* ── Inputs ── */
.finp {
  height: 36px; padding: 0 12px;
  border: 1.5px solid var(--c-border); border-radius: var(--r-md);
  font-size: 13px; color: var(--c-txt); background: var(--c-bg);
  outline: none; transition: border-color var(--t), background var(--t); width: 100%;
  box-sizing: border-box;
}
.finp:focus { border-color: var(--c-primary); background: #fff; }

/* ── Buttons ── */
.btn-p {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0 16px; height: 36px; border-radius: var(--r-md); border: none;
  background: var(--c-primary); color: #fff;
  font-size: 13px; font-weight: 600;
  cursor: pointer; transition: background var(--t), transform var(--t);
  white-space: nowrap;
}
.btn-p:hover { background: var(--c-primary-d); transform: translateY(-1px); }
.btn-sec {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0 14px; height: 36px; border-radius: var(--r-md);
  border: 1.5px solid var(--c-border); background: var(--c-surface);
  color: var(--c-txt-2); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: border-color var(--t);
}
.btn-sec:hover { border-color: var(--c-txt-3); }

/* ── Table ── */
.cd-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.cd-table thead tr { background: var(--c-bg); border-bottom: 1px solid var(--c-border); }
.cd-table th {
  padding: 9px 12px; text-align: left;
  font-size: 10.5px; font-weight: 700; letter-spacing: .05em;
  text-transform: uppercase; color: var(--c-txt-3);
}
.cd-table th.text-right, .cd-table td.text-right { text-align: right; }
.cd-table td { padding: 11px 12px; border-bottom: 1px solid var(--c-border-s); }
.cd-table tbody tr:hover { background: var(--c-bg); }
.cd-table tbody tr:last-child td { border-bottom: none; }
.row-editing td { background: var(--c-success-bg) !important; }

.mono  { font-family: ui-monospace, monospace; }
.muted { color: var(--c-txt-3); }
.fw-6  { font-weight: 600; }
.empty { text-align: center; color: var(--c-txt-3); padding: 28px !important; }

.actions-cell { display: flex; gap: 6px; align-items: center; }
.act-btn {
  width: 28px; height: 28px; border-radius: var(--r-sm);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background var(--t);
}
.edit-btn { background: rgba(59,130,246,.08); color: var(--c-info); }
.edit-btn:hover { background: rgba(59,130,246,.16); }
.del-btn  { background: rgba(239,68,68,.08);  color: var(--c-danger); }
.del-btn:hover  { background: rgba(239,68,68,.16); }
</style>
