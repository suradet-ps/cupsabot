<template>
  <div class="auth-shell">
    <aside class="auth-aside" aria-hidden="true">
      <div class="brand">
        <span class="brand-mark"><i class="fas fa-pills"></i></span>
        <span class="brand-name">ระบบเบิกยาออนไลน์</span>
      </div>
      <div class="aside-copy">
        <h2>เบิกยาและเวชภัณฑ์<br />อย่างเป็นระบบ</h2>
        <p>
          ตั้งแต่การจัดทำใบเบิก การอนุมัติ ไปจนถึงการจ่ายยา
          ทุกขั้นตอนโปร่งใสและติดตามได้ในที่เดียว
        </p>
      </div>
      <ul class="aside-points">
        <li><i class="fas fa-check" aria-hidden="true"></i> จัดการใบเบิกได้ทุก รพ.สต.</li>
        <li><i class="fas fa-check" aria-hidden="true"></i> ติดตามสถานะแบบเรียลไทม์</li>
        <li><i class="fas fa-check" aria-hidden="true"></i> เอกสารราชการพร้อมพิมพ์</li>
      </ul>
    </aside>

    <div class="auth-main">
      <div class="auth-card">
        <header class="auth-header">
          <h1>เข้าสู่ระบบ</h1>
          <p>โรงพยาบาลสระโบสถ์</p>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const email = ref<string>('');
const password = ref<string>('');
const showPassword = ref<boolean>(false);
const loading = ref<boolean>(false);
const errorMessage = ref<string>('');
const authStore = useAuthStore();
const router = useRouter();

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
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background-color: var(--color-canvas);
}

.auth-aside {
  background: var(--gradient-sidebar);
  color: #ffffff;
  padding: var(--space-10);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-12);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.14);
}

.brand-name {
  font-weight: var(--weight-semibold);
}

.aside-copy h2 {
  color: #ffffff;
  font-size: var(--text-section-heading);
  letter-spacing: var(--tracking-section-heading);
  line-height: var(--leading-snug);
  margin-bottom: var(--space-4);
}

.aside-copy p {
  color: rgba(255, 255, 255, 0.78);
  max-width: 42ch;
  margin: 0;
}

.aside-points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.aside-points li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--text-caption);
}

.aside-points i {
  color: var(--color-pink);
}

.auth-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-6);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  animation: fade-in var(--duration-slow) var(--easing-enter);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  margin-bottom: var(--space-8);
}

.auth-header h1 {
  font-size: var(--text-card-heading);
  margin-bottom: var(--space-1-5);
}

.auth-header p {
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
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-xs);
  background: transparent;
  color: var(--color-muted-slate);
  cursor: pointer;
}

.password-toggle:hover {
  background-color: var(--color-soft-stone);
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

@media (max-width: 860px) {
  .auth-shell {
    grid-template-columns: 1fr;
    min-height: 100vh;
  }

  .auth-aside {
    padding: var(--space-8) var(--space-6);
    gap: var(--space-6);
  }

  .aside-points {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth-card {
    max-width: 100%;
  }
}
</style>
