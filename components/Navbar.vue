<template>
  <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center space-x-3 group">
        <div class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
          BRU
        </div>
        <div>
          <h1 class="font-semibold text-slate-900 text-sm md:text-base leading-tight">ระบบประเมินอาคาร</h1>
          <p class="text-xs text-slate-500">มรภ.บุรีรัมย์</p>
        </div>
      </NuxtLink>

      <div class="flex items-center space-x-1 sm:space-x-2">
        <NuxtLink
          to="/"
          class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          :class="$route.path === '/' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
        >
          แดชบอร์ด
        </NuxtLink>

        <!-- Separate Committee Reports Menu -->
        <NuxtLink
          to="/reports"
          class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          :class="$route.path.startsWith('/reports') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'"
        >
          📊 รายงาน
        </NuxtLink>

        <NuxtLink
          v-if="userSession?.role === 'ADMIN'"
          to="/admin"
          class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          :class="$route.path.startsWith('/admin') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'"
        >
          ⚙️ ผู้ดูแลระบบ
        </NuxtLink>

        <NuxtLink
          to="/evaluate"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm flex items-center space-x-1"
        >
          <span>+ เริ่มประเมิน</span>
        </NuxtLink>

        <!-- Logout button -->
        <button
          v-if="userSession?.userlogin"
          type="button"
          @click="logout"
          title="ออกจากระบบ"
          class="text-xs text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors ml-1"
        >
          🚪
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const userSession = useCookie<any>('bru_user_session')

function logout() {
  userSession.value = null
  navigateTo('/login')
}
</script>
