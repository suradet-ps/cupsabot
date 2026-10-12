<template>
  <div class="container">
    <PageHeader
      title="พิมพ์รายงานใบเบิก"
      subtitle="ออกรายงานใบเบิกแยกตาม รพ.สต. และส่งออกเป็น Excel"
      icon="fas fa-print"
    />

    <div class="card report-options no-print">
      <div class="form-group">
        <label for="report-period">1. เลือกรอบเบิก</label>
        <select id="report-period" v-model="selectedPeriod" @change="fetchRequisitionsForPeriod">
          <option :value="null" disabled>-- กรุณาเลือกรอบเบิก --</option>
          <option v-for="period in periods" :key="period.id" :value="period.id">
            {{ period.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="report-pcu">2. เลือก รพ.สต.</label>
        <select id="report-pcu" v-model="selectedRequisition" :disabled="!selectedPeriod">
          <option :value="null" disabled>-- กรุณาเลือก รพ.สต. --</option>
          <option v-for="req in requisitionsInPeriod" :key="req.id" :value="req">
            {{ req.pcus_drugcupsabot.name }} ({{ statusLabel(req.status) }})
          </option>
        </select>
      </div>

      <div class="report-actions">
        <button
          @click="printDocument"
          :disabled="!selectedRequisition || isGenerating"
          class="btn btn-primary"
        >
          <i class="fas fa-print" aria-hidden="true"></i>
          {{ isGenerating ? 'กำลังเตรียมพิมพ์...' : 'พิมพ์ใบเบิก' }}
        </button>
        <button @click="exportToExcel" :disabled="!selectedRequisition" class="btn btn-secondary">
          <i class="fas fa-file-excel" aria-hidden="true"></i> ส่งออก Excel
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">กำลังโหลดข้อมูล...</div>

    <template v-if="selectedRequisition">
      <div class="section-head">
        <h2>ตัวอย่างข้อมูลก่อนพิมพ์</h2>
        <p class="text-muted">ข้อมูลจะถูกจัดรูปแบบตามระเบียบในหน้าพิมพ์จริง</p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="text-center">ลำดับ</th>
              <th>รายการเวชภัณฑ์</th>
              <th class="text-center">ขอเบิก</th>
              <th class="text-center">อนุมัติ</th>
              <th class="text-right">มูลค่ารวม (ที่อนุมัติ)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in selectedRequisition.requisition_items_drugcupsabot"
              :key="item.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ item.items_drugcupsabot.name }}</td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-center bold">{{ item.approved_quantity ?? item.quantity }}</td>
              <td class="text-right">
                {{
                  formatCurrency((item.approved_quantity ?? item.quantity) * item.price_at_request)
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-right">รวมมูลค่าทั้งสิ้น</td>
              <td class="text-right total-value">{{ formatCurrency(grandTotal) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>

    <EmptyState
      v-else-if="selectedPeriod && !loading"
      icon="fas fa-circle-info"
      title="กรุณาเลือก รพ.สต. เพื่อดูข้อมูล"
      text="หากไม่มี รพ.สต. ให้เลือก อาจเป็นเพราะยังไม่มีใบเบิกที่อนุมัติหรือจ่ายแล้วในรอบนี้"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import { useToast } from '@/composables/useToast';
import { supabase } from '@/supabaseClient';
import type { RequisitionPeriod, RequisitionStatus } from '@/types/models';
import { statusLabel } from '@/utils/format';

type ReportItem = {
  id: number;
  quantity: number;
  approved_quantity: number | null;
  price_at_request: number;
  items_drugcupsabot: { name: string; unit_pack: string };
};

type ReportRequisition = {
  id: number;
  status: RequisitionStatus;
  pcus_drugcupsabot: { name: string };
  requisition_periods_drugcupsabot: { name: string };
  requisition_items_drugcupsabot: ReportItem[];
};

const router = useRouter();
const toast = useToast();
const loading = ref<boolean>(false);
const isGenerating = ref<boolean>(false);
const periods = ref<RequisitionPeriod[]>([]);
const requisitionsInPeriod = ref<ReportRequisition[]>([]);
const selectedPeriod = ref<number | null>(null);
const selectedRequisition = ref<ReportRequisition | null>(null);

const grandTotal = computed<number>(() => {
  if (!selectedRequisition.value) return 0;
  return selectedRequisition.value.requisition_items_drugcupsabot.reduce((sum, item) => {
    const quantityToUse = item.approved_quantity ?? item.quantity;
    const itemTotal = Number(quantityToUse) * Number(item.price_at_request);
    return sum + itemTotal;
  }, 0);
});

onMounted(async () => {
  try {
    const { data } = await supabase
      .from('requisition_periods_drugcupsabot')
      .select('id, name')
      .order('start_date', { ascending: false });
    periods.value = (data ?? []) as unknown as RequisitionPeriod[];
  } catch (err) {
    console.error('Error fetching periods:', err instanceof Error ? err.message : String(err));
  }
});

async function fetchRequisitionsForPeriod(): Promise<void> {
  selectedRequisition.value = null;
  requisitionsInPeriod.value = [];
  if (!selectedPeriod.value) return;

  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('requisitions_drugcupsabot')
      .select(
        `
        id, status,
        pcus_drugcupsabot (name),
        requisition_periods_drugcupsabot (name),
        requisition_items_drugcupsabot (
          quantity, approved_quantity, price_at_request,
          items_drugcupsabot (name, unit_pack)
        )
      `,
      )
      .in('status', ['approved', 'fulfilled'])
      .eq('period_id', selectedPeriod.value);

    if (error) throw error;
    requisitionsInPeriod.value = (data ?? []) as unknown as ReportRequisition[];
  } catch (err) {
    console.error('Error fetching requisitions:', err);
    toast.error('ไม่สามารถโหลดข้อมูลใบเบิกได้');
  } finally {
    loading.value = false;
  }
}

function printDocument(): void {
  if (!selectedRequisition.value) {
    toast.warning('กรุณาเลือกใบเบิกที่ต้องการพิมพ์');
    return;
  }
  isGenerating.value = true;

  const routeData = router.resolve({
    name: 'PrintRequisition',
    query: { id: selectedRequisition.value.id },
  });

  window.open(routeData.href, '_blank');

  setTimeout(() => {
    isGenerating.value = false;
  }, 1000);
}

async function exportToExcel(): Promise<void> {
  if (!selectedRequisition.value) return;

  try {
    const { utils, writeFile } = await import('xlsx');

    const pcuName = selectedRequisition.value.pcus_drugcupsabot.name;
    const periodName = selectedRequisition.value.requisition_periods_drugcupsabot.name;

    const dataForExport = selectedRequisition.value.requisition_items_drugcupsabot.map(
      (item, index) => ({
        ลำดับ: index + 1,
        รายการ: item.items_drugcupsabot.name,
        หน่วยนับ: item.items_drugcupsabot.unit_pack,
        จำนวนที่ขอ: item.quantity,
        จำนวนที่อนุมัติ: item.approved_quantity ?? item.quantity,
        ราคาต่อหน่วย: item.price_at_request,
        มูลค่ารวม: (item.approved_quantity ?? item.quantity) * item.price_at_request,
      }),
    );

    const worksheet = utils.json_to_sheet(dataForExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, `ใบเบิก ${pcuName}`);
    writeFile(workbook, `ใบเบิก_${pcuName}_${periodName}.xlsx`);
    toast.success('ส่งออกไฟล์ Excel เรียบร้อยแล้ว');
  } catch (err) {
    toast.error(`เกิดข้อผิดพลาดในการส่งออก Excel: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
  }
}

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0.00';
  return Number(value).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
</script>

<style scoped>
.report-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  align-items: flex-end;
}

.report-options .form-group {
  flex: 1 1 260px;
  margin-bottom: 0;
}

.report-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  flex: 0 1 auto;
}

.section-head {
  align-items: baseline;
}

.section-head .text-muted {
  margin: 0;
  font-size: var(--text-caption);
}

.total-value {
  font-size: var(--text-body-lg);
  color: var(--color-primary);
}
</style>
