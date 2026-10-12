<template>
  <AppModal :open="state.open" :title="state.title" @update:open="onUpdate">
    <p v-if="state.message" class="confirm-message">{{ state.message }}</p>
    <div class="confirm-actions">
      <button type="button" class="btn btn-secondary" @click="resolve(false)">
        {{ state.cancelLabel }}
      </button>
      <button
        type="button"
        class="btn"
        :class="state.variant === 'danger' ? 'btn-danger' : 'btn-primary'"
        data-autofocus
        @click="resolve(true)"
      >
        {{ state.confirmLabel }}
      </button>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from '@/components/AppModal.vue';
import { useConfirm } from '@/composables/useConfirm';

const { state, resolve } = useConfirm();

function onUpdate(open: boolean): void {
  if (!open) resolve(false);
}
</script>

<style scoped>
.confirm-message {
  margin: 0;
  color: var(--color-ink);
  line-height: var(--leading-relaxed);
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
}
</style>
