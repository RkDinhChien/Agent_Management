<template>
  <div class="pq">

    <!-- ══ Banner ══ -->
    <div class="pq-banner">

      <!-- Hexagon decoration -->
      <svg class="pq-deco" viewBox="0 0 300 155" fill="none" aria-hidden="true">
        <defs>
          <polygon id="pqhx" points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"/>
        </defs>
        <g stroke="#059669" stroke-width=".9" opacity=".13">
          <use href="#pqhx" transform="translate(21,24)"/>  <use href="#pqhx" transform="translate(62,24)"/>
          <use href="#pqhx" transform="translate(103,24)"/> <use href="#pqhx" transform="translate(144,24)"/>
          <use href="#pqhx" transform="translate(185,24)"/> <use href="#pqhx" transform="translate(226,24)"/>
          <use href="#pqhx" transform="translate(267,24)"/>
          <use href="#pqhx" transform="translate(0,60)"/>   <use href="#pqhx" transform="translate(41,60)"/>
          <use href="#pqhx" transform="translate(82,60)"/>  <use href="#pqhx" transform="translate(123,60)"/>
          <use href="#pqhx" transform="translate(164,60)"/> <use href="#pqhx" transform="translate(205,60)"/>
          <use href="#pqhx" transform="translate(246,60)"/> <use href="#pqhx" transform="translate(287,60)"/>
          <use href="#pqhx" transform="translate(21,96)"/>  <use href="#pqhx" transform="translate(62,96)"/>
          <use href="#pqhx" transform="translate(103,96)"/> <use href="#pqhx" transform="translate(144,96)"/>
          <use href="#pqhx" transform="translate(185,96)"/> <use href="#pqhx" transform="translate(226,96)"/>
          <use href="#pqhx" transform="translate(267,96)"/>
          <use href="#pqhx" transform="translate(0,132)"/>  <use href="#pqhx" transform="translate(41,132)"/>
          <use href="#pqhx" transform="translate(82,132)"/> <use href="#pqhx" transform="translate(123,132)"/>
          <use href="#pqhx" transform="translate(164,132)"/><use href="#pqhx" transform="translate(205,132)"/>
          <use href="#pqhx" transform="translate(246,132)"/><use href="#pqhx" transform="translate(287,132)"/>
        </g>
        <g stroke="#059669" stroke-width="1.2" opacity=".28">
          <use href="#pqhx" transform="translate(144,60)"/>
          <use href="#pqhx" transform="translate(185,24)"/>
          <use href="#pqhx" transform="translate(226,96)"/>
        </g>
        <polygon points="144,36 164.8,48 164.8,72 144,84 123.2,72 123.2,48" fill="#059669" opacity=".07"/>
        <polygon points="185,0 205.8,12 205.8,36 185,48 164.2,36 164.2,12" fill="#047857" opacity=".06"/>
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

      <!-- Watermark icon: users/shield -->
      <svg class="pq-wm" viewBox="0 0 110 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" aria-hidden="true">
        <circle cx="55" cy="28" r="18"/>
        <path d="M24 88c0-17 14-30 31-30s31 13 31 30"/>
        <circle cx="20" cy="52" r="10"/>
        <path d="M4 88c0-10 7-17 16-17"/>
        <circle cx="90" cy="52" r="10"/>
        <path d="M106 88c0-10-7-17-16-17"/>
        <path d="M46 42l-4 6M64 42l4 6" stroke-dasharray="3 3"/>
      </svg>

      <div class="ctx-top">
        <div class="ctx-title-block">
          <p class="pq-eye">Quản trị · Hệ thống</p>
          <h1 class="pq-title">Phân Quyền</h1>
          <p class="pq-sub">Kiểm soát quyền truy cập theo từng nhóm người dùng</p>
        </div>
      </div>

      <div class="pq-divider"></div>

      <div class="ctx-stats">
        <div class="cs-col">
          <strong class="cs-num">{{ nhoms.length }}<span class="cs-tag">nhóm</span></strong>
          <span class="cs-lbl">Nhóm người dùng</span>
        </div>
        <div class="cs-sep"></div>
        <div class="cs-col">
          <strong class="cs-num">{{ nguoiDungs.length }}<span class="cs-tag">tài khoản</span></strong>
          <span class="cs-lbl">Tài khoản hệ thống</span>
        </div>
        <div class="cs-sep"></div>
        <div class="cs-col">
          <strong class="cs-num">{{ chucNangs.length }}<span class="cs-tag">chức năng</span></strong>
          <span class="cs-lbl">Chức năng phân quyền</span>
        </div>
        <div class="cs-sep"></div>
        <div class="cs-col">
          <strong class="cs-num">4<span class="cs-tag">loại quyền</span></strong>
          <span class="cs-lbl">Xem · Thêm · Sửa · Xóa</span>
        </div>
      </div>
    </div>

    <!-- ══ Tab nav ══ -->
    <div class="pq-tabs">
      <button v-for="t in TABS" :key="t.key" class="pq-tab" :class="{ active: tab === t.key }" @click="tab = t.key">
        <component :is="t.icon" :size="14"/>{{ t.label }}
      </button>
    </div>

    <!-- ══════════════════════ TAB: NHÓM NGƯỜI DÙNG ══════════════════════ -->
    <div class="pq-body" v-if="tab === 'nhom'">
      <div class="pq-card">
        <h3 class="card-title">{{ nhomForm.id ? 'Sửa nhóm' : 'Thêm nhóm mới' }}</h3>
        <div class="inline-form">
          <div class="if-field">
            <label>Tên nhóm người dùng <span class="req">*</span></label>
            <input v-model="nhomForm.ten" class="finp" placeholder="VD: Quản lý, Nhân viên..." @keydown.enter="submitNhom"/>
          </div>
          <div class="if-actions">
            <button class="btn-sec" @click="resetNhom" v-if="nhomForm.id"><X :size="14"/> Hủy</button>
            <button class="btn-pri" @click="submitNhom">
              <component :is="nhomForm.id ? Save : Plus" :size="14"/>
              {{ nhomForm.id ? 'Lưu sửa' : 'Thêm' }}
            </button>
          </div>
        </div>
      </div>

      <div class="pq-card mt-0">
        <div class="list-hd">
          <h3 class="card-title">Danh sách nhóm người dùng</h3>
          <span class="count-badge">{{ nhoms.length }} nhóm</span>
        </div>
        <table class="pq-table">
          <thead><tr><th style="width:48px">STT</th><th>Tên nhóm</th><th style="width:110px">Thao tác</th></tr></thead>
          <tbody>
            <tr v-for="(n, i) in nhoms" :key="n.id" :class="{ 'row-editing': nhomForm.id === n.id }">
              <td class="mono muted">{{ i + 1 }}</td>
              <td class="fw-6">{{ n.ten }}</td>
              <td class="actions-cell">
                <button class="act-btn edit" @click="editNhom(n)" title="Sửa"><Pencil :size="13"/></button>
                <button class="act-btn del" @click="deleteNhom(n.id)" title="Xóa"><Trash2 :size="13"/></button>
              </td>
            </tr>
            <tr v-if="!nhoms.length"><td colspan="3" class="empty">Chưa có nhóm nào</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════════════════ TAB: NGƯỜI DÙNG ══════════════════════ -->
    <div class="pq-body" v-if="tab === 'nguoidung'">
      <div class="pq-card">
        <h3 class="card-title">{{ ndForm.id ? 'Sửa tài khoản' : 'Thêm tài khoản mới' }}</h3>
        <div class="inline-form grid-3">
          <div class="if-field">
            <label>Tên người dùng <span class="req">*</span></label>
            <input v-model="ndForm.ten" class="finp" placeholder="VD: nguyen.abc"/>
          </div>
          <div class="if-field">
            <label>Mật khẩu <span class="req">*</span></label>
            <div class="pw-wrap">
              <input v-model="ndForm.mk" :type="showPw ? 'text' : 'password'" class="finp" placeholder="Nhập mật khẩu"/>
              <button class="pw-eye" @click="showPw = !showPw" type="button">
                <component :is="showPw ? EyeOff : Eye" :size="14"/>
              </button>
            </div>
          </div>
          <div class="if-field">
            <label>Nhóm người dùng <span class="req">*</span></label>
            <select v-model="ndForm.nhomId" class="finp">
              <option value="">-- Chọn nhóm --</option>
              <option v-for="n in nhoms" :key="n.id" :value="n.id">{{ n.ten }}</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-sec" @click="resetNd" v-if="ndForm.id"><X :size="14"/> Hủy</button>
          <button class="btn-pri" @click="submitNd">
            <component :is="ndForm.id ? Save : Plus" :size="14"/>
            {{ ndForm.id ? 'Lưu sửa' : 'Thêm tài khoản' }}
          </button>
        </div>
      </div>

      <div class="pq-card mt-0">
        <div class="list-hd">
          <h3 class="card-title">Danh sách người dùng</h3>
          <span class="count-badge">{{ nguoiDungs.length }} tài khoản</span>
        </div>
        <table class="pq-table">
          <thead>
            <tr>
              <th style="width:48px">STT</th>
              <th>Tên người dùng</th>
              <th>Nhóm</th>
              <th style="width:90px">Mật khẩu</th>
              <th style="width:110px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(u, i) in nguoiDungs" :key="u.id" :class="{ 'row-editing': ndForm.id === u.id }">
              <td class="mono muted">{{ i + 1 }}</td>
              <td class="fw-6">{{ u.ten }}</td>
              <td><span class="nhom-chip">{{ nhomLabel(u.nhomId) }}</span></td>
              <td class="mono muted">••••••</td>
              <td class="actions-cell">
                <button class="act-btn edit" @click="editNd(u)" title="Sửa"><Pencil :size="13"/></button>
                <button class="act-btn del" @click="deleteNd(u.id)" title="Xóa"><Trash2 :size="13"/></button>
              </td>
            </tr>
            <tr v-if="!nguoiDungs.length"><td colspan="5" class="empty">Chưa có tài khoản nào</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════════════════ TAB: PHÂN QUYỀN ══════════════════════ -->
    <div class="pq-body" v-if="tab === 'phanquyen'">
      <div class="pq-card">
        <div class="perm-toolbar">
          <div class="perm-group-select">
            <label>Nhóm người dùng</label>
            <select v-model="permGroupId" class="finp">
              <option v-for="n in nhoms" :key="n.id" :value="n.id">{{ n.ten }}</option>
            </select>
          </div>
          <div class="perm-toolbar-actions">
            <span class="perm-saved-hint" v-if="permSaved">✓ Đã lưu</span>
            <button class="btn-pri" @click="savePerms"><Save :size="14"/> Lưu phân quyền</button>
          </div>
        </div>
      </div>

      <div class="pq-card mt-0">
        <table class="pq-table perm-table">
          <thead>
            <tr>
              <th>Chức năng</th>
              <th class="perm-col">Xem</th>
              <th class="perm-col">Thêm</th>
              <th class="perm-col">Sửa</th>
              <th class="perm-col">Xóa</th>
              <th style="width:100px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fn in chucNangs" :key="fn.id">
              <td class="fw-6">
                <component :is="fn.icon" :size="14" class="fn-icon"/>
                {{ fn.ten }}
              </td>
              <td class="perm-col">
                <label class="perm-check" :class="{ checked: getP(fn.id, 'xem') }">
                  <input type="checkbox" :checked="getP(fn.id, 'xem')" @change="toggleP(fn.id, 'xem')"/>
                </label>
              </td>
              <td class="perm-col">
                <label class="perm-check" :class="{ checked: getP(fn.id, 'them') }">
                  <input type="checkbox" :checked="getP(fn.id, 'them')" @change="toggleP(fn.id, 'them')"/>
                </label>
              </td>
              <td class="perm-col">
                <label class="perm-check" :class="{ checked: getP(fn.id, 'sua') }">
                  <input type="checkbox" :checked="getP(fn.id, 'sua')" @change="toggleP(fn.id, 'sua')"/>
                </label>
              </td>
              <td class="perm-col">
                <label class="perm-check" :class="{ checked: getP(fn.id, 'xoa') }">
                  <input type="checkbox" :checked="getP(fn.id, 'xoa')" @change="toggleP(fn.id, 'xoa')"/>
                </label>
              </td>
              <td class="actions-cell">
                <button class="act-btn edit" @click="grantAll(fn.id)" title="Cấp toàn quyền"><CheckSquare :size="13"/></button>
                <button class="act-btn del" @click="revokeAll(fn.id)" title="Thu hồi quyền"><XSquare :size="13"/></button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="fw-6 muted">Tất cả</td>
              <td class="perm-col"><button class="perm-all-btn" @click="grantCol('xem')">Tất cả</button></td>
              <td class="perm-col"><button class="perm-all-btn" @click="grantCol('them')">Tất cả</button></td>
              <td class="perm-col"><button class="perm-all-btn" @click="grantCol('sua')">Tất cả</button></td>
              <td class="perm-col"><button class="perm-all-btn" @click="grantCol('xoa')">Tất cả</button></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import api from '../services/api';
import {
  Users, UserCheck, ShieldCheck, Plus, Save, X, Pencil, Trash2,
  Eye, EyeOff, CheckSquare, XSquare,
  FileInput, FileOutput, Receipt, Package, BarChart2, Settings, Lock,
} from 'lucide-vue-next';

/* ── Tabs ── */
const TABS = [
  { key: 'nhom',       label: 'Nhóm người dùng', icon: Users },
  { key: 'nguoidung',  label: 'Người dùng',       icon: UserCheck },
  { key: 'phanquyen',  label: 'Phân quyền',       icon: ShieldCheck },
];
const tab = ref('nhom');

/* ════════════════════ NHÓM NGƯỜI DÙNG ════════════════════ */
const nhoms = ref([]);
let nhomNextId = 100;

const loadNhomNguoiDung = async () => {
  try {
    const res = await api.get('/nhom-nguoi-dung');
    const data = res.data?.data || res.data || [];
    nhoms.value = data.map(n => ({ id: n.MaNhom, ten: n.TenNhom }));
    nhomNextId = Math.max(...nhoms.value.map(n => n.id || 0), 0) + 1;
  } catch (err) {
    console.warn('Failed to load nhom-nguoi-dung', err?.response?.status || err.message);
  }
};
let nhomNextIdLocal = nhomNextId;
const nhomForm = reactive({ id: null, ten: '' });

const resetNhom  = () => { nhomForm.id = null; nhomForm.ten = ''; };
const editNhom   = (n) => { nhomForm.id = n.id; nhomForm.ten = n.ten; };
const deleteNhom = (id) => { nhoms.value = nhoms.value.filter(n => n.id !== id); };
const submitNhom = () => {
  if (!nhomForm.ten.trim()) return;
  if (nhomForm.id) {
    const n = nhoms.value.find(n => n.id === nhomForm.id);
    if (n) n.ten = nhomForm.ten.trim();
  } else {
    nhoms.value.push({ id: nhomNextIdLocal++, ten: nhomForm.ten.trim() });
  }
  resetNhom();
};
const nhomLabel = (id) => nhoms.value.find(n => n.id === id)?.ten ?? '—';

/* ════════════════════ NGƯỜI DÙNG ════════════════════ */
const nguoiDungs = ref([]);
let ndNextId = 100;

const loadNguoiDung = async () => {
  try {
    const res = await api.get('/nguoi-dung');
    const data = res.data?.data || res.data || [];
    nguoiDungs.value = data.map(u => ({
      id: u.TenNguoiDung, // Use TenNguoiDung as ID since it's the PK
      ten: u.TenNguoiDung,
      mk: '******',
      nhomId: u.MaNhom
    }));
    ndNextId = (nguoiDungs.value.length > 0) ? (Math.max(...nguoiDungs.value.map(u => typeof u.id === 'number' ? u.id : 0), 0) + 1) : 100;
  } catch (err) {
    console.warn('Failed to load nguoi-dung', err?.response?.status || err.message);
  }
};
let ndNextIdLocal = ndNextId;
const ndForm  = reactive({ id: null, ten: '', mk: '', nhomId: '' });
const showPw  = ref(false);

const resetNd  = () => { ndForm.id = null; ndForm.ten = ''; ndForm.mk = ''; ndForm.nhomId = ''; };
const editNd   = (u) => { ndForm.id = u.id; ndForm.ten = u.ten; ndForm.mk = u.mk; ndForm.nhomId = u.nhomId; };
const deleteNd = (id) => { nguoiDungs.value = nguoiDungs.value.filter(u => u.id !== id); };
const submitNd = () => {
  if (!ndForm.ten.trim() || !ndForm.mk || !ndForm.nhomId) return;
  if (ndForm.id) {
    const u = nguoiDungs.value.find(u => u.id === ndForm.id);
    if (u) { u.ten = ndForm.ten.trim(); u.mk = ndForm.mk; u.nhomId = Number(ndForm.nhomId); }
  } else {
    nguoiDungs.value.push({ id: ndNextIdLocal++, ten: ndForm.ten.trim(), mk: ndForm.mk, nhomId: Number(ndForm.nhomId) });
  }
  resetNd();
};

/* ════════════════════ PHÂN QUYỀN ════════════════════ */
const chucNangs = ref([]);
const fnIcons = {
  'DaiLyView': Users,
  'PhieuNhapView': FileInput,
  'PhieuXuatView': FileOutput,
  'TraCuuView': Package,
  'ThuTienView': Receipt,
  'BaoCaoView': BarChart2,
  'CaiDatView': Settings,
  'PhanQuyenView': Lock,
};

const loadChucNangs = async () => {
  try {
    const res = await api.get('/chuc-nang');
    const data = res.data?.data || res.data || res || [];
    chucNangs.value = data.map(c => ({
      id: c.MaChucNang,
      ten: c.TenChucNang,
      icon: fnIcons[c.TenManHinhDuocLoad] || ShieldCheck
    }));
  } catch (err) {
    console.warn('Failed to load chuc-nang', err);
  }
};

onMounted(() => {
  loadNhomNguoiDung();
  loadNguoiDung();
  loadChucNangs();
});

/* perms[groupId][fnId] = { xem, them, sua, xoa } */
const perms = reactive({});

const loadPerms = async (gid) => {
  if (!gid) return;
  try {
    const res = await api.get(`/phan-quyen/${gid}`);
    const data = res.data?.data || [];
    // Initialize all as false
    const gPerms = Object.fromEntries(chucNangs.value.map(f => [f.id, { xem:false, them:false, sua:false, xoa:false }]));
    // Fill from DB
    data.forEach(p => {
      if (gPerms[p.MaChucNang]) {
        gPerms[p.MaChucNang] = { xem: !!p.Xem, them: !!p.Them, sua: !!p.Sua, xoa: !!p.Xoa };
      }
    });
    perms[gid] = gPerms;
  } catch (err) {
    console.warn('Load perms error', err);
  }
};

const permGroupId = ref(1);
const permSaved   = ref(false);

const ensureGroup = async (gid) => {
  if (!perms[gid]) {
    // Initial local empty state to avoid errors while loading
    perms[gid] = Object.fromEntries(chucNangs.value.map(f => [f.id, { xem:false, them:false, sua:false, xoa:false }]));
    await loadPerms(gid);
  }
};

const getP = (fnId, perm) => {
  if (!perms[permGroupId.value]) return false;
  return !!perms[permGroupId.value][fnId]?.[perm];
};
const toggleP = (fnId, perm) => {
  if (!perms[permGroupId.value]) return;
  perms[permGroupId.value][fnId][perm] = !perms[permGroupId.value][fnId][perm];
  permSaved.value = false;
};
const grantAll  = (fnId) => {
  if (!perms[permGroupId.value]) return;
  const p = perms[permGroupId.value][fnId];
  p.xem = p.them = p.sua = p.xoa = true;
  permSaved.value = false;
};
const revokeAll = (fnId) => {
  if (!perms[permGroupId.value]) return;
  const p = perms[permGroupId.value][fnId];
  p.xem = p.them = p.sua = p.xoa = false;
  permSaved.value = false;
};
const grantCol  = (perm) => {
  if (!perms[permGroupId.value]) return;
  chucNangs.value.forEach(f => perms[permGroupId.value][f.id][perm] = true);
  permSaved.value = false;
};

const savePerms = async () => {
  const gPerms = perms[permGroupId.value];
  if (!gPerms) return;
  const payload = {
    MaNhom: permGroupId.value,
    permissions: Object.entries(gPerms).map(([fnId, p]) => ({
      MaChucNang: Number(fnId),
      Xem: p.xem, Them: p.them, Sua: p.sua, Xoa: p.xoa
    }))
  };
  try {
    await api.post('/phan-quyen', payload);
    permSaved.value = true;
    setTimeout(() => permSaved.value = false, 2500);
  } catch (err) {
    alert('Không thể lưu phân quyền');
  }
};

watch(permGroupId, (newG) => { ensureGroup(newG); }, { immediate: true });
// Also reload when groups are loaded to ensure first group is ready
watch(nhoms, (newN) => { if (newN.length && !perms[permGroupId.value]) ensureGroup(permGroupId.value); });
// Also reload when functions are loaded
watch(chucNangs, () => { if (permGroupId.value) loadPerms(permGroupId.value); });

</script>

<style scoped>
/* ── Page shell ── */
.pq { display: flex; flex-direction: column; gap: 0; }

/* ── Banner ── */
.pq-banner {
  position: relative; overflow: hidden;
  background: linear-gradient(120deg,#ffffff 0%,#f0fdf8 45%,#eef9ff 100%);
  border-radius: 20px; padding: 28px 32px 20px;
  margin-bottom: 0;
  border: 1px solid rgba(16,185,129,.14);
  box-shadow: 0 2px 16px rgba(5,150,105,.07),0 1px 3px rgba(15,23,42,.04);
}
.pq-banner::before {
  content:''; position:absolute; inset:0;
  background-image: radial-gradient(rgba(5,150,105,.1) 1px,transparent 1px);
  background-size: 22px 22px; pointer-events:none; z-index:0;
}
.pq-banner::after {
  content:''; position:absolute; top:0; left:0; right:0; height:2.5px;
  background: linear-gradient(90deg,transparent,#34d399 25%,#059669 50%,#34d399 75%,transparent);
  z-index:1;
}
.pq-deco {
  position: absolute; right: -10px; top: 0;
  width: 300px; height: 155px; pointer-events: none; z-index: 0;
}
.pq-wm {
  position: absolute; right: 260px; top: 20px;
  width: 90px; height: 90px; opacity: .07; color: #059669; pointer-events: none; z-index: 0;
}
.ctx-top { position: relative; z-index: 2; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.ctx-title-block { display: flex; flex-direction: column; gap: 2px; }
.pq-eye  { margin: 0; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #059669; display: flex; align-items: center; gap: 7px; }
.pq-eye::before { content: ''; display: inline-block; width: 18px; height: 2.5px; background: linear-gradient(90deg,#10b981,#059669); border-radius: 2px; flex-shrink: 0; }
.pq-title { font-size: 1.7rem; font-weight: 800; margin: 0; letter-spacing: -.5px; color: #0f172a; }
.pq-sub  { font-size: 13px; color: #64748b; margin: 0; }
.pq-divider { height: 1px; background: rgba(16,185,129,.1); margin: 0 0 18px; position: relative; z-index: 2; }

/* KPI row */
.ctx-stats { position: relative; z-index: 2; display: flex; gap: 0; align-items: stretch; }
.cs-col { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 18px 20px; transition: background .15s; }
.cs-col:first-child { padding-left: 26px; }
.cs-col:hover { background: rgba(5,150,105,.04); }
.cs-sep { width: 1px; background: rgba(16,185,129,.12); margin: 12px 0; flex-shrink: 0; }
.cs-num { font-size: 1.5rem; font-weight: 800; color: #0f172a; display: flex; align-items: baseline; gap: 7px; line-height: 1.1; }
.cs-tag { font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: #ecfdf5; color: #059669; border: 1px solid rgba(16,185,129,.18); }
.cs-lbl { font-size: 0.65rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }

/* ── Tabs ── */
.pq-tabs {
  display: flex; gap: 4px; padding: 16px 0 0;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 20px;
}
.pq-tab {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 18px; border-radius: 8px 8px 0 0;
  border: none; background: transparent; cursor: pointer;
  font-size: 13px; font-weight: 600; color: #64748b;
  border-bottom: 2px solid transparent;
  transition: color .15s, border-color .15s;
}
.pq-tab:hover { color: #047857; }
.pq-tab.active { color: #047857; border-bottom-color: #059669; background: #f0fdf4; }

/* ── Body & cards ── */
.pq-body { display: flex; flex-direction: column; gap: 12px; }
.pq-card {
  background: #fff; border-radius: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
  padding: 20px 24px;
}
.mt-0 { margin-top: 0; }
.card-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 16px; }
.list-hd { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.list-hd .card-title { margin: 0; }
.count-badge { background: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700; border-radius: 20px; padding: 2px 10px; border: 1px solid rgba(16,185,129,.18); }

/* ── Inline form ── */
.inline-form { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
.inline-form.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.if-field { display: flex; flex-direction: column; gap: 5px; min-width: 220px; flex: 1; }
.if-field label { font-size: 12px; font-weight: 600; color: #64748b; }
.req { color: #ef4444; }
.if-actions { display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0; }
.form-actions { display: flex; gap: 8px; margin-top: 14px; justify-content: flex-end; }

.finp {
  height: 36px; padding: 0 12px;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #0f172a; background: #fff;
  outline: none; transition: border-color .15s;
  width: 100%;
}
.finp:focus { border-color: #059669; }

.pw-wrap { position: relative; }
.pw-wrap .finp { padding-right: 36px; }
.pw-eye {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0;
}

/* ── Buttons ── */
.btn-pri {
  display: flex; align-items: center; gap: 6px;
  padding: 0 16px; height: 36px; border-radius: 8px; border: none;
  background: #059669; color: #fff; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: background .15s; white-space: nowrap;
}
.btn-pri:hover { background: #3730a3; }
.btn-sec {
  display: flex; align-items: center; gap: 6px;
  padding: 0 14px; height: 36px; border-radius: 8px;
  border: 1.5px solid #e2e8f0; background: #fff; color: #64748b;
  font-size: 13px; font-weight: 600; cursor: pointer; transition: border-color .15s;
}
.btn-sec:hover { border-color: #cbd5e1; }

/* ── Table ── */
.pq-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.pq-table th {
  padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700;
  letter-spacing: .05em; text-transform: uppercase; color: #94a3b8;
  background: #f8fafc; border-bottom: 1px solid #f1f5f9;
}
.pq-table td { padding: 10px 12px; border-bottom: 1px solid #f8fafc; }
.pq-table tbody tr:hover { background: #fafbfc; }
.pq-table tbody tr:last-child td { border-bottom: none; }
.pq-table tfoot td { padding: 8px 12px; border-top: 1px solid #f1f5f9; background: #fafbfc; }
.row-editing td { background: #f5f3ff !important; }
.mono { font-family: ui-monospace, monospace; }
.muted { color: #94a3b8; }
.fw-6 { font-weight: 600; }
.empty { text-align: center; color: #94a3b8; padding: 28px !important; }

.actions-cell { display: flex; gap: 6px; align-items: center; }
.act-btn {
  width: 28px; height: 28px; border-radius: 6px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: background .12s;
}
.act-btn.edit  { background: #eff6ff; color: #3b82f6; }
.act-btn.edit:hover  { background: #dbeafe; }
.act-btn.del   { background: #fff1f2; color: #f43f5e; }
.act-btn.del:hover   { background: #ffe4e6; }

.nhom-chip {
  display: inline-block; padding: 2px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 700;
  background: #f0fdf4; color: #059669;
}

/* ── Permissions ── */
.perm-toolbar { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.perm-group-select { display: flex; flex-direction: column; gap: 5px; }
.perm-group-select label { font-size: 12px; font-weight: 600; color: #64748b; }
.perm-group-select .finp { width: 220px; }
.perm-toolbar-actions { display: flex; align-items: center; gap: 12px; }
.perm-saved-hint { font-size: 12px; font-weight: 600; color: #059669; }

.perm-table .perm-col { text-align: center; width: 72px; }
.fn-icon { vertical-align: middle; margin-right: 7px; color: #94a3b8; }

.perm-check {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 6px;
  border: 2px solid #e2e8f0; background: #f8fafc; cursor: pointer;
  transition: border-color .12s, background .12s;
}
.perm-check input { display: none; }
.perm-check.checked { background: #059669; border-color: #059669; }
.perm-check.checked::after { content: '✓'; color: #fff; font-size: 12px; font-weight: 800; }

.perm-all-btn {
  font-size: 10px; font-weight: 700; color: #059669;
  background: none; border: none; cursor: pointer; padding: 2px 4px;
  border-radius: 4px; white-space: nowrap;
}
.perm-all-btn:hover { background: #ede9fe; }
</style>
