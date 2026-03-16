import { createApp } from 'vue'
import pinia from './stores'
import router from './router'
import App from './App.vue'

import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/main.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
