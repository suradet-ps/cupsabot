<template>
  <div class="container">
    <PageHeader
      title="รายละเอียดใบเบิก"
      :subtitle="requisition ? requisition.requisition_periods_drugcupsabot.name : undefined"
      icon="fas fa-file-lines"
    >
      <template #actions>
        <router-link to="/pcu/dashboard" class="btn btn-secondary">
          <i class="fas fa-arrow-left" aria-hidden="true"></i> กลับ
        </router-link>
        <button
          v-if="canPrintOrExport"
          type="button"
          class="btn btn-secondary"
          :disabled="exporting"
          @click="exportToExcel"
        >
          <i class="fas fa-file-excel" aria-hidden="true"></i>
          {{ exporting ? 'กำลังส่งออก...' : 'ส่งออก Excel' }}
        </button>
        <router-link
          v-if="canPrintOrExport"
          :to="{ name: 'PcuPrintRequisition', query: { id: requisitionId } }"
          class="btn btn-primary"
          target="_blank"
        >
          <i class="fas fa-print" aria-hidden="true"></i> พิมพ์ใบเบิก
        </router-link>
      </template>
    </PageHeader>

    <div v-if="loading" class="loading">กำลังโหลดข้อมูลใบเบิก...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <template v-if="!loading && requisition">
      <div class="card summary-grid">
        <div class="summary-item">
          <span class="summary-label">รอบเบิก</span>
          <span class="summary-value">{{ requisition.requisition_periods_drugcupsabot.name }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">สถานะ</span>
          <StatusBadge :status="requisition.status" />
        </div>
        <div class="summary-item">
          <span class="summary-label">วันที่ส่ง</span>
          <span class="summary-value">{{ formatDate(requisition.submitted_at) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">วันที่สร้าง</span>
          <span class="summary-value">{{ formatDate(requisition.created_at) }}</span>
        </div>
      </div>

      <div class="section-head">
        <h2>รายการที่เบิก</h2>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายการเวชภัณฑ์</th>
              <th class="text-center">จำนวนที่ขอเบิก</th>
              <th class="text-center">จำนวนที่ได้รับอนุมัติ</th>
              <th class="text-right">ราคาต่อหน่วย</th>
              <th class="text-right">มูลค่าที่อนุมัติ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(reqItem, index) in requisition.requisition_items_drugcupsabot"
              :key="reqItem.id"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ reqItem.items_drugcupsabot.name }}</td>
              <td class="text-center">{{ reqItem.quantity }}</td>
              <td class="text-center bold approved-qty">
                {{ reqItem.approved_quantity ?? '-' }}
              </td>
              <td class="text-right">{{ formatCurrency(reqItem.price_at_request) }}</td>
              <td class="text-right">
                {{
                  formatCurrency(
                    (reqItem.approved_quantity ?? reqItem.quantity) * reqItem.price_at_request,
                  )
                }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" class="text-right">มูลค่ารวมทั้งหมดที่อนุมัติ</td>
              <td class="text-right total-value">{{ formatCurrency(grandTotal) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { useToast } from '@/composables/useToast';
import { supabase } from '@/supabaseClient';
import type { RequisitionStatus, RequisitionWithJoins } from '@/types/models';

const props = defineProps<{ requisitionId: string }>();

const toast = useToast();
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const exporting = ref<boolean>(false);
const requisition = ref<RequisitionWithJoins | null>(null);

const PRINTABLE_STATUSES: RequisitionStatus[] = ['approved', 'fulfilled'];

const canPrintOrExport = computed<boolean>(() => {
  return (
    !!requisition.value &&
    PRINTABLE_STATUSES.includes(requisition.value.status as RequisitionStatus)
  );
});

onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('requisitions_drugcupsabot')
      .select(
        `
        *,
        requisition_periods_drugcupsabot ( name ),
        requisition_items_drugcupsabot (
          *,
          items_drugcupsabot ( name, unit_pack )
        )
      `,
      )
      .eq('id', Number(props.requisitionId))
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new Error('ไม่พบข้อมูลใบเบิก หรือคุณไม่มีสิทธิ์เข้าถึง');
      }
      throw fetchError;
    }
    requisition.value = data as unknown as RequisitionWithJoins;
  } catch (err) {
    error.value = `ไม่สามารถโหลดข้อมูลใบเบิกได้: ${err instanceof Error ? err.message : String(err)}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const grandTotal = computed<number>(() => {
  if (!requisition.value?.requisition_items_drugcupsabot) return 0;

  return requisition.value.requisition_items_drugcupsabot.reduce((sum, item) => {
    const quantityToUse = item.approved_quantity ?? item.quantity;
    const itemTotal = Number(quantityToUse) * Number(item.price_at_request);
    return sum + itemTotal;
  }, 0);
});

function formatDate(dateString: string | null): string {
  if (!dateString) return 'ยังไม่ได้ส่ง';
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0.00';
  return Number(value).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function exportToExcel(): Promise<void> {
  if (!requisition.value || exporting.value) return;
  exporting.value = true;

  try {
    const { utils, writeFile } = await import('xlsx');

    const pcuName = requisition.value.pcus_drugcupsabot?.name ?? 'ไม่ระบุ';
    const periodName = requisition.value.requisition_periods_drugcupsabot?.name ?? 'ไม่ระบุ';

    const dataForExport = requisition.value.requisition_items_drugcupsabot.map((item, index) => {
      const qty = item.approved_quantity ?? item.quantity;
      return {
        ลำดับ: index + 1,
        รายการ: item.items_drugcupsabot.name,
        หน่วยนับ: item.items_drugcupsabot.unit_pack,
        จำนวนที่ขอเบิก: item.quantity,
        จำนวนที่ได้รับอนุมัติ: item.approved_quantity ?? item.quantity,
        ราคาต่อหน่วย: item.price_at_request,
        มูลค่ารวม: qty * item.price_at_request,
      };
    });

    const worksheet = utils.json_to_sheet(dataForExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'ใบเบิก');
    writeFile(workbook, `ใบเบิก_${pcuName}_${periodName}.xlsx`);
    toast.success('ส่งออกไฟล์ Excel เรียบร้อยแล้ว');
  } catch (err) {
    console.error('Error exporting to Excel:', err);
    toast.error(`เกิดข้อผิดพลาดในการส่งออก Excel: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    exporting.value = false;
  }
}
</script>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
}

.summary-label {
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: var(--tracking-mono);
  color: var(--color-muted-slate);
  font-weight: var(--weight-semibold);
}

.summary-value {
  font-size: var(--text-body-lg);
  font-weight: var(--weight-medium);
  color: var(--color-ink);
}

.approved-qty {
  color: var(--color-status-fulfilled);
}

.total-value {
  font-size: var(--text-body-lg);
  color: var(--color-primary);
}
</style>
