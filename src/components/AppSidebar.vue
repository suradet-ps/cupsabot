<template>
  <aside
    class="sidebar no-print"
    :class="{ 'is-open': isOpen, 'is-collapsed': collapsed }"
    aria-label="แถบนำทางผู้ดูแลระบบ"
  >
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
        <router-link
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :title="collapsed ? item.label : undefined"
        >
          <span class="nav-icon" aria-hidden="true"><i :class="item.icon"></i></span>
          <span class="nav-text">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="support-card" :title="collapsed ? 'ระบบเบิกยาออนไลน์' : undefined">
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
defineProps<{ isOpen: boolean; collapsed: boolean }>();

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
  top: 0;
  left: 0;
  bottom: 0;
  width: 264px;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface-soft);
  border-right: 1px solid var(--color-hairline);
  transition: width var(--duration-slow) var(--easing-standard);
  z-index: 1100;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-4);
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: var(--color-brand-pink);
  color: #ffffff;
  font-size: 1.05rem;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  overflow: hidden;
}

.brand-text strong {
  color: var(--color-ink);
  font-size: var(--text-body-sm);
  font-weight: var(--weight-semibold);
  white-space: nowrap;
}

.brand-text small {
  color: var(--color-muted-slate);
  font-size: var(--text-micro);
  white-space: nowrap;
}

.nav {
  flex-grow: 1;
  overflow-y: auto;
  padding: var(--space-2) var(--space-3) var(--space-4);
}

.nav-group + .nav-group {
  margin-top: var(--space-5);
}

.nav-label {
  margin: 0 0 var(--space-2);
  padding: 0 var(--space-3);
  font-size: 11px;
  font-weight: var(--weight-semibold);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--color-slate);
}

.nav a {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-ink);
  font-size: var(--text-body-sm);
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
  width: 22px;
  font-size: 0.9rem;
  color: var(--color-muted-slate);
  flex-shrink: 0;
}

.nav a:hover {
  background-color: var(--color-surface-card);
  color: var(--color-ink);
  text-decoration: none;
}

.nav a.router-link-exact-active,
.nav a.router-link-active {
  background-color: var(--color-ink);
  color: #ffffff;
}

.nav a.router-link-exact-active .nav-icon,
.nav a.router-link-active .nav-icon {
  color: #ffffff;
}

.sidebar-footer {
  padding: var(--space-3);
  border-top: 1px solid var(--color-hairline);
}

.support-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background-color: var(--color-surface-card);
  color: var(--color-muted-slate);
}

.support-card i {
  color: var(--color-brand-pink);
  flex-shrink: 0;
}

.support-card strong {
  display: block;
  font-size: var(--text-micro);
  font-weight: var(--weight-semibold);
  color: var(--color-ink);
}

.support-card span {
  font-size: 11px;
  color: var(--color-muted-slate);
}

/* Collapsed (icon-only) state */
.sidebar.is-collapsed {
  width: 76px;
}

.sidebar.is-collapsed .brand {
  justify-content: center;
  padding-inline: var(--space-2);
}

.sidebar.is-collapsed .brand-text,
.sidebar.is-collapsed .nav-text,
.sidebar.is-collapsed .support-card > div {
  display: none;
}

.sidebar.is-collapsed .nav-label {
  text-align: center;
  padding: 0;
  font-size: 0;
  height: 1px;
  margin: var(--space-3) var(--space-2) var(--space-1-5);
  background-color: var(--color-hairline);
}

.sidebar.is-collapsed .nav {
  padding-inline: var(--space-2);
}

.sidebar.is-collapsed .nav a {
  justify-content: center;
  padding-inline: var(--space-2);
}

.sidebar.is-collapsed .support-card {
  justify-content: center;
}

@media (max-width: 992px) {
  .sidebar,
  .sidebar.is-collapsed {
    width: 264px;
    transform: translateX(-100%);
  }
  .sidebar.is-open {
    transform: translateX(0);
  }
  /* Never collapse on mobile */
  .sidebar.is-collapsed .brand-text {
    display: flex;
  }
  .sidebar.is-collapsed .nav-text {
    display: inline;
  }
  .sidebar.is-collapsed .support-card > div {
    display: block;
  }
  .sidebar.is-collapsed .nav-label {
    font-size: 11px;
    height: auto;
    margin: 0 0 var(--space-2);
    padding: 0 var(--space-3);
    background-color: transparent;
    text-align: left;
  }
  .sidebar.is-collapsed .nav {
    padding-inline: var(--space-3);
  }
  .sidebar.is-collapsed .brand,
  .sidebar.is-collapsed .nav a,
  .sidebar.is-collapsed .support-card {
    justify-content: flex-start;
  }
}
</style>
