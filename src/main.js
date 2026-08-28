import { createClient } from '@supabase/supabase-js'
import './style.css'

const supabase = createClient(
  'https://fgomaujsdblpzxhnnqrg.supabase.co',
  'sb_publishable_JOUqLZDnfGu_yCa6k6FVDQ_AYwpr72i',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
)

const form = document.querySelector('#volunteer-form')
const message = document.querySelector('#form-message')
const submitButton = form.querySelector('[type="submit"]')
const formView = document.querySelector('#form-view')
const thankYouView = document.querySelector('#thank-you-view')

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  message.textContent = ''

  const volunteerName = form.elements.name.value.trim()
  const selectedServices = [...form.querySelectorAll('input[name="services"]:checked')].map(input => input.value)

  if (!volunteerName) {
    message.textContent = 'Please enter your name.'
    form.elements.name.focus()
    return
  }

  if (selectedServices.length === 0) {
    message.textContent = 'Please select at least one service time.'
    form.querySelector('input[name="services"]').focus()
    return
  }

  submitButton.disabled = true
  submitButton.textContent = 'Submitting…'

  const { error } = await supabase
    .from('usher_high_holiday_volunteers_2026_v1')
    .insert({ usher_volunteer_name: volunteerName, usher_service_selections: selectedServices })

  if (error) {
    if (error.code === '23505') {
      message.textContent = 'That name has already been submitted. Please use a different name or contact the organizer.'
    } else if (error.code === '42501') {
      message.textContent = 'The form could not access the sign-up list. Please refresh the page and try again.'
    } else {
      message.textContent = `We could not submit the form (${error.code || 'connection error'}). Please try again.`
    }
    submitButton.disabled = false
    submitButton.textContent = 'Submit'
    return
  }

  formView.hidden = true
  thankYouView.hidden = false
  document.querySelector('#close-button').focus()
})

document.querySelector('#cancel-button').addEventListener('click', () => {
  form.reset()
  message.textContent = ''
  form.elements.name.focus()
})

document.querySelector('#close-button').addEventListener('click', () => {
  window.close()
  if (!window.closed) {
    thankYouView.querySelector('p:last-of-type').textContent = 'You may now close this browser tab.'
  }
})
