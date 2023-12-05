import { createApp, provide } from 'vue'
import App from '../src/views/App.vue'
import router from './router'
import emitter from './services/mitt'


const app = createApp(App)
app.provide("emitter", emitter)

app.use(router)

app.mount('#app')
