<template>
  <div class="min-h-screen bg-slate-50/70 pb-20 print:bg-white print:p-0 print:pb-0">
    <Navbar class="print:hidden" />

    <main class="max-w-6xl mx-auto px-4 py-8 space-y-6 print:max-w-none print:p-0 print:m-0 print:space-y-4">
      <!-- DEDICATED PRINT HEADER (Visible only when printing) -->
      <div class="hidden print:block text-center border-b-2 border-slate-900 pb-3 mb-4 space-y-1">
        <h1 class="text-xl font-bold text-slate-900">มหาวิทยาลัยราชภัฏบุรีรัมย์</h1>
        <h2 class="text-base font-semibold text-slate-800">
          {{ activeReportTab === 1 ? 'รายงานสรุปคะแนนเฉลี่ยผลการตรวจประเมินรายอาคาร' : (activeReportTab === 2 ? 'รายงานสรุปผลการประเมินผู้ปฏิบัติงานรายบุคคล' : (activeReportTab === 3 ? 'รายงานเปรียบเทียบแนวโน้มข้ามรอบประเมิน' : 'รายงานวิเคราะห์จุดบกพร่องตามหมวด')) }}
        </h2>
        <div class="flex items-center justify-center space-x-4 text-xs text-slate-600 pt-0.5">
          <span><strong>รอบการประเมิน:</strong> {{ currentRoundName }}</span>
          <span>•</span>
          <span><strong>วันที่พิมพ์:</strong> {{ printDateStr }}</span>
        </div>
      </div>

      <!-- Report Header (Screen view) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-1">
            <span>📊 รายงานผลการประเมินสำหรับคณะกรรมการ</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">รายงานและผลวิเคราะห์การประเมิน (ตารางสรุปผล)</h2>
          <p class="text-xs text-slate-500">
            แสดงผลคะแนนเฉลี่ย 0 - 5.00 คะแนน คิดคำนวณจากกรรมการทุกคนในแต่ละรอบ พร้อมรองรับการพิมพ์และส่งออก Excel
          </p>
        </div>

        <!-- Controls: Round Selector -->
        <div class="flex items-center space-x-1.5">
          <label class="text-xs font-medium text-slate-500 hidden sm:inline">รอบประเมิน:</label>
          <select
            v-model="selectedRoundId"
            @change="loadReportData"
            class="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          >
            <option v-for="r in availableRounds" :key="r.id" :value="r.id">
              {{ r.name }} {{ r.status === 'OPEN' ? '(เปิดอยู่)' : '(ปิดแล้ว)' }}
            </option>
          </select>
        </div>
      </div>

      <!-- Report Tabs (4 Reports) -->
      <div class="flex items-center space-x-1 border-b border-slate-200/80 pb-2 overflow-x-auto no-scrollbar print:hidden">
        <button
          type="button"
          @click="activeReportTab = 1"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="activeReportTab === 1 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          🏢 1. สรุปคะแนนเฉลี่ยรายอาคาร
        </button>

        <button
          type="button"
          @click="activeReportTab = 2"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="activeReportTab === 2 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          2. สรุปผลประเมินรายบุคคล
        </button>

        <button
          type="button"
          @click="activeReportTab = 3"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="activeReportTab === 3 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          📈 3. เปรียบเทียบแนวโน้มข้ามรอบ
        </button>

        <button
          type="button"
          @click="activeReportTab = 4"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="activeReportTab === 4 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          ⚠️ 4. วิเคราะห์จุดบกพร่องตามหมวด
        </button>
      </div>

      <!-- ============================================================== -->
      <!-- REPORT 1: Building Average Score Summary (TABULAR VIEW)       -->
      <!-- ============================================================== -->
      <section v-if="activeReportTab === 1" class="space-y-4">
        <!-- Criteria Legend & Controls Card -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3 print:hidden">
          <!-- Active Color Criteria Legend for Building -->
          <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
            <span class="font-semibold text-slate-700">🎨 เกณฑ์สีสำหรับอาคาร:</span>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>เขียว (≥ {{ activeColorCriteria.building.greenMin }}) : {{ activeColorCriteria.building.greenLabel }}</span>
              </span>
              <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>เหลือง ({{ activeColorCriteria.building.yellowMin }} - &lt; {{ activeColorCriteria.building.greenMin }}) : {{ activeColorCriteria.building.yellowLabel }}</span>
              </span>
              <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>แดง (&lt; {{ activeColorCriteria.building.yellowMin }}) : {{ activeColorCriteria.building.redLabel }}</span>
              </span>
            </div>
          </div>

          <!-- Search, Sorting & Table Actions -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <input
                v-model="buildingSearchQuery"
                type="text"
                placeholder="ค้นหาชื่ออาคารหรือผู้รับผิดชอบ..."
                class="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>

            <div class="flex items-center space-x-2">
              <!-- Sorting dropdown -->
              <div class="flex items-center space-x-1.5">
                <label class="text-xs text-slate-500 whitespace-nowrap font-medium">เรียงลำดับ:</label>
                <select
                  v-model="buildingSortBy"
                  class="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                >
                  <option value="score_desc">คะแนนสูงสุด → ต่ำสุด</option>
                  <option value="score_asc">คะแนนต่ำสุด → สูงสุด</option>
                  <option value="name_asc">ชื่ออาคาร (ก-ฮ)</option>
                </select>
              </div>

              <!-- Print button for this table -->
              <button
                type="button"
                @click="printReport"
                class="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center space-x-1 flex-shrink-0 cursor-pointer"
                title="พิมพ์รายงานนี้ออกทางเครื่องพิมพ์"
              >
                <span>🖨️ พิมพ์</span>
              </button>

              <!-- Export Excel Button for this table -->
              <button
                type="button"
                @click="exportBuildingExcel"
                class="px-3 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl transition-all shadow-xs flex items-center space-x-1 flex-shrink-0 cursor-pointer"
                title="ส่งออกตารางสรุปรายอาคารเป็นไฟล์ Excel"
              >
                <span>📊 ดาวน์โหลด Excel</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Result count -->
        <div class="flex items-center justify-between text-xs text-slate-500 px-1 print:hidden">
          <span>พบอาคารทั้งหมด <strong>{{ sortedBuildingAverages.length }}</strong> แห่ง</span>
          <span
            v-if="buildingSearchQuery"
            class="text-indigo-600 cursor-pointer hover:underline font-medium"
            @click="buildingSearchQuery = ''"
          >
            ✕ ล้างการค้นหา
          </span>
        </div>

        <!-- TABULAR VIEW: BUILDINGS (No Status Color Column & No Parentheses on Responsible Staff) -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden print:border print:border-slate-400 print:rounded-none print:shadow-none">
          <div class="overflow-x-auto print:overflow-visible">
            <table class="w-full text-left text-xs sm:text-sm border-collapse print:text-[11px]">
              <thead class="bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider border-b border-slate-200 print:bg-slate-100 print:text-black print:border-b-2 print:border-slate-400">
                <tr>
                  <th class="py-3.5 px-3 text-center w-12 font-bold">#</th>
                  <th
                    @click="toggleBuildingSort('name')"
                    class="py-3.5 px-3.5 font-bold cursor-pointer hover:text-indigo-600 transition-colors print:cursor-default"
                  >
                    <div class="flex items-center space-x-1">
                      <span>ชื่ออาคาร</span>
                      <span class="text-[10px] text-slate-400 print:hidden">
                        {{ buildingSortBy === 'name_asc' ? '▲' : '⇅' }}
                      </span>
                    </div>
                  </th>
                  <th class="py-3.5 px-3.5 font-bold">ผู้รับผิดชอบ</th>
                  <th class="py-3.5 px-3.5 font-bold">คณะกรรมการที่ตรวจ</th>
                  <th
                    @click="toggleBuildingSort('score')"
                    class="py-3.5 px-3.5 text-center font-bold cursor-pointer hover:text-indigo-600 transition-colors w-36 print:cursor-default"
                  >
                    <div class="flex items-center justify-center space-x-1">
                      <span>คะแนนเฉลี่ย (0-5.00)</span>
                      <span class="text-[10px] text-slate-400 print:hidden">
                        {{ buildingSortBy === 'score_desc' ? '▼' : (buildingSortBy === 'score_asc' ? '▲' : '⇅') }}
                      </span>
                    </div>
                  </th>
                  <th class="py-3.5 px-3.5 font-bold">จุดที่ต้องปรับปรุงเร่งด่วน</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 print:divide-slate-300">
                <tr v-if="sortedBuildingAverages.length === 0">
                  <td colspan="6" class="py-10 text-center text-slate-400">
                    ไม่พบข้อมูลอาคารตามเงื่อนไขที่เลือก
                  </td>
                </tr>
                <tr
                  v-for="(b, idx) in sortedBuildingAverages"
                  :key="b.buildingId"
                  class="hover:bg-slate-50/80 transition-colors group print:break-inside-avoid"
                >
                  <!-- Rank / # -->
                  <td class="py-3 px-3 text-center">
                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs print:bg-transparent print:font-semibold">
                      {{ idx + 1 }}
                    </span>
                  </td>

                  <!-- Building Name -->
                  <td class="py-3 px-3.5 font-semibold text-slate-900">
                    <div class="flex items-center space-x-2">
                      <span
                        class="w-2.5 h-2.5 rounded-full flex-shrink-0 print:hidden"
                        :class="getDotColorClass(b.gradeColor || b.grade)"
                      ></span>
                      <span class="line-clamp-2 leading-snug">{{ b.buildingName }}</span>
                    </div>
                  </td>

                  <!-- Responsible Staff (No parentheses) -->
                  <td class="py-3 px-3.5 text-slate-700">
                    <span class="font-medium">{{ b.responsibleStaff }}</span>
                  </td>

                  <!-- Committee Auditors -->
                  <td class="py-3 px-3.5 text-slate-600">
                    <div class="space-y-0.5">
                      <div class="text-[11px] font-semibold text-slate-700">
                        👥 {{ b.committeeCount }} ท่าน
                      </div>
                      <div class="flex flex-wrap gap-1 text-[11px] text-slate-500 print:text-slate-700">
                        <span v-for="aud in b.auditors" :key="aud" class="bg-slate-100 px-1.5 py-0.2 rounded text-slate-700 print:bg-transparent print:p-0">
                          {{ aud }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Score (0-5.00) -->
                  <td class="py-3 px-3.5 text-center font-bold">
                    <div class="inline-flex items-baseline space-x-1">
                      <span
                        class="text-base sm:text-lg font-black"
                        :class="getScoreTextClass(b.gradeColor || b.grade)"
                      >
                        {{ b.scoreFormatted || (b.score ? b.score.toFixed(2) : '0.00') }}
                      </span>
                      <span class="text-[10px] text-slate-400 font-normal">/ 5.00</span>
                    </div>
                  </td>

                  <!-- Urgent Defect Notes -->
                  <td class="py-3 px-3.5 text-xs">
                    <span v-if="b.urgentNotes" class="text-rose-700 bg-rose-50 border border-rose-200/80 rounded-lg px-2 py-1 inline-block line-clamp-2 print:bg-transparent print:border-none print:p-0 print:text-rose-900">
                      ⚠️ {{ b.urgentNotes }}
                    </span>
                    <span v-else class="text-slate-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- REPORT 2: Individual Staff Assessment Report (TABULAR VIEW)    -->
      <!-- ============================================================== -->
      <section v-else-if="activeReportTab === 2" class="space-y-4">
        <!-- Criteria Legend & Controls Card -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3 print:hidden">
          <!-- Active Color Criteria Legend for Staff -->
          <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
            <span class="font-semibold text-slate-700">เกณฑ์สีสำหรับบุคลากร:</span>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>เขียว (≥ {{ activeColorCriteria.staff.greenMin }}) : {{ activeColorCriteria.staff.greenLabel }}</span>
              </span>
              <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>เหลือง ({{ activeColorCriteria.staff.yellowMin }} - &lt; {{ activeColorCriteria.staff.greenMin }}) : {{ activeColorCriteria.staff.yellowLabel }}</span>
              </span>
              <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>แดง (&lt; {{ activeColorCriteria.staff.yellowMin }}) : {{ activeColorCriteria.staff.redLabel }}</span>
              </span>
            </div>
          </div>

          <!-- Controls: Search, Filter Building, Sort & Actions -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <input
                v-model="staffSearchQuery"
                type="text"
                placeholder="ค้นหาชื่อผู้ปฏิบัติงานหรืออาคาร..."
                class="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>

            <!-- Building Filter -->
            <div class="flex items-center space-x-2">
              <label class="text-xs text-slate-500 whitespace-nowrap font-medium">กรองอาคาร:</label>
              <select
                v-model="staffBuildingFilter"
                class="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
              >
                <option value="">ทุกอาคาร ({{ uniqueBuildings.length }} แห่ง)</option>
                <option v-for="b in uniqueBuildings" :key="b.id" :value="b.id">
                  {{ b.name }}
                </option>
              </select>
            </div>

            <!-- Sort Option -->
            <div class="flex items-center space-x-2">
              <label class="text-xs text-slate-500 whitespace-nowrap font-medium">เรียงลำดับ:</label>
              <select
                v-model="staffSortBy"
                class="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
              >
                <option value="score_desc">คะแนนสูงสุด → ต่ำสุด</option>
                <option value="score_asc">คะแนนต่ำสุด → สูงสุด</option>
                <option value="building_asc">เรียงตามอาคาร (ก-ฮ)</option>
                <option value="name_asc">เรียงตามชื่อผู้ปฏิบัติงาน</option>
              </select>

              <!-- Print button for this table -->
              <button
                type="button"
                @click="printReport"
                class="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center space-x-1 flex-shrink-0 cursor-pointer"
                title="พิมพ์รายงานนี้ออกทางเครื่องพิมพ์"
              >
                <span>🖨️ พิมพ์</span>
              </button>

              <!-- Export Excel Button for this table -->
              <button
                type="button"
                @click="exportStaffExcel"
                class="px-3 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl transition-all shadow-xs flex items-center space-x-1 flex-shrink-0 cursor-pointer"
                title="ส่งออกตารางสรุปรายบุคคลเป็นไฟล์ Excel"
              >
                <span>📊 ดาวน์โหลด Excel</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Result count -->
        <div class="flex items-center justify-between text-xs text-slate-500 px-1 print:hidden">
          <span>พบผู้ปฏิบัติงานทั้งหมด <strong>{{ filteredStaffAverages.length }}</strong> ท่าน</span>
          <span
            v-if="staffBuildingFilter || staffSearchQuery"
            class="text-indigo-600 cursor-pointer hover:underline font-medium"
            @click="staffBuildingFilter = ''; staffSearchQuery = ''"
          >
            ✕ ล้างตัวกรอง
          </span>
        </div>

        <!-- TABULAR VIEW: STAFF (No Status Color Column) -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden print:border print:border-slate-400 print:rounded-none print:shadow-none">
          <div class="overflow-x-auto print:overflow-visible">
            <table class="w-full text-left text-xs sm:text-sm border-collapse print:text-[11px]">
              <thead class="bg-slate-50/90 text-slate-600 text-[11px] uppercase tracking-wider border-b border-slate-200 print:bg-slate-100 print:text-black print:border-b-2 print:border-slate-400">
                <tr>
                  <th class="py-3.5 px-3 text-center w-12 font-bold">#</th>
                  <th
                    @click="toggleStaffSort('name')"
                    class="py-3.5 px-3.5 font-bold cursor-pointer hover:text-indigo-600 transition-colors print:cursor-default"
                  >
                    <div class="flex items-center space-x-1">
                      <span>ชื่อผู้ปฏิบัติงาน</span>
                      <span class="text-[10px] text-slate-400 print:hidden">
                        {{ staffSortBy === 'name_asc' ? '▲' : '⇅' }}
                      </span>
                    </div>
                  </th>
                  <th
                    @click="toggleStaffSort('building')"
                    class="py-3.5 px-3.5 font-bold cursor-pointer hover:text-indigo-600 transition-colors print:cursor-default"
                  >
                    <div class="flex items-center space-x-1">
                      <span>อาคารที่สังกัด/รับผิดชอบ</span>
                      <span class="text-[10px] text-slate-400 print:hidden">
                        {{ staffSortBy === 'building_asc' ? '▲' : '⇅' }}
                      </span>
                    </div>
                  </th>
                  <th class="py-3.5 px-3.5 font-bold">คณะกรรมการที่ประเมิน</th>
                  <th
                    @click="toggleStaffSort('score')"
                    class="py-3.5 px-3.5 text-center font-bold cursor-pointer hover:text-indigo-600 transition-colors w-36 print:cursor-default"
                  >
                    <div class="flex items-center justify-center space-x-1">
                      <span>คะแนนเฉลี่ย (0-5.00)</span>
                      <span class="text-[10px] text-slate-400 print:hidden">
                        {{ staffSortBy === 'score_desc' ? '▼' : (staffSortBy === 'score_asc' ? '▲' : '⇅') }}
                      </span>
                    </div>
                  </th>
                  <th class="py-3.5 px-3.5 font-bold">จุดที่ต้องปรับปรุงเร่งด่วน</th>
                  <th class="py-3.5 px-3 text-center w-24 font-bold print:hidden">บันทึกรายคน</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 print:divide-slate-300">
                <tr v-if="filteredStaffAverages.length === 0">
                  <td colspan="7" class="py-10 text-center text-slate-400">
                    ไม่พบข้อมูลผู้ปฏิบัติงานตามเงื่อนไขที่เลือก
                  </td>
                </tr>
                <template v-for="(s, idx) in filteredStaffAverages" :key="s.staffKey">
                  <tr class="hover:bg-slate-50/80 transition-colors group print:break-inside-avoid">
                    <!-- Rank / # -->
                    <td class="py-3 px-3 text-center">
                      <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs print:bg-transparent print:font-semibold">
                        {{ idx + 1 }}
                      </span>
                    </td>

                    <!-- Staff Name -->
                    <td class="py-3 px-3.5 font-bold text-slate-900">
                      <div class="flex items-center space-x-2">
                        <span
                          class="w-2.5 h-2.5 rounded-full flex-shrink-0 print:hidden"
                          :class="getDotColorClass(s.gradeColor || s.grade)"
                        ></span>
                        <span>{{ s.staffName }}</span>
                      </div>
                    </td>

                    <!-- Building -->
                    <td class="py-3 px-3.5 text-slate-700 font-medium">
                      <span>{{ s.buildingName }}</span>
                    </td>

                    <!-- Committee Auditors -->
                    <td class="py-3 px-3.5 text-slate-600">
                      <div class="space-y-0.5">
                        <div class="text-[11px] font-semibold text-slate-700">
                          กรรมการ {{ s.committeeCount }} ท่าน
                        </div>
                        <div class="flex flex-wrap gap-1 text-[11px] text-slate-500 print:text-slate-700">
                          <span v-for="aud in s.auditors" :key="aud" class="bg-slate-100 px-1.5 py-0.2 rounded text-slate-700 print:bg-transparent print:p-0">
                            {{ aud }}
                          </span>
                        </div>
                      </div>
                    </td>

                    <!-- Score (0-5.00) -->
                    <td class="py-3 px-3.5 text-center font-bold">
                      <div class="inline-flex items-baseline space-x-1">
                        <span
                          class="text-base sm:text-lg font-black"
                          :class="getScoreTextClass(s.gradeColor || s.grade)"
                        >
                          {{ s.scoreFormatted || (s.score ? s.score.toFixed(2) : '0.00') }}
                        </span>
                        <span class="text-[10px] text-slate-400 font-normal">/ 5.00</span>
                      </div>
                    </td>

                    <!-- Urgent Defect Notes -->
                    <td class="py-3 px-3.5 text-xs">
                      <span v-if="s.urgentNotes" class="text-rose-700 bg-rose-50 border border-rose-200/80 rounded-lg px-2 py-1 inline-block line-clamp-2 print:bg-transparent print:border-none print:p-0 print:text-rose-900">
                        ⚠️ {{ s.urgentNotes }}
                      </span>
                      <span v-else class="text-slate-400">-</span>
                    </td>

                    <!-- Drilldown Toggle (Screen only) -->
                    <td class="py-3 px-3 text-center print:hidden">
                      <button
                        type="button"
                        @click="toggleStaffDrilldown(s.staffKey)"
                        class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border"
                        :class="expandedStaffKeys[s.staffKey] ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-indigo-600 hover:bg-indigo-50 border-slate-200'"
                        title="ดูผลคะแนนรายกรรมการ"
                      >
                        {{ expandedStaffKeys[s.staffKey] ? 'ซ่อน' : 'ดูรายคน' }}
                      </button>
                    </td>
                  </tr>

                  <!-- Expanded Drilldown Row (Screen only) -->
                  <tr v-if="expandedStaffKeys[s.staffKey]" class="bg-indigo-50/40 border-y border-indigo-100/70 print:hidden">
                    <td colspan="7" class="p-3 pl-12">
                      <div class="space-y-1 text-xs">
                        <div class="font-bold text-indigo-950 pb-1 flex items-center space-x-1.5">
                          <span>📋 บันทึกการประเมินแยกรายกรรมการ ({{ s.evaluations.length }} ท่าน):</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          <div
                            v-for="ev in s.evaluations"
                            :key="ev.id"
                            class="bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between"
                          >
                            <span class="font-medium text-slate-800">{{ ev.assessorName }}</span>
                            <span class="font-bold text-slate-900 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                              {{ ev.score }} / 5.00 คะแนน
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- REPORT 3: Cross-Round Trend & Change Comparison               -->
      <!-- ============================================================== -->
      <section v-else-if="activeReportTab === 3" class="space-y-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 print:border print:border-slate-400 print:rounded-none print:shadow-none">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
            <div>
              <h3 class="text-sm font-bold text-slate-900">การเปรียบเทียบพัฒนาการข้ามรอบประเมิน</h3>
              <p class="text-xs text-slate-500">เปรียบเทียบผลคะแนนเฉลี่ยระหว่างรอบปัจจุบัน (2570) กับรอบก่อนหน้า (2568)</p>
            </div>
          </div>

          <div class="overflow-x-auto print:overflow-visible">
            <table class="w-full text-left text-xs sm:text-sm border-collapse print:text-[11px]">
              <thead class="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-100 print:bg-slate-100 print:text-black print:border-b-2 print:border-slate-400">
                <tr>
                  <th class="py-3 px-3">ชื่ออาคาร</th>
                  <th class="py-3 px-3 text-center">รอบก่อนหน้า (2568)</th>
                  <th class="py-3 px-3 text-center">รอบปัจจุบัน (2570)</th>
                  <th class="py-3 px-3 text-center">ส่วนต่าง (+/-)</th>
                  <th class="py-3 px-3 text-center">ทิศทางพัฒนาการ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 print:divide-slate-300">
                <tr v-for="t in trendComparison" :key="t.buildingId" class="hover:bg-slate-50/50 print:break-inside-avoid">
                  <td class="py-3 px-3 font-medium text-slate-900">{{ t.buildingName }}</td>
                  <td class="py-3 px-3 text-center text-slate-600">
                    {{ t.previousRoundPercentage !== null ? ((t.previousRoundPercentage / 20).toFixed(2) + ' / 5.00') : '-' }}
                  </td>
                  <td class="py-3 px-3 text-center font-bold text-slate-900">
                    {{ (t.currentRoundPercentage / 20).toFixed(2) }} / 5.00
                  </td>
                  <td class="py-3 px-3 text-center font-bold">
                    <span v-if="t.diff !== null" :class="t.diff >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                      {{ t.diff >= 0 ? '+' : '' }}{{ (t.diff / 20).toFixed(2) }}
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

      <!-- ============================================================== -->
      <!-- REPORT 4: Category Defect & Risk Hotspots                     -->
      <!-- ============================================================== -->
      <section v-else-if="activeReportTab === 4" class="space-y-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 print:border print:border-slate-400 print:rounded-none print:shadow-none">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
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
                    คะแนนเฉลี่ยหมวด: <span class="font-bold text-slate-800">{{ cat.avgScoreOutOf5.toFixed(2) }} / 5.00</span>
                    • พบข้อบกพร่องสะสม: <span class="font-semibold text-rose-600">{{ cat.defectCount }} ครั้ง</span>
                  </p>
                </div>

                <div class="text-right">
                  <span
                    class="text-base font-bold"
                    :class="cat.avgScoreOutOf5 >= 4.0 ? 'text-emerald-600' : (cat.avgScoreOutOf5 >= 2.0 ? 'text-amber-600' : 'text-rose-600')"
                  >
                    {{ cat.avgScoreOutOf5.toFixed(2) }} / 5.00
                  </span>
                </div>
              </div>

              <!-- Progress bar in 0-5 scale -->
              <div class="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden print:hidden">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :class="cat.avgScoreOutOf5 >= 4.0 ? 'bg-emerald-500' : (cat.avgScoreOutOf5 >= 2.0 ? 'bg-amber-500' : 'bg-rose-500')"
                  :style="{ width: `${(cat.avgScoreOutOf5 / 5) * 100}%` }"
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
import { ref, reactive, computed, onMounted } from 'vue'

const activeReportTab = ref(1)
const selectedRoundId = ref('round-2570')
const availableRounds = ref<any[]>([])
const buildingAverages = ref<any[]>([])
const staffAverages = ref<any[]>([])
const trendComparison = ref<any[]>([])
const categoryStats = ref<any[]>([])

// Color criteria loaded from backend
const activeColorCriteria = reactive({
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

const currentRoundName = computed(() => {
  const r = availableRounds.value.find(item => item.id === selectedRoundId.value)
  return r?.name || selectedRoundId.value
})

const printDateStr = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

function printReport() {
  if (process.client) {
    window.print()
  }
}

// ==========================================
// CONTROLS FOR TAB 1: BUILDING TABULAR REPORT
// ==========================================
const buildingSortBy = ref<'score_desc' | 'score_asc' | 'name_asc'>('score_desc')
const buildingSearchQuery = ref('')

function toggleBuildingSort(column: 'score' | 'name') {
  if (column === 'score') {
    buildingSortBy.value = buildingSortBy.value === 'score_desc' ? 'score_asc' : 'score_desc'
  } else if (column === 'name') {
    buildingSortBy.value = buildingSortBy.value === 'name_asc' ? 'score_desc' : 'name_asc'
  }
}

const sortedBuildingAverages = computed(() => {
  let list = [...buildingAverages.value]

  if (buildingSearchQuery.value.trim()) {
    const q = buildingSearchQuery.value.trim().toLowerCase()
    list = list.filter(b =>
      (b.buildingName && b.buildingName.toLowerCase().includes(q)) ||
      (b.responsibleStaff && b.responsibleStaff.toLowerCase().includes(q))
    )
  }

  if (buildingSortBy.value === 'score_desc') {
    list.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  } else if (buildingSortBy.value === 'score_asc') {
    list.sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
  } else if (buildingSortBy.value === 'name_asc') {
    list.sort((a, b) => (a.buildingName || '').localeCompare(b.buildingName || '', 'th'))
  }

  return list
})

// ==========================================
// CONTROLS FOR TAB 2: STAFF TABULAR REPORT
// ==========================================
const staffSortBy = ref<'score_desc' | 'score_asc' | 'building_asc' | 'name_asc'>('score_desc')
const staffBuildingFilter = ref('')
const staffSearchQuery = ref('')
const expandedStaffKeys = ref<Record<string, boolean>>({})

function toggleStaffSort(column: 'score' | 'name' | 'building') {
  if (column === 'score') {
    staffSortBy.value = staffSortBy.value === 'score_desc' ? 'score_asc' : 'score_desc'
  } else if (column === 'name') {
    staffSortBy.value = staffSortBy.value === 'name_asc' ? 'score_desc' : 'name_asc'
  } else if (column === 'building') {
    staffSortBy.value = staffSortBy.value === 'building_asc' ? 'score_desc' : 'building_asc'
  }
}

function toggleStaffDrilldown(key: string) {
  expandedStaffKeys.value[key] = !expandedStaffKeys.value[key]
}

const uniqueBuildings = computed(() => {
  const map: Record<string, string> = {}
  for (const s of staffAverages.value) {
    if (s.buildingId) {
      map[s.buildingId] = s.buildingName || s.buildingId
    }
  }
  return Object.entries(map).map(([id, name]) => ({ id, name }))
})

const filteredStaffAverages = computed(() => {
  let list = [...staffAverages.value]

  // Filter by building
  if (staffBuildingFilter.value) {
    list = list.filter(s => s.buildingId === staffBuildingFilter.value)
  }

  // Filter by search query
  if (staffSearchQuery.value.trim()) {
    const q = staffSearchQuery.value.trim().toLowerCase()
    list = list.filter(s =>
      (s.staffName && s.staffName.toLowerCase().includes(q)) ||
      (s.buildingName && s.buildingName.toLowerCase().includes(q))
    )
  }

  // Sort
  if (staffSortBy.value === 'score_desc') {
    list.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  } else if (staffSortBy.value === 'score_asc') {
    list.sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
  } else if (staffSortBy.value === 'building_asc') {
    list.sort((a, b) => (a.buildingName || '').localeCompare(b.buildingName || '', 'th'))
  } else if (staffSortBy.value === 'name_asc') {
    list.sort((a, b) => (a.staffName || '').localeCompare(b.staffName || '', 'th'))
  }

  return list
})

// ==========================================
// EXCEL EXPORT FUNCTIONS (.xlsx)
// ==========================================
function exportBuildingExcel() {
  if (process.client) {
    window.location.href = `/api/reports/export-excel?type=building&roundId=${selectedRoundId.value}`
  }
}

function exportStaffExcel() {
  if (process.client) {
    window.location.href = `/api/reports/export-excel?type=staff&roundId=${selectedRoundId.value}`
  }
}

// ==========================================
// DATA LOADING
// ==========================================
async function loadReportData() {
  try {
    const res: any = await $fetch(`/api/reports/summary?roundId=${selectedRoundId.value}`)
    if (res?.ok) {
      availableRounds.value = res.availableRounds || []
      buildingAverages.value = res.buildingAverages || []
      staffAverages.value = res.staffAverages || []
      trendComparison.value = res.trendComparison || []
      categoryStats.value = res.categoryStats || []
      if (res.colorCriteria) {
        if (res.colorCriteria.building) Object.assign(activeColorCriteria.building, res.colorCriteria.building)
        if (res.colorCriteria.staff) Object.assign(activeColorCriteria.staff, res.colorCriteria.staff)
      }
    }
  } catch (err) {
    console.error('Failed to load report data', err)
  }
}

onMounted(() => {
  loadReportData()
})

function getDotColorClass(colorOrGrade: string) {
  if (colorOrGrade === 'emerald' || colorOrGrade === 'green' || colorOrGrade === 'EXCELLENT' || colorOrGrade === 'GREEN') {
    return 'bg-emerald-500 ring-2 ring-emerald-200'
  }
  if (colorOrGrade === 'amber' || colorOrGrade === 'orange' || colorOrGrade === 'FAIR' || colorOrGrade === 'IMPROVEMENT' || colorOrGrade === 'YELLOW') {
    return 'bg-amber-500 ring-2 ring-amber-200'
  }
  return 'bg-rose-500 ring-2 ring-rose-200'
}

function getScoreTextClass(colorOrGrade: string) {
  if (colorOrGrade === 'emerald' || colorOrGrade === 'green' || colorOrGrade === 'EXCELLENT' || colorOrGrade === 'GREEN') {
    return 'text-emerald-700'
  }
  if (colorOrGrade === 'amber' || colorOrGrade === 'orange' || colorOrGrade === 'FAIR' || colorOrGrade === 'IMPROVEMENT' || colorOrGrade === 'YELLOW') {
    return 'text-amber-700'
  }
  return 'text-rose-700'
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

@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }
  body {
    background-color: white !important;
    color: black !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 11px !important;
  }
  th, td {
    border: 1px solid #94a3b8 !important;
    padding: 6px 8px !important;
  }
  th {
    background-color: #f1f5f9 !important;
    color: #0f172a !important;
    font-weight: 700 !important;
  }
  .print\:hidden {
    display: none !important;
  }
}
</style>
