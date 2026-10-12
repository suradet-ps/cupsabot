import { readonly, ref } from 'vue';

export type ConfirmVariant = 'default' | 'danger';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  resolver: ((value: boolean) => void) | null;
}

const state = ref<ConfirmState>({
  open: false,
  title: '',
  message: '',
  confirmLabel: 'ยืนยัน',
  cancelLabel: 'ยกเลิก',
  variant: 'default',
  resolver: null,
});

/**
 * Promise-based confirmation dialog that replaces native `confirm()`.
 * Resolves `true` when confirmed and `false` when dismissed.
 */
export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      state.value = {
        open: true,
        variant: 'default',
        confirmLabel: 'ยืนยัน',
        cancelLabel: 'ยกเลิก',
        ...options,
        resolver: resolve,
      };
    });
  }

  function resolve(value: boolean): void {
    state.value.resolver?.(value);
    state.value = { ...state.value, open: false, resolver: null };
  }

  return { state: readonly(state), confirm, resolve };
}
