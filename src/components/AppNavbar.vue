<!-- src/components/AppNavbar.vue -->
<template>
    <nav class="navbar no-print">
        <div class="navbar-container">
            <router-link to="/" class="navbar-brand">
                <span class="logo-plate"><i class="fas fa-pills"></i></span>
                <span class="brand-text">ระบบเบิกยาออนไลน์</span>
                <span class="brand-subtext">โรงพยาบาลสระโบสถ์</span>
            </router-link>

            <button
                class="hamburger-menu"
                @click="toggleMenu"
                aria-label="Toggle navigation"
            >
                <i class="fas fa-bars"></i>
            </button>

            <div
                class="nav-links"
                v-if="auth.isLoggedIn"
                :class="{ 'is-open': isMenuOpen }"
            >
                <router-link to="/pcu/dashboard" @click="closeMenu">
                    <i class="fas fa-tachometer-alt"></i> หน้าหลัก รพ.สต.
                </router-link>

                <div class="user-info">
                    <span class="avatar"><i class="fas fa-user"></i></span>
                    <div class="user-details">
                        <span class="username">{{
                            auth.profile?.username
                        }}</span>
                        <span class="role">{{ auth.userPcuName }}</span>
                    </div>
                    <button
                        @click="handleLogout"
                        class="btn-logout"
                        title="ออกจากระบบ"
                    >
                        <i class="fas fa-arrow-right-from-bracket"></i>
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
/* Top nav — 64px, white canvas, hairline rule */
.navbar {
    background-color: var(--color-canvas);
    border-bottom: 1px solid var(--color-hairline-strong);
    padding: 0 var(--space-lg);
    height: 64px;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

/* Brand — logo plate left */
.navbar-brand {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--color-ink);
    text-decoration: none;
    z-index: 10;
}

.logo-plate {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--rounded-md);
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    font-size: 0.95rem;
}

.navbar-brand:hover {
    text-decoration: none;
    color: var(--color-ink);
}

.brand-text {
    font-size: var(--text-body-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-ink);
}

.brand-subtext {
    color: var(--color-muted);
    font-size: var(--text-caption);
}

/* Nav links */
.nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    transition:
        transform var(--duration-slow) var(--easing-standard),
        opacity var(--duration-slow) var(--easing-standard);
}

.nav-links > a {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--color-body);
    text-decoration: none;
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--rounded-md);
    font-size: var(--text-nav-link);
    font-weight: var(--weight-medium);
    transition:
        background-color var(--duration-base) var(--easing-standard),
        color var(--duration-base) var(--easing-standard);
}

.nav-links > a:hover,
.nav-links > a.router-link-exact-active {
    background-color: var(--color-canvas-soft);
    color: var(--color-ink);
    text-decoration: none;
}

/* User info */
.user-info {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding-left: var(--space-base);
    margin-left: var(--space-xs);
    border-left: 1px solid var(--color-hairline);
    color: var(--color-ink);
}

.avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--rounded-full);
    background-color: var(--color-surface-strong);
    color: var(--color-body);
    font-size: 0.85rem;
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
    font-size: var(--text-caption);
    color: var(--color-muted);
}

/* Logout button */
.btn-logout {
    background: none;
    border: 1px solid var(--color-hairline-strong);
    cursor: pointer;
    font-size: 0.8rem;
    border-radius: var(--rounded-md);
    transition:
        color var(--duration-base) var(--easing-standard),
        background-color var(--duration-base) var(--easing-standard),
        border-color var(--duration-base) var(--easing-standard);
    color: var(--color-body);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
}

.btn-logout:hover {
    color: var(--color-danger);
    background-color: var(--color-tint-error);
    border-color: rgba(192, 57, 43, 0.25);
}

/* Hamburger */
.hamburger-menu {
    display: none;
    background: none;
    border: 1px solid var(--color-hairline-strong);
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--color-ink);
    border-radius: var(--rounded-md);
    z-index: 10;
    min-width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
}

@media (max-width: 820px) {
    .brand-subtext {
        display: none;
    }

    .hamburger-menu {
        display: flex;
    }

    .nav-links {
        position: absolute;
        top: calc(100% + var(--space-xs));
        left: 0;
        right: 0;
        background-color: var(--color-canvas);
        border: 1px solid var(--color-hairline-strong);
        border-radius: var(--rounded-lg);
        padding: var(--space-sm);
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
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
        justify-content: flex-start;
        padding: var(--space-sm);
    }

    .user-info {
        border-left: none;
        padding-left: 0;
        padding-top: var(--space-base);
        margin-top: var(--space-xs);
        margin-left: 0;
        border-top: 1px solid var(--color-hairline);
    }

    .user-details {
        flex-grow: 1;
    }
}
</style>
