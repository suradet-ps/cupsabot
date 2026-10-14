<template>
  <div class="home-wrapper">
    <div class="home-card">
      <span class="brand-mark" aria-hidden="true"><img src="/logo.svg" alt="" /></span>
      <p class="eyebrow">ระบบเบิกยาออนไลน์ · โรงพยาบาลสระโบสถ์</p>
      <h1>ยินดีต้อนรับ</h1>
      <p class="welcome-text">คุณ {{ auth.profile?.username }}</p>

      <div v-if="!auth.isAdmin" class="action-box">
        <p class="action-note">คุณเข้าสู่ระบบในฐานะผู้ใช้งาน รพ.สต.</p>
        <button @click="goTo('/pcu/dashboard')" class="btn btn-primary">
          <i class="fas fa-clinic-medical" aria-hidden="true"></i>
          ไปยังหน้าหลัก รพ.สต.
        </button>
      </div>

      <div v-if="auth.isAdmin" class="action-box">
        <p class="action-note">คุณเข้าสู่ระบบในฐานะผู้ดูแลระบบ</p>
        <button @click="goTo('/admin/dashboard')" class="btn btn-primary">
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          ไปยังแดชบอร์ดผู้ดูแลระบบ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const router = useRouter();

function goTo(path: string): void {
  router.push(path);
}
</script>

<style scoped>
.home-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-canvas);
  padding: var(--space-8) var(--space-4);
}

.home-card {
  max-width: 460px;
  width: 100%;
  text-align: center;
  padding: var(--space-10);
  background-color: var(--color-surface);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: var(--space-4);
}

.brand-mark img {
  display: block;
  width: 100%;
  height: 100%;
}

.eyebrow {
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: var(--tracking-mono);
  color: var(--color-muted-slate);
  font-weight: var(--weight-semibold);
  margin-bottom: var(--space-2);
}

.home-card h1 {
  font-size: var(--text-section-heading);
  letter-spacing: var(--tracking-section-heading);
  margin-bottom: var(--space-2);
}

.welcome-text {
  font-size: var(--text-body-lg);
  color: var(--color-muted-slate);
  margin-bottom: var(--space-6);
}

.action-box {
  border-top: 1px solid var(--color-hairline);
  padding-top: var(--space-6);
  margin-top: var(--space-6);
}

.action-note {
  font-size: var(--text-caption);
  color: var(--color-muted-slate);
  margin-bottom: var(--space-4);
}

.action-box .btn {
  width: 100%;
}
</style>
