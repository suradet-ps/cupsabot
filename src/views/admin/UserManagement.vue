<template>
  <div class="container">
    <PageHeader
      title="อนุมัติผู้ใช้งาน"
      subtitle="อนุมัติหรือปฏิเสธคำขอลงทะเบียนจากบุคลากร รพ.สต."
      icon="fas fa-user-check"
    />

    <div v-if="loading" class="loading">กำลังโหลดข้อมูล...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <template v-if="!loading">
      <div v-if="pendingUsers.length > 0" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ชื่อ-นามสกุล</th>
              <th>อีเมล</th>
              <th>หน่วยบริการ (รพ.สต.)</th>
              <th>วันที่ลงทะเบียน</th>
              <th class="text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in pendingUsers" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.pcus_drugcupsabot?.name || 'N/A' }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td class="text-center action-buttons">
                <button
                  type="button"
                  @click="updateUserStatus(user.id, 'approved')"
                  class="btn btn-success btn-sm"
                >
                  <i class="fas fa-check" aria-hidden="true"></i> อนุมัติ
                </button>
                <button
                  type="button"
                  @click="updateUserStatus(user.id, 'rejected')"
                  class="btn btn-danger btn-sm"
                >
                  <i class="fas fa-xmark" aria-hidden="true"></i> ปฏิเสธ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-else
        icon="fas fa-user-clock"
        title="ไม่มีคำขอลงทะเบียนใหม่"
        text="เมื่อมีบุคลากรลงทะเบียน คำขอจะแสดงที่นี่เพื่อรอการอนุมัติ"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import { supabase } from '@/supabaseClient';
import type { ProfileStatus } from '@/types/models';

type PendingUser = {
  id: string;
  username: string;
  email: string;
  created_at: string;
  pcus_drugcupsabot: { name: string } | null;
};

const toast = useToast();
const { confirm } = useConfirm();
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const pendingUsers = ref<PendingUser[]>([]);

async function fetchPendingUsers(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    const { data, error: fetchError } = await supabase
      .from('profiles_drugcupsabot')
      .select(
        `
        id,
        username,
        email,
        created_at,
        pcus_drugcupsabot ( name )
      `,
      )
      .eq('status', 'pending');

    if (fetchError) throw fetchError;
    pendingUsers.value = (data ?? []) as unknown as PendingUser[];
  } catch (err) {
    console.error('Error fetching pending users:', err);
    error.value = 'ไม่สามารถโหลดข้อมูลผู้ใช้ที่รอการอนุมัติได้';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchPendingUsers();
});

async function updateUserStatus(
  userId: string,
  newStatus: Exclude<ProfileStatus, 'pending'>,
): Promise<void> {
  const isApprove = newStatus === 'approved';
  const confirmed = await confirm({
    title: isApprove ? 'ยืนยันการอนุมัติผู้ใช้' : 'ยืนยันการปฏิเสธผู้ใช้',
    message: isApprove ? 'คุณต้องการอนุมัติผู้ใช้งานนี้ใช่หรือไม่?' : 'คุณต้องการปฏิเสธผู้ใช้งานนี้ใช่หรือไม่?',
    confirmLabel: isApprove ? 'อนุมัติ' : 'ปฏิเสธ',
    variant: isApprove ? 'default' : 'danger',
  });
  if (!confirmed) return;

  try {
    const { error: updateError } = await supabase
      .from('profiles_drugcupsabot')
      .update({ status: newStatus })
      .eq('id', userId);

    if (updateError) throw updateError;

    toast.success(isApprove ? 'อนุมัติผู้ใช้งานเรียบร้อยแล้ว' : 'ปฏิเสธผู้ใช้งานเรียบร้อยแล้ว');

    await fetchPendingUsers();
  } catch (err) {
    console.error('Error updating user status:', err);
    toast.error(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
}
</style>
