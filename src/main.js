import './assets/scss/all.scss'
import 'bootstrap/dist/js/bootstrap.min.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import AOS from 'aos'
import 'aos/dist/aos.css'

const pinia = createPinia()
const app = createApp(App)

AOS.init()
app.use(LoadingPlugin)
app.use(router)
app.use(pinia)

app.mount('#app')
