<template>
  <Teleport to="body">
    <div class="toast-host" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.variant}`"
          role="status"
        >
          <i :class="[iconFor(toast.variant), 'toast-icon']" aria-hidden="true"></i>
          <p class="toast-message">{{ toast.message }}</p>
          <button
            type="button"
            class="toast-close"
            aria-label="ปิดการแจ้งเตือน"
            @click="dismiss(toast.id)"
          >
            <i class="fas fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { type ToastVariant, useToast } from '@/composables/useToast';

const { toasts, dismiss } = useToast();

function iconFor(variant: ToastVariant): string {
  switch (variant) {
    case 'success':
      return 'fas fa-circle-check';
    case 'error':
      return 'fas fa-circle-exclamation';
    case 'warning':
      return 'fas fa-triangle-exclamation';
    default:
      return 'fas fa-circle-info';
  }
}
</script>

<style scoped>
.toast-host {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: min(360px, calc(100vw - var(--space-8)));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-card-border);
  border-left: 4px solid var(--color-slate);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-overlay);
  pointer-events: auto;
}

.toast-message {
  flex: 1;
  margin: 0;
  font-size: var(--text-caption);
  color: var(--color-ink);
}

.toast-icon {
  margin-top: 1px;
}

.toast--success {
  border-left-color: var(--color-status-fulfilled);
}
.toast--success .toast-icon {
  color: var(--color-status-fulfilled);
}
.toast--error {
  border-left-color: var(--color-status-rejected);
}
.toast--error .toast-icon {
  color: var(--color-status-rejected);
}
.toast--warning {
  border-left-color: var(--color-status-submitted);
}
.toast--warning .toast-icon {
  color: var(--color-status-submitted);
}
.toast--info {
  border-left-color: var(--color-status-approved);
}
.toast--info .toast-icon {
  color: var(--color-status-approved);
}

.toast-close {
  border: none;
  background: transparent;
  color: var(--color-muted-slate);
  cursor: pointer;
  padding: 2px;
  border-radius: var(--radius-xs);
  line-height: 1;
}

.toast-close:hover {
  color: var(--color-ink);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity var(--duration-base) var(--easing-standard),
    transform var(--duration-base) var(--easing-standard);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
