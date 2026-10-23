<template>
  <div class="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 shadow-lg">
    <div class="max-w-4xl mx-auto flex items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <div class="flex flex-col">
          <span class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">ความคืบหน้า</span>
          <span class="text-sm font-semibold text-slate-800">
            {{ evaluatedCount }}/{{ totalCount }} ข้อ
            <span v-if="naCount > 0" class="text-xs text-slate-400 font-normal">({{ naCount }} N/A)</span>
          </span>
        </div>

        <div class="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

        <div class="flex flex-col">
          <span class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">ผลคะแนนรวม</span>
          <div class="flex items-center space-x-2">
            <span class="text-base font-bold text-slate-900">{{ percentage.toFixed(1) }}%</span>
            <span
              class="px-2 py-0.5 text-xs font-semibold rounded-full"
              :class="gradeBadgeClass"
            >
              {{ gradeLabel }}
            </span>
          </div>
        </div>
      </div>

      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  evaluatedCount: number
  totalCount: number
  naCount: number
  percentage: number
  gradeKey: string
  gradeLabel: string
}>()

const gradeBadgeClass = computed(() => {
  switch (props.gradeKey) {
    case 'EXCELLENT':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'GOOD':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'FAIR':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'IMPROVEMENT':
      return 'bg-orange-50 text-orange-700 border border-orange-200'
    default:
      return 'bg-rose-50 text-rose-700 border border-rose-200'
  }
})
</script>
