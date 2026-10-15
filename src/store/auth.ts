import type { User } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '@/supabaseClient';
import type { ProfileWithPcu } from '@/types/models';

export type SessionDeniedReason = 'pending' | 'rejected' | 'unavailable';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const profile = ref<ProfileWithPcu | null>(null);
  const sessionDeniedReason = ref<SessionDeniedReason | null>(null);

  async function fetchSession(): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    user.value = session.user;
    await fetchProfile(user.value.id);

    const status = profile.value?.status ?? null;
    if (status !== 'approved') {
      sessionDeniedReason.value =
        status === 'pending' || status === 'rejected' ? status : 'unavailable';
      await logout();
    }
  }

  async function fetchProfile(userId: string): Promise<void> {
    profile.value = null;
    const { data, error } = await supabase
      .from('profiles_drugcupsabot')
      .select('*, pcus_drugcupsabot(name), status')
      .eq('id', userId)
      .single();
    if (error) console.error('Error fetching profile:', error);
    else profile.value = data as unknown as ProfileWithPcu;
  }

  async function login(email: string, password: string): Promise<void> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    sessionDeniedReason.value = null;

    await fetchProfile(data.user.id);

    const status = profile.value?.status ?? null;

    if (status !== 'approved') {
      await logout();

      if (status === 'pending') {
        throw new Error('บัญชีของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ');
      } else if (status === 'rejected') {
        throw new Error('คำขอลงทะเบียนของคุณถูกปฏิเสธโดยผู้ดูแลระบบ');
      } else if (status === null) {
        throw new Error('ไม่สามารถตรวจสอบสถานะบัญชีได้ กรุณาลองใหม่อีกครั้ง');
      } else {
        throw new Error('บัญชีของคุณยังไม่ถูกเปิดใช้งาน กรุณาติดต่อผู้ดูแล');
      }
    }

    user.value = data.user;
  }

  async function logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error.message);
      }
    } catch (e) {
      console.error('Unexpected error during logout:', e);
    } finally {
      user.value = null;
      profile.value = null;
    }
  }

  function consumeSessionDeniedReason(): SessionDeniedReason | null {
    const reason = sessionDeniedReason.value;
    sessionDeniedReason.value = null;
    return reason;
  }

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => profile.value?.role === 'admin');
  const userPcuName = computed(() => profile.value?.pcus_drugcupsabot?.name || 'N/A');
  const userPcuId = computed(() => profile.value?.pcu_id || null);
  const userProfile = computed(() => profile.value);

  return {
    user,
    profile,
    fetchSession,
    login,
    logout,
    sessionDeniedReason,
    consumeSessionDeniedReason,
    isLoggedIn,
    isAdmin,
    userPcuName,
    userPcuId,
    userProfile,
  };
});
