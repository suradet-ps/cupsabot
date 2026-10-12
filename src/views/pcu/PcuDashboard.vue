<template>
  <div class="container">
    <PageHeader
      title="หน้าหลัก"
      :subtitle="auth.userPcuName"
      icon="fas fa-clinic-medical"
    />

    <div v-if="loading" class="loading">กำลังโหลดข้อมูล...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <template v-if="!loading && !error">
      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <i class="fas fa-calendar-check" aria-hidden="true"></i>
            รอบการเบิกที่เปิดอยู่
            <span class="panel-count">{{ openPeriods.length }}</span>
          </h2>
        </div>

        <div class="panel-body">
          <div v-if="openPeriods.length > 0" class="period-grid">
            <article v-for="period in openPeriods" :key="period.id" class="period-card">
              <div class="period-head">
                <h3>{{ period.name }}</h3>
                <StatusBadge
                  v-if="hasRequisition(period.id)"
                  :status="getRequisitionStatus(period.id)"
                />
              </div>

              <p class="period-dates">
                <i class="far fa-calendar" aria-hidden="true"></i>
                เปิดเบิก {{ formatDate(period.start_date) }} – {{ formatDate(period.end_date) }}
              </p>

              <div class="period-actions">
                <button
                  v-if="!hasRequisition(period.id)"
                  @click="goToRequisition(period.id, null)"
                  class="btn btn-primary"
                >
                  <i class="fas fa-plus" aria-hidden="true"></i> สร้างใบเบิกใหม่
                </button>

                <button
                  v-else-if="getRequisitionStatus(period.id) === 'draft'"
                  @click="goToRequisition(period.id, getRequisitionId(period.id))"
                  class="btn btn-warning"
                >
                  <i class="fas fa-pen-to-square" aria-hidden="true"></i> แก้ไขฉบับร่าง
                </button>

                <router-link
                  v-else-if="getRequisitionId(period.id)"
                  :to="{
                    name: 'RequisitionDetail',
                    params: { requisitionId: getRequisitionId(period.id) },
                  }"
                  class="btn btn-secondary"
                >
                  <i class="fas fa-magnifying-glass" aria-hidden="true"></i> ดูรายละเอียด
                </router-link>
              </div>
            </article>
          </div>

          <EmptyState
            v-else
            icon="fas fa-calendar-xmark"
            title="ยังไม่มีรอบการเบิกที่เปิดใช้งาน"
            text="เมื่อผู้ดูแลระบบเปิดรอบการเบิก รายการจะแสดงที่นี่"
          />
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <i class="fas fa-history" aria-hidden="true"></i>
            ประวัติการเบิก
            <span class="panel-count">{{ historyRequisitions.length }}</span>
          </h2>
        </div>

        <div v-if="historyRequisitions.length > 0" class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>รอบเบิก</th>
                <th>วันที่ส่ง</th>
                <th>สถานะ</th>
                <th class="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in historyRequisitions" :key="req.id">
                <td class="bold">{{ req.requisition_periods_drugcupsabot.name }}</td>
                <td>{{ formatSubmitDate(req.submitted_at) }}</td>
                <td><StatusBadge :status="req.status" /></td>
                <td class="text-center">
                  <router-link
                    :to="{
                      name: 'RequisitionDetail',
                      params: { requisitionId: req.id },
                    }"
                    class="btn btn-info btn-sm"
                  >
                    <i class="fas fa-magnifying-glass" aria-hidden="true"></i> ดูรายละเอียด
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <EmptyState
          v-else
          icon="fas fa-inbox"
          title="ยังไม่มีประวัติการเบิก"
          text="ใบเบิกที่ส่งแล้วจะแสดงอยู่ที่นี่"
        />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/supabaseClient';
import type { RequisitionPeriod, RequisitionStatus } from '@/types/models';

type ExistingRequisition = {
  id: number;
  period_id: number;
  status: RequisitionStatus;
  created_at: string;
  submitted_at: string | null;
  requisition_periods_drugcupsabot: { name: string };
};

const router = useRouter();
const auth = useAuthStore();

const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const openPeriods = ref<RequisitionPeriod[]>([]);
const existingRequisitions = ref<ExistingRequisition[]>([]);

const historyRequisitions = computed<ExistingRequisition[]>(() => {
  return existingRequisitions.value
    .filter((req) => req.status !== 'draft')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

onMounted(async () => {
  if (!auth.userPcuId) {
    error.value = 'ไม่พบข้อมูล รพ.สต. ของผู้ใช้';
    loading.value = false;
    return;
  }

  try {
    const { data: periodsData, error: periodsError } = await supabase
      .from('requisition_periods_drugcupsabot')
      .select('*')
      .eq('status', 'open')
      .order('start_date', { ascending: false });
    if (periodsError) throw periodsError;
    openPeriods.value = (periodsData ?? []) as unknown as RequisitionPeriod[];

    const { data: reqsData, error: reqsError } = await supabase
      .from('requisitions_drugcupsabot')
      .select(
        'id, period_id, status, created_at, submitted_at, requisition_periods_drugcupsabot(name)',
      )
      .eq('pcu_id', auth.userPcuId);
    if (reqsError) throw reqsError;
    existingRequisitions.value = (reqsData ?? []) as unknown as ExistingRequisition[];
  } catch (err) {
    error.value = 'ไม่สามารถโหลดข้อมูลได้';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

function hasRequisition(periodId: number): boolean {
  return existingRequisitions.value.some((req) => req.period_id === periodId);
}
function getRequisitionStatus(periodId: number): RequisitionStatus | null {
  const req = existingRequisitions.value.find((req) => req.period_id === periodId);
  return req ? req.status : null;
}
function getRequisitionId(periodId: number): number | null {
  const req = existingRequisitions.value.find((req) => req.period_id === periodId);
  return req ? req.id : null;
}
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
function formatSubmitDate(dateString: string | null): string {
  if (!dateString) return 'ฉบับร่าง';
  return new Date(dateString).toLocaleString('th-TH');
}
function goToRequisition(periodId: number, requisitionId: number | null): void {
  router.push({
    name: 'RequisitionForm',
    params: { periodId, requisitionId: requisitionId || 'new' },
  });
}
</script>

<style scoped>
.period-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-5);
}

.period-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-md);
  background-color: var(--color-canvas);
}

.period-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.period-head h3 {
  margin: 0;
  font-size: var(--text-feature-heading);
}

.period-dates {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-muted-slate);
  font-size: var(--text-caption);
  margin: 0;
  flex-grow: 1;
}

.period-actions {
  margin-top: var(--space-2);
}

.period-actions .btn {
  width: 100%;
}
</style>
