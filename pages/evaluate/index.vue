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
        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">ข้อมูลการตรวจประเมิน</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Evaluation Round Selection -->
          <div class="sm:col-span-2">
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

          <!-- Building Selection -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">ชื่ออาคาร <span class="text-rose-500">*</span></label>
            <select
              v-model="selectedBuildingId"
              @change="onBuildingChange"
              class="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="" disabled>-- เลือกอาคารที่ทำการตรวจ --</option>
              <option v-for="b in buildings" :key="b.id" :value="b.id">
                {{ b.code }} : {{ b.name }}
              </option>
            </select>
          </div>

          <!-- Responsible Staff -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">ชื่อผู้รับผิดชอบ / แม่บ้านประจำอาคาร</label>
            <input
              v-model="form.responsibleStaffText"
              type="text"
              placeholder="ระบุชื่อแม่บ้านหรือเลือกจากอาคาร"
              class="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
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

          <!-- Assessor -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">ชื่อผู้ตรวจประเมิน</label>
            <input
              v-model="form.assessorName"
              type="text"
              placeholder="ชื่อผู้ประเมิน / กรรมการ"
              class="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </section>

      <!-- Category Filter Tabs (Horizontal touch slider for mobile) -->
      <div class="overflow-x-auto no-scrollbar py-1 -mx-4 px-4 flex items-center space-x-2">
        <button
          v-for="cat in tabOptions"
          :key="cat.id"
          type="button"
          @click="activeTab = cat.id"
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
            @click="activeTab--"
            class="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
          >
            ← หมวดก่อนหน้า
          </button>
          <div v-else></div>

          <button
            type="button"
            @click="activeTab++"
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
            @click="activeTab = 7"
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
            <span v-else>✓ ยืนยันและส่งผลการประเมิน</span>
          </button>
        </div>
      </section>
    </main>

    <!-- Sticky Bottom Bar -->
    <ScoreSummaryBar
      :evaluated-count="evaluationResult.evaluatedItems"
      :total-count="evaluationResult.totalItems"
      :na-count="evaluationResult.naItems"
      :percentage="evaluationResult.percentage"
      :grade-key="evaluationResult.gradeKey"
      :grade-label="evaluationResult.gradeLabel"
    >
      <template #action>
        <button
          v-if="activeTab < 8"
          type="button"
          @click="activeTab = 8"
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
          ส่งผลประเมิน
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
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
const selectedRoundId = ref('round-2570')
const availableRounds = ref<any[]>([])
const buildings = ref<any[]>([])
const userSession = useCookie<any>('bru_user_session')

// Form State
const form = reactive({
  buildingName: '',
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

// Initialize 35 questions
for (const q of EVALUATION_QUESTIONS) {
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
  return EVALUATION_CATEGORIES.find(c => c.id === activeTab.value)?.name || ''
})

const currentQuestions = computed(() => {
  return EVALUATION_QUESTIONS.filter(q => q.categoryId === activeTab.value)
})

const evaluationResult = computed(() => {
  return calculateEvaluation(form.scores)
})

function getCategoryAnsweredCount(catId: number) {
  const catQuestions = EVALUATION_QUESTIONS.filter(q => q.categoryId === catId)
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

function onBuildingChange() {
  const b = buildings.value.find(item => item.id === selectedBuildingId.value)
  if (b) {
    form.buildingName = b.name
    if (b.staffs && b.staffs.length > 0) {
      form.responsibleStaffText = b.staffs.map((s: any) => s.staffName).join(', ')
    }
  }
  saveDraft()
}

// Auto-Save Draft
const DRAFT_KEY = 'bru_eval_draft_v1'
function saveDraft() {
  if (process.client) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      selectedBuildingId: selectedBuildingId.value,
      form
    }))
  }
}

function loadDraft() {
  if (process.client) {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        selectedBuildingId.value = parsed.selectedBuildingId || ''
        Object.assign(form, parsed.form)
      } catch (e) {
        console.error('Failed to parse draft', e)
      }
    }
  }
}

function resetForm() {
  if (confirm('คุณต้องการล้างข้อมูลแบบประเมินทั้งหมดและเริ่มใหม่ใช่หรือไม่?')) {
    if (process.client) localStorage.removeItem(DRAFT_KEY)
    location.reload()
  }
}

onMounted(async () => {
  try {
    const [bRes, rRes]: any = await Promise.all([
      $fetch('/api/buildings'),
      $fetch('/api/rounds')
    ])
    if (bRes?.data) buildings.value = bRes.data
    if (rRes?.data) {
      availableRounds.value = rRes.data
      const openRound = rRes.data.find((r: any) => r.status === 'OPEN')
      if (openRound) selectedRoundId.value = openRound.id
    }
  } catch (err) {
    console.error('Error fetching data', err)
  }
  loadDraft()
})

async function submitAssessment() {
  if (!form.buildingName) {
    activeTab.value = 1
    showToast('กรุณาเลือกอาคารที่ทำการตรวจก่อนส่งผล', 'error')
    return
  }

  isSubmitting.value = true
  try {
    const res: any = await $fetch('/api/assessments', {
      method: 'POST',
      body: {
        roundId: selectedRoundId.value,
        buildingId: selectedBuildingId.value,
        buildingName: form.buildingName,
        responsibleStaffText: form.responsibleStaffText,
        assessorName: form.assessorName,
        scores: form.scores,
        strengthsSummary: form.strengthsSummary,
        urgentProblems: form.urgentProblems,
        correctivePlan: form.correctivePlan,
        targetDeadline: form.targetDeadline,
        signatureImage: form.signatureImage
      }
    })

    if (res?.ok) {
      if (process.client) localStorage.removeItem(DRAFT_KEY)
      showToast(`บันทึกผลการประเมินสำเร็จ! (${res.data?.gradeLabel || evaluationResult.value.gradeLabel})`)
      setTimeout(() => {
        navigateTo('/')
      }, 1200)
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
