<template>
  <div class="admin-layout">
    <AppSidebar :isOpen="isSidebarOpen" />

    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="toggleSidebar"
      aria-hidden="true"
    ></div>

    <div class="main-content">
      <header class="top-header no-print">
        <button
          class="icon-button menu-button"
          @click="toggleSidebar"
          aria-label="เปิด/ปิดเมนู"
          :aria-expanded="isSidebarOpen"
        >
          <i class="fas fa-bars" aria-hidden="true"></i>
        </button>

        <div class="header-spacer"></div>

        <div class="user-info">
          <span class="user-avatar" aria-hidden="true">
            <i class="fas fa-user"></i>
          </span>
          <div class="user-details">
            <span class="username">{{ auth.profile?.username }}</span>
            <span class="role">ผู้ดูแลระบบ</span>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppSidebar from '@/components/AppSidebar.vue';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const router = useRouter();

const isSidebarOpen = ref(false);
function toggleSidebar(): void {
  isSidebarOpen.value = !isSidebarOpen.value;
}

async function handleLogout(): Promise<void> {
  await auth.logout();
  router.push('/login');
}
</script>

<style scoped>
.admin-layout {
  display: flex;
}

.main-content {
  flex-grow: 1;
  margin-left: 264px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-canvas);
  transition: margin-left var(--duration-slow) var(--easing-standard);
}

.top-header {
  position: sticky;
  top: 0;
  z-index: 900;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-hairline);
  padding: 0 var(--space-6);
  height: 60px;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-spacer {
  flex-grow: 1;
}

main {
  flex-grow: 1;
  background-color: var(--color-canvas);
}

main:focus {
  outline: none;
}

/* User info (right zone) */
.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-ink);
}

.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: var(--color-pale-blue);
  color: var(--color-primary);
}

.user-details {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-details .username {
  font-size: var(--text-caption);
  font-weight: var(--weight-medium);
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
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 0.95rem;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-sm);
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
  }
  .menu-button {
    display: inline-flex;
  }
  .sidebar-overlay {
    display: block;
  }
}

@media (max-width: 480px) {
  .user-details {
    display: none;
  }
  .top-header {
    padding: 0 var(--space-4);
  }
}
</style>
