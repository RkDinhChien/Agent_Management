<template>
  <header class="master-header">

    <!-- ── Search ── -->
    <div class="header-search-wrap" ref="searchWrap">
      <div class="search-box-pill" :class="{ focused: open }" @click="openSearch">
        <Search :size="16" class="search-ic" />
        <input
          ref="inputEl"
          v-model="q"
          type="text"
          placeholder="Tìm đại lý, mặt hàng, trang..."
          @focus="open = true"
          @keydown.escape="close"
          @keydown.down.prevent="moveDown"
          @keydown.up.prevent="moveUp"
          @keydown.enter.prevent="selectActive"
        />
        <span class="kb-hint">⌘ K</span>
      </div>

      <!-- Dropdown results -->
      <Transition name="drop">
        <div class="search-drop" v-if="open && (results.length || q.length === 0)">

          <!-- Empty query → show quick nav -->
          <template v-if="!q.trim()">
            <p class="drop-section-label">Điều hướng nhanh</p>
            <div
              v-for="(item, i) in quickNav"
              :key="'q' + i"
              class="drop-item"
              :class="{ active: activeIdx === i }"
              @mouseenter="activeIdx = i"
              @click="go(item)"
            >
              <span class="drop-icon nav-icon"><component :is="item.icon" :size="14"/></span>
              <span class="drop-label">{{ item.label }}</span>
              <span class="drop-sub">{{ item.sub }}</span>
            </div>
          </template>

          <!-- Query → grouped results -->
          <template v-else-if="results.length">
            <template v-for="group in groupedResults" :key="group.type">
              <p class="drop-section-label">{{ group.label }}</p>
              <div
                v-for="(item, i) in group.items"
                :key="item._key"
                class="drop-item"
                :class="{ active: activeIdx === item._flatIdx }"
                @mouseenter="activeIdx = item._flatIdx"
                @click="go(item)"
              >
                <span class="drop-icon" :class="'icon-' + group.type">
                  <component :is="group.icon" :size="14"/>
                </span>
                <span class="drop-label" v-html="highlight(item.label, q)"></span>
                <span class="drop-sub">{{ item.sub }}</span>
              </div>
            </template>
          </template>

          <!-- No match -->
          <div v-else class="drop-empty">
            <SearchX :size="20"/>
            <span>Không tìm thấy "{{ q }}"</span>
          </div>

        </div>
      </Transition>
    </div>

    <!-- ── Tools ── -->
    <div class="header-tools">
      <router-link to="/phan-quyen" class="tool-btn tool-link" title="Phân quyền">
        <ShieldCheck :size="19" />
      </router-link>
      <router-link to="/cai-dat" class="tool-btn tool-link" title="Cài đặt">
        <Settings :size="19" />
      </router-link>
      <div class="tool-divider"></div>
      <button class="tool-btn">
        <Bell :size="20" />
        <span class="active-dot"></span>
      </button>
      <div class="header-location">
        <span>Vietnam HQ</span>
        <ChevronDown :size="14" />
      </div>
    </div>

  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search, SearchX, Bell, ChevronDown, ShieldCheck, Settings,
  Users, Package, FileInput, FileOutput, Receipt, BarChart2, LayoutDashboard,
} from 'lucide-vue-next';

const router = useRouter();

/* ── State ── */
const q         = ref('');
const open      = ref(false);
const activeIdx = ref(0);
const inputEl   = ref(null);
const searchWrap= ref(null);

/* ── Mock data ── */
const AGENTS = [
  { MaDaiLy:1, TenDaiLy:'Đại lý Tuấn Phát',  SDT:'0901234567', Email:'tuanphat@gmail.com',  DiaChi:'12 Nguyễn Huệ, Q.1' },
  { MaDaiLy:2, TenDaiLy:'Đại lý Lan Anh',     SDT:'0912345678', Email:'lananh@gmail.com',    DiaChi:'45 Lê Lợi, Q.3' },
  { MaDaiLy:3, TenDaiLy:'Đại lý Quốc Khánh',  SDT:'0923456789', Email:'quockhanh@gmail.com', DiaChi:'78 Trần Hưng Đạo, Q.5' },
  { MaDaiLy:4, TenDaiLy:'Đại lý Minh Châu',   SDT:'0934567890', Email:'minhchau@gmail.com',  DiaChi:'101 Nguyễn Trãi, Q.10' },
  { MaDaiLy:5, TenDaiLy:'Đại lý Hoa Phượng',  SDT:'0945678901', Email:'hoaphuong@gmail.com', DiaChi:'23 Đinh Tiên Hoàng, Bình Thạnh' },
  { MaDaiLy:6, TenDaiLy:'Đại lý Thanh Bình',  SDT:'0956789012', Email:'thanhbinh@gmail.com', DiaChi:'55 Phan Văn Trị, Gò Vấp' },
  { MaDaiLy:7, TenDaiLy:'Đại lý Phú Quý',     SDT:'0967890123', Email:'phuquy@gmail.com',    DiaChi:'9 Hai Bà Trưng, Q.1' },
  { MaDaiLy:8, TenDaiLy:'Đại lý Bảo Châu',    SDT:'0978901234', Email:'baochau@gmail.com',   DiaChi:'33 Võ Văn Tần, Q.3' },
];

const PRODUCTS = [
  { id:1, code:'MH-001', name:'Bóng đèn LED 9W',    category:'Đèn LED' },
  { id:2, code:'MH-002', name:'Đèn LED panel 12W',  category:'Đèn LED' },
  { id:3, code:'MH-003', name:'Đèn huỳnh quang T8', category:'Đèn' },
  { id:4, code:'MH-004', name:'Công tắc điện Sino',  category:'Thiết bị điện' },
  { id:5, code:'MH-005', name:'Ổ cắm 3 chấu',        category:'Thiết bị điện' },
  { id:6, code:'MH-006', name:'Cầu dao MCB 20A',     category:'Thiết bị điện' },
  { id:7, code:'MH-007', name:'Dây điện CVV 1.5mm',  category:'Dây cáp' },
  { id:8, code:'MH-008', name:'Relay nhiệt LS 10A',  category:'Thiết bị điện' },
];

/* ── Quick nav (shown when query empty) ── */
const quickNav = [
  { label:'Dashboard',       sub:'Tổng quan hệ thống',       icon: LayoutDashboard, route:'/dashboard' },
  { label:'Hồ Sơ Đại Lý',   sub:'Danh sách & công nợ',       icon: Users,           route:'/dai-ly-list' },
  { label:'Mặt Hàng',       sub:'Danh mục sản phẩm',         icon: Package,         route:'/mat-hang' },
  { label:'Phiếu Nhập',     sub:'Nhập hàng từ nhà cung cấp', icon: FileInput,       route:'/phieu-nhap' },
  { label:'Phiếu Xuất',     sub:'Xuất hàng cho đại lý',      icon: FileOutput,      route:'/phieu-xuat' },
  { label:'Thu Tiền',       sub:'Thu hồi công nợ',           icon: Receipt,         route:'/thu-tien' },
  { label:'Báo Cáo',        sub:'Doanh số & công nợ',        icon: BarChart2,       route:'/bao-cao' },
];

/* ── Search results ── */
const results = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return [];
  const out = [];

  AGENTS.forEach(a => {
    if (
      a.TenDaiLy.toLowerCase().includes(term) ||
      a.SDT.includes(term) ||
      a.Email.toLowerCase().includes(term) ||
      a.DiaChi.toLowerCase().includes(term)
    ) {
      out.push({ type:'agent', label: a.TenDaiLy, sub: a.SDT + ' · ' + a.Email, route:'/dai-ly-list', _key:'a'+a.MaDaiLy });
    }
  });

  PRODUCTS.forEach(p => {
    if (
      p.name.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    ) {
      out.push({ type:'product', label: p.name, sub: p.code + ' · ' + p.category, route:'/mat-hang', _key:'p'+p.id });
    }
  });

  return out.map((r, i) => ({ ...r, _flatIdx: i }));
});

const groupedResults = computed(() => {
  const groups = [];
  const agents   = results.value.filter(r => r.type === 'agent');
  const products = results.value.filter(r => r.type === 'product');
  if (agents.length)   groups.push({ type:'agent',   label:'Đại lý',   icon: Users,   items: agents });
  if (products.length) groups.push({ type:'product', label:'Mặt hàng', icon: Package, items: products });
  return groups;
});

/* ── Keyboard nav ── */
const totalItems = computed(() => q.value.trim() ? results.value.length : quickNav.length);

const moveDown = () => { activeIdx.value = (activeIdx.value + 1) % totalItems.value; };
const moveUp   = () => { activeIdx.value = (activeIdx.value - 1 + totalItems.value) % totalItems.value; };

const selectActive = () => {
  if (!q.value.trim()) { go(quickNav[activeIdx.value]); return; }
  const item = results.value[activeIdx.value];
  if (item) go(item);
};

/* ── Actions ── */
const openSearch = () => { open.value = true; inputEl.value?.focus(); };
const close = () => { open.value = false; q.value = ''; activeIdx.value = 0; inputEl.value?.blur(); };

const go = (item) => {
  router.push(item.route);
  close();
};

/* ── Highlight matched text ── */
const highlight = (text, term) => {
  if (!term) return text;
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
};

/* ── Global ⌘K / Ctrl+K shortcut ── */
const onKey = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (open.value) { close(); } else { openSearch(); }
  }
};

/* ── Click outside to close ── */
const onClickOutside = (e) => {
  if (searchWrap.value && !searchWrap.value.contains(e.target)) close();
};

onMounted(() => {
  window.addEventListener('keydown', onKey);
  document.addEventListener('mousedown', onClickOutside);
});
onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
  document.removeEventListener('mousedown', onClickOutside);
});
</script>

<style scoped>
.master-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: transparent;
  z-index: 1001;
}

/* ── Search box ── */
.header-search-wrap { position: relative; }

.search-box-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 9px 16px;
  border-radius: 12px;
  width: 380px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  border: 1.5px solid #f1f5f9;
  cursor: text;
  transition: border-color .15s, box-shadow .15s;
}
.search-box-pill.focused {
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(5,150,105,.1), 0 2px 8px rgba(0,0,0,.05);
}
.search-ic { color: #94a3b8; flex-shrink: 0; }
.search-box-pill input {
  border: none; background: transparent; outline: none;
  flex: 1; font-weight: 500; font-size: 0.875rem; color: #0f172a;
}
.search-box-pill input::placeholder { color: #94a3b8; }
.kb-hint {
  font-size: 0.68rem; font-weight: 700; color: #94a3b8;
  border: 1px solid #e2e8f0; padding: 2px 6px; border-radius: 5px;
  white-space: nowrap; flex-shrink: 0;
}

/* ── Dropdown ── */
.search-drop {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 420px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.06);
  padding: 8px 0;
  z-index: 2000;
  max-height: 420px;
  overflow-y: auto;
}

.drop-section-label {
  font-size: 10px; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: #94a3b8;
  padding: 8px 14px 4px; margin: 0;
}

.drop-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 14px; cursor: pointer;
  transition: background .1s;
}
.drop-item:hover, .drop-item.active { background: #f8fafc; }

.drop-icon {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px;
}
.icon-agent   { background: #ecfdf5; color: #059669; }
.icon-product { background: #eff6ff; color: #3b82f6; }
.nav-icon     { background: #f8fafc; color: #64748b; }

.drop-label {
  flex: 1; font-size: 13px; font-weight: 600; color: #0f172a;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
/* highlight match */
.drop-label :deep(mark) {
  background: #fef08a; color: #713f12; border-radius: 2px;
  padding: 0 1px;
}
.drop-sub {
  font-size: 11px; color: #94a3b8; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; max-width: 140px;
}

.drop-empty {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; padding: 24px 0; color: #94a3b8; font-size: 13px;
}

/* ── Transition ── */
.drop-enter-active, .drop-leave-active { transition: opacity .15s, transform .15s; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Tools ── */
.header-tools { display: flex; align-items: center; gap: 20px; }
.tool-btn {
  background: white; border: 1px solid #f1f5f9;
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #64748b; cursor: pointer; position: relative;
  transition: border-color .15s, box-shadow .15s;
}
.tool-btn:hover { border-color: #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.active-dot {
  position: absolute; top: 10px; right: 10px;
  width: 8px; height: 8px;
  background: #f43f5e; border-radius: 50%; border: 2px solid white;
}
.tool-link { text-decoration: none; color: inherit; }
.tool-divider { width: 1px; height: 22px; background: #e2e8f0; }
.header-location {
  display: flex; align-items: center; gap: 8px;
  font-weight: 700; color: #0f172a; font-size: 0.85rem; cursor: pointer;
}
</style>
