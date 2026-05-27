<template>
  <footer>
    <div class="container">
      <span class="copy">© {{ year }} Julia Lamprecht. {{ $t('footer.rights') }}</span>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
footer {
  background: #5c3a8c;
  color: rgba(255, 255, 255, 0.5);
  padding: 28px 0;
}

.copy {
  font-size: 0.8125rem;
}
</style>
