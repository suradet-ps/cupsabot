<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-backdrop"
      @mousedown.self="close"
      @keydown="onKeydown"
    >
      <div
        ref="dialogRef"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <div class="modal-header">
          <h2 :id="titleId" class="modal-title">{{ title }}</h2>
          <button
            type="button"
            class="modal-close"
            aria-label="ปิดหน้าต่าง"
            @click="close"
          >
            <i class="fas fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{
  open: boolean;
  title: string;
}>();

const emit = defineEmits<(event: 'update:open', value: boolean) => void>();

const dialogRef = ref<HTMLElement | null>(null);
const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;
let previouslyFocused: HTMLElement | null = null;

function close(): void {
  emit('update:open', false);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(): HTMLElement[] {
  if (!dialogRef.value) return [];
  return Array.from(dialogRef.value.querySelectorAll<HTMLElement>(FOCUSABLE));
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusable = getFocusable();
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      await nextTick();
      const autofocus = dialogRef.value?.querySelector<HTMLElement>('[data-autofocus]');
      const focusable = getFocusable();
      (autofocus ?? focusable[0] ?? dialogRef.value)?.focus();
    } else {
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
      previouslyFocused = null;
    }
  },
);

onBeforeUnmount(() => {
  if (props.open) {
    previouslyFocused?.focus?.();
    previouslyFocused = null;
  }
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background-color: rgba(27, 35, 48, 0.5);
  animation: modal-fade var(--duration-base) var(--easing-standard);
}

.modal {
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - var(--space-8));
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-overlay);
  animation: modal-rise var(--duration-slow) var(--easing-enter);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-hairline);
}

.modal-title {
  margin: 0;
  font-size: var(--text-feature-heading);
}

.modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-muted-slate);
  cursor: pointer;
}

.modal-close:hover {
  background-color: var(--color-soft-stone);
  color: var(--color-ink);
}

.modal-body {
  padding: var(--space-6);
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-hairline);
}

@keyframes modal-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
