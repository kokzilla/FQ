<template>
  <div class="min-h-screen bg-slate-50/70 pb-16">
    <Navbar />

    <main class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <!-- Welcome Hero Banner (Updated with Latest Round & without action buttons) -->
      <div class="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 space-y-2.5">
          <span class="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/10">
            ระบบติดตามและประเมินผลอาคาร
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">
            ประเมินผลการปฏิบัติงานบุคลากรประจำอาคาร
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

      <!-- Quick Metrics Summary (5 Grid Columns) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <!-- Grid 1: อาคารที่ตรวจแล้ว / อาคารทั้งหมด -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span class="text-xs text-slate-500 font-medium">อาคารที่ตรวจแล้ว</span>
          <p class="text-2xl font-bold text-slate-900 mt-1">
            {{ evaluatedBuildingsCount }}/{{ totalBuildingsCount }}
            <span class="text-xs font-normal text-slate-400">อาคาร</span>
          </p>
        </div>

        <!-- Grid 2: คะแนนเฉลี่ยรวม -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span class="text-xs text-slate-500 font-medium">คะแนนเฉลี่ยรวม</span>
          <p class="text-2xl font-bold text-indigo-600 mt-1">
            {{ averageScore }} <span class="text-xs font-normal text-slate-400">/ 5.00</span>
          </p>
        </div>

        <!-- Grid 3: ระดับสีเขียว -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span class="text-xs text-emerald-600 font-medium">ระดับสีเขียว (≥ {{ colorCriteria.building.greenMin }})</span>
          <p class="text-2xl font-bold text-emerald-600 mt-1">
            {{ greenBuildingCount }} <span class="text-xs font-normal text-slate-400">อาคาร</span>
          </p>
        </div>

        <!-- Grid 4: ระดับสีเหลือง แทรกระหว่างเขียวกับแดง -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span class="text-xs text-amber-500 font-medium">ระดับสีเหลือง ({{ colorCriteria.building.yellowMin }} - &lt; {{ colorCriteria.building.greenMin }})</span>
          <p class="text-2xl font-bold text-amber-500 mt-1">
            {{ yellowBuildingCount }} <span class="text-xs font-normal text-slate-400">อาคาร</span>
          </p>
        </div>

        <!-- Grid 5: ระดับสีแดง -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm col-span-2 sm:col-span-1">
          <span class="text-xs text-rose-500 font-medium">ระดับสีแดง (&lt; {{ colorCriteria.building.yellowMin }})</span>
          <p class="text-2xl font-bold text-rose-600 mt-1">
            {{ redBuildingCount }} <span class="text-xs font-normal text-slate-400">อาคาร</span>
          </p>
        </div>
      </div>

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

      <!-- Recent Evaluations Section (Compact & Minimal) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-800">รายการประเมินล่าสุด</h3>
          <span class="text-xs text-slate-400">{{ latestRoundAssessments.length }} รายการ (รอบล่าสุด)</span>
        </div>

        <div v-if="latestRoundAssessments.length === 0" class="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-2">
          <p class="text-sm text-slate-500">ยังไม่มีบันทึกการประเมินในรอบนี้</p>
          <NuxtLink to="/evaluate" class="text-xs font-semibold text-indigo-600 hover:underline">
            กดที่นี่เพื่อเริ่มการตรวจครั้งแรก
          </NuxtLink>
        </div>

        <!-- Compact evaluation card list -->
        <div v-else class="space-y-2">
          <div
            v-for="item in latestRoundAssessments"
            :key="item.id"
            class="bg-white rounded-xl p-3 sm:px-4 sm:py-3 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between gap-3"
          >
            <div class="space-y-0.5 min-w-0">
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate">
                🏢 {{ item.buildingName || item.building?.name }}
              </h4>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-slate-500">
                <span>👤 ผู้ปฏิบัติงาน: <span class="text-slate-800 font-medium">{{ item.responsibleStaffText || '-' }}</span></span>
                <span class="text-slate-300">•</span>
                <span>📋 ผู้ประเมิน: <span class="text-slate-800 font-medium">{{ formatAssessorShort(item.assessorName || item.assessor?.fullName) }}</span></span>
              </div>
            </div>

            <!-- Grade & Score Badge (Compact 0-5 scale) -->
            <div class="text-right flex-shrink-0 flex items-center space-x-2">
              <span class="text-sm sm:text-base font-bold text-slate-900">{{ getItemScore(item) }} / 5.00</span>
              <span
                class="inline-block px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded-md whitespace-nowrap"
                :class="getGradeClass(getItemScore(item))"
              >
                {{ getItemGradeLabel(getItemScore(item)) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

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

onMounted(async () => {
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
    scoreGroups[key].items.push(`${item.staffName} (${item.buildingName})`)
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
  const clean = name.replace(/\(.*?\)/g, '').trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '-'

  const titlePrefixes = ['ดร.', 'ผศ.', 'รศ.', 'ศ.', 'อ.', 'นาย', 'นาง', 'นางสาว', 'น.ส.', 'ผศ.ดร.', 'รศ.ดร.']
  if (parts.length >= 2 && titlePrefixes.includes(parts[0])) {
    return `${parts[0]} ${parts[1]}`
  }
  return parts[0]
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
</script>
