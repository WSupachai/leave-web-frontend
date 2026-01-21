import { defineStore } from 'pinia'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '', // ดึงจากเครื่องถ้ามี
    user: null as any // เก็บข้อมูล user (ชื่อ, role)
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token, // เช็คว่า Login หรือยัง?
    userRole: (state) => state.user?.role || 'employee',
    userFullName: (state) => state.user?.fullName || 'User'
  },

  actions: {
    async login(username: string, pass: string) {
      try {
        // 1. ยิง API ไปขอ Token
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          username,
          password: pass
        })

        // 2. ถ้าผ่าน: เก็บ Token ลงตัวแปรและ localStorage
        const token = res.data.access_token
        this.token = token
        localStorage.setItem('token', token)
        
        // 3. แกะ Token เอาข้อมูล User มาเก็บไว้
        this.user = jwtDecode(token)
        
        return true // login สำเร็จ
      } catch (error) {
        console.error('Login Failed', error)
        return false // login พลาด
      }
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token') // ลบออกจากเครื่อง
      
    },

    // เรียกใช้ตอนเปิดเว็บ เพื่อดึงข้อมูลจาก Token เดิมที่มีอยู่
    loadUserFromToken() {
      if (this.token) {
        try {
          this.user = jwtDecode(this.token)
        } catch (e) {
          this.logout() // ถ้า Token เสีย ให้ Logout ออกเลย
        }
      }
    }
  }
})