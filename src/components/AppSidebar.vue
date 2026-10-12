<template>
  <aside class="sidebar no-print" :class="{ 'is-open': isOpen }" aria-label="แถบนำทางผู้ดูแลระบบ">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true"><i class="fas fa-pills"></i></span>
      <span class="brand-text">
        <strong>ระบบเบิกยา</strong>
        <small>โรงพยาบาลสระโบสถ์</small>
      </span>
    </div>

    <nav class="nav" aria-label="เมนูหลัก">
      <div v-for="group in navGroups" :key="group.label" class="nav-group">
        <p class="nav-label">{{ group.label }}</p>
        <router-link v-for="item in group.items" :key="item.to" :to="item.to">
          <span class="nav-icon" aria-hidden="true"><i :class="item.icon"></i></span>
          <span class="nav-text">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="support-card">
        <i class="fas fa-circle-info" aria-hidden="true"></i>
        <div>
          <strong>ระบบเบิกยาออนไลน์</strong>
          <span>เวอร์ชันสำหรับผู้ดูแลระบบ</span>
        </div>
      </div>
    </div>
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
  position: fixed;
  top: var(--space-4);
  left: var(--space-4);
  bottom: var(--space-4);
  width: 264px;
  display: flex;
  flex-direction: column;
  border-radius: 22px;
  overflow: hidden;
  background: var(--gradient-sidebar);
  box-shadow: var(--shadow-overlay);
  transition: transform var(--duration-slow) var(--easing-standard);
  z-index: 1100;
}

/* Decorative glow blooms inside the sidebar */
.sidebar::before {
  content: "";
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(229, 138, 166, 0.5), transparent 70%);
  pointer-events: none;
}

.brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-5) var(--space-4);
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: var(--gradient-brand);
  color: #ffffff;
  font-size: 1.15rem;
  box-shadow: 0 8px 20px rgba(138, 90, 52, 0.45);
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  overflow: hidden;
}

.brand-text strong {
  color: #ffffff;
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  white-space: nowrap;
}

.brand-text small {
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--text-micro);
  white-space: nowrap;
}

.nav {
  position: relative;
  flex-grow: 1;
  overflow-y: auto;
  padding: var(--space-2) var(--space-3) var(--space-4);
}

.nav-group + .nav-group {
  margin-top: var(--space-5);
}

.nav-label {
  margin: 0 0 var(--space-2);
  padding: 0 var(--space-2);
  font-size: 10px;
  font-weight: var(--weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}

.nav a {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-1-5) var(--space-2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.72);
  font-size: var(--text-caption);
  font-weight: var(--weight-medium);
  text-decoration: none;
  transition:
    background-color var(--duration-base) var(--easing-standard),
    color var(--duration-base) var(--easing-standard);
}

.nav a + a {
  margin-top: 2px;
}

.nav-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.9rem;
  flex-shrink: 0;
  transition:
    background-color var(--duration-base) var(--easing-standard),
    box-shadow var(--duration-base) var(--easing-standard);
}

.nav a:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  text-decoration: none;
}

.nav a.router-link-exact-active,
.nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.14);
  color: #ffffff;
}

.nav a.router-link-exact-active .nav-icon,
.nav a.router-link-active .nav-icon {
  background: var(--gradient-brand);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(138, 90, 52, 0.45);
}

.sidebar-footer {
  position: relative;
  padding: var(--space-3);
}

.support-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.72);
}

.support-card i {
  color: rgba(255, 255, 255, 0.6);
}

.support-card strong {
  display: block;
  font-size: var(--text-micro);
  font-weight: var(--weight-semibold);
  color: #ffffff;
}

.support-card span {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
}

@media (max-width: 992px) {
  .sidebar {
    transform: translateX(calc(-100% - var(--space-4)));
  }
  .sidebar.is-open {
    transform: translateX(0);
  }
}
</style>
