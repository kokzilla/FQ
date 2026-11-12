<template>
  <div
    class="bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200"
    :class="hasScore ? 'border-slate-200 shadow-sm' : 'border-slate-200/60 hover:border-slate-300'"
  >
    <!-- Question Header -->
    <div class="flex items-start space-x-3 mb-3">
      <span
        class="flex-shrink-0 w-7 h-7 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors"
        :class="hasScore ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'"
      >
        {{ itemNumber }}
      </span>
      <div class="flex-1">
        <p class="text-sm sm:text-base font-medium text-slate-800 leading-snug">
          {{ title }}
        </p>
        <span v-if="isUrgentRiskItem" class="inline-flex items-center text-[11px] font-semibold text-rose-600 mt-1 bg-rose-50 px-2 py-0.5 rounded-md">
          ⚠️ จุดตรวจความปลอดภัยเร่งด่วน (หากพบสิ่งกีดขวางให้แจ้งทันที)
        </span>
      </div>
    </div>

    <!-- Scoring Button Group (Thumb friendly touch target) -->
    <div class="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
      <button
        v-for="val in [1, 2, 3, 4, 5]"
        :key="val"
        type="button"
        @click="selectScore(val)"
        class="h-11 sm:h-12 rounded-xl text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border"
        :class="getButtonClass(val)"
      >
        <span>{{ val }}</span>
        <span class="text-[9px] font-normal opacity-80">{{ getScoreSublabel(val) }}</span>
      </button>
    </div>

    <!-- Inline Expansion for Defect & Photo Upload (Auto-shows when score is 1, 2, or 3) -->
    <div
      v-if="shouldShowDefectBox"
      class="mt-3 pt-3 border-t border-slate-100 space-y-2 animate-fadeIn"
    >
      <div class="flex items-center justify-between">
        <label class="text-xs font-medium text-slate-700">
          ระบุข้อบกพร่องที่พบ (ถ้ามี)
        </label>
        <label class="cursor-pointer text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1">
          <span>📷 แนบภาพถ่าย</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            class="hidden"
            @change="handlePhotoUpload"
          />
        </label>
      </div>

      <input
        type="text"
        :value="defectNote"
        @input="$emit('update:defectNote', ($event.target as HTMLInputElement).value)"
        placeholder="เช่น มีฝุ่นสะสมตามมุมโต๊ะ, กระจกมีคราบน้ำ"
        class="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
      />

      <!-- Photo Preview -->
      <div v-if="photoUrl" class="relative inline-block mt-1">
        <img :src="photoUrl" class="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm" />
        <button
          type="button"
          @click="$emit('update:photoUrl', '')"
          class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center shadow"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  itemNumber: number
  title: string
  score?: number | null
  isNA?: boolean
  defectNote?: string
  photoUrl?: string
}>()

const emit = defineEmits<{
  (e: 'update:score', value: number | null): void
  (e: 'update:isNA', value: boolean): void
  (e: 'update:defectNote', value: string): void
  (e: 'update:photoUrl', value: string): void
}>()

const hasScore = computed(() => (props.score !== null && props.score !== undefined) || props.isNA)
const isUrgentRiskItem = computed(() => props.itemNumber === 27) // ทางเดินและทางหนีไฟ

const shouldShowDefectBox = computed(() => {
  return (props.score && props.score <= 3) || props.defectNote || props.photoUrl
})

function selectScore(val: number) {
  emit('update:isNA', false)
  emit('update:score', val)
}

function selectNA() {
  emit('update:score', null)
  emit('update:isNA', true)
}

function getScoreSublabel(val: number) {
  switch (val) {
    case 5: return 'ดีเยี่ยม'
    case 4: return 'ดี'
    case 3: return 'พอใช้'
    case 2: return 'ปรับปรุง'
    case 1: return 'เร่งแก้ไข'
    default: return ''
  }
}

function getButtonClass(val: number) {
  if (props.score === val) {
    switch (val) {
      case 5: return 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
      case 4: return 'bg-green-600 text-white border-green-600 shadow-sm'
      case 3: return 'bg-amber-500 text-white border-amber-500 shadow-sm'
      case 2: return 'bg-orange-500 text-white border-orange-500 shadow-sm'
      case 1: return 'bg-rose-600 text-white border-rose-600 shadow-sm'
    }
  }
  return 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
}

function handlePhotoUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (loadEvent) => {
    const rawDataUrl = loadEvent.target?.result as string
    if (!rawDataUrl) return

    // บีบอัดและย่อขนาดรูปภาพด้วย Canvas เพื่อป้องกัน localStorage เต็มและลดขนาด Payload
    const img = new Image()
    img.onload = () => {
      const MAX_DIM = 1024
      let width = img.width
      let height = img.height
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width)
          width = MAX_DIM
        } else {
          width = Math.round((width * MAX_DIM) / height)
          height = MAX_DIM
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.75)
        emit('update:photoUrl', compressedUrl)
      } else {
        emit('update:photoUrl', rawDataUrl)
      }
    }
    img.onerror = () => {
      emit('update:photoUrl', rawDataUrl)
    }
    img.src = rawDataUrl
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
