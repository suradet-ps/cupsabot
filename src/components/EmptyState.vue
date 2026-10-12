<template>
  <div class="empty-state">
    <i v-if="icon" :class="[icon, 'empty-icon']" aria-hidden="true"></i>
    <p class="empty-title">{{ title }}</p>
    <p v-if="text" class="empty-text">{{ text }}</p>
    <div v-if="$slots.default" class="inline">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  text?: string;
  icon?: string;
}>();
</script>
