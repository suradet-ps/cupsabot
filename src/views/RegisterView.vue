<!-- src/views/RegisterView.vue -->
<template>
    <div class="auth">
        <aside class="auth-aside">
            <router-link to="/" class="auth-brand">
                <span class="logo-plate"><i class="fas fa-pills"></i></span>
                <span class="brand-text">ระบบเบิกยาออนไลน์</span>
            </router-link>

            <div class="aside-body">
                <span class="badge-pill">
                    <i class="fas fa-user-plus"></i> สมัครใช้งาน
                </span>
                <h2 class="aside-title">สร้างบัญชีสำหรับ<br />บุคลากร รพ.สต.</h2>
                <p class="aside-text">
                    กรอกข้อมูลให้ครบถ้วน จากนั้นรอการอนุมัติจากผู้ดูแลระบบ
                    ก่อนเข้าใช้งานครั้งแรก
                </p>
            </div>

            <span class="aside-foot">© 2568 โรงพยาบาลสระโบสถ์</span>
        </aside>

        <section class="auth-main">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>สร้างบัญชีใหม่</h1>
                    <p>สำหรับบุคลากร รพ.สต. ในเครือข่ายโรงพยาบาลสระโบสถ์</p>
                </div>

                <form @submit.prevent="handleRegister">
                    <div class="form-group">
                        <label for="username">ชื่อ-นามสกุล</label>
                        <input
                            type="text"
                            id="username"
                            v-model="form.username"
                            required
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
                            placeholder="name@example.com"
                            :disabled="loading"
                        />
                    </div>

                    <div class="form-group">
                        <label for="password">รหัสผ่าน</label>
                        <input
                            type="password"
                            id="password"
                            v-model="form.password"
                            required
                            placeholder="อย่างน้อย 6 ตัวอักษร"
                            :disabled="loading"
                        />
                    </div>

                    <div class="form-group">
                        <label for="pcu">หน่วยบริการ (รพ.สต.) ของคุณ</label>
                        <select
                            id="pcu"
                            v-model="form.pcu_id"
                            required
                            :disabled="isPcuLoading || loading"
                        >
                            <option v-if="isPcuLoading" disabled value="">
                                กำลังโหลดรายชื่อ รพ.สต....
                            </option>
                            <option v-else disabled value="">
                                -- กรุณาเลือกรพ.สต. --
                            </option>
                            <option
                                v-for="pcu in pcuList"
                                :key="pcu.id"
                                :value="pcu.id"
                            >
                                {{ pcu.name }}
                            </option>
                        </select>
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
                            loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"
                        }}</span>
                    </button>
                </form>

                <div class="auth-switch">
                    มีบัญชีอยู่แล้ว?
                    <router-link to="/login">เข้าสู่ระบบที่นี่</router-link>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabaseClient';
import type { Pcu } from '@/types/models';

const router = useRouter();
const pcuList = ref<Pcu[]>([]);
const isPcuLoading = ref<boolean>(true);
const loading = ref<boolean>(false);
const errorMessage = ref<string>('');

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
    (pcu) => pcu.id === (form.value.pcu_id as unknown as number),
  );
  if (!isValidPcu) {
    errorMessage.value = 'ข้อมูล รพ.สต. ไม่ถูกต้อง โปรดเลือกใหม่อีกครั้ง';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const { data, error } = await supabase.auth.signUp({
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

    alert('การลงทะเบียนสำเร็จ! กรุณารอการอนุมัติจากผู้ดูแลระบบก่อนเข้าใช้งาน');
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
    margin: var(--space-lg) 0 var(--space-base);
}

.aside-text {
    font-size: var(--text-body-sm);
    color: var(--color-body);
    max-width: 400px;
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
    background-color: var(--color-tint-error);
    border: 1px solid rgba(192, 57, 43, 0.2);
    border-radius: var(--rounded-md);
    padding: var(--space-sm) var(--space-base);
    margin-top: var(--space-xs);
    font-size: var(--text-caption);
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
