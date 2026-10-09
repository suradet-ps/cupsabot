<!-- src/components/AppSidebar.vue -->
<template>
    <aside class="sidebar no-print" :class="{ 'is-open': isOpen }">
        <div class="sidebar-header">
            <span class="logo-plate"><i class="fas fa-pills"></i></span>
            <div class="header-text">
                <span class="title">ระบบเบิกยาออนไลน์</span>
                <span class="subtitle">โรงพยาบาลสระโบสถ์</span>
            </div>
        </div>

        <nav class="sidebar-nav">
            <span class="nav-label">ภาพรวม</span>
            <router-link to="/admin/dashboard">
                <i class="fas fa-tachometer-alt"></i>
                <span>แดชบอร์ด</span>
            </router-link>

            <span class="nav-label">คลังยา</span>
            <router-link to="/admin/item-management">
                <i class="fas fa-dolly-flatbed"></i>
                <span>จัดการยา</span>
            </router-link>
            <router-link to="/admin/requisition-summary">
                <i class="fas fa-calculator"></i>
                <span>สรุปผลเบิก</span>
            </router-link>

            <span class="nav-label">เอกสารและรายงาน</span>
            <router-link to="/admin/reports">
                <i class="fas fa-print"></i>
                <span>พิมพ์รายงานใบเบิก</span>
            </router-link>
            <router-link to="/admin/memo-generator">
                <i class="fas fa-file-signature"></i>
                <span>พิมพ์บันทึกข้อความ</span>
            </router-link>
            <router-link to="/admin/accounting-report">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>รายงานบัญชี</span>
            </router-link>

            <span class="nav-label">ผู้ดูแลระบบ</span>
            <router-link to="/admin/user-management">
                <i class="fas fa-user-check"></i>
                <span>อนุมัติผู้ใช้งาน</span>
            </router-link>
            <router-link to="/admin/settings">
                <i class="fas fa-cog"></i>
                <span>ตั้งค่าระบบ</span>
            </router-link>
        </nav>
    </aside>
</template>

<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
</script>

<style scoped>
/* Light navigation rail — DESIGN.md §top-nav / hairline depth */
.sidebar {
    width: 264px;
    background-color: var(--color-canvas);
    border-right: 1px solid var(--color-hairline-strong);
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    transition: transform var(--duration-slow) var(--easing-standard);
    z-index: 1100;
}

.sidebar-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-base) var(--space-lg);
    height: 64px;
    border-bottom: 1px solid var(--color-hairline);
}

.logo-plate {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: var(--rounded-md);
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    font-size: 0.95rem;
}

.header-text {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
    overflow: hidden;
}

.header-text .title {
    font-size: var(--text-body-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header-text .subtitle {
    font-size: var(--text-caption);
    font-weight: var(--weight-normal);
    color: var(--color-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sidebar-nav {
    padding: var(--space-sm);
    flex-grow: 1;
    overflow-y: auto;
}

.nav-label {
    display: block;
    padding: var(--space-base) var(--space-sm) var(--space-xs);
    font-size: var(--text-caption-uppercase);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-mono);
    text-transform: uppercase;
    color: var(--color-muted);
}

.sidebar-nav a {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: 10px var(--space-sm);
    border-radius: var(--rounded-md);
    color: var(--color-body);
    font-size: var(--text-body-sm);
    font-weight: var(--weight-medium);
    text-decoration: none;
    margin-bottom: 2px;
    transition:
        background-color var(--duration-base) var(--easing-standard),
        color var(--duration-base) var(--easing-standard);
}

.sidebar-nav a i {
    width: 18px;
    text-align: center;
    font-size: 0.9rem;
    flex-shrink: 0;
    color: var(--color-muted);
    transition: color var(--duration-base) var(--easing-standard);
}

.sidebar-nav a:hover {
    background-color: var(--color-canvas-soft);
    color: var(--color-ink);
    text-decoration: none;
}

.sidebar-nav a:hover i {
    color: var(--color-ink);
}

.sidebar-nav a.router-link-exact-active {
    background-color: var(--color-surface-strong);
    color: var(--color-ink);
    font-weight: var(--weight-semibold);
}

.sidebar-nav a.router-link-exact-active i {
    color: var(--color-primary);
}

@media (max-width: 992px) {
    .sidebar {
        transform: translateX(-100%);
        box-shadow: var(--shadow-overlay);
    }
    .sidebar.is-open {
        transform: translateX(0);
    }
}
</style>
