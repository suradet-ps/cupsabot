<template>
  <div class="pcu-shell">
    <AppNavbar />
    <main id="main-content" tabindex="-1">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue';
</script>

<style scoped>
.pcu-shell {
  min-height: 100vh;
  background-color: var(--color-canvas);
}

main {
  flex-grow: 1;
  padding: var(--space-8) var(--space-6) var(--space-16);
}

main:focus {
  outline: none;
}

@media (max-width: 640px) {
  main {
    padding: var(--space-6) var(--space-4) var(--space-12);
  }
}
</style>
