<template>
  <aside class="sidebar no-print" :class="{ 'is-open': isOpen }" aria-label="แถบนำทางผู้ดูแลระบบ">
    <div class="sidebar-header">
      <span class="logo-badge" aria-hidden="true">
        <i class="fas fa-pills"></i>
      </span>
      <div class="header-text">
        <span class="title">ระบบเบิกยาออนไลน์</span>
        <span class="subtitle">โรงพยาบาลสระโบสถ์</span>
      </div>
    </div>

    <nav class="sidebar-nav" aria-label="เมนูหลัก">
      <div v-for="group in navGroups" :key="group.label" class="nav-group">
        <p class="nav-group-label">{{ group.label }}</p>
        <router-link v-for="item in group.items" :key="item.to" :to="item.to">
          <i :class="item.icon" aria-hidden="true"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ isOpen: boolean }>();

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'ภาพรวม',
    items: [
      { to: '/admin/dashboard', label: 'แดชบอร์ด', icon: 'fas fa-gauge-high' },
      { to: '/admin/item-management', label: 'จัดการรายการยา', icon: 'fas fa-pills' },
    ],
  },
  {
    label: 'รายงานและเอกสาร',
    items: [
      { to: '/admin/requisition-summary', label: 'สรุปผลการเบิก', icon: 'fas fa-calculator' },
      { to: '/admin/reports', label: 'พิมพ์รายงานใบเบิก', icon: 'fas fa-print' },
      { to: '/admin/memo-generator', label: 'พิมพ์บันทึกข้อความ', icon: 'fas fa-file-signature' },
      { to: '/admin/accounting-report', label: 'รายงานบัญชี', icon: 'fas fa-file-invoice-dollar' },
    ],
  },
  {
    label: 'ผู้ใช้และระบบ',
    items: [
      { to: '/admin/user-management', label: 'อนุมัติผู้ใช้งาน', icon: 'fas fa-user-check' },
      { to: '/admin/settings', label: 'ตั้งค่าระบบ', icon: 'fas fa-gear' },
    ],
  },
];
</script>

<style scoped>
.sidebar {
  width: 264px;
  background: var(--gradient-sidebar);
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
  gap: var(--space-3);
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  flex-shrink: 0;
}

.header-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
  overflow: hidden;
}

.header-text .title {
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-text .subtitle {
  font-size: var(--text-micro);
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  padding: var(--space-4) var(--space-3);
  flex-grow: 1;
  overflow-y: auto;
}

.nav-group + .nav-group {
  margin-top: var(--space-5);
}

.nav-group-label {
  margin: 0 0 var(--space-2);
  padding: 0 var(--space-3);
  font-size: var(--text-micro);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-mono);
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  color: rgba(255, 255, 255, 0.78);
  font-size: var(--text-caption);
  font-weight: var(--weight-normal);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition:
    background-color var(--duration-base) var(--easing-standard),
    color var(--duration-base) var(--easing-standard);
}

.sidebar-nav a i {
  width: 18px;
  text-align: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.sidebar-nav a:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  text-decoration: none;
}

.sidebar-nav a.router-link-exact-active,
.sidebar-nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.14);
  border-left-color: var(--color-pink);
  color: #ffffff;
  font-weight: var(--weight-semibold);
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
