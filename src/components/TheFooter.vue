<template>
  <footer>
    <div class="container footer-inner">
      <span class="copy">© {{ year }} Julia Lamprecht. {{ $t('footer.rights') }}</span>
      <a href="#imprint" class="imprint-link">{{ $t('footer.imprint') }}</a>
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

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.copy {
  font-size: 0.8125rem;
}

.imprint-link {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s;
}

.imprint-link:hover {
  color: rgba(255, 255, 255, 0.8);
}
</style>
