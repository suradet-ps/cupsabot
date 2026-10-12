<template>
  <div class="container">
    <PageHeader
      title="สรุปผลการเบิก"
      subtitle="ประมวลผลยอดรวมการเบิกจากทุกหน่วยบริการ"
      icon="fas fa-calculator"
    >
      <template #actions>
        <button
          v-if="processedData.length > 0"
          @click="printSummary"
          class="btn btn-primary no-print"
        >
          <i class="fas fa-print" aria-hidden="true"></i> พิมพ์ใบสรุปยอดรวม
        </button>
      </template>
    </PageHeader>

    <div class="card report-options no-print">
      <div class="form-group">
        <label for="summary-period">1. เลือกรอบเบิกเพื่อประมวลผล</label>
        <select id="summary-period" v-model="selectedPeriod" @change="processRequisitions">
          <option :value="null" disabled>-- กรุณาเลือกรอบเบิก --</option>
          <option v-for="period in periods" :key="period.id" :value="period.id">
            {{ period.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="summary-pcu">2. กรองข้อมูลตาม รพ.สต.</label>
        <select id="summary-pcu" v-model="selectedPcu" :disabled="!processedData.length">
          <option value="all">ดูทั้งหมด</option>
          <option v-for="pcu in pcuList" :key="pcu.id" :value="pcu.id">
            {{ pcu.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">กำลังประมวลผล...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <div v-if="processedData.length > 0" class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>รายการ</th>
            <th v-for="col in columns" :key="col.key" class="text-center">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in processedData" :key="item.item_id">
            <td>{{ item.item_name }}</td>
            <td v-for="col in columns" :key="col.key" class="text-center bold">
              {{ col.value(item) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState
      v-else-if="!loading && selectedPeriod"
      icon="fas fa-circle-info"
      title="ไม่พบข้อมูลใบเบิกที่อนุมัติแล้วในรอบนี้"
      text="เลือก รพ.สต. หรือรอบเบิกอื่นเพื่อดูข้อมูล"
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
import type { Pcu, RequisitionPeriod } from '@/types/models';

type ProcessedItem = {
  item_id: number;
  item_name: string;
  total_quantity: number;
  pcu_breakdown: Record<string, number>;
  category_order: number | null;
  item_order: number | null;
};

type Column = {
  key: string;
  label: string;
  value: (item: ProcessedItem) => number;
};

const router = useRouter();
const toast = useToast();
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const periods = ref<RequisitionPeriod[]>([]);
const pcuList = ref<Pcu[]>([]);
const selectedPeriod = ref<string | null>(null);
const selectedPcu = ref<string | 'all'>('all');
const processedData = ref<ProcessedItem[]>([]);

const columns = computed<Column[]>(() => {
  if (selectedPcu.value === 'all') {
    return [
      { key: 'total', label: 'ยอดรวม (ทุก รพ.สต.)', value: (item) => item.total_quantity },
      ...pcuList.value.map((pcu) => ({
        key: `pcu-${pcu.id}`,
        label: pcu.name,
        value: (item: ProcessedItem) => item.pcu_breakdown[pcu.id] || 0,
      })),
    ];
  }
  return [
    {
      key: 'pcu',
      label: `ยอดเบิก (${getPcuName(selectedPcu.value as string)})`,
      value: (item) => getDisplayQuantity(item),
    },
  ];
});

onMounted(async () => {
  try {
    const { data: periodsData } = await supabase
      .from('requisition_periods_drugcupsabot')
      .select('id, name')
      .order('start_date', { ascending: false });
    periods.value = (periodsData ?? []) as unknown as RequisitionPeriod[];
    const { data: pcusData } = await supabase
      .from('pcus_drugcupsabot')
      .select('id, name')
      .order('name');
    pcuList.value = (pcusData ?? []) as unknown as Pcu[];
  } catch (err) {
    error.value = 'ไม่สามารถโหลดข้อมูลเริ่มต้นได้';
    console.error(err);
  }
});

type RequisitionWithItems = {
  id: string;
  pcu_id: string;
  requisition_items_drugcupsabot: Array<{
    id: number;
    approved_quantity: number | null;
    items_drugcupsabot:
      | {
          id: number;
          name: string;
          category_order: number | null;
          item_order: number | null;
        }
      | Array<{
          id: number;
          name: string;
          category_order: number | null;
          item_order: number | null;
        }>;
  }>;
};

async function processRequisitions(): Promise<void> {
  if (!selectedPeriod.value) return;
  loading.value = true;
  error.value = null;
  processedData.value = [];

  try {
    const { data, error: fetchError } = await supabase
      .from('requisitions_drugcupsabot')
      .select(
        `
        id, pcu_id,
        requisition_items_drugcupsabot (
          id, approved_quantity,
          items_drugcupsabot (id, name, category_order, item_order)
        )
      `,
      )
      .in('status', ['approved', 'fulfilled'])
      .eq('period_id', selectedPeriod.value);

    if (fetchError) throw fetchError;

    const summary: Record<number, ProcessedItem> = {};

    for (const req of (data ?? []) as unknown as RequisitionWithItems[]) {
      const pcuId = req.pcu_id;

      for (const reqItem of req.requisition_items_drugcupsabot ?? []) {
        const itemJoin = Array.isArray(reqItem.items_drugcupsabot)
          ? reqItem.items_drugcupsabot[0]
          : reqItem.items_drugcupsabot;
        if (!itemJoin) {
          console.warn('Skipping orphaned requisition item:', reqItem);
          continue;
        }

        const itemId = itemJoin.id;
        const itemName = itemJoin.name;
        const categoryOrder = itemJoin.category_order;
        const itemOrder = itemJoin.item_order;
        const qty = reqItem.approved_quantity || 0;

        if (!summary[itemId]) {
          summary[itemId] = {
            item_id: itemId,
            item_name: itemName,
            total_quantity: 0,
            pcu_breakdown: {},
            category_order: categoryOrder,
            item_order: itemOrder,
          };
        }

        summary[itemId].total_quantity += qty;
        summary[itemId].pcu_breakdown[pcuId] = (summary[itemId].pcu_breakdown[pcuId] || 0) + qty;
      }
    }

    processedData.value = Object.values(summary).sort((a, b) => {
      const categoryDiff = (a.category_order || 9999) - (b.category_order || 9999);
      if (categoryDiff !== 0) return categoryDiff;

      const itemDiff = (a.item_order || 9999) - (b.item_order || 9999);
      if (itemDiff !== 0) return itemDiff;

      return a.item_name.localeCompare(b.item_name, 'th');
    });
  } catch (err) {
    console.error('Error processing requisitions:', err);
    error.value = 'เกิดข้อผิดพลาดในการประมวลผลข้อมูลใบเบิก';
  } finally {
    loading.value = false;
  }
}

function getPcuName(pcuId: string): string {
  return pcuList.value.find((p) => p.id === pcuId)?.name || 'N/A';
}

function getDisplayQuantity(item: ProcessedItem): number {
  if (selectedPcu.value === 'all') {
    return item.total_quantity;
  }
  return item.pcu_breakdown[selectedPcu.value] || 0;
}

function printSummary(): void {
  if (!selectedPeriod.value) {
    toast.warning('กรุณาเลือกรอบเบิกก่อนพิมพ์');
    return;
  }
  const routeData = router.resolve({
    name: 'PrintRequisitionSummary',
    query: { periodId: selectedPeriod.value },
  });
  window.open(routeData.href, '_blank');
}
</script>

<style scoped>
.report-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  align-items: flex-end;
  margin-bottom: var(--space-6);
}

.report-options .form-group {
  flex: 1 1 280px;
  margin-bottom: 0;
}
</style>
