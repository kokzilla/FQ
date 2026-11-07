<template>
  <ClientOnly>
    <div
      v-if="$pwa?.needRefresh"
      class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 flex items-center justify-between space-x-3"
    >
      <div class="flex items-center space-x-3 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div class="min-w-0">
          <h4 class="text-xs font-semibold text-white truncate">มีเวอร์ชันใหม่พร้อมใช้งาน</h4>
          <p class="text-[11px] text-slate-300 truncate">กดเพื่ออัปเดตและรีโหลดระบบ</p>
        </div>
      </div>
      <div class="flex items-center space-x-1.5 shrink-0">
        <button
          @click="$pwa?.updateServiceWorker()"
          class="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          อัปเดต
        </button>
        <button
          @click="$pwa?.cancelPrompt()"
          class="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          title="ปิดการแจ้งเตือน"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp()
</script>
