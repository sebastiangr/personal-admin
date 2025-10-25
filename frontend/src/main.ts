import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/main.css'
import App from './App.vue'
import router from './router'
import { setRouter } from './utils/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)

setRouter(router);

app.mount('#app')