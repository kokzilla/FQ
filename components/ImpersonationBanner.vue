<template>
  <aside
    v-if="isImpersonating"
    aria-label="โหมดสวมบทบาทผู้ประเมิน"
    class="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 border-b border-amber-600/30 px-3 sm:px-4 py-2 sticky top-0 z-50 shadow-md"
  >
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
      <!-- Left: Status Info -->
      <div class="flex items-center space-x-2 min-w-0">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs shrink-0 shadow-xs">
          🎭
        </span>
        <div class="truncate">
          <span class="font-bold text-slate-950 uppercase tracking-wide mr-1.5">โหมดสวมบทบาทผู้ประเมิน:</span>
          <span>กำลังดูหน้าจอในฐานะ</span>
          <strong class="mx-1 text-slate-950 underline decoration-slate-900 underline-offset-2">{{ userSession?.fullName || 'ผู้ประเมิน' }}</strong>
          <span class="text-slate-800 text-[11px] hidden md:inline">
            ({{ userSession?.positionName || formatRole(userSession?.role) }})
          </span>
          <span class="text-slate-700 text-[11px] ml-1.5 hidden lg:inline">
            [ผู้ดูแลระบบ: {{ adminName }}]
          </span>
        </div>
      </div>

      <!-- Right: Action Buttons -->
      <div class="flex items-center space-x-1.5 shrink-0">
        <!-- Shortcut to Evaluate Page -->
        <NuxtLink
          to="/evaluate"
          class="px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1"
          :class="$route.path.startsWith('/evaluate')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-white/90 hover:bg-white text-slate-900 shadow-xs hover:shadow'"
        >
          <span>📝</span>
          <span>หน้าจอประเมิน</span>
        </NuxtLink>

        <!-- Shortcut to Reports Page -->
        <NuxtLink
          to="/reports"
          class="px-2.5 py-1 rounded-lg font-medium transition-all hidden sm:flex items-center space-x-1"
          :class="$route.path.startsWith('/reports')
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-white/80 hover:bg-white text-slate-900 shadow-xs'"
        >
          <span>📊</span>
          <span>รายงาน</span>
        </NuxtLink>

        <!-- Exit Impersonation Button -->
        <button
          type="button"
          @click="exitImpersonation"
          :disabled="isExiting"
          class="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 active:scale-95 text-white font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
        >
          <span v-if="!isExiting">↩️</span>
          <span v-else class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>สลับกลับสู่ Admin</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const userSession = useCookie<any>('bru_user_session')
const adminSession = useCookie<any>('bru_admin_session')
const isExiting = ref(false)

const isImpersonating = computed(() => {
  return Boolean(userSession.value?.impersonator || adminSession.value)
})

const adminName = computed(() => {
  return userSession.value?.impersonator?.fullName || adminSession.value?.fullName || 'ผู้ดูแลระบบ'
})

function formatRole(role?: string) {
  if (role === 'AUDITOR') return 'กรรมการตรวจประเมิน'
  if (role === 'ADMIN') return 'ผู้ดูแลระบบ'
  if (role === 'SUPERVISOR') return 'หัวหน้างาน'
  if (role === 'HOUSEKEEPER') return 'ผู้รับผิดชอบอาคาร'
  return role || 'ผู้ประเมิน'
}

async function exitImpersonation() {
  if (isExiting.value) return
  isExiting.value = true
  try {
    const res: any = await $fetch('/api/auth/stop-impersonation', {
      method: 'POST'
    })
    if (res?.ok) {
      userSession.value = res.user
      adminSession.value = null
      navigateTo('/admin')
    }
  } catch (err: any) {
    console.error('Failed to stop impersonation:', err)
    // Fallback: หากเซิร์ฟเวอร์ตอบสนองไม่ทันแต่มี adminSession ใน cookie
    if (adminSession.value) {
      userSession.value = adminSession.value
      adminSession.value = null
      navigateTo('/admin')
    }
  } finally {
    isExiting.value = false
  }
}
</script>
