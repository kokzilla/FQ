<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
      <div class="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold items-center justify-center text-lg shadow-md">
        BRU
      </div>
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight">เข้าสู่ระบบประเมินอาคาร</h2>
      <p class="text-xs text-slate-500">
        เข้าสู่ระบบด้วยบัญชี BRU SSO หรือบัญชีผู้ดูแลระบบ (Admin)
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 shadow-sm rounded-3xl border border-slate-200/80 sm:px-8 space-y-5">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">ชื่อผู้ใช้งาน (Username)</label>
            <input
              v-model="username"
              type="text"
              required
              placeholder="admin หรือ username บุคลากร"
              class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">รหัสผ่าน (Password)</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="รหัสผ่าน SSO หรือ admin"
              class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div v-if="errorMsg" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition-all active:scale-95 disabled:opacity-50"
          >
            <span v-if="isLoading">กำลังตรวจสอบ...</span>
            <span v-else>เข้าสู่ระบบ</span>
          </button>
        </form>

        <div class="pt-2 border-t border-slate-100 text-center">
          <p class="text-[11px] text-slate-400">
            💡 สำหรับการทดสอบในเครื่อง: เข้าสู่ระบบ Admin ด้วย username: <code class="text-indigo-600 font-mono font-semibold">admin</code> / รหัสผ่าน: <code class="text-indigo-600 font-mono font-semibold">admin</code>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const username = ref('admin')
const password = ref('admin')
const isLoading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
      }
    })

    if (res?.ok) {
      const redirectUrl = route.query.redirect as string
      if (redirectUrl) {
        navigateTo(redirectUrl)
      } else if (res.user?.role === 'ADMIN') {
        navigateTo('/admin')
      } else {
        navigateTo('/')
      }
    }
  } catch (err: any) {
    errorMsg.value = err?.data?.message || err?.message || 'เข้าสู่ระบบไม่สำเร็จ'
  } finally {
    isLoading.value = false
  }
}
</script>
