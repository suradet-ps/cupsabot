<template>
  <a class="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>

  <div v-if="!auth.isLoggedIn || isPublicPage">
    <router-view />
  </div>
  <AdminLayout v-else-if="auth.isAdmin" />
  <PcuLayout v-else />

  <ToastHost />
  <ConfirmDialog />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import ToastHost from '@/components/ToastHost.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import PcuLayout from '@/layouts/PcuLayout.vue';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const route = useRoute();

const isPublicPage = computed(() => {
  const publicPages = [
    'Login',
    'Home',
    'Register',
    'WaitingForApproval',
    'PrintRequisition',
    'PrintRequisitionSummary',
    'PcuPrintRequisition',
    'AccountingReportPrint',
    'ApprovalMemoPrint',
  ];
  return publicPages.includes(route.name);
});
</script>
