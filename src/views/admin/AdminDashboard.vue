<template>
    <div class="container">
        <header class="page-header">
            <div>
                <span class="section-label">ภาพรวม</span>
                <h2>จัดการใบเบิก</h2>
            </div>
        </header>

        <div v-if="loading" class="loading">กำลังโหลดข้อมูล...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="!loading && !error">
            <div class="stat-grid">
                <div class="stat-card">
                    <span class="stat-label">รอการอนุมัติ</span>
                    <span class="stat-value">{{
                        submittedRequisitions.length
                    }}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">อนุมัติแล้ว รอจ่ายยา</span>
                    <span class="stat-value">{{
                        approvedRequisitions.length
                    }}</span>
                </div>
            </div>

            <h3>ใบเบิกใหม่ (รอการอนุมัติ)</h3>
            <div
                v-if="submittedRequisitions.length > 0"
                class="table-container"
            >
                <table>
                    <thead>
                        <tr>
                            <th>รพ.สต.</th>
                            <th>รอบเบิก</th>
                            <th>วันที่ส่ง</th>
                            <th>สถานะ</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="req in submittedRequisitions" :key="req.id">
                            <td>{{ req.pcus_drugcupsabot.name }}</td>
                            <td>
                                {{ req.requisition_periods_drugcupsabot.name }}
                            </td>
                            <td>{{ formatDate(req.submitted_at) }}</td>
                            <td>
                                <span :class="['status-badge', req.status]">{{
                                    req.status
                                }}</span>
                            </td>
                            <td>
                                <router-link
                                    :to="{
                                        name: 'AdminRequisitionDetail',
                                        params: { requisitionId: req.id },
                                    }"
                                    class="btn-sm btn-primary"
                                >
                                    ตรวจสอบและอนุมัติ
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="no-data-message">ไม่มีใบเบิกใหม่ที่รอการอนุมัติ</p>

            <h3 class="section-divider">รายการที่อนุมัติแล้ว (รอจ่ายยา)</h3>
            <div v-if="approvedRequisitions.length > 0" class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>รพ.สต.</th>
                            <th>รอบเบิก</th>
                            <th>วันที่ส่ง</th>
                            <th>สถานะ</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="req in approvedRequisitions" :key="req.id">
                            <td>{{ req.pcus_drugcupsabot.name }}</td>
                            <td>
                                {{ req.requisition_periods_drugcupsabot.name }}
                            </td>
                            <td>{{ formatDate(req.submitted_at) }}</td>
                            <td>
                                <span :class="['status-badge', req.status]">{{
                                    req.status
                                }}</span>
                            </td>
                            <td>
                                <router-link
                                    :to="{
                                        name: 'AdminRequisitionDetail',
                                        params: { requisitionId: req.id },
                                    }"
                                    class="btn-sm btn-success"
                                >
                                    ยืนยันการจ่าย
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="no-data-message">
                ไม่มีรายการที่อนุมัติแล้วที่รอการจ่าย
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
    // FIX: Supabase types FK joins as arrays even for many-to-one
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

<style scoped>
/* Page header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: var(--space-lg);
}

.page-header h2 {
    border: none;
    padding: 0;
    margin: var(--space-xxs) 0 0;
}

/* Stat cards */
.stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-base);
    margin-bottom: var(--space-xl);
}

.stat-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-xxs);
    background-color: var(--color-surface-card);
    border: 1px solid var(--color-hairline-strong);
    border-radius: var(--rounded-lg);
    padding: var(--space-md);
}

.stat-label {
    font-size: var(--text-caption-uppercase);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-mono);
    text-transform: uppercase;
    color: var(--color-muted);
}

.stat-value {
    font-size: var(--text-display-md);
    font-weight: var(--weight-semibold);
    color: var(--color-ink);
    line-height: var(--leading-tight);
}

/* Section headings */
h3 {
    margin-bottom: var(--space-base);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--color-hairline);
    font-size: var(--text-display-sm);
    color: var(--color-ink);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-feature-heading);
}

.section-divider {
    margin-top: var(--space-xxl);
}

.table-container {
    overflow-x: auto;
    border: 1px solid var(--color-hairline-strong);
    border-radius: var(--rounded-lg);
    background-color: var(--color-surface-card);
}

/* Action links as small buttons */
.btn-sm {
    text-decoration: none;
    white-space: nowrap;
}

/* No data placeholder */
.no-data-message {
    padding: var(--space-xl) var(--space-lg);
    text-align: center;
    color: var(--color-muted);
    font-size: var(--text-body-sm);
    border: 1px dashed var(--color-hairline-strong);
    border-radius: var(--rounded-lg);
    background-color: var(--color-surface-card);
}
</style>
