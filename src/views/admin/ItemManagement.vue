<template>
  <div class="container">
    <PageHeader
      title="จัดการรายการยาและเวชภัณฑ์"
      subtitle="แก้ไขชื่อ ราคา หน่วยนับ และสถานะการเบิกได้"
      icon="fas fa-pills"
    >
      <template #actions>
        <button @click="openAddItemModal" class="btn btn-primary">
          <i class="fas fa-plus" aria-hidden="true"></i> เพิ่มรายการใหม่
        </button>
      </template>
    </PageHeader>

    <div v-if="loading" class="loading">กำลังโหลดข้อมูล...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <template v-if="!loading">
      <div class="search-box">
        <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
        <input
          type="search"
          v-model="searchTerm"
          placeholder="ค้นหารายการ..."
          aria-label="ค้นหารายการยาและเวชภัณฑ์"
        />
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-name">ชื่อรายการ</th>
              <th class="col-price text-right">ราคา</th>
              <th class="col-unit">หน่วยนับ</th>
              <th class="col-notes">หมายเหตุ</th>
              <th class="col-status text-center">เบิกได้</th>
              <th class="col-actions text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td>
                <input
                  type="text"
                  v-model="item.name"
                  class="form-control-table"
                  :aria-label="`ชื่อรายการ ${item.name}`"
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  v-model.number="item.price_per_unit"
                  class="form-control-table text-right"
                  :aria-label="`ราคาต่อหน่วย ${item.name}`"
                />
              </td>
              <td>
                <input
                  type="text"
                  v-model="item.unit_pack"
                  class="form-control-table"
                  :aria-label="`หน่วยนับ ${item.name}`"
                />
              </td>
              <td>
                <input
                  type="text"
                  v-model="item.notes"
                  class="form-control-table"
                  :aria-label="`หมายเหตุ ${item.name}`"
                />
              </td>
              <td class="text-center">
                <label class="switch">
                  <input
                    type="checkbox"
                    v-model="item.is_available"
                    :aria-label="`สถานะการเบิกได้ของ ${item.name}`"
                  />
                  <span class="slider" aria-hidden="true"></span>
                </label>
              </td>
              <td class="text-center">
                <button @click="updateItem(item)" class="btn btn-primary btn-sm">
                  <i class="fas fa-floppy-disk" aria-hidden="true"></i> บันทึก
                </button>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="6" class="text-center text-muted table-empty">
                ไม่พบรายการที่ตรงกับ "{{ searchTerm }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <AppModal
      :open="showAddItemModal"
      title="เพิ่มรายการยาและเวชภัณฑ์ใหม่"
      @update:open="showAddItemModal = $event"
    >
      <form id="add-item-form" @submit.prevent="handleAddItem">
        <div class="form-group">
          <label for="name">ชื่อรายการ <span class="required">*</span></label>
          <input type="text" id="name" v-model="newItem.name" required data-autofocus />
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="price">ราคาต่อหน่วย <span class="required">*</span></label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              v-model.number="newItem.price_per_unit"
              required
            />
          </div>
          <div class="form-group">
            <label for="unit_pack">หน่วยนับ</label>
            <input type="text" id="unit_pack" v-model="newItem.unit_pack" />
          </div>
        </div>

        <div class="form-group">
          <label for="category">หมวดหมู่ <span class="required">*</span></label>
          <select id="category" v-model="newItem.category" required>
            <option disabled value="">-- เลือกหมวดหมู่ --</option>
            <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
            <option value="--new--">-- เพิ่มหมวดหมู่ใหม่ --</option>
          </select>
        </div>

        <div v-if="newItem.category === '--new--'" class="form-group">
          <label for="new_category_name">ชื่อหมวดหมู่ใหม่ <span class="required">*</span></label>
          <input type="text" id="new_category_name" v-model="newCategoryName" required />
        </div>
      </form>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showAddItemModal = false">
          ยกเลิก
        </button>
        <button type="submit" form="add-item-form" class="btn btn-success" :disabled="isSubmitting">
          <i class="fas fa-plus" aria-hidden="true"></i>
          {{ isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มรายการ' }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppModal from '@/components/AppModal.vue';
import PageHeader from '@/components/PageHeader.vue';
import { useToast } from '@/composables/useToast';
import { supabase } from '@/supabaseClient';
import type { Item } from '@/types/models';

type NewItem = {
  name: string;
  price_per_unit: number;
  unit_pack: string;
  category: string;
  is_active: boolean;
  is_available: boolean;
  notes: string | null;
};

type NewItemWithOrders = NewItem & {
  category_order: number;
  item_order: number;
};

const toast = useToast();
const loading = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);
const error = ref<string | null>(null);
const items = ref<Item[]>([]);
const searchTerm = ref<string>('');
const showAddItemModal = ref<boolean>(false);
const newCategoryName = ref<string>('');

const newItem = ref<NewItem>({
  name: '',
  price_per_unit: 0,
  unit_pack: '',
  category: '',
  is_active: true,
  is_available: true,
  notes: null,
});

const uniqueCategories = computed<string[]>(() => {
  if (!items.value) return [];
  const categories = items.value.map((item) => item.category);
  return [...new Set(categories)].sort();
});

onMounted(async () => {
  await fetchItems();
});

async function fetchItems(): Promise<void> {
  try {
    loading.value = true;
    const { data, error: fetchError } = await supabase
      .from('items_drugcupsabot')
      .select('*')
      .order('category_order', { ascending: true, nullsFirst: false })
      .order('item_order', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true });

    if (fetchError) throw fetchError;
    items.value = (data ?? []) as unknown as Item[];
  } catch (err) {
    error.value = `ไม่สามารถโหลดข้อมูลรายการยาได้: ${err instanceof Error ? err.message : String(err)}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const filteredItems = computed<Item[]>(() => {
  if (!searchTerm.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  );
});

async function updateItem(item: Item): Promise<void> {
  try {
    const { id, created_at, category, category_order, item_order, ...updateData } = item;

    const { error: updateError } = await supabase
      .from('items_drugcupsabot')
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;
    toast.success(`อัปเดตรายการ "${item.name}" เรียบร้อยแล้ว`);
  } catch (err) {
    toast.error(`เกิดข้อผิดพลาดในการอัปเดต: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
  }
}

function openAddItemModal(): void {
  newItem.value = {
    name: '',
    price_per_unit: 0,
    unit_pack: '',
    category: '',
    is_active: true,
    is_available: true,
    notes: null,
  };
  newCategoryName.value = '';
  showAddItemModal.value = true;
}

async function handleAddItem(): Promise<void> {
  isSubmitting.value = true;
  try {
    let finalCategory = newItem.value.category;
    if (finalCategory === '--new--') {
      if (!newCategoryName.value.trim()) {
        toast.error('กรุณากรอกชื่อหมวดหมู่ใหม่');
        return;
      }
      finalCategory = newCategoryName.value.trim();
    }

    const dataToInsert: NewItemWithOrders = {
      ...newItem.value,
      category: finalCategory,
      category_order: 0,
      item_order: 0,
    };
    if (dataToInsert.notes === '') dataToInsert.notes = null;

    const existingCategory = items.value.find((item) => item.category === finalCategory);

    if (existingCategory) {
      dataToInsert.category_order = existingCategory.category_order ?? 0;
      const maxItemOrder = items.value
        .filter((item) => item.category === finalCategory)
        .reduce((max, item) => Math.max(max, item.item_order ?? 0), 0);
      dataToInsert.item_order = maxItemOrder + 1;
    } else {
      const maxCategoryOrder = items.value.reduce(
        (max, item) => Math.max(max, item.category_order ?? 0),
        0,
      );
      dataToInsert.category_order = maxCategoryOrder + 1;
      dataToInsert.item_order = 1;
    }

    const { data, error: insertError } = await supabase
      .from('items_drugcupsabot')
      .insert(dataToInsert)
      .select();

    if (insertError) throw insertError;

    const inserted = (data ?? []) as unknown as Item[];
    toast.success(`เพิ่มรายการ "${inserted[0]?.name}" สำเร็จ`);
    showAddItemModal.value = false;
    await fetchItems();
  } catch (err) {
    toast.error(`เกิดข้อผิดพลาดในการเพิ่มรายการ: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.search-box {
  position: relative;
  max-width: 420px;
  margin-bottom: var(--space-5);
}

.search-box > i {
  position: absolute;
  top: 50%;
  left: var(--space-3);
  transform: translateY(-50%);
  color: var(--color-muted-slate);
  pointer-events: none;
}

.search-box input {
  padding-left: calc(var(--space-3) * 2 + 0.75rem);
}

table {
  table-layout: fixed;
  width: 100%;
  min-width: 760px;
}

.col-price,
.col-unit {
  width: 130px;
}
.col-notes {
  width: 24%;
}
.col-status {
  width: 110px;
}
.col-actions {
  width: 120px;
}

.form-control-table {
  width: 100%;
  min-height: 36px;
  padding: var(--space-2) var(--space-3);
}

.table-empty {
  padding: var(--space-8);
}

/* Toggle switch */
.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 26px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  cursor: pointer;
  background-color: var(--color-hairline);
  border-radius: var(--radius-pill);
  transition: background-color var(--duration-base) var(--easing-standard);
}
.slider::before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  top: 3px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: var(--shadow-xs);
  transition: transform var(--duration-base) var(--easing-standard);
}
.switch input:checked + .slider {
  background-color: var(--color-success);
}
.switch input:focus-visible + .slider {
  box-shadow: var(--shadow-focus);
}
.switch input:checked + .slider::before {
  transform: translateX(20px);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.required {
  color: var(--color-status-rejected);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
