<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  leaves: any[]
}>()

// --- คำนวณตัวเลข ---
const totalCount = computed(() => props.leaves.length)
const pendingCount = computed(() => props.leaves.filter(l => l.status === 'Pending').length)
const approvedCount = computed(() => props.leaves.filter(l => l.status === 'Approved').length)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
      <div>
        <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">ใบลาทั้งหมด</p>
        <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ totalCount }}</h3>
      </div>
      <div class="bg-blue-50 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-yellow-400 flex items-center justify-between relative overflow-hidden">
      <div>
        <p class="text-yellow-600 text-xs font-bold uppercase tracking-wider">รออนุมัติ</p>
        <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ pendingCount }}</h3>
      </div>
      <div class="bg-yellow-50 text-yellow-600 w-10 h-10 rounded-lg flex items-center justify-center z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <div class="absolute -right-4 -bottom-4 text-yellow-100 opacity-50">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
      <div>
        <p class="text-green-600 text-xs font-bold uppercase tracking-wider">อนุมัติแล้ว</p>
        <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ approvedCount }}</h3>
      </div>
      <div class="bg-green-50 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
    </div>

  </div>
</template>