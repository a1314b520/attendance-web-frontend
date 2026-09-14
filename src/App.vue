<template>
  <div class="app-wrap">
    <div class="glass-scene">
      <span class="b1"></span>
      <span class="b2"></span>
      <span class="b3"></span>
      <span class="b4"></span>
    </div>
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
.app-wrap {
  position: relative;
  min-height: 100vh;
  z-index: 1;
}
</style>
