<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div
      v-if="showPrompt"
      class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-indigo-100 ring-1 ring-black/5"
    >
      <div class="flex items-start space-x-3">
        <!-- App Icon -->
        <img
          src="/pwa-192x192.png"
          alt="BRU FQ Icon"
          class="w-12 h-12 rounded-xl shadow-md border border-slate-100 shrink-0"
        />

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 leading-tight">ติดตั้งแอป BRU FQ</h3>
            <button
              @click="dismissPrompt"
              class="text-slate-400 hover:text-slate-600 p-1 -mr-1 rounded-lg transition-colors"
              title="ปิด"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="text-xs text-slate-500 mt-1 line-clamp-2">
            ติดตั้งลงหน้าจอโฮมเพื่อเปิดใช้งานได้รวดเร็วและเต็มหน้าจอเสมือนแอปพลิเคชัน
          </p>

          <!-- iOS specific tip -->
          <div v-if="isIos" class="mt-2.5 p-2 bg-indigo-50/70 rounded-lg text-[11px] text-indigo-900 flex items-center space-x-1.5">
            <svg class="w-4 h-4 shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>แตะปุ่ม <strong>แชร์ (Share)</strong> แล้วเลือก <strong>"เพิ่มไปยังหน้าจอโฮม"</strong></span>
          </div>

          <!-- Action Buttons for Chrome/Android/Desktop -->
          <div v-else class="mt-3 flex items-center space-x-2">
            <button
              @click="installApp"
              :disabled="isInstalling"
              class="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{{ isInstalling ? 'กำลังดำเนินการ...' : 'ติดตั้งแอปทันที' }}</span>
            </button>
            <button
              @click="dismissPrompt"
              class="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ไว้ภายหลัง
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showPrompt = ref(false)
const isInstalling = ref(false)
const isIos = ref(false)
let deferredPrompt: any = null

const DISMISS_KEY = 'bru_fq_pwa_dismissed_until'

const isStandalone = () => {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

const checkIos = () => {
  if (typeof window === 'undefined') return false
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent)
}

onMounted(() => {
  // If already installed in standalone mode, do not show
  if (isStandalone()) {
    return
  }

  // Check if dismissed recently (24 hours)
  const dismissedUntil = localStorage.getItem(DISMISS_KEY)
  if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
    return
  }

  // Detect iOS Safari
  if (checkIos()) {
    isIos.value = true
    // Show iOS prompt after a short delay (2 seconds)
    setTimeout(() => {
      showPrompt.value = true
    }, 2000)
    return
  }

  // Standard PWA install event for Android/Chrome/Edge
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt = e
    showPrompt.value = true
  })

  // When installed successfully
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    showPrompt.value = false
    console.log('[PWA] Application successfully installed')
  })
})

const installApp = async () => {
  if (!deferredPrompt) return
  isInstalling.value = true
  try {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      showPrompt.value = false
    }
  } catch (err) {
    console.error('[PWA] Installation failed:', err)
  } finally {
    isInstalling.value = false
    deferredPrompt = null
  }
}

const dismissPrompt = () => {
  showPrompt.value = false
  // Dismiss for 24 hours
  localStorage.setItem(DISMISS_KEY, (Date.now() + 24 * 60 * 60 * 1000).toString())
}
</script>
