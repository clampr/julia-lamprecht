<template>
  <section id="contact">
    <div class="container">
      <h2 class="section-heading">{{ $t('contact.heading') }}</h2>

      <div class="contact-block">
        <div class="contact-item">
          <span class="label">{{ $t('contact.address') }}</span>
          <span class="value">
            Kurt-Schumacher-Str. 26<br />
            61191 Rosbach vor der Höhe
          </span>
        </div>

        <div class="contact-item">
          <span class="label">{{ $t('contact.phone') }}</span>
          <a class="value link" href="tel:+4915168194833">+49 151 68194833</a>
        </div>

        <div class="contact-item">
          <span class="label">{{ $t('contact.email') }}</span>
          <a class="value link" href="mailto:hello@julia-lamprecht.com">hello@julia-lamprecht.com</a>
        </div>

        <div class="contact-item">
          <span class="label">{{ $t('contact.linkedin') }}</span>
          <a class="value link linkedin-link" href="https://www.linkedin.com/in/jlampr/" target="_blank" rel="noopener">
            <svg class="linkedin-icon" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="3" fill="#1a1a1a"/>
              <path fill="#ffffff" d="M7.75 9.5h-2.5v8h2.5v-8zm-1.25-4a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm10.25 4c-1.24 0-2.07.67-2.41 1.31V9.5h-2.5v8h2.5v-4.25c0-1.1.56-1.75 1.56-1.75.97 0 1.44.62 1.44 1.75V17.5h2.5v-4.62c0-2.3-1.23-3.38-3.09-3.38z"/>
            </svg>
            linkedin.com/in/jlampr
          </a>
        </div>

        <a class="mail-btn" href="mailto:hello@julia-lamprecht.com">
          {{ $t('contact.write') }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-block {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 480px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #999999;
}

.value {
  font-size: 1rem;
  color: #1a1a1a;
  line-height: 1.6;
}

.link {
  text-decoration: none;
  color: #1a1a1a;
  transition: color 0.15s;
}

.link:hover {
  color: #555555;
}

.linkedin-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.linkedin-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.mail-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 13px 36px;
  background: #5c3a8c;
  color: #ffffff;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background 0.2s;
  align-self: flex-start;
}

.mail-btn:hover {
  background: #47297a;
}

@media print {
  .mail-btn { display: none; }
}
</style>
