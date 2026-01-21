<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import LeaveForm from './components/LeaveForm.vue'
import LeaveHistory from './components/LeaveHistory.vue'
import LeaveStats from './components/LeaveStats.vue'
import Login from './components/Login.vue' // ✅ Import หน้า Login
import { useAuthStore } from './stores/auth' // ✅ Import Store
import axios from 'axios'
import Swal from 'sweetalert2'
import CreateUser from './components/CreateUser.vue'

const authStore = useAuthStore()
// สร้างตัวแปรเก็บสถานะหน้าจอ (default คือ false = ดูหน้า dashboard)
const showCreateUserPage = ref(false)

// --- Type Definitions ---
interface User { _id: string; name: string; role: string; }
interface Leave { _id: string; user: User | null; reason: string; status: string; }

// --- State ---
const leaves = ref<Leave[]>([])
const users = ref<User[]>([])
const isLoading = ref(false)

// --- Actions ---
const fetchUsers = async () => {
  const res = await fetch('http://localhost:3000/users')
  users.value = await res.json()
}

// ✅ ฟังก์ชันดึงข้อมูล (ปรับปรุงใหม่ให้ใส่ Token)
const fetchLeaves = async () => {
  try {
    // ใช้ axios แทน fetch จะได้ใส่ heades ง่ายๆ
    const res = await axios.get('http://localhost:3000/leaves', {
      headers: { Authorization: `Bearer ${authStore.token}` } // 🔑 แนบกุญแจ
    })
    leaves.value = res.data
  } catch (err) {
    console.error(err)
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      authStore.logout() // ถ้า Token หมดอายุ ให้เด้งออก
    }
  }
}

// ✅ โหลดข้อมูลเมื่อเปิดหน้าเว็บ (ถ้า Login แล้ว)
onMounted(() => {
  authStore.loadUserFromToken() // เช็ค Token ในเครื่อง
  if (authStore.isAuthenticated) {
    fetchLeaves()
  } else {
    // ถ้าไม่มี Token ไม่ต้องทำอะไร (มันจะโชว์หน้า Login เอง)
  }
})

// ✅ ฟังการเปลี่ยนแปลง: พอ Login ปุ๊บ ให้ดึงข้อมูลปั๊บ
import { watch } from 'vue'
watch(() => authStore.isAuthenticated, (isLoggedIn) => {
  if (isLoggedIn) fetchLeaves()
})

// ฟังก์ชันลบข้อมูล
const deleteLeave = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/leaves/${id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}` // 🔑 กุญแจผ่านทาง
      }
    })
    // ลบสำเร็จ -> แจ้งเตือนมุมขวาบน
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })
    Toast.fire({
      icon: 'success',
      title: 'ลบข้อมูลเรียบร้อยแล้ว'
    })
    fetchLeaves()
  } catch (err) {
    console.error(err)
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      authStore.logout() // ถ้า Token หมดอายุ ให้เด้งออก
    } else {
      Swal.fire('Error', 'ไม่สามารถลบข้อมูลได้', 'error')
    }
  }
}

const updateLeaveStatus = async (payload: { id: string, status: string }) => {
  try {
    const res = await fetch(`http://localhost:3000/leaves/${payload.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: payload.status })
    })

    if (res.ok) {
      // ไม่ต้อง alert ก็ได้ จะได้ดูลื่นไหล
      fetchLeaves() // โหลดข้อมูลใหม่ทันที
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาด')
  }
}

const activeTab = ref('All') // ตัวแปรเก็บว่าตอนนี้กด Tab ไหนอยู่
const filteredLeaves = computed(() => {
  if (activeTab.value === 'All') {
    return leaves.value
  }
  if (activeTab.value === 'Pending') {
    return leaves.value.filter((l: any) => l.status === 'Pending')
  }
  if (activeTab.value === 'Finished') {
    return leaves.value.filter((l: any) => ['Approved', 'Rejected'].includes(l.status))
  }
  return leaves.value
})
onMounted(() => {
  fetchLeaves()
})



</script>

<template>
  <Login v-if="!authStore.isAuthenticated" />
  <div class="min-h-screen bg-green-50/30 py-10 px-4 font-sans">
    <div class="max-w-7xl mx-auto">

      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-700">🍃 ระบบยื่นใบลาออนไลน์</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-600">สวัสดี, <b>{{ authStore.userFullName }}</b></span>
          <button v-if="authStore.userRole === 'admin'" @click="showCreateUserPage = !showCreateUserPage"
            class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition">
            {{ showCreateUserPage ? '🏠 กลับหน้าหลัก' : '👤 สร้าง User' }}
          </button>
          <button @click="authStore.logout()"
            class="text-sm text-red-500 hover:text-red-700 underline">ออกจากระบบ</button>
        </div>
      </div>

      <div v-if="showCreateUserPage">
        <CreateUser @on-back="showCreateUserPage = false" />
      </div>

      <div v-else>
        <!-- ส่วนของ Dashboard -->
        <LeaveStats :leaves="leaves" />
        <div class="flex justify-center gap-2 mb-8">
          <button @click="activeTab = 'All'" class="px-4 py-2 rounded-full text-sm font-bold transition"
            :class="activeTab === 'All' ? 'bg-green-800 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'">
            ทั้งหมด ({{ leaves.length }})
          </button>

          <button @click="activeTab = 'Pending'"
            class="px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2"
            :class="activeTab === 'Pending' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'">
            ⏳ รออนุมัติ
            <span v-if="leaves.filter((l: any) => l.status === 'Pending').length > 0"
              class="bg-white text-yellow-600 text-xs px-1.5 rounded-full">
              {{leaves.filter((l: any) => l.status === 'Pending').length}}
            </span>
          </button>

          <button @click="activeTab = 'Finished'" class="px-4 py-2 rounded-full text-sm font-bold transition"
            :class="activeTab === 'Finished' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'">
            📋 ประวัติย้อนหลัง
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div class="lg:col-span-1 lg:sticky lg:top-4">
            <LeaveForm @on-success="fetchLeaves" />
          </div>

          <div class="lg:col-span-2">
            <LeaveHistory :leaves="filteredLeaves" @on-delete="deleteLeave" @on-update="updateLeaveStatus"
              class="mt-0" />
          </div>

        </div>

      </div>
    </div>
  </div>
</template>