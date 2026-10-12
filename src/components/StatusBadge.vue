<template>
  <span class="status-badge" :class="status">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { statusLabel } from '@/utils/format';

const props = defineProps<{ status: string | null | undefined }>();

const label = computed(() => statusLabel(props.status));
</script>
