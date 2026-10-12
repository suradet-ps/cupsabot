<template>
  <div class="container">
    <PageHeader
      title="ตั้งค่าระบบ"
      subtitle="กำหนดข้อมูลบุคลากรที่ใช้ในเอกสารใบเบิกของแต่ละ รพ.สต."
      icon="fas fa-gear"
    />

    <div v-if="loading" class="loading">กำลังโหลดข้อมูล...</div>
    <p v-if="error" class="alert alert--error" role="alert">
      <i class="fas fa-circle-exclamation alert-icon" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </p>

    <template v-if="!loading">
      <div class="section-head">
        <h2>บุคลากรประจำ รพ.สต.</h2>
      </div>
      <p class="text-muted settings-note">
        ข้อมูลนี้จะถูกนำไปใช้ในใบเบิกของแต่ละ รพ.สต. โดยอัตโนมัติ
      </p>

      <div class="settings-grid">
        <div v-for="pcu in pcuSettings" :key="pcu.pcu_id" class="card">
          <h3 class="pcu-title">{{ pcu.pcu_name }}</h3>
          <form @submit.prevent="savePcuPersonnel(pcu)">
            <div class="form-group">
              <label :for="`req-name-${pcu.pcu_id}`">ชื่อผู้เบิก (เช่น ผอ.รพ.สต.)</label>
              <input
                :id="`req-name-${pcu.pcu_id}`"
                type="text"
                v-model="pcu.requester_name"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>
            <div class="form-group">
              <label :for="`req-pos-${pcu.pcu_id}`">ตำแหน่งผู้เบิก</label>
              <input
                :id="`req-pos-${pcu.pcu_id}`"
                type="text"
                v-model="pcu.requester_position"
                placeholder="ตำแหน่ง"
              />
            </div>

            <div class="divider"></div>

            <div class="form-group">
              <label :for="`rec-name-${pcu.pcu_id}`">ชื่อผู้รับของ</label>
              <input
                :id="`rec-name-${pcu.pcu_id}`"
                type="text"
                v-model="pcu.receiver_name"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>
            <div class="form-group">
              <label :for="`rec-pos-${pcu.pcu_id}`">ตำแหน่งผู้รับของ</label>
              <input
                :id="`rec-pos-${pcu.pcu_id}`"
                type="text"
                v-model="pcu.receiver_position"
                placeholder="ตำแหน่ง"
              />
            </div>

            <div class="action-footer">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="savingId === pcu.pcu_id"
              >
                <i class="fas fa-floppy-disk" aria-hidden="true"></i>
                {{ savingId === pcu.pcu_id ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { useToast } from '@/composables/useToast';
import { supabase } from '@/supabaseClient';
import type { Pcu, PcuPersonnel } from '@/types/models';

type PcuSetting = {
  pcu_id: number;
  pcu_name: string;
  id: number | null;
  requester_name: string;
  requester_position: string;
  receiver_name: string;
  receiver_position: string;
};

const toast = useToast();
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const pcuSettings = ref<PcuSetting[]>([]);
const savingId = ref<number | null>(null);

onMounted(async () => {
  await fetchSettings();
});

async function fetchSettings(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    const { data: pcus, error: pcuError } = await supabase
      .from('pcus_drugcupsabot')
      .select('id, name')
      .order('name');
    if (pcuError) throw pcuError;

    const { data: personnel, error: personnelError } = await supabase
      .from('pcu_personnel_drugcupsabot')
      .select('*');
    if (personnelError) throw personnelError;

    const pcusList = (pcus ?? []) as unknown as Pcu[];
    const personnelList = (personnel ?? []) as unknown as PcuPersonnel[];

    const settings = pcusList.map((pcu) => {
      const existingPersonnel = personnelList.find((p) => p.pcu_id === pcu.id);
      return {
        pcu_id: pcu.id,
        pcu_name: pcu.name,
        id: existingPersonnel?.id ?? null,
        requester_name: existingPersonnel?.requester_name || '',
        requester_position: existingPersonnel?.requester_position || '',
        receiver_name: existingPersonnel?.receiver_name || '',
        receiver_position: existingPersonnel?.receiver_position || '',
      };
    });
    pcuSettings.value = settings;
  } catch (err) {
    error.value = `ไม่สามารถโหลดข้อมูลการตั้งค่าได้: ${err instanceof Error ? err.message : String(err)}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function savePcuPersonnel(pcu: PcuSetting): Promise<void> {
  savingId.value = pcu.pcu_id;
  try {
    const upsertData = {
      pcu_id: pcu.pcu_id,
      requester_name: pcu.requester_name,
      requester_position: pcu.requester_position,
      receiver_name: pcu.receiver_name,
      receiver_position: pcu.receiver_position,
    };

    const { error: upsertError } = await supabase
      .from('pcu_personnel_drugcupsabot')
      .upsert(upsertData, { onConflict: 'pcu_id' });

    if (upsertError) throw upsertError;

    toast.success(`บันทึกข้อมูลของ ${pcu.pcu_name} เรียบร้อยแล้ว`);
    await fetchSettings();
  } catch (err) {
    toast.error(`เกิดข้อผิดพลาดในการบันทึก: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
  } finally {
    savingId.value = null;
  }
}
</script>

<style scoped>
.settings-note {
  margin-bottom: var(--space-5);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-6);
}

.pcu-title {
  font-size: var(--text-feature-heading);
  margin-top: 0;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-hairline);
  margin-bottom: var(--space-5);
}

.action-footer {
  margin-top: var(--space-4);
  text-align: right;
}

.action-footer .btn {
  width: 100%;
}
</style>
