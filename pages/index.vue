<template>
  <div class="min-h-screen bg-slate-50/70 pb-16">
    <Navbar />

    <main class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <!-- Welcome Hero Banner (Compact 2-line version) -->
      <div class="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 space-y-1 sm:space-y-1.5">
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight">
            Dashboard
          </h2>
          <!-- Subtitle with the active/latest evaluation round name -->
          <div class="flex items-center space-x-2 text-xs sm:text-sm text-indigo-200">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-semibold text-white">รอบการประเมินล่าสุด:</span>
            <span>{{ latestRound?.name || 'รอบการประเมินประจำปีงบประมาณ 2570' }}</span>
            <span v-if="latestRound?.startDate" class="text-slate-400 text-xs hidden sm:inline">
              ({{ latestRound.startDate }} ถึง {{ latestRound.endDate }})
            </span>
          </div>
        </div>
      </div>

      <!-- Assessor Statistics Section (สถิติการตรวจของคุณ - แสดงเด่นชัดเหมือนสถิติรวม) -->
      <section class="space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              👤
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  สถิติการตรวจของคุณ {{ userSession?.fullName || 'ผู้ตรวจประเมิน' }}
                </h3>
                <span class="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  สถิติส่วนบุคคล
                </span>
              </div>
              <p class="text-xs text-slate-500">ความคืบหน้าการตรวจประเมินอาคารและบุคลากรในความรับผิดชอบของคุณ</p>
            </div>
          </div>
          <NuxtLink
            to="/evaluate"
            class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>📝</span>
            <span>ไปที่หน้าตรวจประเมิน</span>
          </NuxtLink>
        </div>

        <!-- Metric Cards for Assessor (การ์ดเด่นชัดสไตล์เดียวกับสถิติรวม) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <!-- Card 1: อาคารที่ตรวจแล้ว -->
          <div class="bg-gradient-to-br from-indigo-50/90 via-white to-white p-4 sm:p-5 rounded-2xl border border-indigo-200/90 shadow-sm flex flex-col justify-between space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <span>🏢</span>
                <span>อาคารที่ตรวจแล้ว</span>
              </span>
              <span
                class="text-[11px] font-extrabold px-2 py-0.5 rounded-full border"
                :class="myAssignedBuildingsCount > 0 && myEvaluatedBuildingsCount >= myAssignedBuildingsCount
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-indigo-100 text-indigo-800 border-indigo-200'"
              >
                {{ myAssignedBuildingsCount > 0 ? Math.round((myEvaluatedBuildingsCount / myAssignedBuildingsCount) * 100) : 0 }}%
              </span>
            </div>
            <p class="text-2xl sm:text-3xl font-extrabold text-indigo-900 tracking-tight leading-none">
              {{ myEvaluatedBuildingsCount }} <span class="text-sm sm:text-base font-semibold text-slate-400">/ {{ myAssignedBuildingsCount }} อาคาร</span>
            </p>
            <p class="text-[11px] text-slate-500 leading-snug">
              {{ myAssignedBuildingsCount > 0 && myEvaluatedBuildingsCount >= myAssignedBuildingsCount
                ? '🎉 ตรวจครบทุกอาคารที่รับผิดชอบแล้ว'
                : `คงเหลือ ${Math.max(0, myAssignedBuildingsCount - myEvaluatedBuildingsCount)} อาคารที่ยังตรวจไม่ครบ` }}
            </p>
          </div>

          <!-- Card 2: บุคลากรที่ประเมินแล้ว -->
          <div class="bg-gradient-to-br from-purple-50/90 via-white to-white p-4 sm:p-5 rounded-2xl border border-purple-200/90 shadow-sm flex flex-col justify-between space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <span>🧹</span>
                <span>บุคลากรที่ประเมินแล้ว</span>
              </span>
              <span
                class="text-[11px] font-extrabold px-2 py-0.5 rounded-full border"
                :class="myAssignedStaffCount > 0 && myEvaluatedStaffCount >= myAssignedStaffCount
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-purple-100 text-purple-800 border-purple-200'"
              >
                {{ myAssignedStaffCount > 0 ? Math.round((myEvaluatedStaffCount / myAssignedStaffCount) * 100) : 0 }}%
              </span>
            </div>
            <p class="text-2xl sm:text-3xl font-extrabold text-purple-900 tracking-tight leading-none">
              {{ myEvaluatedStaffCount }} <span class="text-sm sm:text-base font-semibold text-slate-400">/ {{ myAssignedStaffCount }} คน</span>
            </p>
            <p class="text-[11px] text-slate-500 leading-snug">
              {{ myAssignedStaffCount > 0 && myEvaluatedStaffCount >= myAssignedStaffCount
                ? '🎉 ประเมินครบทุกคนในความรับผิดชอบแล้ว'
                : `คงเหลือ ${Math.max(0, myAssignedStaffCount - myEvaluatedStaffCount)} คนที่ยังไม่ได้ประเมิน` }}
            </p>
          </div>

          <!-- Card 3: รายการที่ส่งผลประเมินแล้ว -->
          <div class="bg-gradient-to-br from-emerald-50/90 via-white to-white p-4 sm:p-5 rounded-2xl border border-emerald-200/90 shadow-sm flex flex-col justify-between space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <span>📋</span>
                <span>รายการที่ส่งผลประเมินแล้ว</span>
              </span>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                รอบนี้
              </span>
            </div>
            <p class="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight leading-none">
              {{ myEvaluations.length }} <span class="text-sm sm:text-base font-semibold text-slate-400">รายการ</span>
            </p>
            <p class="text-[11px] text-slate-500 leading-snug">
              บันทึกและส่งผลการตรวจประเมินในรอบปัจจุบันเรียบร้อยแล้ว
            </p>
          </div>
        </div>
      </section>

      <!-- Overall Metrics Summary (สถิติการตรวจรวม - ภาพรวมทั้งมหาวิทยาลัย) -->
      <section class="space-y-3 pt-2">
        <div class="flex items-center space-x-2.5 pb-1">
          <div class="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
            🏛️
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h3 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                สถิติการตรวจรวม (ภาพรวมทั้งมหาวิทยาลัย)
              </h3>
              <span class="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                ข้อมูลภาพรวม
              </span>
            </div>
            <p class="text-xs text-slate-500">สรุปความคืบหน้าและผลประเมินของทุกอาคารและบุคลากรทั้งหมดในรอบนี้</p>
          </div>
        </div>

        <!-- 5 Grid Columns สำหรับสถิติรวม -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <!-- Grid 1: อาคารที่ตรวจแล้ว / อาคารทั้งหมด -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
            <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none text-center">
              {{ evaluatedBuildingsCount }}/{{ totalBuildingsCount }}
            </p>
            <span class="text-xs text-slate-500 font-medium mt-1.5 leading-snug text-center">อาคารที่ตรวจแล้ว</span>
          </div>

          <!-- Grid 2: บุคลากรที่ประเมินแล้ว / บุคลากรทั้งหมด -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
            <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none text-center">
              {{ evaluatedStaffCount }}/{{ totalStaffCount }}
            </p>
            <span class="text-xs text-slate-500 font-medium mt-1.5 leading-snug text-center">บุคลากรที่ประเมินแล้ว</span>
          </div>

          <!-- Grid 3: ระดับสีเขียว -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
            <p class="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight leading-none text-center">
              {{ greenBuildingCount }}
            </p>
            <span class="text-xs text-emerald-700 font-medium mt-1.5 leading-snug text-center">ระดับสีเขียว</span>
          </div>

          <!-- Grid 4: ระดับสีเหลือง แทรกระหว่างเขียวกับแดง -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
            <p class="text-2xl sm:text-3xl font-extrabold text-amber-500 tracking-tight leading-none text-center">
              {{ yellowBuildingCount }}
            </p>
            <span class="text-xs text-amber-700 font-medium mt-1.5 leading-snug text-center">ระดับสีเหลือง</span>
          </div>

          <!-- Grid 5: ระดับสีแดง -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
            <p class="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight leading-none text-center">
              {{ redBuildingCount }}
            </p>
            <span class="text-xs text-rose-700 font-medium mt-1.5 leading-snug text-center">ระดับสีแดง</span>
          </div>
        </div>
      </section>

      <!-- Top 3 Leaders Section (Separated: Buildings and Personnel) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 1. Top 3 Buildings -->
        <section class="bg-gradient-to-br from-indigo-500/10 via-slate-50 to-white border border-indigo-200/70 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div class="flex items-center justify-between pb-2 border-b border-indigo-100/80">
            <div class="flex items-center space-x-2">
              <span class="text-xl">🏢</span>
              <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900">อาคารคะแนนสูงสุด 3 ลำดับแรก</h3>
                <p class="text-[11px] text-slate-500">หากคะแนนเท่ากันจะแสดงร่วมกันคั่นด้วย comma</p>
              </div>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              Top อาคาร
            </span>
          </div>

          <div v-if="topThreeBuildings.length === 0" class="text-center py-6 text-xs text-slate-400 bg-white/60 rounded-2xl border border-dashed border-slate-200">
            ยังไม่มีข้อมูลผลการประเมินอาคารในรอบนี้
          </div>

          <div v-else class="space-y-2.5">
            <div
              v-for="item in topThreeBuildings"
              :key="item.rank"
              class="bg-white rounded-2xl p-3 sm:p-3.5 border shadow-xs transition-all flex flex-col justify-between space-y-2 hover:shadow-sm"
              :class="getRankCardClass(item.rank)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">{{ getRankMedal(item.rank) }}</span>
                  <span class="text-xs font-bold uppercase tracking-wider" :class="getRankTitleColor(item.rank)">
                    อันดับที่ {{ item.rank }}
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-sm sm:text-base font-black text-slate-900">{{ item.scoreText }}</span>
                  <span class="text-xs font-semibold text-slate-400 ml-1">({{ item.pctText }})</span>
                </div>
              </div>

              <div class="text-xs sm:text-[13px] text-slate-800 leading-snug font-medium pt-1.5 border-t border-slate-100 break-words">
                {{ item.namesText }}
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Top 3 Personnel -->
        <section class="bg-gradient-to-br from-amber-500/10 via-slate-50 to-white border border-amber-200/70 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div class="flex items-center justify-between pb-2 border-b border-amber-100/80">
            <div class="flex items-center space-x-2">
              <span class="text-xl">👤</span>
              <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900">บุคลากรคะแนนสูงสุด 3 ลำดับแรก</h3>
                <p class="text-[11px] text-slate-500">หากคะแนนเท่ากันจะแสดงร่วมกันคั่นด้วย comma</p>
              </div>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Top บุคลากร
            </span>
          </div>

          <div v-if="topThreePersonnel.length === 0" class="text-center py-6 text-xs text-slate-400 bg-white/60 rounded-2xl border border-dashed border-slate-200">
            ยังไม่มีข้อมูลผลการประเมินบุคลากรในรอบนี้
          </div>

          <div v-else class="space-y-2.5">
            <div
              v-for="item in topThreePersonnel"
              :key="item.rank"
              class="bg-white rounded-2xl p-3 sm:p-3.5 border shadow-xs transition-all flex flex-col justify-between space-y-2 hover:shadow-sm"
              :class="getRankCardClass(item.rank)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">{{ getRankMedal(item.rank) }}</span>
                  <span class="text-xs font-bold uppercase tracking-wider" :class="getRankTitleColor(item.rank)">
                    อันดับที่ {{ item.rank }}
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-sm sm:text-base font-black text-slate-900">{{ item.scoreText }}</span>
                  <span class="text-xs font-semibold text-slate-400 ml-1">({{ item.pctText }})</span>
                </div>
              </div>

              <div class="text-xs sm:text-[13px] text-slate-800 leading-snug font-medium pt-1.5 border-t border-slate-100 break-words">
                {{ item.namesText }}
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- My Evaluated List in Current Round -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-base sm:text-lg">📋</span>
            <h3 class="text-sm sm:text-base font-bold text-slate-900">รายการที่คุณประเมินแล้วในรอบนี้</h3>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {{ myEvaluations.length }} รายการ (รอบล่าสุด)
          </span>
        </div>

        <div v-if="myEvaluations.length === 0" class="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-2 shadow-xs">
          <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-xl">
            📝
          </div>
          <p class="text-sm font-medium text-slate-600">คุณยังไม่มีรายการประเมินในรอบนี้</p>
          <p class="text-xs text-slate-400">เลือกอาคารและบุคลากรที่คุณได้รับมอบหมายเพื่อเริ่มการประเมิน</p>
          <div class="pt-2">
            <NuxtLink to="/evaluate" class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all">
              <span>✍️</span> เริ่มการประเมินผล
            </NuxtLink>
          </div>
        </div>

        <!-- Evaluation Cards List with Edit & Delete -->
        <div v-else class="space-y-2.5">
          <div
            v-for="item in myEvaluations"
            :key="item.id"
            class="bg-white rounded-2xl p-3.5 sm:px-4 sm:py-3.5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div class="space-y-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  🏢 {{ item.buildingName || item.building?.name }}
                </h4>
                <span class="text-[11px] text-slate-400 font-normal">
                  📅 {{ formatDashboardDate(item.assessedAt || item.createdAt) }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-slate-500">
                <span>👤 ผู้ปฏิบัติงาน: <span class="text-slate-800 font-semibold">{{ formatStaffDisplayName(item.responsibleStaffText) || '-' }}</span></span>
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <!-- Score Badge -->
              <div class="text-left sm:text-right flex-shrink-0 flex items-center space-x-2">
                <span class="text-sm sm:text-base font-bold text-slate-900">{{ getItemScore(item) }} / 5.00</span>
                <span
                  class="inline-block px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded-md whitespace-nowrap"
                  :class="getGradeClass(getItemScore(item))"
                >
                  {{ getItemGradeLabel(getItemScore(item)) }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  type="button"
                  @click="editEvaluationItem(item)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  title="แก้ไขผลการประเมินนี้"
                >
                  <span>✏️</span>
                  <span>แก้ไข</span>
                </button>
                <button
                  type="button"
                  @click="deleteEvaluationItem(item)"
                  :disabled="isDeleting"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                  title="ลบผลการประเมินนี้"
                >
                  <span>🗑️</span>
                  <span>ลบ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

const userSession = useCookie<any>('bru_user_session')

const assessments = ref<any[]>([])
const rounds = ref<any[]>([])
const buildings = ref<any[]>([])
const summaryBuildingAverages = ref<any[]>([])
const summaryStaffAverages = ref<any[]>([])
const colorCriteria = reactive({
  building: {
    greenMin: 4.0,
    yellowMin: 2.0,
    greenLabel: 'ดีเยี่ยม / ผ่านเกณฑ์มาตรฐาน',
    yellowLabel: 'ปานกลาง / เฝ้าระวัง',
    redLabel: 'ต้องปรับปรุงเร่งด่วน'
  },
  staff: {
    greenMin: 4.0,
    yellowMin: 2.0,
    greenLabel: 'ดีเยี่ยม / ผลงานดีเด่น',
    yellowLabel: 'ปานกลาง / พอใช้',
    redLabel: 'ต้องปรับปรุงเร่งด่วน'
  }
})

const isDeleting = ref(false)

async function fetchDashboardData() {
  try {
    const [aRes, rRes, bRes, cRes]: any = await Promise.all([
      $fetch('/api/assessments'),
      $fetch('/api/rounds'),
      $fetch('/api/buildings'),
      $fetch('/api/settings/color-criteria')
    ])
    if (aRes?.data) assessments.value = aRes.data
    if (rRes?.data) rounds.value = rRes.data
    if (bRes?.data) buildings.value = bRes.data
    if (cRes?.data) {
      if (cRes.data.building) Object.assign(colorCriteria.building, cRes.data.building)
      if (cRes.data.staff) Object.assign(colorCriteria.staff, cRes.data.staff)
    }

    const activeRoundId = (rounds.value.find((r: any) => r.status === 'OPEN') || rounds.value[0])?.id || 'round-2570'
    const sRes: any = await $fetch(`/api/reports/summary?roundId=${activeRoundId}`)
    if (sRes?.ok) {
      summaryBuildingAverages.value = sRes.buildingAverages || []
      summaryStaffAverages.value = sRes.staffAverages || []
    }
  } catch (err) {
    console.error('Failed to load dashboard data', err)
  }
}

onMounted(async () => {
  await fetchDashboardData()
})

// Active / Latest Evaluation Round
const latestRound = computed(() => {
  if (rounds.value.length === 0) return null
  return rounds.value.find((r: any) => r.status === 'OPEN') || rounds.value[0]
})

// Only assessments from the latest round
const latestRoundAssessments = computed(() => {
  if (!latestRound.value) return assessments.value
  const targetRoundId = latestRound.value.id
  return assessments.value.filter(a => (a.roundId || 'round-2570') === targetRoundId)
})

function getItemScore(item: any): string {
  if (item.totalMaxScore && item.totalMaxScore > 0) {
    return ((item.totalScoreObtained / item.totalMaxScore) * 5).toFixed(2)
  }
  return ((Number(item.percentage) || 0) / 20).toFixed(2)
}

const averageScore = computed(() => {
  if (buildingAverageList.value.length > 0) {
    const total = buildingAverageList.value.reduce((acc, b) => acc + b.avgScore, 0)
    return (total / buildingAverageList.value.length).toFixed(2)
  }
  if (latestRoundAssessments.value.length === 0) return '0.00'
  const total = latestRoundAssessments.value.reduce((acc, curr) => {
    const s = curr.totalMaxScore > 0 ? (curr.totalScoreObtained / curr.totalMaxScore) * 5 : ((Number(curr.percentage) || 0) / 20)
    return acc + s
  }, 0)
  return (total / latestRoundAssessments.value.length).toFixed(2)
})

// Group by building to compute building-level metrics
const buildingScoresMap = computed(() => {
  const map: Record<string, { buildingId: string; buildingName: string; scores: number[] }> = {}
  for (const a of latestRoundAssessments.value) {
    const bId = a.buildingId || a.buildingName || 'unknown'
    if (!map[bId]) {
      map[bId] = {
        buildingId: a.buildingId,
        buildingName: a.buildingName || a.building?.name || bId,
        scores: []
      }
    }
    const scoreVal = Number(getItemScore(a))
    if (!isNaN(scoreVal)) {
      map[bId].scores.push(scoreVal)
    }
  }
  return map
})

const evaluatedBuildingsCount = computed(() => {
  return buildingAverageList.value.length
})

const totalBuildingsCount = computed(() => {
  return Math.max(buildings.value.length, evaluatedBuildingsCount.value)
})

const buildingAverageList = computed(() => {
  if (summaryBuildingAverages.value.length > 0) {
    return summaryBuildingAverages.value.map(b => ({
      buildingId: b.buildingId,
      buildingName: b.buildingName,
      avgScore: Number(b.score),
      scoreStr: b.scoreFormatted || Number(b.score).toFixed(2),
      pctStr: Number(b.percentage).toFixed(1)
    }))
  }
  return Object.values(buildingScoresMap.value).map(b => {
    const avg = b.scores.length > 0 ? b.scores.reduce((sum, s) => sum + s, 0) / b.scores.length : 0
    return {
      ...b,
      avgScore: Math.round(avg * 100) / 100,
      scoreStr: avg.toFixed(2),
      pctStr: (avg * 20).toFixed(1)
    }
  })
})

const greenBuildingCount = computed(() => {
  return buildingAverageList.value.filter(b => b.avgScore >= colorCriteria.building.greenMin).length
})

const yellowBuildingCount = computed(() => {
  return buildingAverageList.value.filter(b => b.avgScore >= colorCriteria.building.yellowMin && b.avgScore < colorCriteria.building.greenMin).length
})

const redBuildingCount = computed(() => {
  return buildingAverageList.value.filter(b => b.avgScore < colorCriteria.building.yellowMin).length
})

// 1. Top 3 Buildings Leaderboard
const topThreeBuildings = computed(() => {
  if (buildingAverageList.value.length === 0) return []

  const scoreGroups: Record<string, { scoreVal: number; scoreStr: string; pctStr: string; items: string[] }> = {}
  for (const b of buildingAverageList.value) {
    const key = b.avgScore.toFixed(2)
    if (!scoreGroups[key]) {
      scoreGroups[key] = {
        scoreVal: b.avgScore,
        scoreStr: b.scoreStr,
        pctStr: b.pctStr,
        items: []
      }
    }
    scoreGroups[key].items.push(b.buildingName)
  }

  const sorted = Object.values(scoreGroups).sort((a, b) => b.scoreVal - a.scoreVal)

  return sorted.slice(0, 3).map((g, idx) => ({
    rank: idx + 1,
    scoreText: `${g.scoreStr} / 5.00`,
    pctText: `${g.pctStr}%`,
    namesText: g.items.join(', ') // Tied buildings separated by comma
  }))
})

// 2. Top 3 Personnel Leaderboard
const staffPerformanceList = computed(() => {
  if (summaryStaffAverages.value.length > 0) {
    return summaryStaffAverages.value.map(s => ({
      buildingName: s.buildingName,
      staffName: s.staffName,
      avgScore: Number(s.score),
      scoreStr: s.scoreFormatted || Number(s.score).toFixed(2),
      pctStr: Number(s.percentage).toFixed(1)
    }))
  }
  const map: Record<string, { buildingName: string; staffName: string; scores: number[] }> = {}
  for (const a of latestRoundAssessments.value) {
    const sName = (a.responsibleStaffText || '').trim() || 'ไม่ระบุ'
    const bName = (a.buildingName || a.building?.name || 'อาคาร').trim()
    const key = `${bName}___${sName}`
    if (!map[key]) {
      map[key] = {
        buildingName: bName,
        staffName: sName,
        scores: []
      }
    }
    const scoreVal = Number(getItemScore(a))
    if (!isNaN(scoreVal)) {
      map[key].scores.push(scoreVal)
    }
  }

  return Object.values(map).map(item => {
    const avg = item.scores.length > 0 ? item.scores.reduce((a, b) => a + b, 0) / item.scores.length : 0
    return {
      buildingName: item.buildingName,
      staffName: item.staffName,
      avgScore: Math.round(avg * 100) / 100,
      scoreStr: avg.toFixed(2),
      pctStr: (avg * 20).toFixed(1)
    }
  })
})

const evaluatedStaffCount = computed(() => {
  return staffPerformanceList.value.length
})

const totalStaffCount = computed(() => {
  const staffSet = new Set<string>()
  for (const b of buildings.value) {
    if (b.staffs && Array.isArray(b.staffs)) {
      for (const s of b.staffs) {
        if (s.staffName && s.staffName.trim()) {
          staffSet.add(`${b.name || b.id}___${s.staffName.trim()}`)
        }
      }
    }
  }
  for (const item of staffPerformanceList.value) {
    staffSet.add(`${item.buildingName}___${item.staffName}`)
  }
  return Math.max(staffSet.size, evaluatedStaffCount.value)
})

function normalizePersonName(name?: string | null): string {
  if (!name) return ''
  let str = String(name).trim()
  const prefixRegex = /^(?:ว่าที่\s*ร้อยตรี|ว่าที่\s*ร\.ต\.|ผศ\.\s*ดร\.|รศ\.\s*ดร\.|ศ\.\s*ดร\.|อาจารย์\s*ดร\.|อาจารย์\s*|ผศ\.|รศ\.|ศ\.|ดร\.|อ\.|นาย|นางสาว|นาง|น\.ส\.)\s*/i
  let prev = ''
  while (prev !== str) {
    prev = str
    str = str.replace(prefixRegex, '').trim()
  }
  return str.toLowerCase()
}

// Current logged-in assessor statistics
const myEvaluations = computed(() => {
  if (!userSession.value) return []
  const sessionUser = userSession.value
  const sId = sessionUser.id
  const sLogin = sessionUser.userlogin
  const sName = sessionUser.fullName?.trim()

  return latestRoundAssessments.value.filter(a => {
    if (sId && a.assessorId === sId) return true
    if (sLogin && (a.assessor?.userlogin === sLogin || a.assessorId === sLogin)) return true
    const aName = (a.assessorName || a.assessor?.fullName || '').trim()
    if (sName && aName && (aName === sName || aName.includes(sName) || sName.includes(aName))) return true
    return false
  })
})

const myAssignedBuildings = computed(() => {
  const session = userSession.value
  if (!session) return []
  const sId = session.id
  const sLogin = (session.userlogin || '').trim().toLowerCase()
  const sName = normalizePersonName(session.fullName || '')

  const matched = buildings.value.filter((b: any) => {
    if (!Array.isArray(b.auditors) || b.auditors.length === 0) return false
    return b.auditors.some((aud: any) => {
      if (sId && aud.userId && aud.userId === sId) return true
      if (sLogin && aud.userlogin && String(aud.userlogin).trim().toLowerCase() === sLogin) return true
      const aName = normalizePersonName(aud.fullName || '')
      if (sName && aName && aName === sName) return true
      return false
    })
  })

  if (matched.length === 0 && session.role === 'ADMIN') {
    return buildings.value
  }
  return matched
})

const myAssignedBuildingsCount = computed(() => {
  return myAssignedBuildings.value.length
})

const myAssignedStaffCount = computed(() => {
  let count = 0
  for (const b of myAssignedBuildings.value) {
    if (Array.isArray(b.staffs)) {
      count += b.staffs.filter((s: any) => s.staffName && s.staffName.trim()).length
    }
  }
  return count
})

function hasAssessorEvaluatedStaffInBuilding(b: any, staff: any): boolean {
  const targetStaffName = normalizePersonName(staff.staffName)
  return myEvaluations.value.some((ev: any) => {
    const sameBuilding = ev.buildingId === b.id || (ev.buildingName || ev.building?.name) === b.name
    if (!sameBuilding) return false
    if (staff.id && ev.staffId && ev.staffId === staff.id) return true
    if (targetStaffName && normalizePersonName(ev.responsibleStaffText) === targetStaffName) return true
    return false
  })
}

const myEvaluatedBuildingsCount = computed(() => {
  if (myAssignedBuildings.value.length === 0) return 0
  let completedCount = 0
  for (const b of myAssignedBuildings.value) {
    const validStaffs = Array.isArray(b.staffs) ? b.staffs.filter((s: any) => s.staffName && s.staffName.trim()) : []
    if (validStaffs.length > 0) {
      // นับว่าอาคารตรวจแล้วเมื่อประเมินผู้ปฏิบัติงานในอาคารนั้นครบทุกคน
      const allEvaluated = validStaffs.every((s: any) => hasAssessorEvaluatedStaffInBuilding(b, s))
      if (allEvaluated) completedCount++
    } else {
      const hasAnyEval = myEvaluations.value.some((ev: any) => ev.buildingId === b.id || (ev.buildingName || ev.building?.name) === b.name)
      if (hasAnyEval) completedCount++
    }
  }
  return completedCount
})

const myEvaluatedStaffCount = computed(() => {
  let evaluatedCount = 0
  for (const b of myAssignedBuildings.value) {
    const validStaffs = Array.isArray(b.staffs) ? b.staffs.filter((s: any) => s.staffName && s.staffName.trim()) : []
    for (const s of validStaffs) {
      if (hasAssessorEvaluatedStaffInBuilding(b, s)) {
        evaluatedCount++
      }
    }
  }
  return evaluatedCount
})

const topThreePersonnel = computed(() => {
  if (staffPerformanceList.value.length === 0) return []

  const scoreGroups: Record<string, { scoreVal: number; scoreStr: string; pctStr: string; items: string[] }> = {}
  for (const item of staffPerformanceList.value) {
    const key = item.avgScore.toFixed(2)
    if (!scoreGroups[key]) {
      scoreGroups[key] = {
        scoreVal: item.avgScore,
        scoreStr: item.scoreStr,
        pctStr: item.pctStr,
        items: []
      }
    }
    scoreGroups[key].items.push(`${formatStaffDisplayName(item.staffName)} (${item.buildingName})`)
  }

  const sorted = Object.values(scoreGroups).sort((a, b) => b.scoreVal - a.scoreVal)

  return sorted.slice(0, 3).map((g, idx) => ({
    rank: idx + 1,
    scoreText: `${g.scoreStr} / 5.00`,
    pctText: `${g.pctStr}%`,
    namesText: g.items.join(', ') // Tied personnel separated by comma
  }))
})

function getRankMedal(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  return '🥉'
}

function getRankCardClass(rank: number) {
  if (rank === 1) return 'border-amber-300 bg-gradient-to-b from-amber-50/50 to-white'
  if (rank === 2) return 'border-slate-300 bg-gradient-to-b from-slate-50/60 to-white'
  return 'border-orange-300 bg-gradient-to-b from-orange-50/40 to-white'
}

function getRankTitleColor(rank: number) {
  if (rank === 1) return 'text-amber-700'
  if (rank === 2) return 'text-slate-600'
  return 'text-orange-700'
}

function formatAssessorShort(name: string) {
  if (!name) return '-'
  const clean = String(name).replace(/\(.*?\)/g, '').trim()
  if (!clean || clean === '-') return '-'

  const knownPrefixes = new Set([
    'ศาสตราจารย์', 'ศ.', 'ศ.ดร.',
    'รองศาสตราจารย์', 'รศ.', 'รศ.ดร.',
    'ผู้ช่วยศาสตราจารย์', 'ผศ.', 'ผศ.ดร.',
    'อาจารย์', 'อ.', 'อ.ดร.',
    'ดร.', 'นายแพทย์', 'นพ.', 'แพทย์หญิง', 'พญ.',
    'ว่าที่ร้อยตรี', 'ว่าที่ ร.ต.', 'ว่าที่ ร.ต. ดร.',
    'นาย', 'นางสาว', 'นาง', 'น.ส.', 'ด.ช.', 'ด.ญ.'
  ])

  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '-'
  if (parts.length === 1) return parts[0]

  const prefixes: string[] = []
  let idx = 0
  while (idx < parts.length) {
    const token = parts[idx]
    if (knownPrefixes.has(token) || knownPrefixes.has(token + '.')) {
      prefixes.push(token)
      idx++
    } else if (token === 'ว่าที่' && idx + 1 < parts.length && (parts[idx + 1] === 'ร.ต.' || parts[idx + 1] === 'ร้อยตรี')) {
      prefixes.push(`${parts[idx]} ${parts[idx + 1]}`)
      idx += 2
    } else {
      break
    }
  }

  if (idx < parts.length) {
    const firstName = parts[idx]
    if (prefixes.length > 0) {
      return `${prefixes.join(' ')} ${firstName}`
    }
    const embeddedMatch = parts[0].match(/^(นาย|นางสาว|นาง|น\.ส\.|ดร\.|ผศ\.|รศ\.|ศ\.|อ\.)(.+)$/)
    if (embeddedMatch) {
      return `${embeddedMatch[1]} ${embeddedMatch[2]}`
    }
    return firstName
  }

  return clean
}

function getItemGradeLabel(scoreStr: string) {
  const s = Number(scoreStr)
  if (s >= colorCriteria.building.greenMin) return colorCriteria.building.greenLabel || 'ผ่านเกณฑ์ดีเยี่ยม'
  if (s >= colorCriteria.building.yellowMin) return colorCriteria.building.yellowLabel || 'ปานกลาง / เฝ้าระวัง'
  return colorCriteria.building.redLabel || 'ต้องปรับปรุงเร่งด่วน'
}

function getGradeClass(scoreStrOrGrade: string) {
  const s = Number(scoreStrOrGrade)
  if (!isNaN(s)) {
    if (s >= colorCriteria.building.greenMin) return 'bg-emerald-50 text-emerald-800 border border-emerald-200'
    if (s >= colorCriteria.building.yellowMin) return 'bg-amber-50 text-amber-800 border border-amber-200'
    return 'bg-rose-50 text-rose-800 border border-rose-200'
  }
  if (scoreStrOrGrade === 'EXCELLENT' || scoreStrOrGrade === 'ดีเยี่ยม') return 'bg-emerald-50 text-emerald-800 border border-emerald-200'
  if (scoreStrOrGrade === 'GOOD' || scoreStrOrGrade === 'ดี') return 'bg-emerald-50 text-emerald-800 border border-emerald-200'
  if (scoreStrOrGrade === 'FAIR' || scoreStrOrGrade?.includes('พอใช้')) return 'bg-amber-50 text-amber-800 border border-amber-200'
  if (scoreStrOrGrade === 'IMPROVEMENT' || scoreStrOrGrade === 'ต้องปรับปรุง') return 'bg-rose-50 text-rose-800 border border-rose-200'
  return 'bg-rose-50 text-rose-800 border border-rose-200'
}

function formatDashboardDate(dateStr?: string | null): string {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return String(dateStr)
  }
}

function formatStaffDisplayName(fullName: string): string {
  if (!fullName) return ''
  let str = String(fullName).trim()
  const prefixRegex = /^(?:ว่าที่\s*ร้อยตรี|ว่าที่\s*ร\.ต\.|ผศ\.\s*ดร\.|รศ\.\s*ดร\.|ศ\.\s*ดร\.|อาจารย์\s*ดร\.|อาจารย์\s*|ผศ\.|รศ\.|ศ\.|ดร\.|อ\.|นาย|นางสาว|นาง|น\.ส\.)\s*/i
  let prev = ''
  while (prev !== str) {
    prev = str
    str = str.replace(prefixRegex, '').trim()
  }
  const parts = str.split(/\s+/).filter(Boolean)
  return parts.length > 0 ? parts[0] : (str || '')
}

function editEvaluationItem(item: any) {
  if (!item) return
  navigateTo({
    path: '/evaluate',
    query: {
      buildingId: item.buildingId,
      staffId: item.staffId || '',
      staffName: item.responsibleStaffText || '',
      roundId: item.roundId || latestRound.value?.id || ''
    }
  })
}

async function deleteEvaluationItem(item: any) {
  if (!item || !item.id) return
  const staffName = formatStaffDisplayName(item.responsibleStaffText) || 'ผู้ปฏิบัติงาน'
  const bldgName = item.buildingName || item.building?.name || 'อาคาร'
  if (!confirm(`คุณต้องการลบผลการประเมินของ "${staffName}" (${bldgName}) ใช่หรือไม่?`)) {
    return
  }

  isDeleting.value = true
  try {
    const res: any = await $fetch(`/api/assessments/${item.id}`, {
      method: 'DELETE'
    })
    if (res?.ok) {
      await fetchDashboardData()
      alert('ลบผลการประเมินเรียบร้อยแล้ว')
    }
  } catch (err: any) {
    alert(err?.data?.message || err?.message || 'เกิดข้อผิดพลาดในการลบผลการประเมิน')
  } finally {
    isDeleting.value = false
  }
}
</script>
