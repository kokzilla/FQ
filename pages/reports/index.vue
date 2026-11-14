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

        <!-- ซ่อนไว้ก่อนตามคำขอ
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
        -->
      </div>

      <!-- ============================================================== -->
      <!-- REPORT 1: Building Average Score Summary (TABULAR VIEW)       -->
      <!-- ============================================================== -->
      <section v-if="activeReportTab === 1" class="space-y-4">
        <!-- Criteria Legend & Controls Card -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3 print:hidden">
          <!-- Active Color Criteria Trigger for Building -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <button
              type="button"
              @click="openColorCriteriaModal('building')"
              class="inline-flex items-center space-x-1.5 text-slate-700 hover:text-indigo-600 transition-colors font-semibold group cursor-pointer"
              title="คลิกเพื่อดูรายละเอียดระดับเกณฑ์สี"
            >
              <span>🎨 ระดับเกณฑ์สี</span>
              <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 font-bold text-[11px] border border-slate-200">
                ℹ
              </span>
            </button>
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

            <div class="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2">
              <!-- Sorting dropdown -->
              <div class="flex items-center space-x-1.5">
                <label class="text-xs text-slate-500 whitespace-nowrap font-medium">เรียงลำดับ:</label>
                <select
                  v-model="buildingSortBy"
                  class="text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                >
                  <option value="score_desc">คะแนนสูงสุด → ต่ำสุด</option>
                  <option value="score_asc">คะแนนต่ำสุด → สูงสุด</option>
                  <option value="name_asc">ชื่ออาคาร (ก-ฮ)</option>
                </select>
              </div>

              <!-- Action buttons group -->
              <div class="flex items-center space-x-1.5">
                <!-- Print button for this table -->
                <button
                  type="button"
                  @click="printReport"
                  class="px-2.5 sm:px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center space-x-1 flex-shrink-0 cursor-pointer whitespace-nowrap"
                  title="พิมพ์รายงานนี้ออกทางเครื่องพิมพ์"
                >
                  <span>🖨️ พิมพ์</span>
                </button>

                <!-- Export Excel Button for this table -->
                <button
                  type="button"
                  @click="exportBuildingExcel"
                  class="px-2.5 sm:px-3 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl transition-all shadow-xs flex items-center space-x-1 flex-shrink-0 cursor-pointer whitespace-nowrap"
                  title="ส่งออกตารางสรุปรายอาคารเป็นไฟล์ Excel"
                >
                  <span>📊 <span class="hidden sm:inline">ดาวน์โหลด </span>Excel</span>
                </button>
              </div>
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

                  <!-- Responsible Staff Button (Click to view popup) -->
                  <td class="py-3 px-3.5 text-slate-700">
                    <button
                      v-if="getStaffCount(b) > 0"
                      type="button"
                      @click="openStaffModal(b.buildingName, getStaffList(b))"
                      class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium text-xs transition-colors border border-slate-200/80 cursor-pointer"
                      title="คลิกเพื่อดูรายชื่อผู้รับผิดชอบประจำอาคาร"
                    >
                      <span>🧹 {{ getStaffCount(b) }} ท่าน</span>
                    </button>
                    <span v-else class="text-xs text-slate-400 italic">ไม่ระบุ</span>
                  </td>

                  <!-- Committee Auditors -->
                  <td class="py-3 px-3.5 text-slate-600">
                    <button
                      type="button"
                      @click="openAuditorsModal(b.buildingName, b.auditorDetails || b.auditors, b.committeeMatrix)"
                      class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-medium text-xs transition-colors border cursor-pointer"
                      :class="isBuildingAuditedFully(b)
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800'
                        : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:text-amber-900'"
                      :title="isBuildingAuditedFully(b)
                        ? 'คณะกรรมการประเมินครบ 5 ท่านขึ้นไปทุกคนแล้ว (คลิกเพื่อดูรายชื่อ)'
                        : 'คณะกรรมการยังประเมินไม่ครบ 5 ท่าน (คลิกเพื่อดูรายชื่อ)'"
                    >
                      <span>👤 {{ b.committeeCount }} ท่าน</span>
                    </button>
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
          <!-- Active Color Criteria Trigger for Staff -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <button
              type="button"
              @click="openColorCriteriaModal('staff')"
              class="inline-flex items-center space-x-1.5 text-slate-700 hover:text-indigo-600 transition-colors font-semibold group cursor-pointer"
              title="คลิกเพื่อดูรายละเอียดระดับเกณฑ์สี"
            >
              <span>🎨 ระดับเกณฑ์สี</span>
              <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 font-bold text-[11px] border border-slate-200">
                ℹ
              </span>
            </button>
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

            <div class="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2">
              <!-- Building Filter Combobox (Searchable) -->
              <div class="relative flex items-center space-x-1.5" ref="staffBuildingDropdownRef">
                <label class="text-xs text-slate-500 whitespace-nowrap font-medium">กรองอาคาร:</label>
                <div class="relative min-w-[140px] sm:min-w-[180px]">
                  <input
                    type="text"
                    v-model="staffBuildingSearchQuery"
                    @focus="isStaffBuildingDropdownOpen = true"
                    @input="isStaffBuildingDropdownOpen = true"
                    placeholder="ทุกอาคาร..."
                    class="w-full text-xs sm:text-sm pl-2.5 pr-7 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                  />
                  <!-- Clear / Dropdown icon -->
                  <div class="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                    <button
                      v-if="staffBuildingFilter"
                      type="button"
                      @click="clearStaffBuildingSelection"
                      class="text-slate-400 hover:text-slate-600 text-xs p-0.5 rounded-full hover:bg-slate-100"
                      title="ล้างตัวกรองอาคาร"
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      @click="isStaffBuildingDropdownOpen = !isStaffBuildingDropdownOpen"
                      class="text-slate-400 hover:text-slate-600 focus:outline-none transition-transform duration-200"
                      :class="isStaffBuildingDropdownOpen ? 'rotate-180' : ''"
                      tabindex="-1"
                    >
                      <span class="text-[9px]">▼</span>
                    </button>
                  </div>

                  <!-- Dropdown Menu -->
                  <div
                    v-if="isStaffBuildingDropdownOpen"
                    class="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl py-1 text-xs divide-y divide-slate-100"
                  >
                    <!-- All Buildings Option -->
                    <div
                      @click="selectStaffBuilding(null)"
                      class="px-3 py-2 hover:bg-indigo-50 cursor-pointer flex items-center justify-between transition-colors"
                      :class="!staffBuildingFilter ? 'bg-indigo-50/80 text-indigo-700 font-semibold' : 'text-slate-700'"
                    >
                      <span>ทุกอาคาร ({{ uniqueBuildings.length }} แห่ง)</span>
                      <span v-if="!staffBuildingFilter" class="text-indigo-600 text-[10px]">✓</span>
                    </div>

                    <!-- Individual Buildings -->
                    <div
                      v-for="b in filteredStaffBuildings"
                      :key="b.id"
                      @click="selectStaffBuilding(b)"
                      class="px-3 py-2 hover:bg-indigo-50 cursor-pointer flex items-center justify-between transition-colors"
                      :class="staffBuildingFilter === b.id ? 'bg-indigo-50/80 text-indigo-700 font-semibold' : 'text-slate-700'"
                    >
                      <span class="line-clamp-1">{{ b.name }}</span>
                      <span v-if="staffBuildingFilter === b.id" class="text-indigo-600 text-[10px]">✓</span>
                    </div>

                    <div v-if="filteredStaffBuildings.length === 0" class="px-3 py-2.5 text-center text-[11px] text-slate-400">
                      ไม่พบอาคารที่ตรงกับ "{{ staffBuildingSearchQuery }}"
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sort Option -->
              <div class="flex items-center space-x-1.5">
                <label class="text-xs text-slate-500 whitespace-nowrap font-medium">เรียงลำดับ:</label>
                <select
                  v-model="staffSortBy"
                  class="text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                >
                  <option value="score_desc">คะแนนสูงสุด → ต่ำสุด</option>
                  <option value="score_asc">คะแนนต่ำสุด → สูงสุด</option>
                  <option value="building_asc">เรียงตามอาคาร (ก-ฮ)</option>
                  <option value="name_asc">เรียงตามชื่อผู้ปฏิบัติงาน</option>
                </select>
              </div>

              <!-- Action buttons group -->
              <div class="flex items-center space-x-1.5">
                <!-- Print button for this table -->
                <button
                  type="button"
                  @click="printReport"
                  class="px-2.5 sm:px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center space-x-1 flex-shrink-0 cursor-pointer whitespace-nowrap"
                  title="พิมพ์รายงานนี้ออกทางเครื่องพิมพ์"
                >
                  <span>🖨️ พิมพ์</span>
                </button>

                <!-- Export Excel Button for this table -->
                <button
                  type="button"
                  @click="exportStaffExcel"
                  class="px-2.5 sm:px-3 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl transition-all shadow-xs flex items-center space-x-1 flex-shrink-0 cursor-pointer whitespace-nowrap"
                  title="ส่งออกตารางสรุปรายบุคคลเป็นไฟล์ Excel"
                >
                  <span>📊 <span class="hidden sm:inline">ดาวน์โหลด </span>Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Result count -->
        <div class="flex items-center justify-between text-xs text-slate-500 px-1 print:hidden">
          <span>พบผู้ปฏิบัติงานทั้งหมด <strong>{{ filteredStaffAverages.length }}</strong> ท่าน</span>
          <span
            v-if="staffBuildingFilter || staffSearchQuery"
            class="text-indigo-600 cursor-pointer hover:underline font-medium"
            @click="clearAllStaffFilters"
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
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 print:divide-slate-300">
                <tr v-if="filteredStaffAverages.length === 0">
                  <td colspan="6" class="py-10 text-center text-slate-400">
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
                      <button
                        type="button"
                        @click="openAuditorsModal(s.staffName + (s.buildingName ? ' (' + s.buildingName + ')' : ''), s.auditors, s.committeeMatrix)"
                        class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-medium text-xs transition-colors border cursor-pointer"
                        :class="(s.committeeCount || 0) >= 5
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:text-amber-900'"
                        :title="(s.committeeCount || 0) >= 5
                          ? 'ได้รับการประเมินครบ 5 ท่านขึ้นไปแล้ว (คลิกเพื่อดูรายชื่อ)'
                          : 'ยังได้รับการประเมินไม่ครบ 5 ท่าน (คลิกเพื่อดูรายชื่อ)'"
                      >
                        <span>👤 {{ s.committeeCount }} ท่าน</span>
                      </button>
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

      <!-- Modal: Color Criteria Popup -->
      <div v-if="showColorCriteriaModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-2">
              <span class="text-xl">🎨</span>
              <h3 class="text-base font-bold text-slate-900">
                ระดับเกณฑ์สี ({{ colorCriteriaModalType === 'building' ? 'เกณฑ์สำหรับอาคาร' : 'เกณฑ์สำหรับบุคลากร' }})
              </h3>
            </div>
            <button
              type="button"
              @click="showColorCriteriaModal = false"
              class="text-slate-400 hover:text-slate-600 text-sm p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>

          <div class="space-y-3 text-xs sm:text-sm">
            <!-- Green -->
            <div class="flex items-start space-x-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
              <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 mt-0.5 flex-shrink-0"></span>
              <div class="space-y-0.5 flex-1">
                <div class="font-bold flex items-center justify-between">
                  <span>{{ currentColorCriteria.greenLabel }} (เขียว)</span>
                  <span class="font-mono text-emerald-800">≥ {{ currentColorCriteria.greenMin }}</span>
                </div>
                <p class="text-[11px] text-emerald-700">ผลการประเมินอยู่ในระดับดีเยี่ยม ผ่านเกณฑ์มาตรฐานสูงสุด</p>
              </div>
            </div>

            <!-- Yellow -->
            <div class="flex items-start space-x-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
              <span class="w-3.5 h-3.5 rounded-full bg-amber-500 mt-0.5 flex-shrink-0"></span>
              <div class="space-y-0.5 flex-1">
                <div class="font-bold flex items-center justify-between">
                  <span>{{ currentColorCriteria.yellowLabel }} (เหลือง)</span>
                  <span class="font-mono text-amber-800">{{ currentColorCriteria.yellowMin }} - &lt; {{ currentColorCriteria.greenMin }}</span>
                </div>
                <p class="text-[11px] text-amber-700">ผลการประเมินอยู่ในระดับปานกลาง ควรปรับปรุงในบางจุด</p>
              </div>
            </div>

            <!-- Red -->
            <div class="flex items-start space-x-3 p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950">
              <span class="w-3.5 h-3.5 rounded-full bg-rose-500 mt-0.5 flex-shrink-0"></span>
              <div class="space-y-0.5 flex-1">
                <div class="font-bold flex items-center justify-between">
                  <span>{{ currentColorCriteria.redLabel }} (แดง)</span>
                  <span class="font-mono text-rose-800">&lt; {{ currentColorCriteria.yellowMin }}</span>
                </div>
                <p class="text-[11px] text-rose-700">ผลการประเมินต้องปรับปรุงเร่งด่วน มีข้อบกพร่องที่ต้องแก้ไขทันที</p>
              </div>
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button
              type="button"
              @click="showColorCriteriaModal = false"
              class="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>

      <!-- Modal: Committee Auditors Popup -->
      <div v-if="showAuditorsModal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-5xl xl:max-w-6xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 my-auto">
          <!-- Modal Header -->
          <div class="flex items-start justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-3">
              <span class="text-2xl p-2 rounded-2xl bg-indigo-50 text-indigo-600">👥</span>
              <div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900">คณะกรรมการที่ตรวจ</h3>
                <div class="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                  <span class="font-semibold text-indigo-700">{{ selectedAuditorsTargetName }}</span>
                  <span v-if="selectedCommitteeMatrix?.columns?.length" class="text-slate-300">•</span>
                  <span v-if="selectedCommitteeMatrix?.columns?.length" class="text-slate-600">
                    ผู้รับผิดชอบ {{ selectedCommitteeMatrix.columns.length }} ท่าน
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              @click="showAuditorsModal = false"
              class="text-slate-400 hover:text-slate-700 text-base p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Table View if Committee Matrix is available -->
          <div v-if="selectedCommitteeMatrix && selectedCommitteeMatrix.columns && selectedCommitteeMatrix.columns.length > 0" class="space-y-2">
            <div class="text-xs text-slate-500 flex items-center justify-between px-1">
              <span>ตารางแสดงรายชื่อคณะกรรมการแยกตามผู้รับผิดชอบประจำอาคาร:</span>
              <span class="text-[11px] text-slate-400">💡 เรียงลำดับตามตำแหน่งในคณะกรรมการ</span>
            </div>

            <div class="overflow-x-auto max-h-[65vh] overflow-y-auto rounded-2xl border border-slate-200 shadow-inner bg-slate-50/30">
              <table class="w-full text-left border-collapse min-w-full">
                <thead>
                  <tr class="bg-slate-100/95 sticky top-0 z-10 shadow-sm backdrop-blur-sm">
                    <th class="py-3 px-3.5 text-center text-xs font-bold text-slate-600 border-b border-r border-slate-200 w-14">
                      ลำดับ
                    </th>
                    <th
                      v-for="(col, colIdx) in selectedCommitteeMatrix.columns"
                      :key="colIdx"
                      class="py-3 px-4 text-xs sm:text-sm font-bold border-b border-r border-slate-200 last:border-r-0 min-w-[200px] max-w-[280px] bg-slate-100/95"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          🧹 ผู้รับผิดชอบ #{{ colIdx + 1 }}
                        </span>
                        <span class="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          ตรวจแล้ว {{ col.auditorCount }} ท่าน
                        </span>
                      </div>
                      <div class="text-slate-900 font-bold truncate text-base" :title="col.staffName">
                        {{ formatStaffFirstName(col.staffName) }}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <!-- Empty state when no auditors evaluated yet -->
                  <tr v-if="selectedCommitteeMatrix.maxRows === 0">
                    <td :colspan="selectedCommitteeMatrix.columns.length + 1" class="py-8 text-center text-slate-400 text-xs italic">
                      ยังไม่มีข้อมูลการตรวจประเมินสำหรับอาคารนี้
                    </td>
                  </tr>

                  <!-- Rows of Auditors -->
                  <tr
                    v-else
                    v-for="rowIdx in selectedCommitteeMatrix.maxRows"
                    :key="rowIdx"
                    class="hover:bg-slate-50/80 transition-colors"
                  >
                    <!-- Row number -->
                    <td class="py-3 px-3 text-center text-xs font-bold text-slate-400 border-r border-slate-100 bg-slate-50/40">
                      {{ rowIdx }}
                    </td>

                    <!-- Cells for each staff column -->
                    <td
                      v-for="(col, cIdx) in selectedCommitteeMatrix.columns"
                      :key="cIdx"
                      class="py-2.5 px-3.5 text-xs sm:text-sm border-r border-slate-100 last:border-r-0 align-top"
                    >
                      <!-- When auditor exists for this row: แสดงเฉพาะ คำนำหน้าและชื่อเท่านั้น (ลบป้ายสถานะ) -->
                      <div
                        v-if="col.auditors[rowIdx - 1]"
                        class="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-colors flex items-center space-x-2.5"
                      >
                        <span class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {{ rowIdx }}
                        </span>
                        <div class="font-bold text-slate-800 text-xs sm:text-sm leading-snug truncate" :title="col.auditors[rowIdx - 1].name">
                          {{ formatAssessorTitleAndName(col.auditors[rowIdx - 1].name) }}
                        </div>
                      </div>

                      <!-- Empty slot -->
                      <div v-else class="flex items-center justify-center py-4 text-slate-300 text-xs italic">
                        -
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Fallback: List View if no matrix provided -->
          <div v-else class="space-y-2 py-1 max-h-72 overflow-y-auto">
            <div
              v-for="(auditor, aIdx) in selectedAuditorsList"
              :key="aIdx"
              class="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800"
            >
              <span class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {{ aIdx + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <div class="text-xs sm:text-sm text-slate-900 leading-snug">
                  <span class="font-bold">{{ formatAssessorTitleAndName(getAuditorName(auditor)) }}</span>
                  <span v-if="getAuditorStaff(auditor)" class="text-indigo-700 font-medium ml-1">
                    (ผู้รับผิดชอบที่ประเมิน: {{ formatStaffFirstName(getAuditorStaff(auditor)) }})
                  </span>
                </div>
              </div>
            </div>

            <div v-if="!selectedAuditorsList || selectedAuditorsList.length === 0" class="text-center py-4 text-xs text-slate-400">
              ไม่พบรายชื่อคณะกรรมการ
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="pt-2 flex justify-end border-t border-slate-100">
            <button
              type="button"
              @click="showAuditorsModal = false"
              class="px-5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>

      <!-- Modal: Responsible Staff Popup -->
      <div v-if="showStaffModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-2">
              <span class="text-xl">🧹</span>
              <div>
                <h3 class="text-sm font-bold text-slate-900">ผู้รับผิดชอบประจำอาคาร</h3>
                <p class="text-[11px] text-slate-500 line-clamp-1 max-w-[200px]">{{ selectedStaffTargetName }}</p>
              </div>
            </div>
            <button
              type="button"
              @click="showStaffModal = false"
              class="text-slate-400 hover:text-slate-600 text-sm p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>

          <div class="space-y-2 py-1 max-h-64 overflow-y-auto">
            <div
              v-for="(staff, sIdx) in selectedStaffList"
              :key="sIdx"
              class="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800"
            >
              <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {{ sIdx + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <span class="font-bold text-slate-900">{{ formatStaffFirstName(staff) }}</span>
                <span v-if="staff !== formatStaffFirstName(staff)" class="text-xs text-slate-400 ml-1.5 font-normal">({{ staff }})</span>
              </div>
            </div>

            <div v-if="!selectedStaffList || selectedStaffList.length === 0" class="text-center py-4 text-xs text-slate-400">
              ไม่พบรายชื่อผู้รับผิดชอบ
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button
              type="button"
              @click="showStaffModal = false"
              class="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'

const activeReportTab = ref(1)
const selectedRoundId = ref('round-2570')
const availableRounds = ref<any[]>([])
const buildingAverages = ref<any[]>([])
const staffAverages = ref<any[]>([])
const trendComparison = ref<any[]>([])
const categoryStats = ref<any[]>([])

// Modals State
const showColorCriteriaModal = ref(false)
const colorCriteriaModalType = ref<'building' | 'staff'>('building')

function openColorCriteriaModal(type: 'building' | 'staff') {
  colorCriteriaModalType.value = type
  showColorCriteriaModal.value = true
}

const currentColorCriteria = computed(() => {
  return colorCriteriaModalType.value === 'building'
    ? activeColorCriteria.building
    : activeColorCriteria.staff
})

const showAuditorsModal = ref(false)
const selectedAuditorsTargetName = ref('')
const selectedAuditorsList = ref<any[]>([])
const selectedCommitteeMatrix = ref<any>(null)

function openAuditorsModal(targetName: string, auditors?: any[], matrix?: any) {
  selectedAuditorsTargetName.value = targetName
  selectedAuditorsList.value = auditors || []
  selectedCommitteeMatrix.value = matrix || null
  showAuditorsModal.value = true
}

/**
 * แปลงชื่อผู้ประเมินให้แสดงเฉพาะ "คำนำหน้าและชื่อ" เท่านั้น (ไม่เอานามสกุล)
 * เช่น "รองศาสตราจารย์ ดร. ศิราณี จุโฑปะมา" -> "รองศาสตราจารย์ ดร. ศิราณี"
 */
function formatAssessorTitleAndName(fullName: string): string {
  if (!fullName) return '-'
  const clean = String(fullName).replace(/\(.*?\)/g, '').trim()
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

/**
 * แปลงชื่อผู้รับผิดชอบให้แสดง "แค่ชื่อ" เท่านั้น (ตัดคำนำหน้าและนามสกุลออก)
 * เช่น "นางประยงค์ นันกลาง" -> "ประยงค์"
 */
function formatStaffFirstName(name: string): string {
  if (!name) return '-'
  let str = String(name).replace(/\(.*?\)/g, '').trim()
  if (!str || str === 'ไม่ระบุ' || str === 'ไม่ระบุผู้รับผิดชอบ') return 'ไม่ระบุ'

  const prefixRegex = /^(?:ว่าที่\s*ร้อยตรี|ว่าที่\s*ร\.ต\.|ผศ\.\s*ดร\.|รศ\.\s*ดร\.|ศ\.\s*ดร\.|อาจารย์\s*ดร\.|อาจารย์\s*|ผศ\.|รศ\.|ศ\.|ดร\.|อ\.|นาย|นางสาว|นาง|น\.ส\.|ด\.ช\.|ด\.ญ\.)\s*/i
  let prev = ''
  while (prev !== str) {
    prev = str
    str = str.replace(prefixRegex, '').trim()
  }

  const parts = str.split(/\s+/).filter(Boolean)
  return parts.length > 0 ? parts[0] : (str || '-')
}

/**
 * ตรวจสอบว่าผู้รับผิดชอบอาคารทุกคนถูกประเมินโดยผู้ประเมินครบ 5 คนหรือมากกว่าแล้วหรือไม่
 */
function isBuildingAuditedFully(b: any): boolean {
  if (!b) return false
  const matrix = b.committeeMatrix
  if (matrix && Array.isArray(matrix.columns) && matrix.columns.length > 0) {
    return matrix.columns.every((col: any) => (col.auditorCount || col.auditors?.length || 0) >= 5)
  }
  return (b.committeeCount || 0) >= 5
}

function getPositionBadgeClass(position: string): string {
  if (!position) return 'bg-slate-100 text-slate-700 border-slate-200'
  if (position.includes('ประธานกรรมการ') && !position.includes('รอง')) {
    return 'bg-amber-100 text-amber-900 border-amber-300'
  }
  if (position.includes('รองประธาน')) {
    return 'bg-purple-100 text-purple-900 border-purple-300'
  }
  if (position.includes('เลขานุการ')) {
    return 'bg-sky-100 text-sky-900 border-sky-300'
  }
  return 'bg-indigo-50 text-indigo-700 border-indigo-200'
}

function getAuditorName(auditor: any): string {
  if (!auditor) return '-'
  if (typeof auditor === 'string') {
    const match = auditor.match(/^(.*?)\s*\((?:ผู้รับผิดชอบ(?:ที่ประเมิน)?|ประเมิน):.*?\)$/)
    if (match) return match[1].trim()
    return auditor
  }
  return auditor.name || auditor.assessorName || auditor.displayText || '-'
}

function getAuditorStaff(auditor: any): string {
  if (!auditor) return ''
  if (typeof auditor === 'string') {
    const match = auditor.match(/\((?:ผู้รับผิดชอบ(?:ที่ประเมิน)?|ประเมิน):\s*(.*?)\)/)
    if (match) return match[1].trim()
    return ''
  }
  return auditor.staff || auditor.staffText || ''
}

const showStaffModal = ref(false)
const selectedStaffTargetName = ref('')
const selectedStaffList = ref<string[]>([])

function openStaffModal(targetName: string, staffList: string[]) {
  selectedStaffTargetName.value = targetName
  selectedStaffList.value = staffList || []
  showStaffModal.value = true
}

function getStaffList(b: any): string[] {
  if (Array.isArray(b.responsibleStaffList) && b.responsibleStaffList.length > 0) {
    return b.responsibleStaffList.filter((s: string) => s && s !== 'ไม่ระบุ')
  }
  if (b.responsibleStaff && b.responsibleStaff !== 'ไม่ระบุ') {
    return b.responsibleStaff
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0 && s !== 'ไม่ระบุ')
  }
  return []
}

function getStaffCount(b: any): number {
  if (b.responsibleStaffCount !== undefined) return b.responsibleStaffCount
  return getStaffList(b).length
}

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

// Building Combobox Filter State
const staffBuildingDropdownRef = ref<HTMLElement | null>(null)
const staffBuildingSearchQuery = ref('')
const isStaffBuildingDropdownOpen = ref(false)

const filteredStaffBuildings = computed(() => {
  const query = staffBuildingSearchQuery.value.trim().toLowerCase()
  if (!query) return uniqueBuildings.value
  return uniqueBuildings.value.filter(b => b.name && b.name.toLowerCase().includes(query))
})

function selectStaffBuilding(b: { id: string; name: string } | null) {
  if (b) {
    staffBuildingFilter.value = b.id
    staffBuildingSearchQuery.value = b.name
  } else {
    staffBuildingFilter.value = ''
    staffBuildingSearchQuery.value = ''
  }
  isStaffBuildingDropdownOpen.value = false
}

function clearStaffBuildingSelection() {
  selectStaffBuilding(null)
}

function clearAllStaffFilters() {
  staffBuildingFilter.value = ''
  staffSearchQuery.value = ''
  staffBuildingSearchQuery.value = ''
}

onClickOutside(staffBuildingDropdownRef, () => {
  isStaffBuildingDropdownOpen.value = false
  if (staffBuildingFilter.value) {
    const current = uniqueBuildings.value.find(b => b.id === staffBuildingFilter.value)
    if (current) {
      staffBuildingSearchQuery.value = current.name
    }
  } else {
    staffBuildingSearchQuery.value = ''
  }
})

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
  return Object.entries(map)
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'th', { numeric: true }))
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
