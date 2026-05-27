<template>
  <section id="languages">
    <div class="container">
      <h2 class="section-heading">{{ $t('languages.heading') }}</h2>
      <div class="lang-grid">
        <div
          v-for="(lang, i) in entries"
          :key="i"
          class="lang-card"
        >
          <span class="lang-name">{{ lang.name }}</span>
          <span v-if="lang.sublabel" class="lang-sublabel">{{ lang.sublabel }}</span>
          <div class="lang-dots" aria-hidden="true">
            <span
              v-for="n in 5"
              :key="n"
              class="dot"
              :class="{ filled: n <= lang.proficiency }"
            ></span>
          </div>
          <span class="lang-level">{{ lang.level }}</span>
        </div>
      </div>
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
  (locale.value === 'en' ? en : de).languages.entries
)
</script>

<style scoped>
.lang-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.lang-card {
  background: #ffffff;
  border: 1px solid #ebebeb;
  padding: 32px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.lang-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
}

.lang-sublabel {
  font-size: 0.75rem;
  color: #aaaaaa;
  letter-spacing: 0.04em;
  margin-top: -6px;
}

.lang-dots {
  display: flex;
  gap: 7px;
  margin: 4px 0;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #e2e2e2;
  transition: background 0.2s;
}

.dot.filled {
  background: #5c3a8c;
}

.lang-level {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888888;
}

@media (max-width: 600px) {
  .lang-grid {
    grid-template-columns: 1fr;
    max-width: 280px;
    margin: 0 auto;
  }
}

/* ── Print ── */
@media print {
  .lang-grid {
    gap: 12px;
  }

  .lang-card {
    border-color: #e0e0e0;
    padding: 20px 16px;
    gap: 7px;
  }
}
</style>
