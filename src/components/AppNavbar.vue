<template>
  <nav class="navbar no-print" aria-label="แถบนำทางหลัก">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        <span class="logo-badge" aria-hidden="true">
          <i class="fas fa-pills"></i>
        </span>
        <span class="brand-text">
          <span class="brand-title">ระบบเบิกยาออนไลน์</span>
          <span class="brand-subtext">โรงพยาบาลสระโบสถ์</span>
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
        <router-link to="/pcu/dashboard" @click="closeMenu">
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
.navbar {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-hairline);
  padding: 0 var(--space-6);
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1180px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.logo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--gradient-primary);
  color: #ffffff;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-title {
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  color: var(--color-ink);
}

.brand-subtext {
  font-size: var(--text-micro);
  color: var(--color-muted-slate);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition:
    transform var(--duration-slow) var(--easing-standard),
    opacity var(--duration-slow) var(--easing-standard);
}

.nav-links > a {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-muted-slate);
  text-decoration: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-caption);
  font-weight: var(--weight-medium);
  transition:
    background-color var(--duration-base) var(--easing-standard),
    color var(--duration-base) var(--easing-standard);
}

.nav-links > a:hover,
.nav-links > a.router-link-exact-active {
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
  .navbar {
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

  .nav-links > a {
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
