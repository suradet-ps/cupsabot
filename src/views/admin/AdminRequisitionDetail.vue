<template>
  <div class="container">
    <PageHeader
      title="รายละเอียดใบเบิก"
      :subtitle="
        requisition
          ? `${requisition.pcus_drugcupsabot.name} · ${requisition.requisition_periods_drugcupsabot.name}`
          : undefined
      "
      icon="fas fa-file-invoice"
    >
      <template #actions>
        <router-link to="/admin/dashboard" class="btn btn-secondary no-print">
          <i class="fas fa-arrow-left" aria-hidden="true"></i> กลับแดชบอร์ด
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
          <span class="summary-label">รพ.สต.</span>
          <span class="summary-value">{{ requisition.pcus_drugcupsabot.name }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">รอบเบิก</span>
          <span class="summary-value">
            {{ requisition.requisition_periods_drugcupsabot.name }}
          </span>
        </div>
        <div class="summary-item">
          <span class="summary-label">วันที่ส่ง</span>
          <span class="summary-value">{{ formatDate(requisition.submitted_at) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">สถานะ</span>
          <StatusBadge :status="requisition.status" />
        </div>
      </div>

      <div class="section-head">
        <h2>รายการที่เบิก</h2>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="text-center">ลำดับ</th>
              <th>รายการเวชภัณฑ์</th>
              <th class="text-center">คงเหลือ (ที่แจ้ง)</th>
              <th class="text-center">จำนวนขอเบิก</th>
              <th class="text-center">จำนวนอนุมัติ</th>
              <th class="text-right">ราคา/หน่วย</th>
              <th class="text-right">มูลค่าที่อนุมัติ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(reqItem, index) in editableItems" :key="reqItem.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ reqItem.items_drugcupsabot.name }}</td>
              <td class="text-center">{{ reqItem.on_hand_quantity ?? '-' }}</td>
              <td class="text-center">{{ reqItem.quantity }}</td>
              <td class="text-center">
                <input
                  type="number"
                  class="quantity-input"
                  v-model.number="reqItem.approved_quantity"
                  min="0"
                  :aria-label="`จำนวนที่อนุมัติ ${reqItem.items_drugcupsabot.name}`"
                  @focus="$event.target.select()"
                />
              </td>
              <td class="text-right">{{ formatCurrency(reqItem.price_at_request) }}</td>
              <td class="text-right bold">
                {{ formatCurrency((reqItem.approved_quantity || 0) * reqItem.price_at_request) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6" class="text-right">มูลค่ารวมที่อนุมัติ</td>
              <td class="text-right total-value">{{ formatCurrency(grandTotalApproved) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="card admin-actions no-print">
        <h3>จัดการใบเบิก</h3>
        <div class="action-buttons">
          <button @click="saveAndApprove" :disabled="isUpdating" class="btn btn-primary">
            <i class="fas fa-check-double" aria-hidden="true"></i>
            {{ isUpdating ? 'กำลังบันทึก...' : 'บันทึกและอนุมัติ' }}
          </button>
          <button
            @click="fulfillRequisition"
            :disabled="isUpdating || requisition.status !== 'approved'"
            class="btn btn-success"
          >
            <i class="fas fa-dolly" aria-hidden="true"></i>
            {{ isUpdating ? 'กำลังบันทึก...' : 'ยืนยันการจ่ายยา' }}
          </button>
        </div>
        <p v-if="requisition.status !== 'approved'" class="form-hint">
          <i class="fas fa-circle-info" aria-hidden="true"></i>
          ต้องบันทึกและอนุมัติใบเบิกก่อน จึงจะยืนยันการจ่ายยาได้
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import { supabase } from '@/supabaseClient';
import type { RequisitionWithJoins } from '@/types/models';

type EditableItem = {
  id: number;
  quantity: number;
  on_hand_quantity: number | null;
  approved_quantity: number;
  price_at_request: number;
  items_drugcupsabot: { name: string; unit_pack: string };
};

const props = defineProps<{ requisitionId: string }>();

const toast = useToast();
const { confirm } = useConfirm();
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const requisition = ref<RequisitionWithJoins | null>(null);
const editableItems = ref<EditableItem[]>([]);
const isUpdating = ref<boolean>(false);

async function fetchRequisition(): Promise<void> {
  try {
    loading.value = true;
    error.value = null;

    const { data, error: fetchError } = await supabase
      .from('requisitions_drugcupsabot')
      .select(
        `
        *,
        pcus_drugcupsabot(name),
        requisition_periods_drugcupsabot(name),
        requisition_items_drugcupsabot(
          *,
          items_drugcupsabot(name, unit_pack)
        )
      `,
      )
      .eq('id', props.requisitionId)
      .single();

    if (fetchError) throw fetchError;

    requisition.value = data as unknown as RequisitionWithJoins;

    editableItems.value = (data.requisition_items_drugcupsabot as unknown as EditableItem[]).map(
      (item) => ({
        ...item,
        approved_quantity: item.approved_quantity ?? item.quantity,
      }),
    );
  } catch (err) {
    error.value = `ไม่สามารถโหลดข้อมูลได้: ${err instanceof Error ? err.message : String(err)}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchRequisition);

const grandTotalApproved = computed<number>(() => {
  if (!editableItems.value) return 0;
  return editableItems.value.reduce((sum, item) => {
    const quantity = item.approved_quantity || 0;
    const price = item.price_at_request || 0;
    return sum + Number(quantity) * Number(price);
  }, 0);
});

async function saveAndApprove(): Promise<void> {
  const confirmed = await confirm({
    title: 'ยืนยันการบันทึกและอนุมัติ',
    message: 'การกระทำนี้จะอัปเดตจำนวนที่อนุมัติทั้งหมด และเปลี่ยนสถานะเป็นอนุมัติแล้ว',
    confirmLabel: 'บันทึกและอนุมัติ',
  });
  if (!confirmed) return;

  isUpdating.value = true;
  try {
    const itemsToUpdate = editableItems.value.map((item) => ({
      id: item.id,
      approved_quantity: item.approved_quantity || 0,
    }));

    const { error: rpcError } = await supabase.rpc('update_approved_quantities', {
      items_data: itemsToUpdate,
    });
    if (rpcError) throw rpcError;

    const { error: reqError } = await supabase
      .from('requisitions_drugcupsabot')
      .update({ status: 'approved' })
      .eq('id', props.requisitionId);
    if (reqError) throw reqError;

    toast.success('บันทึกและอนุมัติใบเบิกเรียบร้อยแล้ว');
    await fetchRequisition();
  } catch (err) {
    toast.error(`เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
  } finally {
    isUpdating.value = false;
  }
}

async function fulfillRequisition(): Promise<void> {
  const confirmed = await confirm({
    title: 'ยืนยันการจ่ายยา',
    message: 'ยืนยันการจ่ายเวชภัณฑ์ตามจำนวนที่อนุมัติแล้วใช่หรือไม่?',
    confirmLabel: 'ยืนยันการจ่าย',
  });
  if (!confirmed) return;

  isUpdating.value = true;
  try {
    const { error: reqError } = await supabase
      .from('requisitions_drugcupsabot')
      .update({ status: 'fulfilled' })
      .eq('id', props.requisitionId);
    if (reqError) throw reqError;

    toast.success('ยืนยันการจ่ายเวชภัณฑ์เรียบร้อยแล้ว');
    await fetchRequisition();
  } catch (err) {
    toast.error(`เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
  } finally {
    isUpdating.value = false;
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
function formatCurrency(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '0.00';
  return Number(value).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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

.quantity-input {
  width: 92px;
  text-align: center;
}

.total-value {
  font-size: var(--text-body-lg);
  color: var(--color-primary);
}

.admin-actions {
  margin-top: var(--space-8);
}

.admin-actions h3 {
  margin-top: 0;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.action-buttons .btn {
  flex: 1 1 220px;
}
</style>
