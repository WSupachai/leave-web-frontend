<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const emit = defineEmits(['on-back']) // เอาไว้กดปุ่ม "ย้อนกลับ"

// ข้อมูลสำหรับ Dropdown
const departments = ['IT', 'HR', 'Sales', 'Accounting', 'Management']
const roles = [
    { label: 'พนักงาน (Employee)', value: 'employee' },
    { label: 'หัวหน้า (Manager)', value: 'manager' },
    { label: 'ผู้ดูแลระบบ (Admin)', value: 'admin' }
]

const form = ref({
    username: '',
    password: '',
    fullName: '',
    role: 'employee', // default
    department: 'IT'  // default
})

const submitUser = async () => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/users`, form.value, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })

        Swal.fire('สำเร็จ', 'สร้างผู้ใช้งานเรียบร้อยแล้ว', 'success')
        
        // Reset Form
        form.value = { username: '', password: '', fullName: '', role: 'employee', department: 'IT' }

    } catch (err) {
        Swal.fire('ผิดพลาด', 'ไม่สามารถสร้าง User ได้ (ชื่ออาจซ้ำหรือไม่มีสิทธิ์)', 'error')
    }
}
</script>

<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-700">👤 สร้างผู้ใช้งานใหม่</h2>
            <button @click="$emit('on-back')" class="text-gray-500 hover:text-gray-700 text-sm">
                ← กลับไปหน้าหลัก
            </button>
        </div>

        <form @submit.prevent="submitUser" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input v-model="form.username" type="text" class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input v-model="form.password" type="password" class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" required>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                <input v-model="form.fullName" type="text" class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" required>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง (Role)</label>
                    <select v-model="form.role" class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500">
                        <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">แผนก (Department)</label>
                    <select v-model="form.department" class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500">
                        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
                    </select>
                </div>
            </div>

            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-4">
                บันทึกผู้ใช้งาน
            </button>
        </form>
    </div>
</template>