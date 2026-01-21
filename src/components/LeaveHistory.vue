<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// 1. รับข้อมูล Leaves เข้ามา
const props = defineProps<{
  leaves: any[]
}>()

// 3. ฟังก์ชันแปลงวันที่ให้เหมือนในรูป (2/ม.ค./69)
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  // แปลงเป็นปี พ.ศ. (ค.ศ. + 543) และเอาแค่ 2 หลักท้าย
  const year = (date.getFullYear() + 543).toString().slice(-2)
  const month = date.toLocaleDateString('th-TH', { month: 'short' }) // ม.ค.
  const day = date.getDate()
  return `${day}/${month}/${year}`
}

// 4. ฟังก์ชันแปลงเวลาบันทึก (11/ม.ค./69 21:35)
const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const d = formatDate(dateString)
  const time = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  return `${d} ${time}`
}

// Event สำหรับอนุมัติ และ
const emit = defineEmits(['on-delete', 'on-update'])

const handleStatus = (id: string, newStatus: string) => {
  // ส่ง id และสถานะใหม่กลับไปให้แม่ (App.vue) จัดการ
  emit('on-update', { id, status: newStatus })
}




//ฟังก์ชันคำนวณระยะเวลา
const calculateTimeDiff = (start: string, end: string) => {
  if (!start || !end) return ''

  // แปลงเวลา "HH:mm" เป็นตัวเลขนาที
  const [startH, startM] = start.split(':').map(Number)
  const [endH, endM] = end.split(':').map(Number)

  const startTotal = (startH * 60) + startM
  const endTotal = (endH * 60) + endM

  let diff = endTotal - startTotal

  // แปลงกลับเป็น ชม. และ นาที
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60

  let result = ''
  if (hours > 0) result += `${hours} ชม.`
  if (minutes > 0) result += ` ${minutes} นาที`

  return result ? `(${result.trim()})` : ''
}

const getVariantLabel = (variant: string) => {
  switch (variant) {
    case 'full': return 'ลาเต็มวัน'
    case 'first_half': return 'ลาครึ่งเช้า'
    case 'second_half': return 'ลาครึ่งบ่าย'
    case 'time_range': return 'ลาระบุเวลา'
    default: return ''
  }
}

import Swal from 'sweetalert2'
const handleDelete = (id: string) => {
  //console.log('🗑️ กำลังจะลบ ID:', id)
  Swal.fire({
    title: 'ยืนยันการลบ?',
    text: "หากลบแล้วจะไม่สามารถกู้คืนข้อมูลได้",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed) {
      // ถ้ากดยืนยัน ให้ส่ง event ไปบอก App.vue ให้ลบ
      emit('on-delete', id)
    }
  })
}

</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ">

    <div
      class="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition border-b border-gray-100">
      <h2 class="text-lg font-bold text-gray-800">ประวัติใบลา</h2>
      <div class="bg-green-900 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <div class="p-4 space-y-4 bg-gray-50 min-h-[200px]">

      <div v-for="leave in leaves" :key="leave._id"
        class="bg-gray-200/50 border border-gray-200 rounded-lg p-4 relative group hover:bg-gray-200 transition duration-200">

        <div class="flex items-start gap-4">

          <div class="mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-800" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div class="flex-1 space-y-1">
            <h3 class="font-bold text-gray-800 text-base">
              {{ leave.type === 'Vacation' ? 'ลาพักร้อน' : leave.type === 'Sick' ? 'ลาป่วย' : 'ลากิจ' }}
              <span>
                ({{ getVariantLabel(leave.timeVariant) }})
              </span>
            </h3>

            <div class="text-sm text-gray-600 space-y-0.5">
              <p>ชื่อพนักงาน : <span class="text-gray-800 font-semibold">{{ leave.userName }}</span></p>
            </div>

            <div class="text-sm text-gray-600 space-y-0.5">
              <p>ฝ่าย/แผนก : <span class="text-gray-800">{{ leave.user?.role || 'ทั่วไป' }}</span></p>
              <!--
              <p>วันที่ : <span class="text-gray-800">{{ formatDate(leave.startDate) }} - {{ formatDate(leave.endDate)
              }}</span></p>
              -->
              <p v-if="leave.timeVariant === 'full'">
                วันที่ :
                <span class="text-xs text-gray-800"> {{ formatDate(leave.startDate) }} - {{ formatDate(leave.endDate) }}
                  (เต็มวัน)</span>
              </p>

              <p v-else>
                วันที่ : {{ formatDate(leave.startDate) }}
                <span class="font-bold text-blue-600">
                  {{
                    leave.timeVariant === 'first_half' ? '[ครึ่งเช้า]' :
                      leave.timeVariant === 'second_half' ? '[ครึ่งบ่าย]' :
                        `[${leave.startTime} - ${leave.endTime}] ${calculateTimeDiff(leave.startTime, leave.endTime)} `
                  }}
                </span>
              </p>

              <p>การหักเงิน : <span class="text-gray-800">{{ leave.isDeduction ? 'หักเงิน' : 'ไม่หักเงิน' }}</span></p>
              <p>หมายเหตุ : <span class="text-gray-800">{{ leave.reason }}</span></p>



              <p class="flex items-center gap-2">
                สถานะ :
                <span class="px-2 py-0.5 rounded text-xs font-bold" :class="{
                  'bg-yellow-200 text-yellow-800': leave.status === 'Pending',
                  'bg-green-200 text-green-800': leave.status === 'Approved',
                  'bg-red-200 text-red-800': leave.status === 'Rejected'
                }">
                  {{ leave.status }}
                </span>
              </p>

              <p class="text-xs text-gray-500 mt-2 pt-1 border-t border-gray-300">
                วันที่บันทึก : {{ formatDateTime(leave.createdAt) }} {{ leave.user?.name }}
              </p>
            </div>

            <div v-if="['manager', 'admin'].includes(authStore.userRole) && leave.status === 'Pending'" class="mt-3 flex gap-2 pt-2 border-t border-gray-100">
              <button @click="handleStatus(leave._id, 'Approved')" v-if="leave.status === 'Pending'"
                class="flex-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold py-1.5 px-3 rounded border border-green-200 transition flex justify-center items-center gap-1">
                ✅ อนุมัติ
              </button>
              <button @click="handleStatus(leave._id, 'Rejected')" v-if="leave.status === 'Pending'"
                class="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-1.5 px-3 rounded border border-red-200 transition flex justify-center items-center gap-1">
                ❌ ไม่อนุมัติ
              </button>
            </div>
          </div>

          <!-- -->

          <div v-if="leave.status === 'Pending'"
            class="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition"
            @click="handleDelete(leave._id)">
            <div class="bg-red-100 p-2 rounded-md border border-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <span class="text-xs text-red-400 font-bold">ลบ</span>
          </div>

        </div>
      </div>
      <div v-if="leaves.length === 0" class="text-center text-gray-400 py-8">
        ไม่มีประวัติใบลา
      </div>

    </div>
  </div>
</template>