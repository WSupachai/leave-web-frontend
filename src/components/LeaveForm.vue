<script setup lang="ts">
import { ref } from 'vue'

// 1. รับข้อมูลรายชื่อพนักงาน (Props)
//defineProps<{
//  users: { _id: string, name: string }[]
//}>()

// 2. เตรียม Event ส่งกลับไปบอกแม่ (Emits)
const emit = defineEmits(['on-success'])

// --- State ---
const form = ref({
  //user: '',
  userName: '',
  type: 'Vacation',
  startDate: '',
  endDate: '',
  handoverPerson: '',
  reason: ''
})
const isSubmitting = ref(false)

// --- Config Style (เก็บ Class ยาวๆ ไว้ที่นี่ แก้ที่เดียวเปลี่ยนทุกช่อง) ---
const inputClass = "w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition text-gray-700 placeholder-gray-400"
const labelClass = "block text-sm font-bold text-gray-700 mb-1"

// --- Action ---
const submitLeave = async () => {
  // ตรวจสอบค่าว่าง
  if (!form.value.userName || !form.value.startDate || !form.value.endDate || !form.value.reason) {
    return alert('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ')
  }

  isSubmitting.value = true
  try {
    const res = await fetch('http://localhost:3000/leaves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    if (res.ok) {
      alert('✅ บันทึกข้อมูลเรียบร้อย')
      // Reset ค่า
      form.value.reason = ''
      form.value.startDate = ''
      form.value.endDate = ''
      form.value.handoverPerson = ''
      emit('on-success') // ส่งสัญญาณ
    }
  } catch (err) {
    alert('❌ เชื่อมต่อ Server ไม่ได้')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
    
    <div class="flex justify-between items-center mb-6 pb-2 border-b border-gray-300">
      <h2 class="text-xl font-bold text-gray-800">บันทึกใบลา</h2>
      <div class="bg-green-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-green-900">
        -
      </div>
    </div>

    <div class="space-y-5">
      
   <div>
        <label :class="labelClass">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
        <input 
          type="text" 
          v-model="form.userName" 
          :class="inputClass" 
        >
      </div>

      <div>
        <label :class="labelClass">ประเภทการลา</label>
        <select v-model="form.type" :class="inputClass">
          <option value="Vacation">🏖️ ลาพักร้อน</option>
          <option value="Sick">🤒 ลาป่วย</option>
          <option value="Business">💼 ลากิจ</option>
        </select>
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
        <div>
          <label :class="labelClass">ตั้งแต่วันที่ <span class="text-red-500">*</span></label>
          <input type="date" v-model="form.startDate" :class="inputClass">
        </div>
        <div>
          <label :class="labelClass">ถึงวันที่ <span class="text-red-500">*</span></label>
          <input type="date" v-model="form.endDate" :class="inputClass">
        </div>
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
          <input type="radio" name="salary" class="w-4 h-4 text-green-600 focus:ring-green-500 accent-green-700" checked>
          <span class="text-sm text-gray-700 font-medium">ไม่หักเงิน</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="salary" class="w-4 h-4 text-green-600 focus:ring-green-500 accent-green-700">
          <span class="text-sm text-gray-700 font-medium">หักเงิน</span>
        </label>
      </div>

      <div class="flex justify-center gap-3 pt-4">
        <button 
          @click="submitLeave"
          :disabled="isSubmitting"
          class="bg-green-900 hover:bg-green-800 text-white font-bold py-2 px-8 rounded-full shadow-lg transform active:scale-95 transition-all"
        >
          {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึก' }}
        </button>
      </div>

    </div>
  </div>
</template>