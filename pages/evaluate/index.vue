<template>
  <div class="min-h-screen bg-slate-50/70 pb-28">
    <Navbar />

    <main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <!-- Title & Auto-Save Status Banner -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">แบบประเมินผลการปฏิบัติงาน</h2>
          <p class="text-xs sm:text-sm text-slate-500">บุคลากรประจำอาคาร (แม่บ้าน) มหาวิทยาลัยราชภัฏบุรีรัมย์</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            บันทึกแบบร่างอัตโนมัติ
          </span>
          <button
            type="button"
            @click="resetForm"
            class="text-[11px] text-slate-400 hover:text-rose-600 transition-colors px-2 py-1"
          >
            ล้างข้อมูล
          </button>
        </div>
      </div>

      <!-- Header Card: Building & Assessor Selection -->
      <section class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">ข้อมูลการตรวจประเมิน</h3>
          <div class="inline-flex items-center gap-2 text-xs bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/70">
            <span class="text-slate-400">ผู้ตรวจประเมิน:</span>
            <span class="font-semibold text-slate-900">👤 {{ currentAssessorDisplayName }}</span>
            <span v-if="userSession?.positionName || userSession?.role" class="text-[10px] bg-indigo-50 text-indigo-700 font-medium px-1.5 py-0.5 rounded">
              {{ userSession?.positionName || userSession?.role }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Evaluation Round Selection -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">รอบการประเมิน <span class="text-rose-500">*</span></label>
            <select
              v-model="selectedRoundId"
              class="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option v-for="r in availableRounds" :key="r.id" :value="r.id">
                {{ r.name }} {{ r.status === 'OPEN' ? '(🟢 เปิดประเมิน)' : '(⚪ ปิดแล้ว)' }}
              </option>
            </select>
          </div>

          <!-- Date -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">วันที่ตรวจประเมิน</label>
            <input
              v-model="form.assessmentDate"
              type="date"
              class="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <!-- Building Selection (Searchable Combobox) -->
          <div class="sm:col-span-2 relative" ref="buildingDropdownRef">
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              ชื่ออาคาร (ค้นหา/เลือก) <span class="text-rose-500">*</span>
            </label>
            
            <div class="relative">
              <input
                type="text"
                v-model="buildingSearchQuery"
                @focus="isBuildingDropdownOpen = true"
                @input="isBuildingDropdownOpen = true"
                placeholder="-- พิมพ์ค้นหาหรือคลิกเพื่อเลือกชื่ออาคาร --"
                class="w-full text-sm pl-3.5 pr-12 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
              />
              
              <!-- Chevron / Clear Button -->
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
                <button
                  v-if="selectedBuildingId"
                  type="button"
                  @click="clearBuildingSelection"
                  class="text-slate-400 hover:text-slate-600 text-xs p-1 rounded-full hover:bg-slate-100 transition-colors"
                  title="ล้างการเลือกอาคาร"
                >
                  ✕
                </button>
                <button
                  type="button"
                  @click="isBuildingDropdownOpen = !isBuildingDropdownOpen"
                  class="text-slate-400 hover:text-slate-600 p-1 focus:outline-none transition-transform duration-200"
                  :class="isBuildingDropdownOpen ? 'rotate-180' : ''"
                  tabindex="-1"
                >
                  <span class="text-[10px]">▼</span>
                </button>
              </div>

              <!-- Dropdown Menu -->
              <div
                v-if="isBuildingDropdownOpen"
                class="absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl py-1 text-sm divide-y divide-slate-100"
              >
                <div
                  v-for="b in filteredBuildings"
                  :key="b.id"
                  @click="selectBuilding(b)"
                  class="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer flex items-center justify-between transition-colors"
                  :class="selectedBuildingId === b.id ? 'bg-indigo-50/80 text-indigo-700 font-semibold' : 'text-slate-700'"
                >
                  <span>{{ b.name }}</span>
                  <span v-if="selectedBuildingId === b.id" class="text-indigo-600 text-xs font-medium">✓ เลือกอยู่</span>
                </div>

                <div v-if="filteredBuildings.length === 0" class="px-4 py-3 text-center text-xs text-slate-400">
                  ไม่พบอาคารที่ตรงกับ "{{ buildingSearchQuery }}"
                </div>
              </div>
            </div>
          </div>

          <!-- Responsible Staff (Button List) -->
          <div class="sm:col-span-2 space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-medium text-slate-700">
                ผู้ปฏิบัติงาน / แม่บ้านที่จะประเมิน (รายบุคคล) <span class="text-rose-500">*</span>
              </label>
              <span v-if="form.responsibleStaffText" class="text-[11px] text-slate-500">
                กำลังเลือก: <strong class="text-indigo-600 font-semibold">{{ form.responsibleStaffText }}</strong>
                <span v-if="currentAssessmentId" class="ml-1 text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  (มีผลประเมินเดิม)
                </span>
              </span>
            </div>

            <div v-if="!selectedBuildingId" class="text-xs text-slate-400 italic py-2">
              กรุณาเลือกอาคารด้านบน เพื่อแสดงรายชื่อผู้ดูแล
            </div>

            <div v-else class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <!-- Staff Buttons -->
                <button
                  v-for="s in currentBuildingStaffs"
                  :key="s.id"
                  type="button"
                  @click="selectStaff(s)"
                  class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all"
                  :class="selectedStaffId === s.id && !isCustomStaff
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20 font-semibold'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'"
                >
                  <span>{{ formatStaffDisplayName(s.staffName) }}</span>
                  <span
                    v-if="isStaffEvaluated(s.id, s.staffName)"
                    class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                    :class="selectedStaffId === s.id && !isCustomStaff ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-700'"
                    title="ประเมินแล้ว"
                  >
                    ✓
                  </span>
                </button>

                <!-- Custom Staff Button -->
                <button
                  type="button"
                  @click="selectCustomStaff"
                  class="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all"
                  :class="isCustomStaff
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-dashed border-slate-300 hover:border-slate-400'"
                >
                  <span>➕ ระบุชื่ออื่น</span>
                </button>
              </div>

              <!-- Custom Staff Textbox -->
              <div v-if="isCustomStaff" class="pt-1 flex items-center gap-2">
                <input
                  v-model="form.responsibleStaffText"
                  type="text"
                  placeholder="พิมพ์ชื่อ-สกุล ผู้ปฏิบัติงานรายบุคคล..."
                  class="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Filter Tabs (Horizontal touch slider for mobile) -->
      <div id="evaluation-questions-top" class="scroll-mt-4 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 flex items-center space-x-2">
        <button
          v-for="cat in tabOptions"
          :key="cat.id"
          type="button"
          @click="changeTab(cat.id)"
          class="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
          :class="activeTab === cat.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'"
        >
          {{ cat.shortLabel }}
          <span v-if="cat.badge" class="ml-1 text-[10px] px-1.5 py-0.2 rounded-full" :class="activeTab === cat.id ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'">
            {{ cat.badge }}
          </span>
        </button>
      </div>

      <!-- Part 1: Evaluation Questions -->
      <section v-if="activeTab <= 7" class="space-y-3">
        <div class="flex items-center justify-between pb-1">
          <h3 class="text-sm font-semibold text-slate-800">{{ currentCategoryName }}</h3>
          <span class="text-xs text-slate-400">ประเมิน 1-5 หรือ N/A</span>
        </div>

        <QuestionCard
          v-for="q in currentQuestions"
          :key="q.id"
          :item-number="q.itemNumber"
          :title="q.title"
          :score="form.scores[q.id]?.score"
          :is-n-a="form.scores[q.id]?.isNA"
          :defect-note="form.scores[q.id]?.defectNote"
          :photo-url="form.scores[q.id]?.photoUrl"
          @update:score="val => setScore(q.id, val)"
          @update:is-n-a="val => setNA(q.id, val)"
          @update:defect-note="val => setDefectNote(q.id, val)"
          @update:photo-url="val => setPhotoUrl(q.id, val)"
        />

        <!-- Next / Previous Category Quick Navigation -->
        <div class="flex items-center justify-between pt-4">
          <button
            v-if="activeTab > 1"
            type="button"
            @click="changeTab(activeTab - 1)"
            class="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
          >
            ← หมวดก่อนหน้า
          </button>
          <div v-else></div>

          <button
            type="button"
            @click="changeTab(activeTab + 1)"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
          >
            {{ activeTab === 7 ? 'ไปยังข้อค้นพบตอนที่ 2 →' : 'หมวดถัดไป →' }}
          </button>
        </div>
      </section>

      <!-- Part 2: Findings & Follow-up (Tab 8) -->
      <section v-else-if="activeTab === 8" class="space-y-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
            ตอนที่ 2 ข้อค้นพบจากการตรวจ
          </h3>

          <!-- Strengths -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">จุดเด่นในการปฏิบัติงาน</label>
            <textarea
              v-model="form.strengthsSummary"
              rows="2"
              placeholder="เช่น มีความกระตือรือร้น, พื้นทางเดินแวววาวสะอาดมาก, ดูแลต้นไม้สดชื่น"
              class="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            ></textarea>
          </div>

          <!-- Urgent Problems -->
          <div>
            <label class="block text-xs font-medium text-rose-700 mb-1">จุดที่ต้องปรับปรุงเร่งด่วน</label>
            <textarea
              v-model="form.urgentProblems"
              rows="2"
              placeholder="เช่น ท่อระบายน้ำอุดตัน, พื้นห้องน้ำลื่น, เศษวัสดุกีดขวางทางหนีไฟ"
              class="w-full text-xs sm:text-sm p-3 rounded-xl border border-rose-200 bg-rose-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            ></textarea>
          </div>

          <!-- Corrective Plan & Deadline -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-slate-700 mb-1">แนวทางแก้ไข</label>
              <input
                v-model="form.correctivePlan"
                type="text"
                placeholder="ระบุข้อตกลงในการปรับปรุงแก้ไข"
                class="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">กำหนดเวลาแล้วเสร็จ</label>
              <input
                v-model="form.targetDeadline"
                type="date"
                class="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        <!-- Digital Signature -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <SignaturePad v-model="form.signatureImage" />
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between pt-2">
          <button
            type="button"
            @click="changeTab(7)"
            class="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
          >
            ← ย้อนกลับไปหมวดที่ 7
          </button>

          <button
            type="button"
            @click="submitAssessment"
            :disabled="isSubmitting"
            class="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <span v-if="isSubmitting">กำลังบันทึก...</span>
            <span v-else>{{ currentAssessmentId ? '✓ บันทึกการแก้ไขผลการประเมิน' : '✓ ยืนยันและส่งผลการประเมิน' }}</span>
          </button>
        </div>
      </section>
    </main>

    <!-- Sticky Bottom Bar -->
    <ScoreSummaryBar
      :evaluated-count="evaluationResult.evaluatedItems"
      :total-count="evaluationResult.totalItems"
      :na-count="evaluationResult.naItems"
      :average-score="evaluationResult.averageScore"
      :percentage="evaluationResult.percentage"
      :grade-key="evaluationResult.gradeKey"
      :grade-label="evaluationResult.gradeLabel"
    >
      <template #action>
        <button
          v-if="activeTab < 8"
          type="button"
          @click="changeTab(8)"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          สรุปและลงนาม →
        </button>
        <button
          v-else
          type="button"
          @click="submitAssessment"
          :disabled="isSubmitting"
          class="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {{ currentAssessmentId ? 'บันทึกแก้ไข' : 'ส่งผลประเมิน' }}
        </button>
      </template>
    </ScoreSummaryBar>

    <!-- Minimal Auto-dismissing Toast Notification -->
    <Transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast.show"
        class="fixed bottom-20 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium backdrop-blur-md pointer-events-auto max-w-sm"
        :class="toast.type === 'error'
          ? 'bg-rose-50/95 border-rose-200 text-rose-800 shadow-rose-900/10'
          : 'bg-emerald-50/95 border-emerald-200 text-emerald-800 shadow-emerald-900/10'"
      >
        <span class="text-base flex-shrink-0">
          {{ toast.type === 'error' ? '⚠️' : '✅' }}
        </span>
        <span class="flex-1 leading-snug">{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { EVALUATION_CATEGORIES, EVALUATION_QUESTIONS } from '~/shared/constants/questions'
import { calculateEvaluation } from '~/shared/types/evaluation'

// Toast Notification
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
let toastTimer: any = null
function showToast(message: string, type: 'success' | 'error' = 'success') {
  clearTimeout(toastTimer)
  toast.message = message
  toast.type = type
  toast.show = true
  toastTimer = setTimeout(() => {
    toast.show = false
  }, 2600)
}

const activeTab = ref(1)
const isSubmitting = ref(false)
const selectedBuildingId = ref('')
const selectedStaffId = ref('')
const isCustomStaff = ref(false)
const selectedRoundId = ref('round-2570')
const availableRounds = ref<any[]>([])
const buildings = ref<any[]>([])
const dynamicCategories = ref<any[]>([...EVALUATION_CATEGORIES])
const dynamicQuestions = ref<any[]>([...EVALUATION_QUESTIONS])
const colorCriteria = reactive({
  greenMin: 4.0,
  yellowMin: 2.0,
  greenLabel: 'ดีเยี่ยม',
  yellowLabel: 'ปานกลาง',
  redLabel: 'ต้องปรับปรุงเร่งด่วน'
})
const userSession = useCookie<any>('bru_user_session')

// Building Searchable Dropdown State
const buildingDropdownRef = ref<HTMLElement | null>(null)
const buildingSearchQuery = ref('')
const isBuildingDropdownOpen = ref(false)

const filteredBuildings = computed(() => {
  const query = buildingSearchQuery.value.trim().toLowerCase()
  const list = query
    ? buildings.value.filter(b => b.name && b.name.toLowerCase().includes(query))
    : [...buildings.value]

  return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'th', { numeric: true }))
})

function selectBuilding(b: any) {
  selectedBuildingId.value = b.id
  buildingSearchQuery.value = b.name
  isBuildingDropdownOpen.value = false
  onBuildingChange()
}

function clearBuildingSelection() {
  selectedBuildingId.value = ''
  buildingSearchQuery.value = ''
  isBuildingDropdownOpen.value = false
  onBuildingChange()
}

onClickOutside(buildingDropdownRef, () => {
  isBuildingDropdownOpen.value = false
  if (selectedBuildingId.value) {
    const current = buildings.value.find(b => b.id === selectedBuildingId.value)
    if (current) {
      buildingSearchQuery.value = current.name
    }
  } else {
    buildingSearchQuery.value = ''
  }
})

// Tab Navigation with Auto Scroll to Top
function changeTab(tabId: number) {
  activeTab.value = tabId
  if (process.client) {
    nextTick(() => {
      const el = document.getElementById('evaluation-questions-top')
      if (el) {
        const rect = el.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        window.scrollTo({
          top: rect.top + scrollTop - 20,
          behavior: 'smooth'
        })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }
}

// Assessment Tracking State
const currentAssessmentId = ref<string | null>(null)
const existingAssessments = ref<any[]>([])

const currentAssessorDisplayName = computed(() => {
  return userSession.value?.fullName || form.assessorName || 'กรรมการผู้ตรวจประเมิน'
})

// Form State
const form = reactive({
  buildingName: '',
  staffId: '',
  responsibleStaffText: '',
  assessmentDate: new Date().toISOString().split('T')[0],
  assessorName: userSession.value?.fullName || 'กรรมการผู้ตรวจประเมิน',
  strengthsSummary: '',
  urgentProblems: '',
  correctivePlan: '',
  targetDeadline: '',
  signatureImage: '',
  scores: {} as Record<number, { score: number | null; isNA: boolean; defectNote?: string; photoUrl?: string }>
})

// Initialize questions
for (const q of dynamicQuestions.value) {
  form.scores[q.id] = { score: null, isNA: false, defectNote: '', photoUrl: '' }
}

const tabOptions = computed(() => [
  { id: 1, shortLabel: '1. ในอาคาร', badge: getCategoryAnsweredCount(1) },
  { id: 2, shortLabel: '2. ห้องเรียน/งาน', badge: getCategoryAnsweredCount(2) },
  { id: 3, shortLabel: '3. ห้องน้ำ/ขยะ', badge: getCategoryAnsweredCount(3) },
  { id: 4, shortLabel: '4. ครุภัณฑ์', badge: getCategoryAnsweredCount(4) },
  { id: 5, shortLabel: '5. นอกอาคาร/สวน', badge: getCategoryAnsweredCount(5) },
  { id: 6, shortLabel: '6. ปลอดภัย/จิตสาธารณะ', badge: getCategoryAnsweredCount(6) },
  { id: 7, shortLabel: '7. อื่นๆ/ป้าย', badge: getCategoryAnsweredCount(7) },
  { id: 8, shortLabel: 'ตอนที่ 2 สรุป/ลงนาม', badge: '' },
])

const currentCategoryName = computed(() => {
  return dynamicCategories.value.find(c => c.id === activeTab.value)?.name || ''
})

const currentQuestions = computed(() => {
  return dynamicQuestions.value.filter(q => q.categoryId === activeTab.value)
})

const evaluationResult = computed(() => {
  return calculateEvaluation(form.scores, {
    totalItems: dynamicQuestions.value.length,
    ...colorCriteria
  })
})

function getCategoryAnsweredCount(catId: number) {
  const catQuestions = dynamicQuestions.value.filter(q => q.categoryId === catId)
  const answered = catQuestions.filter(q => {
    const s = form.scores[q.id]
    return s && (s.isNA || (s.score !== null && s.score !== undefined))
  }).length
  return `${answered}/${catQuestions.length}`
}

function setScore(qId: number, score: number | null) {
  if (!form.scores[qId]) form.scores[qId] = { score: null, isNA: false }
  form.scores[qId].score = score
  form.scores[qId].isNA = false
  saveDraft()
}

function setNA(qId: number, isNA: boolean) {
  if (!form.scores[qId]) form.scores[qId] = { score: null, isNA: false }
  form.scores[qId].isNA = isNA
  form.scores[qId].score = null
  saveDraft()
}

function setDefectNote(qId: number, note: string) {
  if (!form.scores[qId]) form.scores[qId] = { score: null, isNA: false }
  form.scores[qId].defectNote = note
  saveDraft()
}

function setPhotoUrl(qId: number, url: string) {
  if (!form.scores[qId]) form.scores[qId] = { score: null, isNA: false }
  form.scores[qId].photoUrl = url
  saveDraft()
}

// Helpers
function formatStaffDisplayName(fullName: string): string {
  if (!fullName) return ''
  let str = String(fullName).trim()
  const prefixRegex = /^(?:ว่าที่\s*ร้อยตรี|ว่าที่\s*ร\.ต\.|ผศ\.\s*ดร\.|รศ\.\s*ดร\.|ศ\.\s*ดร\.|อาจารย์\s*ดร\.|อาจารย์\s*|ผศ\.|รศ\.|ศ\.|ดร\.|อ\.|นาย|นางสาว|นาง|น\.ส\.)\s*/i
  let prev = ''
  while (prev !== str) {
    prev = str
    str = str.replace(prefixRegex, '').trim()
  }
  return str
}

const currentBuildingStaffs = computed(() => {
  const b = buildings.value.find(item => item.id === selectedBuildingId.value)
  return b?.staffs || []
})

async function fetchExistingAssessments() {
  if (!selectedBuildingId.value || !selectedRoundId.value) {
    existingAssessments.value = []
    return
  }
  try {
    const assessorId = userSession.value?.id || userSession.value?.userlogin
    const res: any = await $fetch('/api/assessments', {
      params: {
        roundId: selectedRoundId.value,
        buildingId: selectedBuildingId.value,
        assessorId: assessorId || undefined
      }
    })
    if (res?.ok && Array.isArray(res.data)) {
      existingAssessments.value = res.data
    } else {
      existingAssessments.value = []
    }
  } catch (err) {
    console.error('Failed to fetch existing assessments', err)
    existingAssessments.value = []
  }
}

function getExistingAssessment(staffId?: string | null, staffName?: string | null) {
  if (!existingAssessments.value.length) return null
  return existingAssessments.value.find((a: any) => {
    if (staffId && a.staffId && a.staffId === staffId) return true
    if (staffName && a.responsibleStaffText) {
      const nameA = formatStaffDisplayName(a.responsibleStaffText).trim().toLowerCase()
      const nameB = formatStaffDisplayName(staffName).trim().toLowerCase()
      if (nameA && nameB && nameA === nameB) return true
    }
    return false
  }) || null
}

function isStaffEvaluated(staffId?: string | null, staffName?: string | null): boolean {
  return !!getExistingAssessment(staffId, staffName)
}

function selectStaff(s: any) {
  isCustomStaff.value = false
  selectedStaffId.value = s.id
  form.staffId = s.id
  form.responsibleStaffText = s.staffName

  // ล้างฟอร์มให้สะอาดบริสุทธิ์เสมอเพื่อไม่ให้จำค่าคนเดิม
  resetScoresAndFindings()

  const existing = getExistingAssessment(s.id, s.staffName)
  if (existing) {
    loadExistingAssessmentData(existing)
  } else {
    // โหลด Draft เฉพาะบุคคล (ถ้ามี)
    loadDraftForStaff(s.id)
  }
  saveDraft()
}

function selectCustomStaff() {
  isCustomStaff.value = true
  selectedStaffId.value = '__CUSTOM__'
  form.staffId = ''
  form.responsibleStaffText = ''
  resetScoresAndFindings()
  loadDraftForStaff('__CUSTOM__')
  saveDraft()
}

function loadExistingAssessmentData(existing: any) {
  currentAssessmentId.value = existing.id
  form.assessmentDate = existing.assessedAt
    ? new Date(existing.assessedAt).toISOString().split('T')[0]
    : form.assessmentDate
  form.strengthsSummary = existing.strengthsSummary || ''
  form.urgentProblems = existing.urgentProblems || ''
  form.correctivePlan = existing.correctivePlan || ''
  form.targetDeadline = existing.targetDeadline
    ? new Date(existing.targetDeadline).toISOString().split('T')[0]
    : ''
  form.signatureImage = existing.signatureImage || ''

  // ล้างค่าคำถามก่อนโหลด
  for (const q of dynamicQuestions.value) {
    form.scores[q.id] = { score: null, isNA: false, defectNote: '', photoUrl: '' }
  }

  // นำคะแนนเดิมมาใส่
  if (Array.isArray(existing.scores)) {
    for (const sc of existing.scores) {
      if (form.scores[sc.questionItemId]) {
        form.scores[sc.questionItemId] = {
          score: sc.score !== null && sc.score !== undefined ? Number(sc.score) : null,
          isNA: Boolean(sc.isNA),
          defectNote: sc.defectNote || '',
          photoUrl: sc.photoUrl || ''
        }
      }
    }
  }

  showToast(`โหลดผลการประเมินของ "${formatStaffDisplayName(existing.responsibleStaffText)}" เรียบร้อยแล้ว`, 'success')
}

function resetScoresAndFindings() {
  currentAssessmentId.value = null
  form.strengthsSummary = ''
  form.urgentProblems = ''
  form.correctivePlan = ''
  form.targetDeadline = ''
  form.signatureImage = ''
  for (const q of dynamicQuestions.value) {
    form.scores[q.id] = { score: null, isNA: false, defectNote: '', photoUrl: '' }
  }
  activeTab.value = 1
}

async function onBuildingChange() {
  const b = buildings.value.find(item => item.id === selectedBuildingId.value)
  if (b) {
    form.buildingName = b.name
    await fetchExistingAssessments()

    if (b.staffs && b.staffs.length > 0) {
      // ค้นหาผู้ดูแลคนแรกที่ยังไม่ได้รับการประเมิน (ยังไม่มี ✓) ก่อน
      const unevaluated = b.staffs.find((s: any) => !isStaffEvaluated(s.id, s.staffName))
      selectStaff(unevaluated || b.staffs[0])
    } else {
      selectCustomStaff()
    }
  } else {
    existingAssessments.value = []
    selectedStaffId.value = ''
    form.staffId = ''
    form.responsibleStaffText = ''
    resetScoresAndFindings()
  }
}

watch(selectedRoundId, async () => {
  if (selectedBuildingId.value) {
    await fetchExistingAssessments()
    if (selectedStaffId.value && !isCustomStaff.value) {
      const s = currentBuildingStaffs.value.find((item: any) => item.id === selectedStaffId.value)
      if (s) {
        selectStaff(s)
      }
    }
  }
})

// Auto-Save Draft (แยกรายบุคคลตามรอบ อาคาร และผู้ปฏิบัติงาน)
function getDraftKey(roundId?: string, buildingId?: string, staffId?: string) {
  const r = roundId || selectedRoundId.value || 'round-2570'
  const b = buildingId || selectedBuildingId.value || 'no-bldg'
  const s = staffId || selectedStaffId.value || (isCustomStaff.value ? '__CUSTOM__' : 'default')
  return `bru_eval_draft_${r}_${b}_${s}`
}

function saveDraft() {
  if (process.client && selectedBuildingId.value && selectedStaffId.value) {
    const key = getDraftKey()
    localStorage.setItem(key, JSON.stringify({
      selectedRoundId: selectedRoundId.value,
      selectedBuildingId: selectedBuildingId.value,
      selectedStaffId: selectedStaffId.value,
      isCustomStaff: isCustomStaff.value,
      currentAssessmentId: currentAssessmentId.value,
      form
    }))
  }
}

function loadDraftForStaff(staffId?: string): boolean {
  if (!process.client) return false
  const key = getDraftKey(selectedRoundId.value, selectedBuildingId.value, staffId || selectedStaffId.value)
  const draft = localStorage.getItem(key)
  if (draft) {
    try {
      const parsed = JSON.parse(draft)
      if (parsed.form) {
        currentAssessmentId.value = parsed.currentAssessmentId || null
        Object.assign(form, parsed.form)
        return true
      }
    } catch (e) {
      console.error('Failed to parse draft', e)
    }
  }
  return false
}

function clearDraft(staffId?: string) {
  if (process.client) {
    const key = getDraftKey(selectedRoundId.value, selectedBuildingId.value, staffId || selectedStaffId.value)
    localStorage.removeItem(key)
    localStorage.removeItem('bru_eval_draft_v1')
  }
}

function resetForm() {
  if (confirm('คุณต้องการล้างข้อมูลแบบประเมินทั้งหมดและเริ่มใหม่ใช่หรือไม่?')) {
    clearDraft()
    resetScoresAndFindings()
    selectedBuildingId.value = ''
    buildingSearchQuery.value = ''
    selectedStaffId.value = ''
    form.buildingName = ''
    form.staffId = ''
    form.responsibleStaffText = ''
    existingAssessments.value = []
  }
}

onMounted(async () => {
  try {
    const [bRes, rRes, qRes, cRes]: any = await Promise.all([
      $fetch('/api/buildings'),
      $fetch('/api/rounds'),
      $fetch('/api/questions'),
      $fetch('/api/settings/color-criteria')
    ])
    if (bRes?.data) {
      buildings.value = [...bRes.data].sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '', 'th', { numeric: true }))
      if (selectedBuildingId.value) {
        const current = buildings.value.find((b: any) => b.id === selectedBuildingId.value)
        if (current) buildingSearchQuery.value = current.name
      }
    }
    if (rRes?.data) {
      availableRounds.value = rRes.data
      if (!selectedRoundId.value) {
        const openRound = rRes.data.find((r: any) => r.status === 'OPEN')
        if (openRound) selectedRoundId.value = openRound.id
      }
    }
    if (qRes?.ok) {
      if (qRes.categories?.length) dynamicCategories.value = qRes.categories
      if (qRes.questions?.length) {
        dynamicQuestions.value = qRes.questions
        const validIds = new Set(qRes.questions.map((q: any) => q.id))
        for (const q of qRes.questions) {
          if (!form.scores[q.id]) {
            form.scores[q.id] = { score: null, isNA: false, defectNote: '', photoUrl: '' }
          }
        }
        for (const k of Object.keys(form.scores)) {
          if (!validIds.has(Number(k))) {
            delete form.scores[Number(k)]
          }
        }
      }
    }
    if (cRes?.data?.building) {
      Object.assign(colorCriteria, cRes.data.building)
    }

    if (selectedBuildingId.value) {
      await fetchExistingAssessments()
    }
  } catch (err) {
    console.error('Error fetching data', err)
  }
})

async function submitAssessment() {
  const currentRound = availableRounds.value.find((r: any) => r.id === selectedRoundId.value)
  if (currentRound && currentRound.status === 'CLOSED') {
    showToast('รอบการประเมินนี้ปิดรับการประเมินแล้ว กรุณาเลือกรอบที่เปิดอยู่', 'error')
    return
  }

  if (!form.buildingName) {
    activeTab.value = 1
    showToast('กรุณาเลือกอาคารที่ทำการตรวจก่อนส่งผล', 'error')
    return
  }
  if (!form.responsibleStaffText || form.responsibleStaffText.trim() === '') {
    activeTab.value = 1
    showToast('กรุณาระบุหรือเลือกผู้ปฏิบัติงานรายบุคคลที่จะประเมิน', 'error')
    return
  }

  // ตรวจสอบการให้คะแนนครบทุกข้อ และตรวจสอบการระบุข้อบกพร่องเมื่อให้คะแนน <= 3
  for (const q of dynamicQuestions.value) {
    const item = form.scores[q.id]
    const isAnswered = item && (item.isNA || (item.score !== null && item.score !== undefined))
    if (!isAnswered) {
      activeTab.value = q.categoryId
      showToast(`กรุณาประเมินข้อที่ ${q.itemNumber} ในหมวดที่ ${q.categoryId} ให้ครบถ้วนก่อนส่งผล`, 'error')
      return
    }
    if (!item.isNA && item.score !== null && item.score !== undefined && item.score <= 3) {
      if (!item.defectNote || !item.defectNote.trim()) {
        activeTab.value = q.categoryId
        showToast(`ข้อที่ ${q.itemNumber} ได้คะแนน ${item.score} กรุณาระบุข้อบกพร่องที่พบ`, 'error')
        return
      }
    }
  }

  isSubmitting.value = true
  try {
    const endpoint = currentAssessmentId.value
      ? `/api/assessments/${currentAssessmentId.value}`
      : '/api/assessments'
    const method = currentAssessmentId.value ? 'PUT' : 'POST'

    const res: any = await $fetch(endpoint, {
      method,
      body: {
        roundId: selectedRoundId.value,
        buildingId: selectedBuildingId.value,
        buildingName: form.buildingName,
        staffId: form.staffId || null,
        responsibleStaffText: form.responsibleStaffText.trim(),
        assessorId: userSession.value?.id || userSession.value?.userlogin || null,
        assessorName: currentAssessorDisplayName.value,
        assessedAt: form.assessmentDate,
        scores: form.scores,
        strengthsSummary: form.strengthsSummary,
        urgentProblems: form.urgentProblems,
        correctivePlan: form.correctivePlan,
        targetDeadline: form.targetDeadline,
        signatureImage: form.signatureImage
      }
    })

    if (res?.ok) {
      clearDraft(form.staffId || selectedStaffId.value)
      await fetchExistingAssessments()

      const evaluatedName = formatStaffDisplayName(form.responsibleStaffText)
      showToast(currentAssessmentId.value
        ? `บันทึกการแก้ไขผลการประเมินของ "${evaluatedName}" สำเร็จ!`
        : `บันทึกผลการประเมินของ "${evaluatedName}" สำเร็จ! (${res.data?.gradeLabel || evaluationResult.value.gradeLabel})`
      )

      // ตรวจสอบว่าในอาคารนี้ยังมีผู้ดูแลคนอื่นที่ยังไม่ได้รับการประเมินหรือไม่
      const remainingStaff = currentBuildingStaffs.value.find((s: any) => !isStaffEvaluated(s.id, s.staffName))

      if (remainingStaff) {
        // ยังมีผู้ดูแลคนอื่นที่ยังไม่ได้รับการประเมิน -> สลับไปประเมินคนถัดไปอัตโนมัติ พร้อมฟอร์มสะอาด
        setTimeout(() => {
          selectStaff(remainingStaff)
          showToast(`สลับไปยังผู้ดูแลถัดไป: "${formatStaffDisplayName(remainingStaff.staffName)}" พร้อมตรวจประเมินต่อ`, 'success')
        }, 800)
      } else {
        // ประเมินครบทุกคนในอาคารนี้แล้ว
        setTimeout(() => {
          showToast(`ประเมินผู้ดูแลครบทุกคนใน ${form.buildingName} แล้ว`, 'success')
        }, 600)
        setTimeout(() => {
          navigateTo('/')
        }, 2000)
      }
    }
  } catch (err: any) {
    showToast(err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error')
  } finally {
    isSubmitting.value = false
  }
}
  } catch (err: any) {
    showToast(err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
