<template>
  <div class="container">
    <PageHeader
      :title="isEditing ? 'แก้ไขใบเบิก' : 'สร้างใบเบิกใหม่'"
      :subtitle="periodInfo?.name"
      icon="fas fa-file-signature"
    >
      <template #actions>
        <router-link to="/pcu/dashboard" class="btn btn-secondary">
          <i class="fas fa-arrow-left" aria-hidden="true"></i> กลับ
        </router-link>
      </template>
    </PageHeader>

    <div v-if="loading" class="loading">กำลังโหลดรายการ...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <form v-if="!loading && !error" @submit.prevent="submitForm">
      <div class="card toolbar">
        <div class="form-group search-group">
          <label for="search">ค้นหารายการ</label>
          <div class="search-field">
            <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
            <input
              type="search"
              id="search"
              v-model="searchTerm"
              placeholder="พิมพ์ชื่อยาเพื่อค้นหา..."
              class="search-input"
            />
          </div>
        </div>
        <p class="toolbar-count">
          แสดง <strong>{{ filteredItems.length }}</strong> จาก {{ items.length }} รายการ
        </p>
      </div>

      <div class="table-wrapper requisition-table">
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ประเภท</th>
              <th>รายการเวชภัณฑ์</th>
              <th>หน่วยนับ</th>
              <th class="text-right">ราคา</th>
              <th class="text-center">คงเหลือ</th>
              <th class="text-center">จำนวนเบิก</th>
              <th class="text-right">มูลค่า</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredItems"
              :key="item.id"
              :class="{ 'locked-item': !item.is_available }"
            >
              <td class="text-center">{{ item.item_order }}</td>
              <td>{{ item.category }}</td>
              <td>
                <span class="item-name">{{ item.name }}</span>
                <span v-if="!item.is_available" class="item-lock">
                  <i class="fas fa-lock" aria-hidden="true"></i> ไม่พร้อมจ่าย
                  <template v-if="item.notes"> — {{ item.notes }}</template>
                </span>
              </td>
              <td class="text-center">{{ item.unit_pack }}</td>
              <td class="text-right">{{ formatCurrency(item.price_per_unit) }}</td>
              <td class="text-center">
                <input
                  type="number"
                  min="0"
                  class="quantity-input"
                  v-model.number="requisitionData[item.id].onHand"
                  :aria-label="`จำนวนคงเหลือ ${item.name}`"
                  @focus="selectAll"
                  :disabled="!item.is_available"
                />
              </td>
              <td class="text-center">
                <input
                  type="number"
                  min="0"
                  class="quantity-input"
                  v-model.number="requisitionData[item.id].quantity"
                  :aria-label="`จำนวนเบิก ${item.name}`"
                  @input="updateTotal"
                  @focus="selectAll"
                  :disabled="!item.is_available"
                />
              </td>
              <td class="text-right">{{ formatCurrency(calculateValue(item)) }}</td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="8" class="text-center text-muted table-empty">
                ไม่พบรายการที่ตรงกับ "{{ searchTerm }}"
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7" class="text-right">รวมมูลค่าทั้งหมด</td>
              <td class="text-right total-value">{{ formatCurrency(totalValue) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="form-actions">
        <button
          type="button"
          @click="saveDraft"
          class="btn btn-secondary"
          :disabled="isSubmitting"
        >
          <i class="fas fa-floppy-disk" aria-hidden="true"></i>
          {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
        </button>
        <button type="submit" class="btn btn-success" :disabled="isSubmitting">
          <i class="fas fa-paper-plane" aria-hidden="true"></i>
          {{ isSubmitting ? 'กำลังส่ง...' : 'ส่งใบเบิก' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/supabaseClient';
import type { Item, RequisitionPeriod, RequisitionStatus } from '@/types/models';

type RequisitionEntry = {
  quantity: number | null;
  onHand: number | null;
};

type RequisitionHeader = {
  id: string;
  status: RequisitionStatus;
  pcu_id: string;
  period_id: string;
};

const props = defineProps<{
  periodId: string;
  requisitionId?: string;
}>();

const router = useRouter();
const auth = useAuthStore();
const toast = useToast();
const { confirm } = useConfirm();

const loading = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);
const error = ref<string | null>(null);
const items = ref<Item[]>([]);
const periodInfo = ref<Pick<RequisitionPeriod, 'name'> | null>(null);
const requisitionData = ref<Record<number, RequisitionEntry>>({});
const totalValue = ref<number>(0);
const searchTerm = ref<string>('');

const isEditing = computed<boolean>(
  () => props.requisitionId !== undefined && props.requisitionId !== 'new',
);

async function verifyEditableRequisition(): Promise<string | null> {
  if (!isEditing.value) return null;

  const { data, error: headerError } = await supabase
    .from('requisitions_drugcupsabot')
    .select('id, status, pcu_id, period_id')
    .eq('id', String(props.requisitionId))
    .single();

  if (headerError || !data) {
    return 'ไม่พบใบเบิกที่ต้องการแก้ไข';
  }

  const header = data as unknown as RequisitionHeader;

  if (header.status !== 'draft') {
    return 'ใบเบิกนี้ถูกส่ง อนุมัติ หรือจ่ายไปแล้ว จึงไม่สามารถแก้ไขได้';
  }

  if (!auth.userPcuId || header.pcu_id !== auth.userPcuId) {
    return 'คุณไม่มีสิทธิ์แก้ไขใบเบิกของ รพ.สต. อื่น';
  }

  if (header.period_id !== props.periodId) {
    return 'ใบเบิกนี้ไม่ได้อยู่ในรอบเบิกที่ระบุ';
  }

  return null;
}

function selectAll(event: FocusEvent): void {
  const target = event.target as HTMLInputElement | null;
  target?.select();
}

onMounted(async () => {
  try {
    const { data: periodData, error: periodError } = await supabase
      .from('requisition_periods_drugcupsabot')
      .select('name')
      .eq('id', props.periodId)
      .single();
    if (periodError) throw periodError;
    periodInfo.value = periodData;

    if (isEditing.value) {
      const guardError = await verifyEditableRequisition();
      if (guardError) {
        error.value = guardError;
        return;
      }
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('items_drugcupsabot')
      .select('*')
      .eq('is_active', true)
      .order('category_order', { ascending: true })
      .order('item_order', { ascending: true });
    if (itemsError) throw itemsError;
    items.value = (itemsData ?? []) as unknown as Item[];

    items.value.forEach((item) => {
      requisitionData.value[item.id] = { quantity: null, onHand: null };
    });

    if (isEditing.value) {
      const { data: existingData, error: draftError } = await supabase
        .from('requisition_items_drugcupsabot')
        .select('item_id, quantity, on_hand_quantity')
        .eq('requisition_id', String(props.requisitionId));

      if (draftError) throw draftError;

      if (existingData) {
        existingData.forEach((item) => {
          if (requisitionData.value[item.item_id]) {
            requisitionData.value[item.item_id].quantity = item.quantity;
            requisitionData.value[item.item_id].onHand = item.on_hand_quantity;
          }
        });
        updateTotal();
      }
    }
  } catch (err) {
    error.value = `ไม่สามารถโหลดข้อมูลได้: ${err instanceof Error ? err.message : String(err)}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const filteredItems = computed<Item[]>(() => {
  if (!searchTerm.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  );
});

function calculateValue(item: Item): number {
  if (!item.is_available) {
    if (requisitionData.value[item.id]?.quantity) {
      requisitionData.value[item.id].quantity = 0;
    }
    return 0;
  }
  const quantity = requisitionData.value[item.id]?.quantity || 0;
  return quantity * item.price_per_unit;
}

function updateTotal(): void {
  totalValue.value = items.value.reduce((sum, item) => {
    return sum + calculateValue(item);
  }, 0);
}

function formatCurrency(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '0.00';
  return Number(value).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function saveRequisition(status: RequisitionStatus): Promise<void> {
  if (!auth.userProfile || !auth.userPcuId) {
    toast.error('ข้อมูลผู้ใช้ไม่สมบูรณ์');
    return;
  }
  isSubmitting.value = true;

  try {
    if (isEditing.value) {
      const guardError = await verifyEditableRequisition();
      if (guardError) {
        toast.error(guardError);
        return;
      }
    }

    let currentRequisitionId: string | null = isEditing.value ? String(props.requisitionId) : null;

    if (!isEditing.value) {
      const { data: newHeader, error: headerError } = await supabase
        .from('requisitions_drugcupsabot')
        .insert({
          pcu_id: auth.userPcuId,
          period_id: props.periodId,
          requester_id: auth.userProfile.id,
          status: 'draft',
        })
        .select('id')
        .single();

      if (headerError) throw headerError;
      currentRequisitionId = newHeader.id;
    }

    if (currentRequisitionId === null) {
      throw new Error('ไม่พบรหัสใบเบิก');
    }

    const { error: deleteError } = await supabase
      .from('requisition_items_drugcupsabot')
      .delete()
      .eq('requisition_id', currentRequisitionId);
    if (deleteError) throw deleteError;

    const itemsToInsert = Object.entries(requisitionData.value)
      .filter(([itemId, entry]) => {
        const itemDetails = items.value.find((i) => i.id === Number(itemId));
        return entry.quantity !== null && entry.quantity > 0 && itemDetails?.is_available;
      })
      .map(([itemId, entry]) => {
        const itemDetails = items.value.find((i) => i.id === Number(itemId));
        if (!itemDetails) {
          throw new Error(`Item ${itemId} not found`);
        }
        return {
          requisition_id: currentRequisitionId,
          item_id: Number(itemId),
          quantity: entry.quantity ?? 0,
          on_hand_quantity: entry.onHand,
          price_at_request: itemDetails.price_per_unit,
        };
      });

    if (itemsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('requisition_items_drugcupsabot')
        .insert(itemsToInsert);
      if (insertError) throw insertError;
    }

    const { data: updatedRows, error: updateStatusError } = await supabase
      .from('requisitions_drugcupsabot')
      .update({
        status: status,
        submitted_at: status === 'submitted' ? new Date().toISOString() : null,
      })
      .eq('id', currentRequisitionId)
      .eq('pcu_id', auth.userPcuId)
      .eq('status', 'draft')
      .select('id');
    if (updateStatusError) throw updateStatusError;
    if (!updatedRows || updatedRows.length === 0) {
      throw new Error('ใบเบิกนี้ไม่ได้อยู่ในสถานะฉบับร่างแล้ว กรุณาโหลดหน้าใหม่');
    }

    toast.success(status === 'submitted' ? 'ส่งใบเบิกเรียบร้อยแล้ว' : 'บันทึกฉบับร่างเรียบร้อยแล้ว');
    router.push('/pcu/dashboard');
  } catch (err) {
    toast.error(`เกิดข้อผิดพลาดในการบันทึก: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
}

function saveDraft(): void {
  saveRequisition('draft');
}

async function submitForm(): Promise<void> {
  const confirmed = await confirm({
    title: 'ยืนยันการส่งใบเบิก',
    message: 'เมื่อส่งแล้วจะไม่สามารถแก้ไขได้อีก คุณต้องการยืนยันการส่งใบเบิกนี้ใช่หรือไม่?',
    confirmLabel: 'ยืนยันการส่ง',
  });
  if (confirmed) {
    saveRequisition('submitted');
  }
}
</script>

<style scoped>
.search-group {
  margin-bottom: 0;
  max-width: 420px;
}

.search-field {
  position: relative;
}

.search-field > i {
  position: absolute;
  top: 50%;
  left: var(--space-3);
  transform: translateY(-50%);
  color: var(--color-muted-slate);
  pointer-events: none;
}

.search-field input {
  padding-left: calc(var(--space-3) * 2 + 0.75rem);
}

.toolbar-count {
  margin: 0;
  font-size: var(--text-caption);
  color: var(--color-muted-slate);
}

.requisition-table {
  max-height: 62vh;
  overflow-y: auto;
}

.requisition-table table {
  min-width: 860px;
}

.quantity-input {
  width: 92px;
  text-align: center;
}

.item-name {
  font-weight: var(--weight-medium);
}

.item-lock {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1-5);
  margin-top: var(--space-1-5);
  font-size: var(--text-micro);
  font-weight: var(--weight-medium);
  color: var(--color-status-rejected);
}

.locked-item {
  background-color: var(--color-soft-stone);
  color: var(--color-muted-slate);
}

.locked-item .quantity-input {
  background-color: var(--color-border-light);
  cursor: not-allowed;
}

.table-empty {
  padding: var(--space-8);
}

.total-value {
  font-size: var(--text-body-lg);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .quantity-input {
    width: 76px;
  }
}
</style>
