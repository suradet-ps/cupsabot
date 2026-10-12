<template>
  <header class="page-header">
    <div>
      <h1 class="page-title">
        <i v-if="icon" :class="[icon, 'page-title-icon']" aria-hidden="true"></i>
        {{ title }}
      </h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  icon?: string;
}>();
</script>
