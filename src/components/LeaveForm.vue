<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import Swal from 'sweetalert2'

const authStore = useAuthStore()

//  เตรียม Event ส่งกลับไปบอกแม่ (Emits)
const emit = defineEmits(['on-success'])

// --- State ---
const form = ref({
  //user: '',
  userName: authStore.userFullName,
  type: 'Vacation',
  timeVariant: 'full',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  handoverPerson: '',
  reason: ''
})
const isSubmitting = ref(false)

// --- Config Style (เก็บ Class ยาวๆ ไว้ที่นี่ แก้ที่เดียวเปลี่ยนทุกช่อง) ---
const inputClass = "w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition text-gray-700 placeholder-gray-400"
const labelClass = "block text-sm font-bold text-gray-700 mb-1"

// --- Action ---
const submitLeave = async () => {
  // ตรวจสอบค่าว่าง  !form.value.startDate || !form.value.endDate ||
  if (!form.value.userName || !form.value.reason) {
    return alert('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ')
  }

  isSubmitting.value = true
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/leaves`, form.value, {
      headers: {
        Authorization: `Bearer ${authStore.token}` // 🔑 กุญแจสำคัญอยู่ตรงนี้!
      }
    })

    // Axios จะ throw error ถ้าไม่สำเร็จ ดังนั้นถ้าหลุดมาบรรทัดนี้แปลว่าสำเร็จแน่นอน
    Swal.fire({
      icon: 'success',
      title: 'บันทึกสำเร็จ!',
      text: `คุณได้ทำการลาจำนวน ${leaveDuration.value}`,
      timer: 2000,
      showConfirmButton: false
    })

      // Reset ค่า
      form.value.reason = ''
      form.value.startDate = ''
      form.value.endDate = ''
      form.value.handoverPerson = ''
      emit('on-success') // ส่งสัญญาณ
 
  } catch (err) {
    alert('❌ เชื่อมต่อ Server ไม่ได้')
  } finally {
    isSubmitting.value = false
  }
}

const leaveDuration = ref('')
//Logic คำนวณเวลา
const calculateDuration = () => {
  const { startDate, endDate, startTime, endTime, timeVariant } = form.value

  // 1. กรณีลาเต็มวัน (คำนวณเป็นวัน)
  if (timeVariant === 'full' && startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) return alert('วันที่ผิดพลาด') // แจ้งเตือนง่ายๆ หรือใช้ Swal

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    leaveDuration.value = `${diffDays} วัน`
  }

  // 2. กรณีลาครึ่งวัน (Fix ค่าเลย)
  else if (timeVariant === 'first_half' || timeVariant === 'second_half') {
    leaveDuration.value = '0.5 วัน (4 ชั่วโมง)'
  }

  // 3. กรณีลาเป็นช่วงเวลา (คำนวณเป็นชั่วโมง)
  else if (timeVariant === 'time_range' && startTime && endTime) {
    // แปลง "09:00" เป็นตัวเลขนาที
    const [startH, startM] = startTime.split(':').map(Number)
    const [endH, endM] = endTime.split(':').map(Number)

    const startMinutes = (startH * 60) + startM
    const endMinutes = (endH * 60) + endM

    if (endMinutes <= startMinutes) {
      leaveDuration.value = 'เวลาไม่ถูกต้อง'
      return
    }

    const diffMinutes = endMinutes - startMinutes
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    leaveDuration.value = `${hours} ชม. ${minutes > 0 ? minutes + ' นาที' : ''}`
  } else {
    leaveDuration.value = ''
  }
}

</script>

<template>
  <div class="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">

    <div class="flex justify-between items-center mb-6 pb-2 border-b border-gray-300">
      <h2 class="text-xl font-bold text-gray-800">บันทึกใบลา</h2>
      <div
        class="bg-green-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-green-900">
        -
      </div>
    </div>

    <div class="space-y-5">

      <div class="hidden">
        <label :class="labelClass">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
        <input type="text" v-model="form.userName" :class="inputClass" readonly>
      </div>

      <div class="space-y-3">
        <label class="block text-sm font-bold text-gray-700">ระบุช่วงเวลา</label>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <label class="cursor-pointer">
            <input type="radio" v-model="form.timeVariant" value="full" class="peer sr-only">
            <div
              class="p-2 text-center text-sm border rounded-lg peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600 hover:bg-gray-50 transition">
              🌕 เต็มวัน
            </div>
          </label>
          <label class="cursor-pointer">
            <input type="radio" v-model="form.timeVariant" value="first_half" class="peer sr-only">
            <div
              class="p-2 text-center text-sm border rounded-lg peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600 hover:bg-gray-50 transition">
              ⛅ ครึ่งเช้า
            </div>
          </label>
          <label class="cursor-pointer">
            <input type="radio" v-model="form.timeVariant" value="second_half" class="peer sr-only">
            <div
              class="p-2 text-center text-sm border rounded-lg peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600 hover:bg-gray-50 transition">
              🌤️ ครึ่งบ่าย
            </div>
          </label>
          <label class="cursor-pointer">
            <input type="radio" v-model="form.timeVariant" value="time_range" class="peer sr-only">
            <div
              class="p-2 text-center text-sm border rounded-lg peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600 hover:bg-gray-50 transition">
              🕒 ระบุเวลา
            </div>
          </label>
        </div>
      </div>

      <div>
        <label :class="labelClass">ประเภทการลา</label>
        <select v-model="form.type" :class="inputClass">
          <option value="Vacation">🏖️ ลาพักร้อน</option>
          <option value="Sick">🤒 ลาป่วย</option>
          <option value="Business">💼 ลากิจ</option>
        </select>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">

        <div v-if="form.timeVariant === 'full'" class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold text-gray-500">จากวันที่</label>
            <input type="date" v-model="form.startDate" @input="form.endDate = form.startDate" :class="inputClass">
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500">ถึงวันที่</label>
            <input type="date" v-model="form.endDate" :class="inputClass">
          </div>
        </div>

        <div v-else>
          <label class="text-xs font-bold text-gray-500">วันที่ลา</label>
          <input type="date" v-model="form.startDate" @input="form.endDate = form.startDate" :class="inputClass">
        </div>

        <div v-if="form.timeVariant === 'time_range'" class="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
          <div>
            <label class="text-xs font-bold text-gray-500">ตั้งแต่เวลา</label>
            <input type="time" v-model="form.startTime" :class="inputClass">
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500">ถึงเวลา</label>
            <input type="time" v-model="form.endTime" :class="inputClass">
          </div>
        </div>

        <div v-if="leaveDuration"
          class="flex items-center gap-2 text-sm font-bold text-green-700 bg-green-100 p-2 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          รวมระยะเวลา: {{ leaveDuration }}
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4 text-sm shadow-sm">
        <div class="flex justify-between border-b border-gray-100 pb-2 mb-2">
          <span class="text-gray-600 font-medium">สิทธิ์การลาพักร้อน</span>
          <div class="text-right">
            <span class="block text-gray-400 text-xs">0:0:0 | 6:0:0</span>
            <span class="block text-gray-400 text-xs">(สะสม | ปัจจุบัน)</span>
          </div>
        </div>
        <div class="flex justify-between items-center text-gray-500 pt-1">
          <span class="font-medium">คงเหลือ</span>
          <span class="font-mono text-green-700 font-bold text-lg">6 วัน</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!--
          <div>
            <label :class="labelClass">ตั้งแต่วันที่ <span class="text-red-500">*</span></label>
            <input type="date" v-model="form.startDate" :class="inputClass">
          </div>
          <div>
            <label :class="labelClass">ถึงวันที่ <span class="text-red-500">*</span></label>
            <input type="date" v-model="form.endDate" :class="inputClass">
          </div>
       
        -->
      </div>

      <div>
        <label :class="labelClass">ชื่อผู้รับมอบหมายงาน</label>
        <input type="text" v-model="form.handoverPerson" placeholder="ระบุชื่อเพื่อนร่วมงาน..." :class="inputClass">
      </div>

      <div>
        <label :class="labelClass">ระบุเหตุผลในการลา <span class="text-red-500">*</span></label>
        <textarea v-model="form.reason" rows="2" :class="inputClass" placeholder="..."></textarea>
      </div>

      <div class="flex items-center gap-6 mt-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="salary" class="w-4 h-4 text-green-600 focus:ring-green-500 accent-green-700"
            checked>
          <span class="text-sm text-gray-700 font-medium">ไม่หักเงิน</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="salary" class="w-4 h-4 text-green-600 focus:ring-green-500 accent-green-700">
          <span class="text-sm text-gray-700 font-medium">หักเงิน</span>
        </label>
      </div>

      <div class="flex justify-center gap-3 pt-4">
        <button @click="submitLeave" :disabled="isSubmitting"
          class="bg-green-900 hover:bg-green-800 text-white font-bold py-2 px-8 rounded-full shadow-lg transform active:scale-95 transition-all">
          {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึก' }}
        </button>
      </div>

    </div>
  </div>
</template>