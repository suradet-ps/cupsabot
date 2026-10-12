<template>
  <div class="container">
    <PageHeader
      title="แดชบอร์ดผู้ดูแลระบบ"
      subtitle="ภาพรวมใบเบิกจากทุกหน่วยบริการ"
      icon="fas fa-gauge-high"
    />

    <div v-if="loading" class="loading">กำลังโหลดข้อมูล...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <template v-if="!loading && !error">
      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-icon stat-icon--amber" aria-hidden="true">
            <i class="fas fa-hourglass-half"></i>
          </span>
          <div class="stat-body">
            <p class="stat-label">รอการอนุมัติ</p>
            <p class="stat-value">{{ submittedRequisitions.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon stat-icon--blue" aria-hidden="true">
            <i class="fas fa-clipboard-check"></i>
          </span>
          <div class="stat-body">
            <p class="stat-label">อนุมัติแล้ว · รอจ่ายยา</p>
            <p class="stat-value">{{ approvedRequisitions.length }}</p>
          </div>
        </div>
      </div>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <i class="fas fa-inbox" aria-hidden="true"></i>
            ใบเบิกใหม่ (รอการอนุมัติ)
            <span class="panel-count">{{ submittedRequisitions.length }}</span>
          </h2>
        </div>

        <div v-if="submittedRequisitions.length > 0" class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>รพ.สต.</th>
                <th>รอบเบิก</th>
                <th>วันที่ส่ง</th>
                <th>สถานะ</th>
                <th class="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in submittedRequisitions" :key="req.id">
                <td class="bold">{{ req.pcus_drugcupsabot.name }}</td>
                <td>{{ req.requisition_periods_drugcupsabot.name }}</td>
                <td>{{ formatDate(req.submitted_at) }}</td>
                <td><StatusBadge :status="req.status" /></td>
                <td class="text-center">
                  <router-link
                    :to="{
                      name: 'AdminRequisitionDetail',
                      params: { requisitionId: req.id },
                    }"
                    class="btn btn-primary btn-sm"
                  >
                    <i class="fas fa-pen-to-square" aria-hidden="true"></i> ตรวจสอบ
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <EmptyState
          v-else
          icon="fas fa-circle-check"
          title="ไม่มีใบเบิกที่รอการอนุมัติ"
          text="เมื่อ รพ.สต. ส่งใบเบิกเข้ามา รายการจะแสดงที่นี่"
        />
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <i class="fas fa-dolly" aria-hidden="true"></i>
            อนุมัติแล้ว (รอการจ่ายยา)
            <span class="panel-count">{{ approvedRequisitions.length }}</span>
          </h2>
        </div>

        <div v-if="approvedRequisitions.length > 0" class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>รพ.สต.</th>
                <th>รอบเบิก</th>
                <th>วันที่ส่ง</th>
                <th>สถานะ</th>
                <th class="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in approvedRequisitions" :key="req.id">
                <td class="bold">{{ req.pcus_drugcupsabot.name }}</td>
                <td>{{ req.requisition_periods_drugcupsabot.name }}</td>
                <td>{{ formatDate(req.submitted_at) }}</td>
                <td><StatusBadge :status="req.status" /></td>
                <td class="text-center">
                  <router-link
                    :to="{
                      name: 'AdminRequisitionDetail',
                      params: { requisitionId: req.id },
                    }"
                    class="btn btn-success btn-sm"
                  >
                    <i class="fas fa-dolly" aria-hidden="true"></i> ยืนยันการจ่าย
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <EmptyState
          v-else
          icon="fas fa-box-open"
          title="ไม่มีรายการที่รอการจ่ายยา"
          text="ใบเบิกที่อนุมัติแล้วและยังไม่จ่ายยาจะแสดงที่นี่"
        />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { supabase } from '@/supabaseClient';
import type { RequisitionStatus } from '@/types/models';

type DashboardRequisition = {
  id: number;
  submitted_at: string | null;
  status: RequisitionStatus;
  pcus_drugcupsabot: { name: string };
  requisition_periods_drugcupsabot: { name: string };
};

const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const requisitions = ref<DashboardRequisition[]>([]);

const submittedRequisitions = computed<DashboardRequisition[]>(() => {
  return requisitions.value.filter((req) => req.status === 'submitted');
});

const approvedRequisitions = computed<DashboardRequisition[]>(() => {
  return requisitions.value.filter((req) => req.status === 'approved');
});

onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('requisitions_drugcupsabot')
      .select(
        `
        id,
        submitted_at,
        status,
        pcus_drugcupsabot ( name ),
        requisition_periods_drugcupsabot ( name )
      `,
      )
      .in('status', ['submitted', 'approved'])
      .order('submitted_at', { ascending: true });

    if (fetchError) throw fetchError;
    requisitions.value = (data ?? []) as unknown as DashboardRequisition[];
  } catch (err) {
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลใบเบิก';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('th-TH');
}
</script>
