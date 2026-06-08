<template>
  <div class="atmos-master-app" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- Unique Floating Sidebar -->
    <Sidebar :isCollapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
    
    <!-- Robust Main Area (Overlap Fixed) -->
    <div class="main-body-view" :class="{ 'is-collapsed': sidebarCollapsed }">
      <div class="master-content-wrapper">
        <Header />
        <main class="primary-viewport">
          <router-view />
        </main>
      </div>
    </div>

    <!-- Global floating chat -->
    <ChatBox />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import ChatBox from '../ChatBox.vue';

const sidebarCollapsed = ref(false);
</script>

<style scoped>
.atmos-master-app {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* FIXING THE OVERLAP: Using fixed sidebar width for spacing */
.main-body-view {
  flex: 1;
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left var(--transition-base);
}

.main-body-view.is-collapsed {
  margin-left: var(--sidebar-collapsed);
}

.master-content-wrapper {
  max-width: 1600px;
  width: 100%;
  margin: 0;
  padding: 10px 30px 30px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.primary-viewport {
  flex: 1;
  margin-top: 5px;
  animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1200px) {
  .master-content-wrapper { padding: 20px; }
}

@media (max-width: 1024px) {
  .main-body-view { margin-left: 0; }
  .atmos-master-app { flex-direction: column; }
}
</style>
