<template>
  <aside class="atmos-collapsible-sidebar" :class="{ 'is-collapsed': isCollapsed }">
    <!-- Toggle Trigger -->
    <button class="toggle-trigger-btn" @click="$emit('toggle')">
      <ChevronLeft :size="16" v-if="!isCollapsed" />
      <ChevronRight :size="16" v-else />
    </button>

    <div class="brand-unit">
      <div class="brand-aura">
        <Layers :size="24" stroke-width="2.5" />
      </div>
      <div class="brand-meta" v-if="!isCollapsed">
        <span class="b-head">SE104</span>
        <span class="b-sub">Hệ Thống</span>
      </div>
    </div>

    <!-- Master Nav -->
    <nav class="master-links">
      <div class="link-category" v-if="!isCollapsed">QUẢN LÝ CHUNG</div>
      
      <router-link to="/dashboard" class="atmos-link" :class="{ active: isActive('/dashboard') }">
        <div class="l-aura"><LayoutGrid :size="20" /></div>
        <span class="l-text" v-if="!isCollapsed">Tổng Quan</span>
        <div class="active-indicator" v-if="isActive('/dashboard') && !isCollapsed"></div>
      </router-link>

      <router-link to="/dai-ly-list" class="atmos-link" :class="{ active: isActive('/dai-ly-list') }">
        <div class="l-aura"><Users :size="20" /></div>
        <span class="l-text" v-if="!isCollapsed">Hồ Sơ Đại Lý</span>
      </router-link>

      <router-link to="/phieu-nhap" class="atmos-link" :class="{ active: isActive('/phieu-nhap') }">
        <div class="l-aura"><Package :size="20" /></div>
        <span class="l-text" v-if="!isCollapsed">Nhập Xuất Hàng</span>
      </router-link>

      <router-link to="/tra-cuu" class="atmos-link" :class="{ active: isActive('/tra-cuu') }">
        <div class="l-aura"><Search :size="20" /></div>
        <span class="l-text" v-if="!isCollapsed">Tra Cứu</span>
      </router-link>

      <div class="link-category mt-30" v-if="!isCollapsed">NÂNG CAO</div>
      <router-link to="/bao-cao" class="atmos-link" :class="{ active: isActive('/bao-cao') }">
        <div class="l-aura"><PieChart :size="20" /></div>
        <span class="l-text" v-if="!isCollapsed">Báo Cáo Tháng</span>
      </router-link>
      
      <router-link to="/cai-dat" class="atmos-link" :class="{ active: isActive('/cai-dat') }">
        <div class="l-aura"><Settings :size="20" /></div>
        <span class="l-text" v-if="!isCollapsed">Quy Định</span>
      </router-link>
    </nav>

    <!-- Footer Tray (Light) -->
    <div class="sidebar-tray-footer">
      <div class="user-pill-glass">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=30&q=80" alt="Admin" />
        <div class="u-meta-light" v-if="!isCollapsed">
          <strong>Admin</strong>
          <span>SE104 Hub</span>
        </div>
      </div>
      <button class="logout-icon-btn" @click="handleLogout" v-if="!isCollapsed">
        <Power :size="16" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { 
  LayoutGrid, Users, Package, Search, 
  PieChart, Settings, Layers, Power,
  ChevronLeft, ChevronRight 
} from 'lucide-vue-next';

const props = defineProps({
  isCollapsed: Boolean
});

const emit = defineEmits(['toggle']);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isActive = (path) => {
  if (path === '/dashboard') return route.path === '/dashboard';
  if (path === '/dai-ly-list') return route.path === '/dai-ly-list';
  if (path === '/dai-ly') return route.path === '/dai-ly';
  return route.path === path;
};
const handleLogout = () => { authStore.logout(); router.push('/login'); };
</script>

<style scoped>
.atmos-collapsible-sidebar {
  width: calc(var(--sidebar-width) - 40px);
  height: calc(100vh - 40px);
  position: fixed;
  left: 20px;
  top: 20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: var(--radius-xl);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  padding: 30px 16px;
  box-sizing: border-box; /* Fix bottom cutoff */
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: width var(--transition-base), left var(--transition-base);
  overflow: visible; /* Show toggle button */
}

.atmos-collapsible-sidebar.is-collapsed {
  width: var(--sidebar-collapsed);
  padding: 40px 10px;
}

/* Light Brand Styling */
.brand-unit { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-left: 8px; transition: 0.3s; }
.brand-aura {
  width: 38px; height: 38px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
  flex-shrink: 0;
}

.b-head { font-size: 1.4rem; font-weight: 850; color: #0f172a; display: block; letter-spacing: -1px; }
.b-sub { font-size: 0.7rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

/* Toggle Trigger Button */
.toggle-trigger-btn {
  position: absolute; top: 15px; right: -12px;
  width: 24px; height: 24px; background: white; border: 1px solid #f1f5f9;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: #94a3b8; cursor: pointer; z-index: 20; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: 0.3s;
}
.toggle-trigger-btn:hover { background: #10b981; color: white; border-color: #10b981; }

.master-links { flex: 1; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; overflow-x: hidden; padding-right: 5px; }
.master-links::-webkit-scrollbar { width: 3px; }
.master-links::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 99px; }
.link-category { font-size: 0.65rem; font-weight: 800; color: #cbd5e1; margin-bottom: 8px; padding-left: 10px; letter-spacing: 1px; }

.atmos-link {
  display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 12px;
  text-decoration: none; color: #64748b; font-weight: 600; font-size: 0.9rem;
  transition: var(--transition-base);
  position: relative;
}

.l-aura { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 8px; flex-shrink: 0; }
.l-aura :deep(svg) { stroke-width: 1.75; }
.atmos-link:hover { background: rgba(0,0,0,0.02); color: #0f172a; }

.atmos-link.active { background: rgba(16, 185, 129, 0.1); color: #059669; }
.is-collapsed .atmos-link { justify-content: center; padding: 8px; }
.is-collapsed .l-aura { width: 44px; height: 44px; }

.active-indicator {
  position: absolute; right: 0; width: 4px; height: 20px;
  background: #10b981; border-radius: 99px; box-shadow: 0 0 10px #10b981;
}

.mt-30 { margin-top: 16px; }

/* Light Footer Tray */
.sidebar-tray-footer {
  padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.05);
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.user-pill-glass { display: flex; align-items: center; gap: 12px; }
.user-pill-glass img { width: 34px; height: 34px; border-radius: 50%; border: 2px solid #f1f5f9; }
.u-meta-light strong { display: block; color: #0f172a; font-size: 0.85rem; }
.u-meta-light span { color: #94a3b8; font-size: 0.7rem; font-weight: 700; }

.logout-icon-btn {
  background: #f8fafc; border: none; width: 36px; height: 36px;
  border-radius: 10px; color: #94a3b8; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: 0.2s;
}
.logout-icon-btn:hover { background: #fee2e2; color: #ef4444; }
</style>
