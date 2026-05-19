<template>
  <header :class="{ scrolled: isScrolled }">
    <div class="container header-inner">
      <a href="#" class="logo" @click.prevent="scrollTop">Julia Lamprecht</a>

      <button class="menu-toggle" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav :class="{ open: menuOpen }">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          @click="navigate"
        >{{ $t(`nav.${item.key}`) }}</a>

        <button class="lang-switch" @click="toggleLang">
          {{ locale === 'de' ? 'EN' : 'DE' }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isScrolled = ref(false)
const menuOpen = ref(false)

const navItems = [
  { id: 'about', key: 'about' },
  { id: 'experience', key: 'experience' },
  { id: 'education', key: 'education' },
  { id: 'contact', key: 'contact' }
]

function toggleLang() {
  locale.value = locale.value === 'de' ? 'en' : 'de'
  localStorage.setItem('locale', locale.value)
  menuOpen.value = false
}

function navigate() {
  menuOpen.value = false
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onScroll() {
  isScrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20px 0;
  transition: background 0.3s, padding 0.3s, box-shadow 0.3s;
}

header.scrolled {
  background: rgba(255, 255, 255, 0.97);
  padding: 12px 0;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.02em;
  transition: color 0.3s;
}

header.scrolled .logo {
  color: #1a1a1a;
}

nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

nav a {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.2s;
}

nav a:hover {
  color: #ffffff;
}

header.scrolled nav a {
  color: #555555;
}

header.scrolled nav a:hover {
  color: #1a1a1a;
}

.lang-switch {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.lang-switch:hover {
  background: rgba(255, 255, 255, 0.15);
}

header.scrolled .lang-switch {
  border-color: #cccccc;
  color: #555555;
}

header.scrolled .lang-switch:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: #ffffff;
  transition: background 0.3s;
}

header.scrolled .menu-toggle span {
  background: #1a1a1a;
}

@media (max-width: 640px) {
  .menu-toggle {
    display: flex;
  }

  nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.97);
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    padding: 8px 24px 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  nav.open {
    display: flex;
  }

  nav a {
    color: #555555;
    padding: 10px 0;
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
  }

  nav a:hover {
    color: #1a1a1a;
  }

  .lang-switch {
    margin-top: 12px;
    border-color: #cccccc;
    color: #555555;
  }
}
</style>
