<template>
  <section class="hero" aria-label="Hero">
    <video class="hero-video" autoplay muted loop playsinline>
      <source src="/header.mp4" type="video/mp4" />
    </video>
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
  background-color: #5c3a8c;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: grayscale(1);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(92, 58, 140, 0.5) 0%,
    rgba(92, 58, 140, 0.72) 100%
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

/* ── Print: replace full-page video hero with a compact coloured header ── */
@media print {
  .hero {
    height: auto;
    min-height: 0;
    /* background-color: #5c3a8c is already defined above — used as-is. */
    padding: 0;
  }

  /* The video and animated scroll indicator make no sense on paper. */
  .hero-video,
  .scroll-hint { display: none; }

  /* Collapse the overlay so the hero background-color alone creates the
     purple block (avoids a semi-transparent layer over another purple). */
  .hero-overlay { display: none; }

  .hero-content {
    padding: 44px 24px 36px;
  }

  h1 {
    font-size: 2.2rem;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 0.9rem;
    margin-bottom: 0;
  }

  /* The "Contact" CTA button is a navigation affordance only. */
  .cta { display: none; }
}
</style>
