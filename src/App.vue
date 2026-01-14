<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LeaveForm from './components/LeaveForm.vue' 
import LeaveHistory from './components/LeaveHistory.vue'

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

const fetchLeaves = async () => {
  isLoading.value = true
  const res = await fetch('http://localhost:3000/leaves')
  leaves.value = await res.json()
  isLoading.value = false
}

onMounted(() => {
  fetchUsers()
  fetchLeaves()
})

// ฟังก์ชันลบข้อมูล
const deleteLeave = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/leaves/${id}`, { method: 'DELETE' })
    if (res.ok) {
      alert('ลบข้อมูลสำเร็จ')
      fetchLeaves() // โหลดใหม่
    }
  } catch (err) {
    alert('ลบไม่สำเร็จ')
  }
}

</script>

<template>
  <div class="min-h-screen bg-green-50/30 py-10 px-4 font-sans">
    <div class="max-w-7xl mx-auto"> 
      
      <div class="text-center mb-8">
         <h1 class="text-2xl font-bold text-gray-700">🍃 ระบบยื่นใบลาออนไลน์</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div class="lg:col-span-1 lg:sticky lg:top-4"> 
          <LeaveForm 
            @on-success="fetchLeaves" 
          />
        </div>

        <div class="lg:col-span-2">
          <LeaveHistory 
            :leaves="leaves" 
            @on-delete="deleteLeave"
            class="mt-0" 
          />
        </div>
        
      </div>

    </div>
  </div>
</template>