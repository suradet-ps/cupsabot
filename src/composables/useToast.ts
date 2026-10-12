import { readonly, ref } from 'vue';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  variant: ToastVariant;
  message: string;
}

const toasts = ref<Toast[]>([]);
let sequence = 0;

function dismiss(id: number): void {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

function show(message: string, variant: ToastVariant = 'info', timeout = 4500): number {
  const id = ++sequence;
  toasts.value = [...toasts.value, { id, variant, message }];
  if (timeout > 0) {
    setTimeout(() => dismiss(id), timeout);
  }
  return id;
}

/**
 * Lightweight, accessible, app-wide notifications.
 * State is module-scoped so any component shares the same queue.
 */
export function useToast() {
  return {
    toasts: readonly(toasts),
    dismiss,
    show,
    success: (message: string, timeout?: number) => show(message, 'success', timeout),
    error: (message: string, timeout?: number) => show(message, 'error', timeout),
    info: (message: string, timeout?: number) => show(message, 'info', timeout),
    warning: (message: string, timeout?: number) => show(message, 'warning', timeout),
  };
}
