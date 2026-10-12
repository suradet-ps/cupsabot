<template>
  <nav class="navbar-wrap no-print" aria-label="แถบนำทางหลัก">
    <div class="navbar">
      <router-link to="/" class="navbar-brand">
        <span class="brand-mark" aria-hidden="true"><i class="fas fa-pills"></i></span>
        <span class="brand-text">
          <strong>ระบบเบิกยาออนไลน์</strong>
          <small>โรงพยาบาลสระโบสถ์</small>
        </span>
      </router-link>

      <button
        class="icon-button hamburger-menu"
        @click="toggleMenu"
        aria-label="เปิด/ปิดเมนู"
        :aria-expanded="isMenuOpen"
      >
        <i :class="isMenuOpen ? 'fas fa-xmark' : 'fas fa-bars'" aria-hidden="true"></i>
      </button>

      <div class="nav-links" v-if="auth.isLoggedIn" :class="{ 'is-open': isMenuOpen }">
        <router-link to="/pcu/dashboard" class="nav-item" @click="closeMenu">
          <i class="fas fa-gauge-high" aria-hidden="true"></i>
          หน้าหลัก
        </router-link>

        <div class="user-info">
          <span class="user-avatar" aria-hidden="true">
            <i class="fas fa-user"></i>
          </span>
          <div class="user-details">
            <span class="username">{{ auth.profile?.username }}</span>
            <span class="role">{{ auth.userPcuName }}</span>
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
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu(): void {
  isMenuOpen.value = false;
}

async function handleLogout(): Promise<void> {
  await auth.logout();
  closeMenu();
  router.push('/login');
}
</script>

<style scoped>
.navbar-wrap {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--color-canvas);
  border-bottom: 1px solid var(--color-hairline);
}

.navbar {
  max-width: 1280px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--space-6);
  position: relative;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-ink);
  text-decoration: none;
  z-index: 10;
}

.navbar-brand:hover {
  text-decoration: none;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: var(--color-brand-pink);
  color: #ffffff;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-text strong {
  font-size: var(--text-body-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-ink);
}

.brand-text small {
  font-size: var(--text-micro);
  color: var(--color-muted-slate);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  transition:
    transform var(--duration-slow) var(--easing-standard),
    opacity var(--duration-slow) var(--easing-standard);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-ink);
  text-decoration: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
  font-size: var(--text-caption);
  font-weight: var(--weight-medium);
  transition:
    background-color var(--duration-base) var(--easing-standard),
    color var(--duration-base) var(--easing-standard);
}

.nav-item:hover,
.nav-item.router-link-exact-active {
  background-color: var(--color-ink);
  color: #ffffff;
  text-decoration: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-1) var(--space-3) var(--space-1) var(--space-1);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-pill);
  background-color: var(--color-surface-soft);
  color: var(--color-ink);
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
  font-weight: var(--weight-medium);
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
}

.icon-button:hover {
  background-color: var(--color-surface-card);
  color: var(--color-ink);
}

.logout-button:hover {
  color: var(--color-status-rejected);
  background-color: var(--color-status-rejected-bg);
}

.hamburger-menu {
  display: none;
  z-index: 10;
}

@media (max-width: 820px) {
  .navbar {
    padding: 0 var(--space-5);
  }

  .hamburger-menu {
    display: inline-flex;
  }

  .nav-links {
    position: absolute;
    top: calc(100% + var(--space-2));
    left: var(--space-4);
    right: var(--space-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-hairline);
    border-radius: var(--radius-lg);
    padding: var(--space-3);
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
    opacity: 0;
    transform: translateY(-8px);
    pointer-events: none;
    box-shadow: var(--shadow-overlay);
  }

  .nav-links.is-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .nav-item {
    justify-content: center;
    padding: var(--space-3);
  }

  .user-info {
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
}
</style>
