<template>
  <div class="min-h-screen bg-slate-50/70 pb-16">
    <Navbar />

    <main class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <!-- Welcome Hero Banner (Minimal & Clean) -->
      <div class="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 space-y-3">
          <span class="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/10">
            ระบบติดตามและประเมินผลอาคาร
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">
            ประเมินผลการปฏิบัติงานบุคลากรประจำอาคาร
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            มหาวิทยาลัยราชภัฏบุรีรัมย์ — ระบบบันทึกคะแนน 35 ข้อ แนบรูปถ่าย ตรวจติดตามผล และสรุปคะแนนร้อยละอัตโนมัติ
          </p>

          <div class="pt-2 flex flex-wrap gap-3">
            <NuxtLink
              to="/evaluate"
              class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow transition-all active:scale-95 flex items-center space-x-2"
            >
              <span>+ เริ่มตรวจประเมินอาคารใหม่</span>
            </NuxtLink>

            <a
              href="/api/reports/export-excel"
              target="_blank"
              class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center space-x-2"
            >
              <span>📥 ดาวน์โหลด Excel สรุปผล</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Summary -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span class="text-xs text-slate-500 font-medium">ตรวจแล้วทั้งหมด</span>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ assessments.length }} <span class="text-xs font-normal text-slate-400">ครั้ง</span></p>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span class="text-xs text-slate-500 font-medium">คะแนนเฉลี่ยรวม</span>
          <p class="text-2xl font-bold text-indigo-600 mt-1">{{ averageScore }}<span class="text-xs font-normal text-slate-400">%</span></p>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span class="text-xs text-slate-500 font-medium">ระดับดีเยี่ยม (90%+)</span>
          <p class="text-2xl font-bold text-emerald-600 mt-1">{{ excellentCount }} <span class="text-xs font-normal text-slate-400">อาคาร</span></p>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span class="text-xs text-rose-500 font-medium">ต้องเร่งแก้ไข (&lt;60%)</span>
          <p class="text-2xl font-bold text-rose-600 mt-1">{{ urgentCount }} <span class="text-xs font-normal text-slate-400">อาคาร</span></p>
        </div>
      </div>

      <!-- Recent Evaluations Section -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-800">รายการประเมินล่าสุด</h3>
          <span class="text-xs text-slate-400">{{ assessments.length }} รายการ</span>
        </div>

        <div v-if="assessments.length === 0" class="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-2">
          <p class="text-sm text-slate-500">ยังไม่มีบันทึกการประเมินอาคาร</p>
          <NuxtLink to="/evaluate" class="text-xs font-semibold text-indigo-600 hover:underline">
            กดที่นี่เพื่อเริ่มการตรวจครั้งแรก
          </NuxtLink>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="item in assessments"
            :key="item.id"
            class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h4 class="text-base font-semibold text-slate-900">{{ item.buildingName || item.building?.name }}</h4>
                <p class="text-xs text-slate-500 mt-0.5">
                  แม่บ้าน/ผู้รับผิดชอบ: <span class="text-slate-700 font-medium">{{ item.responsibleStaffText }}</span>
                </p>
                <p class="text-xs text-slate-400 mt-0.5">
                  ผู้ตรวจ: {{ item.assessorName || item.assessor?.fullName }} • วันที่: {{ formatDate(item.assessedAt) }}
                </p>
              </div>

              <!-- Grade & Percentage Badge -->
              <div class="text-right flex-shrink-0">
                <span class="text-lg font-bold text-slate-900">{{ Number(item.percentage).toFixed(1) }}%</span>
                <div>
                  <span
                    class="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mt-1"
                    :class="getGradeClass(item.grade || item.gradeKey)"
                  >
                    {{ item.gradeLabel || item.grade }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Urgent Issue warning if recorded -->
            <div v-if="item.urgentProblems" class="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-xs text-rose-800">
              <span class="font-semibold text-rose-700">จุดที่ต้องปรับปรุงเร่งด่วน:</span> {{ item.urgentProblems }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const assessments = ref<any[]>([])

onMounted(async () => {
  try {
    const res: any = await $fetch('/api/assessments')
    if (res?.data) {
      assessments.value = res.data
    }
  } catch (err) {
    console.error('Failed to load assessments', err)
  }
})

const averageScore = computed(() => {
  if (assessments.value.length === 0) return '0.0'
  const total = assessments.value.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0)
  return (total / assessments.value.length).toFixed(1)
})

const excellentCount = computed(() => {
  return assessments.value.filter(a => Number(a.percentage) >= 90).length
})

const urgentCount = computed(() => {
  return assessments.value.filter(a => Number(a.percentage) < 60).length
})

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
}

function getGradeClass(grade: string) {
  if (grade === 'EXCELLENT' || grade === 'ดีเยี่ยม') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (grade === 'GOOD' || grade === 'ดี') return 'bg-green-50 text-green-700 border border-green-200'
  if (grade === 'FAIR' || grade?.includes('พอใช้')) return 'bg-amber-50 text-amber-700 border border-amber-200'
  if (grade === 'IMPROVEMENT' || grade === 'ต้องปรับปรุง') return 'bg-orange-50 text-orange-700 border border-orange-200'
  return 'bg-rose-50 text-rose-700 border border-rose-200'
}
</script>
