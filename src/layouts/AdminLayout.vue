<!-- src/layouts/AdminLayout.vue -->
<template>
    <div class="admin-layout">
        <AppSidebar :isOpen="isSidebarOpen" />

        <div
            v-if="isSidebarOpen"
            class="sidebar-overlay"
            @click="toggleSidebar"
        ></div>

        <div class="main-content">
            <header class="top-header no-print">
                <button
                    class="hamburger-menu"
                    @click="toggleSidebar"
                    aria-label="Toggle Sidebar"
                >
                    <i class="fas fa-bars"></i>
                </button>

                <div class="header-spacer"></div>

                <div class="user-info">
                    <span class="avatar"><i class="fas fa-user-shield"></i></span>
                    <div class="user-details">
                        <span class="username">{{
                            auth.profile?.username
                        }}</span>
                        <span class="role">ผู้ดูแลระบบ</span>
                    </div>
                    <button
                        @click="handleLogout"
                        class="btn-logout"
                        title="ออกจากระบบ"
                    >
                        <i class="fas fa-arrow-right-from-bracket"></i>
                    </button>
                </div>
            </header>
            <main>
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
function toggleSidebar() {
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
    background-color: var(--color-canvas-soft);
    transition: margin-left var(--duration-slow) var(--easing-standard);
}

/* Top header — white canvas, hairline rule, right-aligned user zone */
.top-header {
    background-color: var(--color-canvas);
    border-bottom: 1px solid var(--color-hairline-strong);
    padding: 0 var(--space-lg);
    height: 64px;
    display: flex;
    align-items: center;
    gap: var(--space-base);
    position: sticky;
    top: 0;
    z-index: 900;
}

.header-spacer {
    flex-grow: 1;
}

main {
    flex-grow: 1;
}

/* User info (right zone) */
.user-info {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
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
    line-height: 1;
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

/* Hamburger for mobile */
.hamburger-menu {
    display: none;
    font-size: 0.9rem;
    background: none;
    border: 1px solid var(--color-hairline-strong);
    color: var(--color-ink);
    cursor: pointer;
    border-radius: var(--rounded-md);
    min-width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
}

/* Dark overlay when sidebar is open on mobile */
.sidebar-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1050;
    display: none;
}

@media (max-width: 992px) {
    .main-content {
        margin-left: 0;
    }
    .hamburger-menu {
        display: flex;
    }
    .sidebar-overlay {
        display: block;
    }
}

@media (max-width: 640px) {
    .user-details {
        display: none;
    }
}
</style>
