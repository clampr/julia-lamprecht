<template>
  <div>
    <TheHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import EducationSection from './components/EducationSection.vue'
import ContactSection from './components/ContactSection.vue'
import TheFooter from './components/TheFooter.vue'
</script>
