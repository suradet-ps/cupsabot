<template>
  <div class="container">
    <PageHeader
      title="รายงานมูลค่าทางบัญชี"
      subtitle="สรุปมูลค่าการเบิกจ่ายของแต่ละ รพ.สต. เพื่อส่งมอบให้ฝ่ายบัญชี"
      icon="fas fa-file-invoice-dollar"
    >
      <template #actions>
        <button
          v-if="reportData.length > 0"
          @click="printReport"
          class="btn btn-primary no-print"
        >
          <i class="fas fa-print" aria-hidden="true"></i> พิมพ์รายงาน
        </button>
      </template>
    </PageHeader>

    <div class="card report-options no-print">
      <div class="form-group">
        <label for="report-period">เลือกรอบเบิกเพื่อดูรายงาน</label>
        <select id="report-period" v-model="selectedPeriod" @change="generateReport">
          <option :value="null" disabled>-- กรุณาเลือกรอบเบิก --</option>
          <option v-for="period in periods" :key="period.id" :value="period.id">
            {{ period.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">กำลังประมวลผลข้อมูล...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <div v-if="reportData.length > 0" class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="text-center">ลำดับ</th>
            <th>หน่วยบริการ (รพ.สต.)</th>
            <th class="text-right">มูลค่ารวม (บาท)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pcu, index) in reportData" :key="pcu.pcu_id">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ pcu.pcu_name }}</td>
            <td class="text-right bold">{{ formatCurrency(pcu.total_value) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="text-right">มูลค่ารวมทั้งสิ้น</td>
            <td class="text-right total-value">{{ formatCurrency(grandTotal) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <EmptyState
      v-else-if="!loading && selectedPeriod"
      icon="fas fa-circle-info"
      title="ไม่พบข้อมูลใบเบิกที่อนุมัติแล้วในรอบนี้"
      text="เลือกรอบเบิกอื่นเพื่อดูรายงาน"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import { supabase } from '@/supabaseClient';
import type { AccountingSummaryRow, RequisitionPeriod } from '@/types/models';

const router = useRouter();
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const periods = ref<RequisitionPeriod[]>([]);
const selectedPeriod = ref<string | null>(null);
const reportData = ref<AccountingSummaryRow[]>([]);

const grandTotal = computed<number>(() => {
  return reportData.value.reduce((sum, pcu) => sum + pcu.total_value, 0);
});

onMounted(async () => {
  try {
    const { data } = await supabase
      .from('requisition_periods_drugcupsabot')
      .select('id, name')
      .order('start_date', { ascending: false });
    periods.value = (data ?? []) as unknown as RequisitionPeriod[];
  } catch (err) {
    error.value = 'ไม่สามารถโหลดรอบเบิกได้';
    console.error('Error fetching periods:', err);
  }
});

async function generateReport(): Promise<void> {
  if (!selectedPeriod.value) return;
  loading.value = true;
  error.value = null;
  reportData.value = [];

  try {
    const { data, error: fetchError } = await supabase.rpc('get_accounting_summary_by_period', {
      period_id_param: selectedPeriod.value,
    });

    if (fetchError) throw fetchError;

    reportData.value = (data ?? []) as unknown as AccountingSummaryRow[];
  } catch (err) {
    error.value = `เกิดข้อผิดพลาดในการประมวลผล: ${err instanceof Error ? err.message : String(err)}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function printReport(): void {
  if (!selectedPeriod.value) return;
  const routeData = router.resolve({
    name: 'AccountingReportPrint',
    query: { periodId: selectedPeriod.value },
  });
  window.open(routeData.href, '_blank');
}

function formatCurrency(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '0.00';
  return Number(value).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
</script>

<style scoped>
.report-options {
  display: flex;
  gap: var(--space-5);
  align-items: flex-end;
  margin-bottom: var(--space-6);
}

.report-options .form-group {
  flex: 1 1 280px;
  margin-bottom: 0;
}

.total-value {
  font-size: var(--text-body-lg);
  color: var(--color-primary);
}
</style>
