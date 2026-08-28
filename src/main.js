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
  const selectedServices = new Set(
    [...form.querySelectorAll('input[name="services"]:checked')].map(input => input.value)
  )

  if (!volunteerName) {
    message.textContent = 'Please enter your name.'
    form.elements.name.focus()
    return
  }

  if (selectedServices.size === 0) {
    message.textContent = 'Please select at least one service time.'
    form.querySelector('input[name="services"]').focus()
    return
  }

  submitButton.disabled = true
  submitButton.textContent = 'Submitting…'

  const { error } = await supabase
    .from('usher_high_holiday_volunteers_2026_v1')
    .insert({
      usher_volunteer_name: volunteerName,
      usher_erev_rosh_hashana_selected: selectedServices.has('erev_rosh_hashana'),
      usher_rosh_hashana_selected: selectedServices.has('rosh_hashana'),
      usher_kol_nidre_selected: selectedServices.has('kol_nidre'),
      usher_yom_kippur_morning_selected: selectedServices.has('yom_kippur_morning'),
      usher_yom_kippur_afternoon_evening_selected: selectedServices.has('yom_kippur_afternoon_evening')
    })

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
  form.reset()
  message.textContent = ''
  formView.hidden = true
  thankYouView.hidden = true
  document.querySelector('.page-shell').hidden = true
  document.title = 'Form closed'
  window.close()
})
