<template>
  <header class="master-header">
    <div class="header-search-wrap">
      <div class="search-box-pill">
        <Search :size="18" />
        <input type="text" placeholder="Search agencies, metrics, or logs..." />
        <span class="kb-hint">⌘ K</span>
      </div>
    </div>

    <div class="header-tools">
      <button class="tool-btn"><Moon :size="20" /></button>
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
import { Search, Moon, Bell, ChevronDown } from 'lucide-vue-next';
</script>

<style scoped>
.master-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: transparent;
  z-index: 1001;
}

.search-box-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 10px 20px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  border: 1px solid #f1f5f9;
}

.search-box-pill input { border: none; background: transparent; outline: none; flex: 1; font-weight: 500; font-size: 0.9rem; }
.kb-hint { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); border: 1px solid #e2e8f0; padding: 2px 6px; border-radius: 6px; }

.header-tools { display: flex; align-items: center; gap: 20px; }
.tool-btn { background: white; border: 1px solid #f1f5f9; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-dim); cursor: pointer; position: relative; }
.active-dot { position: absolute; top: 12px; right: 12px; width: 8px; height: 8px; background: #f43f5e; border-radius: 50%; border: 2px solid white; }

.header-location { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--navy-800); font-size: 0.85rem; cursor: pointer; }
</style>
