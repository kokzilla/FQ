<template>
  <div class="min-h-screen bg-slate-50/70 pb-20">
    <Navbar />

    <main class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <!-- Report Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-1">
            <span>📊 รายงานผลการประเมินสำหรับคณะกรรมการ</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">รายงานและผลวิเคราะห์การประเมิน</h2>
          <p class="text-xs text-slate-500">ผลคะแนนเฉลี่ยของคณะกรรมการ, การเปรียบเทียบข้ามรอบ, และจุดบกพร่องเร่งด่วน</p>
        </div>

        <!-- Round Selector -->
        <div class="flex items-center space-x-2">
          <label class="text-xs font-medium text-slate-600 flex-shrink-0">รอบประเมิน:</label>
          <select
            v-model="selectedRoundId"
            @change="loadReportData"
            class="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          >
            <option v-for="r in availableRounds" :key="r.id" :value="r.id">
              {{ r.name }} {{ r.status === 'OPEN' ? '(เปิดอยู่)' : '(ปิดแล้ว)' }}
            </option>
          </select>

          <a
            href="/api/reports/export-excel"
            target="_blank"
            class="px-3 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors shadow-sm flex items-center space-x-1 flex-shrink-0"
          >
            <span>📥 Excel</span>
          </a>
        </div>
      </div>

      <!-- Report Tabs (3 Core Reports) -->
      <div class="flex items-center space-x-1 border-b border-slate-200/80 pb-2">
        <button
          type="button"
          @click="activeReportTab = 1"
          class="px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
          :class="activeReportTab === 1 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          1. สรุปคะแนนเฉลี่ยรายอาคาร
        </button>

        <button
          type="button"
          @click="activeReportTab = 2"
          class="px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
          :class="activeReportTab === 2 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          2. เปรียบเทียบแนวโน้มข้ามรอบ 📈
        </button>

        <button
          type="button"
          @click="activeReportTab = 3"
          class="px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
          :class="activeReportTab === 3 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          3. วิเคราะห์จุดบกพร่องตามหมวด ⚠️
        </button>
      </div>

      <!-- REPORT 1: Building Average Score Summary (Item-level consensus) -->
      <section v-if="activeReportTab === 1" class="space-y-4">
        <div class="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900 flex items-start space-x-2">
          <span class="text-base">💡</span>
          <div>
            <span class="font-semibold">เกณฑ์การคำนวณคะแนนเฉลี่ย:</span>
            รวมคะแนนของคณะกรรมการทุกท่านในแต่ละข้อย่อย (1-35) มาหาค่าเฉลี่ยรายข้อ จากนั้นนำมารวมเป็นคะแนนและร้อยละของอาคาร เพื่อให้คะแนนสะท้อนมติของคณะกรรมการอย่างละเอียด
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="(b, idx) in buildingAverages"
            :key="b.buildingId"
            class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    #{{ idx + 1 }}
                  </span>
                  <h4 class="text-base font-semibold text-slate-900">{{ b.buildingName }}</h4>
                </div>
                <p class="text-xs text-slate-500">
                  แม่บ้าน/ผู้รับผิดชอบ: <span class="text-slate-700 font-medium">{{ b.responsibleStaff }}</span>
                </p>
                <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                  <span class="font-medium text-slate-600">👥 กรรมการที่ตรวจ ({{ b.committeeCount }} ท่าน):</span>
                  <span v-for="aud in b.auditors" :key="aud" class="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] text-slate-700">
                    {{ aud }}
                  </span>
                </div>
              </div>

              <!-- Grade & Percentage Badge -->
              <div class="text-right flex-shrink-0">
                <span class="text-xl font-bold text-slate-900">{{ b.percentage.toFixed(1) }}%</span>
                <div>
                  <span
                    class="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mt-1"
                    :class="getGradeBadgeClass(b.grade)"
                  >
                    {{ b.gradeLabel }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Urgent Issues if any -->
            <div v-if="b.urgentNotes" class="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-xs text-rose-800">
              <span class="font-semibold text-rose-700">จุดที่ต้องปรับปรุงเร่งด่วน:</span> {{ b.urgentNotes }}
            </div>
          </div>
        </div>
      </section>

      <!-- REPORT 2: Cross-Round Trend & Change Comparison -->
      <section v-else-if="activeReportTab === 2" class="space-y-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-sm font-bold text-slate-900">การเปรียบเทียบพัฒนาการข้ามรอบประเมิน</h3>
              <p class="text-xs text-slate-500">เปรียบเทียบผลคะแนนเฉลี่ยระหว่างรอบปัจจุบัน (2570) กับรอบก่อนหน้า (2568)</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th class="py-3 px-3">ชื่ออาคาร</th>
                  <th class="py-3 px-3 text-center">รอบก่อนหน้า (2568)</th>
                  <th class="py-3 px-3 text-center">รอบปัจจุบัน (2570)</th>
                  <th class="py-3 px-3 text-center">ส่วนต่าง (+/-)</th>
                  <th class="py-3 px-3 text-center">ทิศทางพัฒนาการ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="t in trendComparison" :key="t.buildingId" class="hover:bg-slate-50/50">
                  <td class="py-3 px-3 font-medium text-slate-900">{{ t.buildingName }}</td>
                  <td class="py-3 px-3 text-center text-slate-600">
                    {{ t.previousRoundPercentage !== null ? t.previousRoundPercentage.toFixed(1) + '%' : '-' }}
                  </td>
                  <td class="py-3 px-3 text-center font-bold text-slate-900">
                    {{ t.currentRoundPercentage.toFixed(1) }}%
                  </td>
                  <td class="py-3 px-3 text-center font-bold">
                    <span v-if="t.diff !== null" :class="t.diff >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                      {{ t.diff >= 0 ? '+' : '' }}{{ t.diff.toFixed(1) }}%
                    </span>
                    <span v-else class="text-slate-400">-</span>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <span
                      v-if="t.trend === 'UP'"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      📈 ดีขึ้น
                    </span>
                    <span
                      v-else-if="t.trend === 'DOWN'"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      📉 ลดลง
                    </span>
                    <span
                      v-else-if="t.trend === 'EQUAL'"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"
                    >
                      ➖ คงที่
                    </span>
                    <span v-else class="text-xs text-slate-400 font-normal">อาคารใหม่</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- REPORT 3: Category Defect & Risk Hotspots -->
      <section v-else-if="activeReportTab === 3" class="space-y-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-sm font-bold text-slate-900">วิเคราะห์จุดอ่อนและความเสี่ยงเร่งด่วนตามหมวด</h3>
              <p class="text-xs text-slate-500">จัดอันดับหมวดที่มีคะแนนต่ำสุดและตรวจพบข้อบกพร่องบ่อยที่สุดในมหาวิทยาลัย</p>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="(cat, idx) in categoryStats"
              :key="cat.categoryId"
              class="p-4 rounded-xl border transition-all"
              :class="cat.isRiskHotspot ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/80 bg-slate-50/30'"
            >
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <span
                      class="w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center"
                      :class="cat.isRiskHotspot ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'"
                    >
                      {{ idx + 1 }}
                    </span>
                    <h4 class="text-sm font-semibold text-slate-900">{{ cat.categoryName }}</h4>
                    <span
                      v-if="cat.isRiskHotspot"
                      class="text-[10px] font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md"
                    >
                      ⚠️ จุดเสี่ยงที่ต้องปรับปรุงเชิงนโยบาย
                    </span>
                  </div>
                  <p class="text-xs text-slate-500">
                    คะแนนเฉลี่ยหมวด: <span class="font-bold text-slate-800">{{ cat.avgScoreOutOf5.toFixed(2) }} / 5.0</span>
                    • พบข้อบกพร่องสะสม: <span class="font-semibold text-rose-600">{{ cat.defectCount }} ครั้ง</span>
                  </p>
                </div>

                <div class="text-right">
                  <span
                    class="text-base font-bold"
                    :class="cat.percentage >= 80 ? 'text-emerald-600' : (cat.percentage >= 70 ? 'text-amber-600' : 'text-rose-600')"
                  >
                    {{ cat.percentage.toFixed(1) }}%
                  </span>
                </div>
              </div>

              <!-- Progress bar -->
              <div class="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :class="cat.percentage >= 80 ? 'bg-emerald-500' : (cat.percentage >= 70 ? 'bg-amber-500' : 'bg-rose-500')"
                  :style="{ width: `${cat.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const activeReportTab = ref(1)
const selectedRoundId = ref('round-2570')
const availableRounds = ref<any[]>([])
const buildingAverages = ref<any[]>([])
const trendComparison = ref<any[]>([])
const categoryStats = ref<any[]>([])

async function loadReportData() {
  try {
    const res: any = await $fetch(`/api/reports/summary?roundId=${selectedRoundId.value}`)
    if (res?.ok) {
      availableRounds.value = res.availableRounds || []
      buildingAverages.value = res.buildingAverages || []
      trendComparison.value = res.trendComparison || []
      categoryStats.value = res.categoryStats || []
    }
  } catch (err) {
    console.error('Failed to load report data', err)
  }
}

onMounted(() => {
  loadReportData()
})

function getGradeBadgeClass(grade: string) {
  if (grade === 'EXCELLENT') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (grade === 'GOOD') return 'bg-green-50 text-green-700 border border-green-200'
  if (grade === 'FAIR') return 'bg-amber-50 text-amber-700 border border-amber-200'
  if (grade === 'IMPROVEMENT') return 'bg-orange-50 text-orange-700 border border-orange-200'
  return 'bg-rose-50 text-rose-700 border border-rose-200'
}
</script>
