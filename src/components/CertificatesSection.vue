<template>
  <section id="certificates" class="alt-bg">
    <div class="container">
      <h2 class="section-heading">{{ $t('certificates.heading') }}</h2>
      <ul class="cert-list">
        <li
          v-for="(cert, i) in entries"
          :key="i"
          class="cert-item"
        >
          <div class="cert-accent" aria-hidden="true"></div>
          <div class="cert-body">
            <h3 class="cert-name">{{ cert.name }}</h3>
            <p class="cert-issuer">{{ cert.issuer }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import de from '../locales/de.json'
import en from '../locales/en.json'

const { locale } = useI18n()
const entries = computed(() =>
  (locale.value === 'en' ? en : de).certificates.entries
)
</script>

<style scoped>
.alt-bg {
  background: #f8f8f8;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.cert-item {
  display: flex;
  align-items: stretch;
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid #f0f0f0;
}

.cert-item:first-child {
  border-top: 1px solid #f0f0f0;
}

.cert-accent {
  flex-shrink: 0;
  width: 3px;
  background: #5c3a8c;
  border-radius: 2px;
  align-self: stretch;
  min-height: 100%;
}

.cert-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
}

.cert-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.35;
}

.cert-issuer {
  font-size: 0.875rem;
  color: #888888;
  font-weight: 400;
}

/* ── Print ── */
@media print {
  .cert-item {
    padding: 18px 0;
    break-inside: avoid;
  }

  .cert-name {
    font-size: 0.9375rem;
  }
}
</style>
