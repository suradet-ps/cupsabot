<template>
  <div class="register-page">
    <div class="register-card">
      <router-link to="/login" class="back-link">
        <i class="fas fa-arrow-left" aria-hidden="true"></i> กลับหน้าเข้าสู่ระบบ
      </router-link>

      <header class="register-header">
        <span class="brand-mark" aria-hidden="true"><i class="fas fa-user-plus"></i></span>
        <h1>สร้างบัญชีใหม่</h1>
        <p>สำหรับบุคลากร รพ.สต. ในเครือข่ายโรงพยาบาลสระโบสถ์</p>
      </header>

      <form @submit.prevent="handleRegister" novalidate>
        <div class="form-group">
          <label for="username">ชื่อ-นามสกุล</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            required
            autocomplete="name"
            placeholder="เช่น สมชาย ใจดี"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="email">อีเมล</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            autocomplete="email"
            placeholder="name@example.com"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">รหัสผ่าน</label>
          <div class="password-field">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              required
              minlength="6"
              autocomplete="new-password"
              placeholder="อย่างน้อย 6 ตัวอักษร"
              aria-describedby="password-hint"
              :disabled="loading"
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
          <p id="password-hint" class="form-hint">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
        </div>

        <div class="form-group">
          <label for="pcu">หน่วยบริการ (รพ.สต.) ของคุณ</label>
          <select
            id="pcu"
            v-model="form.pcu_id"
            required
            :disabled="isPcuLoading || loading"
          >
            <option v-if="isPcuLoading" disabled value="">กำลังโหลดรายชื่อ รพ.สต....</option>
            <option v-else disabled value="">-- กรุณาเลือกรพ.สต. --</option>
            <option v-for="pcu in pcuList" :key="pcu.id" :value="pcu.id">
              {{ pcu.name }}
            </option>
          </select>
        </div>

        <p v-if="errorMessage" class="alert alert--error" role="alert">
          <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
          <span>{{ errorMessage }}</span>
        </p>

        <button type="submit" class="btn btn-primary btn-submit" :disabled="loading">
          <i v-if="loading" class="fas fa-spinner fa-spin" aria-hidden="true"></i>
          <i v-else class="fas fa-check" aria-hidden="true"></i>
          <span>{{ loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน' }}</span>
        </button>
      </form>

      <p class="login-link">
        มีบัญชีอยู่แล้ว?
        <router-link to="/login">เข้าสู่ระบบที่นี่</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { supabase } from '@/supabaseClient';
import type { Pcu } from '@/types/models';

const router = useRouter();
const toast = useToast();
const pcuList = ref<Pcu[]>([]);
const isPcuLoading = ref<boolean>(true);
const loading = ref<boolean>(false);
const errorMessage = ref<string>('');
const showPassword = ref<boolean>(false);

const form = ref<{
  username: string;
  email: string;
  password: string;
  pcu_id: string;
}>({
  username: '',
  email: '',
  password: '',
  pcu_id: '',
});

const APP_BASE_URL: string = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
const EMAIL_REDIRECT_URL = `${APP_BASE_URL}/waiting-for-approval`;

async function fetchPcuList(): Promise<void> {
  try {
    isPcuLoading.value = true;
    const { data, error } = await supabase
      .from('pcus_drugcupsabot')
      .select('id, name')
      .order('name');
    if (error) throw error;
    pcuList.value = (data ?? []) as unknown as Pcu[];
  } catch (err) {
    console.error('Error fetching PCU list:', err);
    errorMessage.value = 'ไม่สามารถโหลดรายชื่อ รพ.สต. ได้ กรุณาลองใหม่อีกครั้ง';
  } finally {
    isPcuLoading.value = false;
  }
}

onMounted(() => {
  fetchPcuList();
});

async function handleRegister(): Promise<void> {
  if (!form.value.pcu_id) {
    errorMessage.value = 'กรุณาเลือก รพ.สต. ของคุณ';
    return;
  }

  const isValidPcu = pcuList.value.some(
    // FIX: HTML <select> v-model returns string, but pcus.id is number.
    // Preserved original behavior: strict equality between number and string
    // is always false, so this branch (and the alert path below) is dead
    // code at runtime. Cast keeps TS happy without changing semantics.
    (pcu) => pcu.id === (form.value.pcu_id as unknown as number),
  );
  if (!isValidPcu) {
    errorMessage.value = 'ข้อมูล รพ.สต. ไม่ถูกต้อง โปรดเลือกใหม่อีกครั้ง';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const { error } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          username: form.value.username.trim(),
          pcu_id: form.value.pcu_id,
          email: form.value.email.trim(),
        },
        emailRedirectTo: EMAIL_REDIRECT_URL,
      },
    });

    if (error) throw error;

    toast.success('การลงทะเบียนสำเร็จ กรุณารอการอนุมัติจากผู้ดูแลระบบก่อนเข้าใช้งาน');
    router.push('/login');
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error) {
      if (error.message.includes('User already registered')) {
        errorMessage.value = 'อีเมลนี้มีการลงทะเบียนแล้ว';
      } else if (error.message.includes('PCU does not exist')) {
        errorMessage.value = 'ข้อมูล รพ.สต. ไม่ถูกต้อง กรุณาเลือกใหม่อีกครั้ง';
      } else {
        errorMessage.value = `เกิดข้อผิดพลาด: ${error.message}`;
      }
    } else {
      errorMessage.value = `เกิดข้อผิดพลาด: ${String(error)}`;
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: var(--space-8) var(--space-4);
  background-color: var(--color-canvas);
}

.register-card {
  width: 100%;
  max-width: 480px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-card);
  animation: fade-in var(--duration-slow) var(--easing-enter);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-caption);
  color: var(--color-muted-slate);
  margin-bottom: var(--space-6);
}

.back-link:hover {
  color: var(--color-primary);
  text-decoration: none;
}

.register-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  color: #ffffff;
  font-size: 1.25rem;
  margin-bottom: var(--space-4);
}

.register-header h1 {
  font-size: var(--text-card-heading);
  margin-bottom: var(--space-2);
}

.register-header p {
  font-size: var(--text-caption);
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
  margin-top: var(--space-4);
}

.login-link {
  margin-top: var(--space-6);
  margin-bottom: 0;
  font-size: var(--text-caption);
  color: var(--color-muted-slate);
  text-align: center;
}

@media (max-width: 480px) {
  .register-card {
    padding: var(--space-6) var(--space-4);
  }
}
</style>
