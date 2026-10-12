<template>
  <div class="pcu-layout">
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
main:focus {
  outline: none;
}
</style>
