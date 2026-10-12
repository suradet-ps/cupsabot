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
  top: var(--space-4);
  z-index: 1000;
  padding: 0 var(--space-6);
  margin-bottom: var(--space-2);
}

.navbar {
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--space-4);
  background-color: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-card-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
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
  border-radius: 13px;
  background: var(--gradient-brand);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(138, 90, 52, 0.4);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-text strong {
  font-size: var(--text-caption);
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
  color: var(--color-muted-slate);
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
  background-color: var(--color-pale-blue);
  color: var(--color-primary);
  text-decoration: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-left: var(--space-4);
  border-left: 1px solid var(--color-hairline);
  color: var(--color-ink);
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
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
  width: 38px;
  height: 38px;
  padding: 0;
  font-size: 0.95rem;
  border: 1px solid var(--color-hairline);
  border-radius: 12px;
  background-color: var(--color-surface);
  color: var(--color-muted-slate);
  cursor: pointer;
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

.hamburger-menu {
  display: none;
  z-index: 10;
}

@media (max-width: 820px) {
  .navbar-wrap {
    padding: 0 var(--space-4);
  }

  .hamburger-menu {
    display: inline-flex;
  }

  .nav-links {
    position: absolute;
    top: calc(100% + var(--space-2));
    left: 0;
    right: 0;
    background-color: var(--color-surface);
    border: 1px solid var(--color-hairline);
    border-radius: var(--radius-md);
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
    flex-direction: column;
    border-left: none;
    padding-left: 0;
    padding-top: var(--space-4);
    margin-top: var(--space-2);
    border-top: 1px solid var(--color-hairline);
    width: 100%;
    gap: var(--space-3);
  }

  .user-details {
    text-align: center;
  }
}
</style>
