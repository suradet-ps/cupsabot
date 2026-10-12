<template>
  <div class="admin-shell">
    <AppSidebar :isOpen="isSidebarOpen" :collapsed="isCollapsed" />

    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="toggleSidebar"
      aria-hidden="true"
    ></div>

    <div class="main-content" :class="{ 'is-collapsed': isCollapsed }">
      <header class="topbar no-print">
        <div class="topbar-left">
          <button
            class="icon-button menu-button"
            @click="toggleSidebar"
            aria-label="เปิด/ปิดเมนู"
            :aria-expanded="isSidebarOpen"
          >
            <i class="fas fa-bars" aria-hidden="true"></i>
          </button>

          <button
            class="icon-button collapse-button"
            @click="toggleCollapse"
            :aria-label="isCollapsed ? 'ขยายเมนู' : 'ย่อเมนู'"
            :aria-pressed="isCollapsed"
            :title="isCollapsed ? 'ขยายเมนู' : 'ย่อเมนู'"
          >
            <i
              :class="isCollapsed ? 'fas fa-angles-right' : 'fas fa-angles-left'"
              aria-hidden="true"
            ></i>
          </button>

          <div class="breadcrumb">
            <span class="crumb-root">ผู้ดูแลระบบ</span>
            <i class="fas fa-chevron-right" aria-hidden="true"></i>
            <span class="crumb-current">{{ pageTitle }}</span>
          </div>
        </div>

        <div class="topbar-right">
          <div class="user-chip">
            <span class="user-avatar" aria-hidden="true">
              <i class="fas fa-user"></i>
            </span>
            <div class="user-details">
              <span class="username">{{ auth.profile?.username }}</span>
              <span class="role">ผู้ดูแลระบบ</span>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="icon-button logout-button"
            title="ออกจากระบบ"
            aria-label="ออกจากระบบ"
          >
            <i class="fas fa-arrow-right-from-bracket" aria-hidden="true"></i>
          </button>
        </div>
      </header>

      <main id="main-content" tabindex="-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppSidebar from '@/components/AppSidebar.vue';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const isSidebarOpen = ref(false);
function toggleSidebar(): void {
  isSidebarOpen.value = !isSidebarOpen.value;
}

const COLLAPSE_KEY = 'cupsabot:sidebar-collapsed';
const isCollapsed = ref<boolean>(localStorage.getItem(COLLAPSE_KEY) === '1');
function toggleCollapse(): void {
  isCollapsed.value = !isCollapsed.value;
}
watch(isCollapsed, (value) => {
  localStorage.setItem(COLLAPSE_KEY, value ? '1' : '0');
});

const pageTitle = computed(() => (route.meta.title as string | undefined) ?? 'แดชบอร์ด');

async function handleLogout(): Promise<void> {
  await auth.logout();
  router.push('/login');
}
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background-color: var(--color-canvas);
}

.main-content {
  margin-left: 264px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-8) var(--space-16);
  transition: margin-left var(--duration-slow) var(--easing-standard);
}

.main-content.is-collapsed {
  margin-left: 76px;
}

/* Flat cream top bar — Clay top-nav */
.topbar {
  position: sticky;
  top: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  height: 64px;
  margin: 0 calc(-1 * var(--space-8)) var(--space-8);
  padding: 0 var(--space-8);
  background-color: var(--color-canvas);
  border-bottom: 1px solid var(--color-hairline);
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-caption);
  padding-left: var(--space-2);
}

.crumb-root {
  color: var(--color-muted-slate);
}

.breadcrumb i {
  font-size: 0.55rem;
  color: var(--color-slate);
}

.crumb-current {
  color: var(--color-ink);
  font-weight: var(--weight-semibold);
}

main {
  flex-grow: 1;
}

main:focus {
  outline: none;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-1) var(--space-3) var(--space-1) var(--space-1);
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-hairline);
  background-color: var(--color-surface-soft);
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--color-brand-pink);
  color: #ffffff;
  font-size: 0.75rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.user-details .username {
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  color: var(--color-ink);
}

.user-details .role {
  font-size: 11px;
  color: var(--color-muted-slate);
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  font-size: 0.85rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--color-ink);
  cursor: pointer;
  transition:
    color var(--duration-base) var(--easing-standard),
    background-color var(--duration-base) var(--easing-standard),
    border-color var(--duration-base) var(--easing-standard);
}

.icon-button:hover {
  background-color: var(--color-surface-card);
  color: var(--color-ink);
}

.logout-button:hover {
  color: var(--color-status-rejected);
  background-color: var(--color-status-rejected-bg);
}

.menu-button {
  display: none;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(26, 18, 11, 0.4);
  z-index: 1050;
  display: none;
}

@media (max-width: 992px) {
  .main-content,
  .main-content.is-collapsed {
    margin-left: 0;
    padding: 0 var(--space-5) var(--space-12);
  }
  .topbar {
    margin: 0 calc(-1 * var(--space-5)) var(--space-6);
    padding: 0 var(--space-5);
  }
  .menu-button {
    display: inline-flex;
  }
  .collapse-button {
    display: none;
  }
  .sidebar-overlay {
    display: block;
  }
}

@media (max-width: 560px) {
  .user-details,
  .crumb-root,
  .breadcrumb i {
    display: none;
  }
}
</style>
