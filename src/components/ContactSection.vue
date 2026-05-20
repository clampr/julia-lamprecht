<template>
  <section id="contact" class="alt-bg">
    <div class="container">
      <h2 class="section-heading">{{ $t('contact.heading') }}</h2>

      <div class="contact-block">
        <div class="contact-item">
          <span class="label">{{ $t('contact.address') }}</span>
          <span class="value">
            Musterstraße 12<br />
            63065 Offenbach am Main
          </span>
        </div>

        <div class="contact-item">
          <span class="label">{{ $t('contact.phone') }}</span>
          <a class="value link" href="tel:+4912345678900">+49 123 456 789 00</a>
        </div>

        <div class="contact-item">
          <span class="label">{{ $t('contact.email') }}</span>
          <a class="value link" href="mailto:mail@julia-lamprecht.com">mail@julia-lamprecht.com</a>
        </div>

        <a class="mail-btn" href="mailto:mail@julia-lamprecht.com">
          {{ $t('contact.write') }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.alt-bg {
  background: #f8f8f8;
}

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
</style>
