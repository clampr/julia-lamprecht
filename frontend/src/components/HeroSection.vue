<template>
  <section class="hero" aria-label="Hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1>{{ $t('hero.title') }}</h1>
      <p class="subtitle">{{ $t('hero.subtitle') }}</p>
      <a href="#contact" class="cta">{{ $t('nav.contact') }}</a>
    </div>
    <div class="scroll-hint" aria-hidden="true">
      <span></span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /*
   * Replace the background-image below with the actual photo:
   * background-image: url('/hero.jpg');
   * The photo will be automatically displayed in grayscale via the filter property.
   */
  background-color: #2a2a2a;
  background-image:
    radial-gradient(ellipse at 60% 40%, #4a4a4a 0%, #1a1a1a 60%),
    linear-gradient(160deg, #3a3a3a 0%, #111111 100%);
  background-size: cover;
  background-position: center top;
  filter: none;
}

/* When a real photo is used, apply grayscale: */
/* .hero { filter: grayscale(1); } */

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.35) 0%,
    rgba(0, 0, 0, 0.55) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #ffffff;
  padding: 0 24px;
}

h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  letter-spacing: 0.04em;
  margin-bottom: 16px;
}

.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  font-weight: 300;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

.cta {
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.7);
  padding: 12px 32px;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  transition: background 0.25s, border-color 0.25s;
}

.cta:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: #ffffff;
}

.scroll-hint {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.scroll-hint span {
  display: block;
  width: 1px;
  height: 48px;
  background: rgba(255, 255, 255, 0.5);
  margin: 0 auto;
  animation: scrollLine 1.8s ease-in-out infinite;
}

@keyframes scrollLine {
  0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
  40%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
  60%  { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
  100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
}
</style>
