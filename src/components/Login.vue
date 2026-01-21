<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import Swal from 'sweetalert2'

const username = ref('')
const password = ref('')
const authStore = useAuthStore()

const handleLogin = async () => {
  if (!username.value || !password.value) return

  const success = await authStore.login(username.value, password.value)
  
  if (success) {
    Swal.fire({
      icon: 'success',
      title: 'ยินดีต้อนรับ!',
      text: `สวัสดีคุณ ${authStore.userFullName}`,
      timer: 1500,
      showConfirmButton: false
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'เข้าสู่ระบบไม่สำเร็จ',
      text: 'Username หรือ Password ผิดพลาด'
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-green-50/50">
    <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">ระบบใบลาออนไลน์</h2>
        <p class="text-gray-500 text-sm mt-1">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input v-model="username" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" placeholder="กรอกชื่อผู้ใช้" required />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" placeholder="กรอกรหัสผ่าน" required />
        </div>

        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  </div>
</template>