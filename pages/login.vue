<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
      <div class="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold items-center justify-center text-lg shadow-md">
        BRU
      </div>
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight">เข้าสู่ระบบประเมินคุณภาพอาคารและการปฏิบัติงานบุคลากร</h2>
      <p class="text-xs text-slate-500">
        เข้าสู่ระบบด้วยบัญชี BRU SSO หรือบัญชีผู้ดูแลระบบ (Admin)
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 shadow-sm rounded-3xl border border-slate-200/80 sm:px-8 space-y-5">
        
        <!-- แจ้งเตือนสถานะฐานข้อมูล PostgreSQL Offline -->
        <div v-if="dbStatus && !dbStatus.ok" class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
          <div class="flex items-start gap-2.5">
            <svg class="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div class="space-y-1">
              <p class="font-bold text-rose-900">ไม่สามารถเชื่อมต่อฐานข้อมูลได้ (PostgreSQL Offline)</p>
              <p class="text-slate-600 leading-relaxed">
                ระบบไม่สามารถติดต่อฐานข้อมูลบนเซิร์ฟเวอร์หลักได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่อเครือข่าย หรือติดต่อผู้ดูแลระบบ
              </p>
              <p v-if="dbStatus.error" class="font-mono text-[11px] text-rose-600 break-all bg-rose-100/70 p-1.5 rounded-lg">
                {{ dbStatus.error }}
              </p>
            </div>
          </div>
          <div class="pt-1 flex justify-end">
            <button
              type="button"
              @click="checkDatabase"
              :disabled="isCheckingDb"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-[11px] transition-all disabled:opacity-50"
            >
              <span v-if="isCheckingDb">กำลังตรวจสอบ...</span>
              <span v-else>↻ ลองเชื่อมต่อใหม่</span>
            </button>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">ชื่อผู้ใช้งาน (Username)</label>
            <input
              v-model="username"
              type="text"
              required
              placeholder="ระบุชื่อผู้ใช้งาน"
              class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">รหัสผ่าน (Password)</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="ระบุรหัสผ่าน"
              class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div v-if="errorMsg" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="isLoading || (dbStatus && !dbStatus.ok)"
            class="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">กำลังตรวจสอบ...</span>
            <span v-else-if="dbStatus && !dbStatus.ok">ฐานข้อมูลไม่พร้อมใช้งาน</span>
            <span v-else>เข้าสู่ระบบ</span>
          </button>
        </form>

        <!-- สถานะการเชื่อมต่อฐานข้อมูลแบบย่อเมื่อพร้อมใช้งาน -->
        <div v-if="dbStatus?.ok" class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div class="flex items-center gap-1.5">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ฐานข้อมูล PostgreSQL: เชื่อมต่อสมบูรณ์</span>
          </div>
          <button
            type="button"
            @click="checkDatabase"
            :disabled="isCheckingDb"
            class="text-indigo-600 hover:underline"
            title="ตรวจสอบการเชื่อมต่อใหม่"
          >
            {{ isCheckingDb ? 'กำลังตรวจ...' : 'ตรวจสอบ' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const isCheckingDb = ref(false)
const errorMsg = ref('')
const dbStatus = ref<{ ok: boolean; message?: string; error?: string } | null>(null)

async function checkDatabase() {
  isCheckingDb.value = true
  try {
    const res: any = await $fetch('/api/system/db-status')
    dbStatus.value = res
  } catch (err: any) {
    dbStatus.value = {
      ok: false,
      message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้',
      error: err?.message || 'Network error'
    }
  } finally {
    isCheckingDb.value = false
  }
}

onMounted(() => {
  checkDatabase()
})

async function handleLogin() {
  if (dbStatus.value && !dbStatus.value.ok) {
    errorMsg.value = 'ไม่สามารถเข้าสู่ระบบได้เนื่องจากเซิร์ฟเวอร์ฐานข้อมูลไม่พร้อมใช้งาน'
    return
  }

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
    // หาก Error เกิดจากฐานข้อมูล ให้รีเฟรชสถานะฐานข้อมูลด้วย
    if (err?.statusCode === 503) {
      checkDatabase()
    }
  } finally {
    isLoading.value = false
  }
}
</script>
