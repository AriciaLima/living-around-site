document.addEventListener('DOMContentLoaded', () => {
  const toTopButtons = document.querySelectorAll('.btn-to-top')

  function handleToTopClick(event) {
    event.preventDefault()
    // Smooth scroll to top of the document
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if (toTopButtons && toTopButtons.length) {
    toTopButtons.forEach(btn => {
      btn.addEventListener('click', handleToTopClick)
    })
  }

  // Contacts form success modal handling
  const contactsForm = document.querySelector('.contact-card form')
  const successModalEl = document.getElementById('successModal')

  if (contactsForm && successModalEl) {
    const bsModal = new bootstrap.Modal(successModalEl)
    contactsForm.addEventListener('submit', e => {
      e.preventDefault()

      // Simple validation
      const nameEl = contactsForm.querySelector('#contact-name')
      const emailEl = contactsForm.querySelector('#contact-email')
      const messageEl = contactsForm.querySelector('#contact-message')

      let valid = true
      // reset validation state
      ;[nameEl, emailEl, messageEl].forEach(el =>
        el.classList.remove('is-invalid')
      )

      if (!nameEl.value.trim()) {
        nameEl.classList.add('is-invalid')
        valid = false
      }

      const emailValue = emailEl.value.trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailValue || !emailRegex.test(emailValue)) {
        emailEl.classList.add('is-invalid')
        valid = false
      }

      if (!messageEl.value.trim()) {
        messageEl.classList.add('is-invalid')
        valid = false
      }

      if (!valid) return

      // Everything valid — show modal and reset
      bsModal.show()
      contactsForm.reset()
    })
  }
})
