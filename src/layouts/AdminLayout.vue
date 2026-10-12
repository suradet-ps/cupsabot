<template>
  <div class="admin-shell">
    <AppSidebar :isOpen="isSidebarOpen" />

    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="toggleSidebar"
      aria-hidden="true"
    ></div>

    <div class="main-content">
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
import { computed, ref } from 'vue';
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

const pageTitle = computed(() => (route.meta.title as string | undefined) ?? 'แดชบอร์ด');

async function handleLogout(): Promise<void> {
  await auth.logout();
  router.push('/login');
}
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background:
    radial-gradient(1000px 620px at 100% -10%, rgba(138, 90, 52, 0.12), transparent 60%),
    radial-gradient(820px 560px at -12% 112%, rgba(229, 138, 166, 0.1), transparent 60%),
    var(--color-canvas);
}

.main-content {
  margin-left: 296px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-4) var(--space-6) var(--space-12);
  transition: margin-left var(--duration-slow) var(--easing-standard);
}

/* Floating translucent top bar */
.topbar {
  position: sticky;
  top: var(--space-4);
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-2-5) var(--space-4);
  margin-bottom: var(--space-6);
  background-color: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-card-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-caption);
}

.crumb-root {
  color: var(--color-muted-slate);
}

.breadcrumb i {
  font-size: 0.6rem;
  color: var(--color-hairline);
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
  padding: var(--space-1-5) var(--space-3);
  border-radius: var(--radius-pill);
  background-color: var(--color-soft-stone);
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-brand);
  color: #ffffff;
  font-size: 0.8rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-details .username {
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  color: var(--color-ink);
}

.user-details .role {
  font-size: var(--text-micro);
  color: var(--color-muted-slate);
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  font-size: 0.95rem;
  border: 1px solid var(--color-hairline);
  border-radius: 12px;
  background-color: var(--color-surface);
  color: var(--color-muted-slate);
  cursor: pointer;
  transition:
    color var(--duration-base) var(--easing-standard),
    background-color var(--duration-base) var(--easing-standard),
    border-color var(--duration-base) var(--easing-standard);
}

.icon-button:hover {
  background-color: var(--color-soft-stone);
  color: var(--color-ink);
}

.logout-button:hover {
  color: var(--color-status-rejected);
  background-color: var(--color-status-rejected-bg);
  border-color: rgba(201, 42, 42, 0.25);
}

.menu-button {
  display: none;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(27, 35, 48, 0.45);
  z-index: 1050;
  display: none;
}

@media (max-width: 992px) {
  .main-content {
    margin-left: 0;
    padding: var(--space-3) var(--space-4) var(--space-10);
  }
  .menu-button {
    display: inline-flex;
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
