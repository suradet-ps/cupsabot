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
  background:
    radial-gradient(1000px 620px at 100% -10%, rgba(138, 90, 52, 0.12), transparent 60%),
    radial-gradient(820px 560px at -12% 112%, rgba(229, 138, 166, 0.1), transparent 60%),
    var(--color-canvas);
}

main {
  flex-grow: 1;
  padding: var(--space-4) var(--space-6) var(--space-12);
}

main:focus {
  outline: none;
}

@media (max-width: 640px) {
  main {
    padding: var(--space-3) var(--space-4) var(--space-10);
  }
}
</style>
