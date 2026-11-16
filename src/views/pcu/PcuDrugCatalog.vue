<template>
  <div class="container">
    <PageHeader
      title="บัญชียาและเวชภัณฑ์"
      subtitle="รายการยาทั้งหมดที่เปิดให้เบิก พร้อมราคา หน่วยนับ และสถานะ"
      icon="fas fa-pills"
    >
      <template #actions>
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="loading || exporting || filteredItems.length === 0"
          title="ส่งออกเฉพาะรายการที่แสดงอยู่"
          @click="exportToExcel"
        >
          <i class="fas fa-file-excel" aria-hidden="true"></i>
          {{ exporting ? 'กำลังส่งออก...' : 'ส่งออก Excel' }}
        </button>
      </template>
    </PageHeader>

    <div v-if="loading" class="loading">กำลังโหลดบัญชียา...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <template v-if="!loading && !error">
      <div class="card toolbar">
        <div class="form-group search-group">
          <label for="drug-search">ค้นหารายการ</label>
          <div class="search-field">
            <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
            <input
              id="drug-search"
              v-model="searchTerm"
              type="search"
              class="search-input"
              placeholder="ค้นหาชื่อยา หมวดหมู่ หรือหมายเหตุ..."
            />
          </div>
        </div>

        <div class="form-group category-group">
          <label for="drug-category">หมวดหมู่</label>
          <select id="drug-category" v-model="selectedCategory">
            <option value="">ทุกหมวดหมู่</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <p class="toolbar-count">
          แสดง <strong>{{ filteredItems.length }}</strong> จาก {{ items.length }} รายการ
          <span class="count-divider" aria-hidden="true">·</span>
          เบิกได้ {{ availableCount }} รายการ
          <span class="count-divider" aria-hidden="true">·</span>
          ไม่พร้อมจ่าย {{ unavailableCount }} รายการ
        </p>
      </div>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <i class="fas fa-prescription-bottle-medical" aria-hidden="true"></i>
            รายการยาและเวชภัณฑ์
            <span class="panel-count">{{ filteredItems.length }}</span>
          </h2>
          <p class="panel-note">ราคาที่แสดงเป็นราคาต่อหน่วยปัจจุบัน</p>
        </div>

        <div v-if="filteredItems.length > 0" class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th class="text-center col-index">ลำดับ</th>
                <th class="col-category">หมวดหมู่</th>
                <th>รายการยา</th>
                <th class="text-center col-unit">หน่วยนับ</th>
                <th class="text-right col-price">ราคาต่อหน่วย</th>
                <th class="text-center col-status">สถานะ</th>
                <th class="col-notes">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredItems" :key="item.id">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="category">{{ item.category }}</td>
                <td class="item-name">{{ item.name }}</td>
                <td class="text-center">{{ item.unit_pack }}</td>
                <td class="text-right price">{{ formatCurrency(item.price_per_unit) }}</td>
                <td class="text-center">
                  <span
                    class="status-badge"
                    :class="item.is_available ? 'available' : 'unavailable'"
                  >
                    {{ item.is_available ? 'เบิกได้' : 'ไม่พร้อมจ่าย' }}
                  </span>
                </td>
                <td class="notes">{{ item.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="panel-body">
          <EmptyState
            :icon="items.length === 0 ? 'fas fa-pills' : 'fas fa-magnifying-glass'"
            :title="items.length === 0 ? 'ยังไม่มีรายการยาในบัญชี' : 'ไม่พบรายการที่ตรงกับเงื่อนไข'"
            :text="
              items.length === 0
                ? 'เมื่อผู้ดูแลระบบเพิ่มรายการยา รายการจะแสดงที่นี่'
                : 'ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น'
            "
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/supabaseClient';
import type { Item } from '@/types/models';
import { formatCurrency } from '@/utils/format';
import { exportItemCatalogToExcel } from '@/utils/item-catalog-excel';

const auth = useAuthStore();
const toast = useToast();

const loading = ref<boolean>(true);
const exporting = ref<boolean>(false);
const error = ref<string | null>(null);
const items = ref<Item[]>([]);
const searchTerm = ref<string>('');
const selectedCategory = ref<string>('');

const categories = computed<string[]>(() => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items.value) {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      result.push(item.category);
    }
  }

  return result;
});

const filteredItems = computed<Item[]>(() => {
  const term = searchTerm.value.trim().toLowerCase();

  return items.value.filter((item) => {
    if (selectedCategory.value && item.category !== selectedCategory.value) {
      return false;
    }
    if (!term) return true;

    return (
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      (item.notes ?? '').toLowerCase().includes(term)
    );
  });
});

const availableCount = computed<number>(
  () => filteredItems.value.filter((item) => item.is_available).length,
);
const unavailableCount = computed<number>(() => filteredItems.value.length - availableCount.value);

onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('items_drugcupsabot')
      .select('*')
      .eq('is_active', true)
      .order('category_order', { ascending: true, nullsFirst: false })
      .order('item_order', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true });

    if (fetchError) throw fetchError;
    items.value = (data ?? []) as unknown as Item[];
  } catch (err) {
    error.value = `ไม่สามารถโหลดบัญชียาได้: ${err instanceof Error ? err.message : String(err)}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
});

async function exportToExcel(): Promise<void> {
  if (exporting.value || filteredItems.value.length === 0) return;
  exporting.value = true;

  try {
    const itemsToExport = filteredItems.value;
    const fileName = await exportItemCatalogToExcel({
      items: itemsToExport,
      pcuName: auth.userPcuName,
    });
    toast.success(`ส่งออก ${itemsToExport.length} รายการเป็น ${fileName} เรียบร้อยแล้ว`);
  } catch (err) {
    toast.error(`เกิดข้อผิดพลาดในการส่งออก Excel: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
  } finally {
    exporting.value = false;
  }
}
</script>

<style scoped>
.search-group {
  flex: 2 1 320px;
}

.category-group {
  flex: 0 1 220px;
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
  margin: 0 0 var(--space-1);
  font-size: var(--text-caption);
  color: var(--color-muted-slate);
}

.count-divider {
  margin: 0 var(--space-1);
}

.panel-note {
  margin: 0;
  font-size: var(--text-caption);
  color: var(--color-muted-slate);
}

table {
  min-width: 860px;
}

.col-index {
  width: 70px;
}

.col-category {
  width: 150px;
}

.col-unit {
  width: 110px;
}

.col-price {
  width: 140px;
}

.col-status {
  width: 150px;
}

.col-notes {
  width: 24%;
}

.category {
  color: var(--color-muted-slate);
  font-size: var(--text-caption);
}

.item-name {
  font-weight: var(--weight-medium);
}

.price {
  font-variant-numeric: tabular-nums;
}

.status-badge.available {
  background-color: var(--color-status-fulfilled-bg);
  color: var(--color-status-fulfilled);
  border-color: rgba(31, 138, 76, 0.25);
}

.status-badge.unavailable {
  background-color: var(--color-status-rejected-bg);
  color: var(--color-status-rejected);
  border-color: rgba(179, 38, 30, 0.25);
}

.notes {
  color: var(--color-muted-slate);
  font-size: var(--text-caption);
}

@media (max-width: 640px) {
  .toolbar-count {
    flex-basis: 100%;
  }
}
</style>
