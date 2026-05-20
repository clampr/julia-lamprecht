<template>
  <section id="experience" class="alt-bg">
    <div class="container">
      <h2 class="section-heading">{{ $t('experience.heading') }}</h2>
      <div class="timeline">
        <article
          v-for="(entry, i) in entries"
          :key="i"
          class="timeline-item"
        >
          <div class="timeline-marker"></div>
          <div class="timeline-body">
            <div class="meta">
              <span class="period">{{ entry.period }}</span>
              <span class="sep">·</span>
              <span class="type">{{ entry.type }}</span>
            </div>
            <h3 class="role">{{ entry.role }}</h3>
            <p class="org">{{ entry.org }}</p>
            <p v-if="entry.location" class="location">{{ entry.location }}</p>
            <ul v-if="entry.bullets && entry.bullets.length" class="bullets">
              <li v-for="(b, j) in entry.bullets" :key="j">{{ b }}</li>
            </ul>
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
  (locale.value === 'en' ? en : de).experience.entries
)
</script>

<style scoped>
.alt-bg {
  background: #f8f8f8;
}

.timeline {
  position: relative;
  padding-left: 28px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: #d8d8d8;
}

.timeline-item {
  position: relative;
  margin-bottom: 48px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -27px;
  top: 6px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid #5c3a8c;
  background: #5c3a8c;
}

.timeline-body {
  padding-bottom: 4px;
}

.meta {
  font-size: 0.8125rem;
  color: #888888;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sep {
  color: #cccccc;
}

.role {
  font-family: 'Playfair Display', serif;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.org {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #444444;
  margin-bottom: 2px;
}

.location {
  font-size: 0.8125rem;
  color: #888888;
  margin-bottom: 10px;
}

.bullets {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bullets li {
  font-size: 0.9375rem;
  color: #555555;
  padding-left: 14px;
  position: relative;
}

.bullets li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #aaaaaa;
}
</style>
