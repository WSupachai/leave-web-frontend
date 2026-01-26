# Leave Management System (Frontend)

ระบบลางานออนไลน์สำหรับพนักงานและผู้ดูแลระบบ  
พัฒนาด้วย Vue.js เชื่อมต่อกับ Backend ผ่าน REST API

## Features
- Login / Logout
- ยื่นใบลางานออนไลน์
- ดูประวัติการลา
- ผู้ดูแลอนุมัติ / ปฏิเสธการลา
- แยกสิทธิ์ผู้ใช้งาน (Admin / User)

## Tech Stack
**Frontend**
- Vue.js
- Axios
- Tailwind CSS

**Backend**
- NestJS
- MongoDB
- Mongoose
- JWT Authentication

## Demo Account

สามารถใช้บัญชีทดสอบเพื่อทดลองใช้งานระบบได้

**User (Employee)**
- Username: User A
- Password: 123456
- 
 **User (Employee Role Manager)** 
- Username: User B
- Password: 123456

**Admin**
- Username: admin
- Password: admin1234

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
