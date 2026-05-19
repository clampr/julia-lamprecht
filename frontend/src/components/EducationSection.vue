<template>
  <section id="education">
    <div class="container">
      <h2 class="section-heading">{{ $t('education.heading') }}</h2>
      <div class="edu-list">
        <article
          v-for="(entry, i) in entries"
          :key="i"
          class="edu-item"
        >
          <div class="edu-period">{{ entry.period }}</div>
          <div class="edu-body">
            <h3 class="degree">{{ entry.degree }}</h3>
            <p class="school">{{ entry.school }}</p>
            <p class="thesis"><em>Thesis:</em> {{ entry.thesis }}</p>
          </div>
        </article>
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
  (locale.value === 'en' ? en : de).education.entries
)
</script>

<style scoped>
.edu-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.edu-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0 32px;
  align-items: start;
}

.edu-period {
  font-size: 0.8125rem;
  color: #888888;
  padding-top: 4px;
  white-space: nowrap;
}

.degree {
  font-family: 'Playfair Display', serif;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.school {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #444444;
  margin-bottom: 8px;
}

.thesis {
  font-size: 0.875rem;
  color: #666666;
  line-height: 1.6;
}

.thesis em {
  font-style: normal;
  color: #888888;
  font-size: 0.8125rem;
}

@media (max-width: 560px) {
  .edu-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .edu-period {
    padding-top: 0;
  }
}
</style>
