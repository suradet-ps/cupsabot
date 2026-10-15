<template>
  <div class="auth-shell">
    <section class="auth-hero">
      <div class="hero-copy">
        <span class="hero-eyebrow">
          <span class="dot" aria-hidden="true"></span> ระบบเบิกยาออนไลน์ · โรงพยาบาลสระโบสถ์
        </span>
        <h1 class="display-lg">เบิกยาและเวชภัณฑ์<br />อย่างเป็นระบบ</h1>
        <p class="hero-lead">
          ตั้งแต่การจัดทำใบเบิก การอนุมัติ ไปจนถึงการจ่ายยา
          ทุกขั้นตอนโปร่งใสและติดตามได้ในที่เดียว
        </p>
        <ul class="hero-points">
          <li><i class="fas fa-check" aria-hidden="true"></i> จัดการใบเบิกได้ทุก รพ.สต.</li>
          <li><i class="fas fa-check" aria-hidden="true"></i> ติดตามสถานะแบบเรียลไทม์</li>
          <li><i class="fas fa-check" aria-hidden="true"></i> เอกสารราชการพร้อมพิมพ์</li>
        </ul>
      </div>

      <div class="hero-art" aria-hidden="true">
        <div class="art-card art-card--beige">
          <span class="art-blob art-blob--sm"></span>
          <span class="art-blob art-blob--lg"></span>
        </div>
        <div class="art-card art-card--brown">
          <span class="art-ring"></span>
        </div>
        <div class="art-card art-card--red">
          <img src="/logo.svg" alt="" class="art-logo" />
        </div>
      </div>
    </section>

    <section class="auth-form">
      <div class="form-card">
        <header class="form-header">
          <h2>เข้าสู่ระบบ</h2>
          <p>สำหรับบุคลากรและผู้ดูแลระบบ</p>
        </header>

        <form @submit.prevent="handleLogin" novalidate>
          <div class="form-group">
            <label for="email">อีเมล</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              autocomplete="email"
              placeholder="name@example.com"
            />
          </div>

          <div class="form-group">
            <label for="password">รหัสผ่าน</label>
            <div class="password-field">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                autocomplete="current-password"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="password-toggle"
                :aria-label="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <p v-if="errorMessage" class="alert alert--error" role="alert">
            <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
            <span>{{ errorMessage }}</span>
          </p>

          <button type="submit" class="btn btn-primary btn-submit" :disabled="loading">
            <i v-if="!loading" class="fas fa-arrow-right-to-bracket" aria-hidden="true"></i>
            <i v-else class="fas fa-spinner fa-spin" aria-hidden="true"></i>
            <span>{{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}</span>
          </button>

          <p class="auth-footer">
            ยังไม่มีบัญชี?
            <router-link to="/register">ลงทะเบียนที่นี่</router-link>
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const email = ref<string>('');
const password = ref<string>('');
const showPassword = ref<boolean>(false);
const loading = ref<boolean>(false);
const errorMessage = ref<string>('');
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  const reason = authStore.consumeSessionDeniedReason();
  if (reason === 'pending') {
    errorMessage.value = 'บัญชีของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ';
  } else if (reason === 'rejected') {
    errorMessage.value = 'คำขอลงทะเบียนของคุณถูกปฏิเสธโดยผู้ดูแลระบบ';
  } else if (reason === 'unavailable') {
    errorMessage.value = 'ไม่สามารถตรวจสอบสถานะบัญชีได้ กรุณาเข้าสู่ระบบอีกครั้ง';
  }
});

async function handleLogin(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-shell {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  min-height: 100vh;
  background-color: var(--color-canvas);
}

/* Hero band — cream canvas, big display type, saturated art cards */
.auth-hero {
  padding: var(--space-16) var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-12);
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  color: var(--color-muted-slate);
  margin-bottom: var(--space-4);
}

.hero-eyebrow .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-brand-red);
}

.hero-copy h1 {
  margin-bottom: var(--space-5);
  max-width: 14ch;
}

.hero-lead {
  font-size: var(--text-body-lg);
  color: var(--color-muted-slate);
  max-width: 46ch;
  margin-bottom: var(--space-6);
}

.hero-points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.hero-points li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-body-sm);
  color: var(--color-ink);
}

.hero-points i {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--color-brand-mint);
  color: var(--color-ink);
  font-size: 0.6rem;
}

.hero-art {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  align-items: end;
}

.art-card {
  position: relative;
  border-radius: var(--radius-xl);
  aspect-ratio: 1;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.art-card--beige {
  background-color: var(--color-brand-beige);
}
.art-card--brown {
  background-color: var(--color-brand-brown);
}
.art-card--red {
  background-color: var(--color-brand-red);
  aspect-ratio: 1;
}

.art-logo {
  display: block;
  width: 78%;
  height: 78%;
}

.art-card--brown {
  aspect-ratio: 1 / 1.35;
}

.art-blob {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.55);
}
.art-blob--sm {
  width: 34%;
  height: 34%;
  top: 16%;
  left: 14%;
}
.art-blob--lg {
  width: 56%;
  height: 56%;
  bottom: -12%;
  right: -8%;
  background-color: rgba(26, 18, 11, 0.12);
}

.art-ring {
  width: 56%;
  height: 56%;
  border-radius: 50%;
  border: 10px solid rgba(26, 18, 11, 0.16);
}

/* Form */
.auth-form {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-10) var(--space-8);
  background-color: var(--color-surface-soft);
  border-left: 1px solid var(--color-hairline);
}

.form-card {
  width: 100%;
  max-width: 400px;
}

.form-header {
  margin-bottom: var(--space-8);
}

.form-header h2 {
  font-size: var(--text-display-sm);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-display-sm);
  margin-bottom: var(--space-2);
}

.form-header p {
  color: var(--color-muted-slate);
  margin: 0;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: var(--space-2);
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-muted-slate);
  cursor: pointer;
}

.password-toggle:hover {
  background-color: var(--color-surface-card);
  color: var(--color-ink);
}

.btn-submit {
  width: 100%;
  margin-top: var(--space-2);
}

.auth-footer {
  margin-top: var(--space-6);
  margin-bottom: 0;
  font-size: var(--text-caption);
  color: var(--color-muted-slate);
  text-align: center;
}

@media (max-width: 960px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }

  .auth-hero {
    padding: var(--space-12) var(--space-6) var(--space-8);
    gap: var(--space-8);
  }

  .hero-art {
    display: none;
  }

  .auth-form {
    border-left: none;
    border-top: 1px solid var(--color-hairline);
    padding: var(--space-8) var(--space-6) var(--space-12);
  }
}
</style>
