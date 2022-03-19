window.onNuxtReady(() => {
  console.log('Nuxt.js is ready and mounted')
})

import Vue from 'vue';
import Auth from '@/authentication/auth'

Vue.use(Auth);