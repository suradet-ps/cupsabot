<template>
    <div class="auth">
        <!-- Brand panel with sky-blue atmospheric wash -->
        <aside class="auth-aside">
            <router-link to="/" class="auth-brand">
                <span class="logo-plate"><i class="fas fa-pills"></i></span>
                <span class="brand-text">ระบบเบิกยาออนไลน์</span>
            </router-link>

            <div class="aside-body">
                <span class="badge-pill">
                    <i class="fas fa-shield-halved"></i> โรงพยาบาลสระโบสถ์
                </span>
                <h2 class="aside-title">
                    ใบเบิกที่ตามงานได้<br />ตั้งแต่คลินิกถึงชั้นวางยา
                </h2>
                <ul class="aside-list">
                    <li>
                        <i class="fas fa-check"></i> ค้นหาและจัดทำใบเบิกได้ในที่เดียว
                    </li>
                    <li>
                        <i class="fas fa-check"></i> ติดตามสถานะได้ทุกขั้นตอน
                    </li>
                    <li>
                        <i class="fas fa-check"></i> รายงานและเอกสารพร้อมพิมพ์
                    </li>
                </ul>
            </div>

            <span class="aside-foot">© 2568 โรงพยาบาลสระโบสถ์</span>
        </aside>

        <!-- Form panel -->
        <section class="auth-main">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>เข้าสู่ระบบ</h1>
                    <p>กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน</p>
                </div>

                <form @submit.prevent="handleLogin">
                    <div class="form-group">
                        <label for="email">อีเมล</label>
                        <input
                            type="email"
                            id="email"
                            v-model="email"
                            required
                            placeholder="name@example.com"
                            autocomplete="email"
                        />
                    </div>
                    <div class="form-group">
                        <label for="password">รหัสผ่าน</label>
                        <input
                            type="password"
                            id="password"
                            v-model="password"
                            required
                            placeholder="********"
                            autocomplete="current-password"
                        />
                    </div>

                    <p v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </p>

                    <button
                        type="submit"
                        class="btn btn-primary btn-submit"
                        :disabled="loading"
                    >
                        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                        <span>{{
                            loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"
                        }}</span>
                    </button>
                </form>

                <div class="auth-switch">
                    ยังไม่มีบัญชี?
                    <router-link to="/register">ลงทะเบียนที่นี่</router-link>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const email = ref<string>('');
const password = ref<string>('');
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
.auth {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    min-height: 100vh;
    background-color: var(--color-canvas);
}

/* ---------- Brand panel ---------- */
.auth-aside {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--space-xl);
    background-image: var(--gradient-hero);
    background-repeat: no-repeat;
    border-right: 1px solid var(--color-hairline);
}

.auth-brand {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--color-ink);
    text-decoration: none;
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

.brand-text {
    font-size: var(--text-body-sm);
    font-weight: var(--weight-semibold);
}

.aside-body {
    max-width: 460px;
}

.aside-title {
    font-size: var(--text-display-lg);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-section-display);
    color: var(--color-ink);
    border: none;
    padding: 0;
    margin: var(--space-lg) 0;
}

.aside-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.aside-list li {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: var(--text-body-sm);
    color: var(--color-ink);
}

.aside-list i {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: var(--rounded-full);
    background-color: var(--color-ink);
    color: var(--color-on-primary);
    font-size: 0.6rem;
    flex-shrink: 0;
}

.aside-foot {
    font-size: var(--text-caption);
    color: var(--color-muted);
}

/* ---------- Form panel ---------- */
.auth-main {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xl);
}

.auth-card {
    width: 100%;
    max-width: 380px;
    animation: fade-in var(--duration-slow) var(--easing-standard);
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
    margin-bottom: var(--space-xl);
}

.auth-header h1 {
    font-size: var(--text-display-md);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-card-heading);
    color: var(--color-ink);
    margin-bottom: var(--space-xs);
}

.auth-header p {
    font-size: var(--text-body-sm);
    color: var(--color-muted);
    margin: 0;
}

.btn-submit {
    width: 100%;
    margin-top: var(--space-base);
    height: 44px;
}

.error-message {
    color: var(--color-danger);
    font-size: var(--text-caption);
    margin-top: var(--space-xs);
    padding: var(--space-sm) var(--space-base);
    background-color: var(--color-tint-error);
    border: 1px solid rgba(192, 57, 43, 0.2);
    border-radius: var(--rounded-md);
}

.auth-switch {
    margin-top: var(--space-lg);
    font-size: var(--text-body-sm);
    color: var(--color-muted);
    text-align: center;
}

@media (max-width: 900px) {
    .auth {
        grid-template-columns: 1fr;
    }
    .auth-aside {
        display: none;
    }
}
</style>
