<template>
  <section id="contact" class="alt-bg">
    <div class="container">
      <h2 class="section-heading">{{ $t('contact.heading') }}</h2>

      <form class="contact-form" @submit.prevent="handleSubmit" novalidate>
        <!-- Honeypot -->
        <input type="text" name="website" class="honeypot" tabindex="-1" autocomplete="off" v-model="honeypot" />

        <div class="field">
          <label for="name">{{ $t('contact.name') }} *</label>
          <input
            id="name"
            type="text"
            v-model="form.name"
            :placeholder="$t('contact.namePlaceholder')"
            required
            :class="{ invalid: errors.name }"
          />
          <span v-if="errors.name" class="error-msg">{{ $t('contact.required') }}</span>
        </div>

        <div class="field">
          <label for="email">{{ $t('contact.email') }} *</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            :placeholder="$t('contact.emailPlaceholder')"
            required
            :class="{ invalid: errors.email }"
          />
          <span v-if="errors.email" class="error-msg">{{ $t('contact.required') }}</span>
        </div>

        <div class="field">
          <label for="message">{{ $t('contact.message') }} *</label>
          <textarea
            id="message"
            v-model="form.message"
            :placeholder="$t('contact.messagePlaceholder')"
            rows="5"
            required
            :class="{ invalid: errors.message }"
          ></textarea>
          <span v-if="errors.message" class="error-msg">{{ $t('contact.required') }}</span>
        </div>

        <div v-if="status === 'success'" class="feedback success" role="alert">
          {{ $t('contact.success') }}
        </div>
        <div v-if="status === 'error'" class="feedback error" role="alert">
          {{ $t('contact.error') }}
        </div>

        <button type="submit" :disabled="loading">
          <span v-if="!loading">{{ $t('contact.send') }}</span>
          <span v-else class="spinner" aria-hidden="true"></span>
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ name: '', email: '', message: '' })
const errors = reactive({ name: false, email: false, message: false })
const honeypot = ref('')
const loading = ref(false)
const status = ref(null)

function validate() {
  errors.name = !form.name.trim()
  errors.email = !form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  errors.message = !form.message.trim()
  return !errors.name && !errors.email && !errors.message
}

async function handleSubmit() {
  status.value = null
  if (!validate()) return
  if (honeypot.value) return

  loading.value = true
  try {
    const res = await fetch('/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message
      })
    })
    const data = await res.json()
    if (res.ok && data.success) {
      status.value = 'success'
      form.name = ''
      form.email = ''
      form.message = ''
    } else {
      status.value = 'error'
    }
  } catch {
    status.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.alt-bg {
  background: #f8f8f8;
}

.contact-form {
  max-width: 560px;
}

.honeypot {
  position: absolute;
  left: -9999px;
  opacity: 0;
}

.field {
  margin-bottom: 24px;
}

label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #555555;
  margin-bottom: 6px;
}

input,
textarea {
  width: 100%;
  padding: 10px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  color: #1a1a1a;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: #888888;
}

input.invalid,
textarea.invalid {
  border-color: #c0392b;
}

.error-msg {
  font-size: 0.75rem;
  color: #c0392b;
  margin-top: 4px;
  display: block;
}

button[type='submit'] {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  padding: 13px 36px;
  cursor: pointer;
  min-width: 140px;
  transition: background 0.2s;
}

button[type='submit']:hover:not(:disabled) {
  background: #333333;
}

button[type='submit']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.feedback {
  margin-bottom: 20px;
  padding: 12px 16px;
  font-size: 0.9rem;
}

.feedback.success {
  background: #f0faf0;
  border: 1px solid #b2d8b2;
  color: #2e7d32;
}

.feedback.error {
  background: #fdf0f0;
  border: 1px solid #f0b2b2;
  color: #c0392b;
}
</style>
