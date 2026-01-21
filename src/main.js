import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. ต้อง import
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia() // 2. สร้าง

app.use(pinia) // 3. ใช้งาน (ต้องบรรทัดนี้ก่อน mount นะ!)
app.mount('#app')