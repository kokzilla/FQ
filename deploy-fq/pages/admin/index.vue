<template>
  <div class="min-h-screen bg-slate-50/70 pb-20">
    <Navbar />

    <main class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <!-- Admin Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-1">
            <span>🛡️ แผงควบคุมผู้ดูแลระบบ (Admin Console)</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">การจัดการระบบและข้อมูลหลัก</h2>
          <p class="text-xs text-slate-500">จัดการรอบประเมิน, ดึงข้อมูล SSO กำหนดกรรมการ/ผู้ดูแลระบบ, จัดการอาคารและแม่บ้าน, และปรับแต่งข้อคำถาม</p>
        </div>
      </div>

      <!-- Admin Navigation Tabs -->
      <div class="flex items-center space-x-1.5 border-b border-slate-200/80 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          @click="adminTab = 'rounds'"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="adminTab === 'rounds' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          🗓️ 1. รอบการประเมิน
        </button>

        <button
          type="button"
          @click="adminTab = 'sso'"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="adminTab === 'sso' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          👥 2. สิทธิ์กรรมการและผู้ดูแลระบบ
        </button>

        <button
          type="button"
          @click="adminTab = 'buildings'"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="adminTab === 'buildings' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          🏢 3. จัดการอาคารและผู้รับผิดชอบ
        </button>

        <button
          type="button"
          @click="adminTab = 'questions'"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="adminTab === 'questions' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          📝 4. จัดการข้อคำถามในหมวด
        </button>

        <button
          type="button"
          @click="adminTab = 'criteria-building'"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="adminTab === 'criteria-building' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          🎨 5. เกณฑ์สีสำหรับอาคาร
        </button>

        <button
          type="button"
          @click="adminTab = 'criteria-staff'"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
          :class="adminTab === 'criteria-staff' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          👤 6. เกณฑ์สีสำหรับบุคลากร
        </button>
      </div>

      <!-- TAB 1: Evaluation Rounds Management -->
      <section v-if="adminTab === 'rounds'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-800">รอบการประเมินทั้งหมด ({{ rounds.length }} รอบ)</h3>
          <button
            type="button"
            @click="showAddRoundModal = true"
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            + สร้างรอบประเมินใหม่
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="r in rounds"
            :key="r.id"
            class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <h4 class="text-base font-semibold text-slate-900">{{ r.name }}</h4>
                <span
                  class="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="r.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'"
                >
                  {{ r.status === 'OPEN' ? '🟢 กำลังเปิดรับการประเมิน' : '⚪ ปิดรอบแล้ว' }}
                </span>
              </div>
              <p class="text-xs text-slate-500">{{ r.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}</p>
              <p class="text-xs text-slate-400">ช่วงเวลา: {{ r.startDate }} ถึง {{ r.endDate }}</p>
            </div>

            <div class="flex items-center space-x-2">
              <button
                type="button"
                @click="openEditRoundModal(r)"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
              >
                ✏️ แก้ไขรอบ
              </button>
              <button
                type="button"
                @click="toggleRoundStatus(r)"
                class="px-3 py-1.5 rounded-xl text-xs font-medium border"
                :class="r.status === 'OPEN' ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'"
              >
                {{ r.status === 'OPEN' ? 'ปิดรอบ' : 'เปิดรอบ' }}
              </button>
              <button
                type="button"
                @click="deleteRound(r.id, r.name)"
                class="px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200/60"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 2: BRU SSO Search, Role Assignment & Appointed Committee -->
      <section v-else-if="adminTab === 'sso'" class="space-y-5">
        <!-- SSO Search Card -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-bold text-slate-900">ค้นหาบุคลากรจาก BRU SSO API</h3>
                <p class="text-xs text-slate-500">พิมพ์ชื่อ-นามสกุล หรือ Username เพื่อค้นหาและแต่งตั้งสิทธิ์เป็นกรรมการ หรือผู้ดูแลระบบ</p>
              </div>
              <div class="flex items-center space-x-2">
                <span v-if="ssoSource" class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                  แหล่งข้อมูล: {{ ssoSource === 'BRU_SSO_API' ? '🌐 Live BRU SSO' : '💾 Mock Local' }}
                </span>
                <button
                  type="button"
                  @click="showAddManualUserModal = true"
                  class="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors whitespace-nowrap"
                >
                  + กำหนดสิทธิ์ด้วยตนเอง
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <input
              v-model="ssoSearchKeyword"
              @keyup.enter="searchSsoUsers"
              type="text"
              placeholder="พิมพ์ชื่อ, สกุล หรือ userlogin..."
              class="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              @click="searchSsoUsers"
              :disabled="isSearchingSso"
              class="px-5 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm disabled:opacity-50"
            >
              <span v-if="isSearchingSso">กำลังค้นหา...</span>
              <span v-else>🔍 ค้นหา</span>
            </button>
          </div>

          <!-- Search Results -->
          <div v-if="ssoResults.length > 0" class="space-y-2 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-semibold text-slate-700">ผลการค้นหาบุคลากร ({{ ssoResults.length }} รายการ):</h4>
              <button
                type="button"
                @click="ssoSearchKeyword = ''; searchSsoUsers()"
                class="text-[11px] text-indigo-600 hover:underline"
              >
                ล้างคำค้นหา
              </button>
            </div>

            <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
              <div
                v-for="u in ssoResults"
                :key="u.userlogin || u.USERLOGIN"
                class="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-50/90 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div class="space-y-0.5">
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold text-slate-900">{{ u.fullName || u.FULL_NAME || u.name }}</span>
                    <span class="text-xs text-indigo-600 font-mono font-medium">({{ u.userlogin || u.USERLOGIN }})</span>
                  </div>
                  <p class="text-[11px] text-slate-500">
                    {{ u.positionName || u.POSITIONNAME || 'บุคลากรมหาวิทยาลัย' }}
                    <span v-if="u.email" class="text-slate-400">• {{ u.email }}</span>
                  </p>
                </div>

                <!-- Role Selection Action Buttons -->
                <div class="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    @click="assignRole(u, 'ADMIN')"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center space-x-1"
                    title="แต่งตั้งเป็นผู้ดูแลระบบ (Admin)"
                  >
                    <span>🛡️</span>
                    <span>ตั้งเป็น Admin</span>
                  </button>
                  <button
                    type="button"
                    @click="assignRole(u, 'AUDITOR')"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center space-x-1"
                    title="แต่งตั้งเป็นคณะกรรมการตรวจประเมิน"
                  >
                    <span>📋</span>
                    <span>ตั้งเป็น กรรมการ</span>
                  </button>
                  <button
                    type="button"
                    @click="assignRole(u, 'HOUSEKEEPER')"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1"
                    title="กำหนดเป็นผู้รับผิดชอบอาคาร"
                  >
                    <span>🏢</span>
                    <span>ผู้รับผิดชอบ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="!isSearchingSso" class="py-6 text-center text-xs text-slate-400">
            ไม่พบข้อมูลบุคลากร หรือยังไม่ได้เริ่มค้นหา
          </div>
        </div>

        <!-- Appointed Committee & Authorized Personnel List -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-sm font-bold text-slate-900">รายชื่อบุคลากรและคณะกรรมการที่มีสิทธิ์ในระบบปัจจุบัน ({{ appointedUsers.length }} ท่าน)</h3>
              <p class="text-xs text-slate-500">สามารถเปลี่ยนสิทธิ์ หรือยกเลิกสิทธิ์การเข้าถึงระบบได้ทันที</p>
            </div>

            <!-- Role Filter Pills -->
            <div class="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                @click="roleFilter = 'ALL'"
                class="px-2.5 py-1 rounded-lg font-medium transition-all"
                :class="roleFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
              >
                ทั้งหมด ({{ appointedUsers.length }})
              </button>
              <button
                type="button"
                @click="roleFilter = 'ADMIN'"
                class="px-2.5 py-1 rounded-lg font-medium transition-all"
                :class="roleFilter === 'ADMIN' ? 'bg-purple-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
              >
                🛡️ Admin ({{ appointedUsers.filter(u => u.role === 'ADMIN').length }})
              </button>
              <button
                type="button"
                @click="roleFilter = 'AUDITOR'"
                class="px-2.5 py-1 rounded-lg font-medium transition-all"
                :class="roleFilter === 'AUDITOR' ? 'bg-indigo-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
              >
                📋 กรรมการ ({{ appointedUsers.filter(u => u.role === 'AUDITOR').length }})
              </button>
            </div>
          </div>

          <!-- Personnel List -->
          <div class="divide-y divide-slate-100">
            <div
              v-for="u in filteredAppointedUsers"
              :key="u.id"
              class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
            >
              <div class="space-y-0.5">
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-bold text-slate-900">{{ u.fullName }}</span>
                  <span class="text-[11px] text-slate-500 font-mono">({{ u.userlogin }})</span>
                  <span
                    class="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                    :class="{
                      'bg-purple-50 text-purple-700 border border-purple-200': u.role === 'ADMIN',
                      'bg-indigo-50 text-indigo-700 border border-indigo-200': u.role === 'AUDITOR',
                      'bg-amber-50 text-amber-700 border border-amber-200': u.role === 'SUPERVISOR',
                      'bg-slate-100 text-slate-600 border border-slate-200': u.role === 'HOUSEKEEPER'
                    }"
                  >
                    {{ formatRoleTitle(u.role) }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-500">
                  {{ u.positionName || 'บุคลากร' }}
                  <span v-if="u.email" class="text-slate-400">• {{ u.email }}</span>
                </p>
              </div>

              <!-- Role Selector & Revoke Button -->
              <div class="flex items-center space-x-2 flex-shrink-0">
                <select
                  :value="u.role"
                  @change="changeUserRole(u, ($event.target as HTMLSelectElement).value)"
                  class="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ADMIN">🛡️ ผู้ดูแลระบบ (ADMIN)</option>
                  <option value="AUDITOR">📋 คณะกรรมการ (AUDITOR)</option>
                  <option value="SUPERVISOR">👁️ หัวหน้างาน (SUPERVISOR)</option>
                  <option value="HOUSEKEEPER">🏢 ผู้รับผิดชอบ (HOUSEKEEPER)</option>
                </select>

                <button
                  type="button"
                  @click="revokeUserRole(u)"
                  class="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <span>✕</span>
                  <span>ยกเลิกสิทธิ์</span>
                </button>
              </div>
            </div>

            <div v-if="filteredAppointedUsers.length === 0" class="py-6 text-center text-xs text-slate-400">
              ไม่มีรายชื่อบุคลากรในหมวดหมู่นี้
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 3: Buildings & Staff Management (HYBRID SSO + OUTSOURCE) -->
      <section v-else-if="adminTab === 'buildings'" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-800">รายชื่ออาคารและผู้รับผิดชอบ ({{ buildings.length }} แห่ง)</h3>
            <p class="text-xs text-slate-500">รองรับทั้งการดึงข้อมูลจาก BRU SSO, เลือกจากประวัติในระบบ และพิมพ์ชื่อแม่บ้าน Outsource เอง</p>
          </div>
          <button
            type="button"
            @click="openAddBuildingModal"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center space-x-1.5 self-start sm:self-auto flex-shrink-0"
          >
            <span>+</span>
            <span>เพิ่มอาคารใหม่</span>
          </button>
        </div>

        <!-- Search Bar for Buildings and Caretakers -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2.5">
          <div class="relative">
            <input
              v-model="buildingSearchQuery"
              type="text"
              placeholder="ค้นหาตามชื่ออาคาร, รหัสอาคาร หรือผู้ดูแลอาคาร/แม่บ้าน..."
              class="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <span class="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
            <button
              v-if="buildingSearchQuery"
              type="button"
              @click="buildingSearchQuery = ''"
              class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              title="ล้างคำค้นหา"
            >
              ✕
            </button>
          </div>

          <!-- Result Count / Filter Indicator -->
          <div class="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              พบอาคาร <strong>{{ filteredBuildings.length }}</strong> จากทั้งหมด <strong>{{ buildings.length }}</strong> แห่ง
              <span v-if="buildingSearchQuery" class="text-indigo-600 font-medium ml-1">
                (กรองตามคำค้นหา "{{ buildingSearchQuery }}")
              </span>
            </span>
            <button
              v-if="buildingSearchQuery"
              type="button"
              @click="buildingSearchQuery = ''"
              class="text-indigo-600 hover:text-indigo-700 hover:underline font-medium cursor-pointer"
            >
              ✕ ล้างการค้นหา
            </button>
          </div>
        </div>

        <!-- Buildings List -->
        <div v-if="filteredBuildings.length > 0" class="grid grid-cols-1 gap-3">
          <div
            v-for="b in filteredBuildings"
            :key="b.id"
            class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="space-y-1.5">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold font-mono">
                  {{ b.code }}
                </span>
                <h4 class="text-base font-semibold text-slate-900">{{ b.name }}</h4>
                <span v-if="b.floors" class="text-xs text-slate-400">({{ b.floors }} ชั้น)</span>
              </div>
              <p v-if="b.description" class="text-xs text-slate-500">{{ b.description }}</p>
              
              <!-- Staff Chips -->
              <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                <span class="font-medium text-slate-500">แม่บ้าน/ผู้รับผิดชอบ:</span>
                <span
                  v-for="s in b.staffs"
                  :key="s.id"
                  class="inline-flex items-center bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium text-xs border border-indigo-100"
                >
                  👤 {{ s.staffName }}
                </span>
                <span v-if="!b.staffs || b.staffs.length === 0" class="text-slate-400 italic text-xs">
                  (ยังไม่ได้ระบุแม่บ้าน)
                </span>
              </div>
            </div>

            <div class="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
              <button
                type="button"
                @click="openEditBuildingModal(b)"
                class="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200"
              >
                ✏️ แก้ไขอาคาร
              </button>
              <button
                type="button"
                @click="deleteBuilding(b.id, b.name)"
                class="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200/60"
              >
                ลบอาคาร
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="py-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div class="text-3xl">🔍</div>
          <p class="text-sm font-semibold text-slate-700">
            {{ buildingSearchQuery ? 'ไม่พบอาคารที่ตรงกับคำค้นหา' : 'ยังไม่มีข้อมูลอาคารในระบบ' }}
          </p>
          <p v-if="buildingSearchQuery" class="text-xs text-slate-400 max-w-sm mx-auto">
            ไม่พบผลลัพธ์ที่ตรงกับ "{{ buildingSearchQuery }}" ลองค้นหาด้วยชื่ออาคาร, รหัสอาคาร หรือชื่อผู้รับผิดชอบ/แม่บ้านคำอื่น
          </p>
          <div v-if="buildingSearchQuery" class="pt-2">
            <button
              type="button"
              @click="buildingSearchQuery = ''"
              class="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200"
            >
              ล้างคำค้นหา
            </button>
          </div>
        </div>
      </section>

      <!-- TAB 4: Dynamic Question Management -->
      <section v-else-if="adminTab === 'questions'" class="space-y-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-sm font-bold text-slate-900">จัดการข้อคำถามในแต่ละหมวด</h3>
              <p class="text-xs text-slate-500">สามารถแก้ไขข้อความคำถาม ย้ายหมวด หรือเพิ่ม/ลบข้อคำถามได้</p>
            </div>

            <!-- Category Selector -->
            <select
              v-model="selectedCategoryForQuestions"
              class="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>

          <!-- Add New Question Box -->
          <div class="flex gap-2">
            <input
              v-model="newQuestionText"
              @keyup.enter="addQuestion"
              type="text"
              placeholder="พิมพ์ข้อความคำถามประเมินใหม่ในหมวดนี้..."
              class="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              @click="addQuestion"
              class="px-4 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm whitespace-nowrap"
            >
              + เพิ่มข้อคำถาม
            </button>
          </div>

          <!-- Question List in Selected Category -->
          <div class="space-y-2 pt-2">
            <div
              v-for="q in filteredQuestions"
              :key="q.id"
              class="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-start justify-between gap-3 hover:bg-white transition-colors"
            >
              <div class="flex items-start space-x-2.5">
                <span class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {{ q.itemNumber }}
                </span>
                <p class="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                  {{ q.title }}
                </p>
              </div>

              <div class="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  type="button"
                  @click="openEditQuestionModal(q)"
                  class="text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors font-medium border border-indigo-100"
                >
                  ✏️ แก้ไข
                </button>
                <button
                  type="button"
                  @click="deleteQuestion(q.id, q.title)"
                  class="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                >
                  ลบ
                </button>
              </div>
            </div>

            <div v-if="filteredQuestions.length === 0" class="py-6 text-center text-xs text-slate-400">
              ไม่มีข้อคำถามในหมวดนี้
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 5: Building Color Criteria -->
      <section v-else-if="adminTab === 'criteria-building'" class="space-y-5">
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div class="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-1">
                <span>🎨 เกณฑ์สีสำหรับอาคาร</span>
              </div>
              <h3 class="text-base font-bold text-slate-900">กำหนดเกณฑ์คะแนนและป้ายกำกับสี (รายอาคาร)</h3>
              <p class="text-xs text-slate-500">ปรับเปลี่ยนช่วงคะแนนประเมินเฉลี่ย (0 - 5.00 คะแนน) และข้อความกำกับสำหรับรายงานสรุปคะแนนของอาคาร</p>
            </div>
            <button
              type="button"
              @click="resetBuildingCriteria"
              class="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors self-start sm:self-auto"
            >
              🔄 คืนค่าเริ่มต้น
            </button>
          </div>

          <form @submit.prevent="saveBuildingCriteria" class="space-y-4">
            <!-- GREEN TIER -->
            <div class="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm"></span>
                  <span class="text-sm font-bold text-emerald-950">ระดับสีเขียว (ผ่านเกณฑ์มาตรฐาน / ดีเยี่ยม)</span>
                </div>
                <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  พรีวิว: {{ buildingCriteria.greenLabel || 'ดีเยี่ยม' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-emerald-900 mb-1">คะแนนขั้นต่ำ (ตั้งแต่คะแนนนี้ขึ้นไป)</label>
                  <div class="relative">
                    <input
                      v-model.number="buildingCriteria.greenMin"
                      type="number"
                      step="0.05"
                      min="0"
                      max="5"
                      required
                      class="w-full text-sm px-3.5 py-2 rounded-xl border border-emerald-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <span class="absolute right-3 top-2 text-xs text-slate-400">/ 5.00</span>
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-emerald-900 mb-1">ป้ายข้อความกำกับสถานะ</label>
                  <input
                    v-model="buildingCriteria.greenLabel"
                    type="text"
                    required
                    placeholder="เช่น ดีเยี่ยม / ผ่านเกณฑ์มาตรฐาน"
                    class="w-full text-sm px-3.5 py-2 rounded-xl border border-emerald-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            <!-- YELLOW TIER -->
            <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm"></span>
                  <span class="text-sm font-bold text-amber-950">ระดับสีเหลือง (เฝ้าระวัง / ปานกลาง)</span>
                </div>
                <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  พรีวิว: {{ buildingCriteria.yellowLabel || 'ปานกลาง' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-amber-900 mb-1">
                    คะแนนขั้นต่ำ (ระหว่าง {{ buildingCriteria.yellowMin }} ถึง &lt; {{ buildingCriteria.greenMin }})
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="buildingCriteria.yellowMin"
                      type="number"
                      step="0.05"
                      min="0"
                      max="5"
                      required
                      class="w-full text-sm px-3.5 py-2 rounded-xl border border-amber-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <span class="absolute right-3 top-2 text-xs text-slate-400">/ 5.00</span>
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-amber-900 mb-1">ป้ายข้อความกำกับสถานะ</label>
                  <input
                    v-model="buildingCriteria.yellowLabel"
                    type="text"
                    required
                    placeholder="เช่น ปานกลาง / เฝ้าระวัง"
                    class="w-full text-sm px-3.5 py-2 rounded-xl border border-amber-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            </div>

            <!-- RED TIER -->
            <div class="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm"></span>
                  <span class="text-sm font-bold text-rose-950">ระดับสีแดง (ต้องปรับปรุงเร่งด่วน)</span>
                </div>
                <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  พรีวิว: {{ buildingCriteria.redLabel || 'ต้องปรับปรุงเร่งด่วน' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-rose-900 mb-1">ช่วงคะแนนที่จัดอยู่ในเกณฑ์นี้</label>
                  <div class="w-full text-sm px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/60 font-semibold text-rose-800">
                    ต่ำกว่า {{ buildingCriteria.yellowMin }} คะแนน
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-rose-900 mb-1">ป้ายข้อความกำกับสถานะ</label>
                  <input
                    v-model="buildingCriteria.redLabel"
                    type="text"
                    required
                    placeholder="เช่น ต้องปรับปรุงเร่งด่วน"
                    class="w-full text-sm px-3.5 py-2 rounded-xl border border-rose-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end pt-2">
              <button
                type="submit"
                :disabled="isSavingCriteria"
                class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <span>💾 บันทึกเกณฑ์สีสำหรับอาคาร</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- TAB 6: Staff Color Criteria -->
      <section v-else-if="adminTab === 'criteria-staff'" class="space-y-5">
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div class="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold mb-1">
                <span>👤 เกณฑ์สีสำหรับบุคลากร</span>
              </div>
              <h3 class="text-base font-bold text-slate-900">กำหนดเกณฑ์คะแนนและป้ายกำกับสี (รายบุคลากร/แม่บ้าน)</h3>
              <p class="text-xs text-slate-500">ปรับเปลี่ยนช่วงคะแนนประเมินเฉลี่ย (0 - 5.00 คะแนน) และข้อความกำกับสำหรับรายงานสรุปรายบุคคลของผู้ปฏิบัติงาน</p>
            </div>
            <button
              type="button"
              @click="resetStaffCriteria"
              class="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors self-start sm:self-auto"
            >
              🔄 คืนค่าเริ่มต้น
            </button>
          </div>

          <form @submit.prevent="saveStaffCriteria" class="space-y-4">
            <!-- GREEN TIER -->
            <div class="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm"></span>
                  <span class="text-sm font-bold text-emerald-950">ระดับสีเขียว (ผลงานดีเด่น / ดีเยี่ยม)</span>
                </div>
                <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  พรีวิว: {{ staffCriteria.greenLabel || 'ดีเยี่ยม' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-emerald-900 mb-1">คะแนนขั้นต่ำ (ตั้งแต่คะแนนนี้ขึ้นไป)</label>
                  <div class="relative">
                    <input
                      v-model.number="staffCriteria.greenMin"
                      type="number"
                      step="0.05"
                      min="0"
                      max="5"
                      required
                      class="w-full text-sm px-3.5 py-2 rounded-xl border border-emerald-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <span class="absolute right-3 top-2 text-xs text-slate-400">/ 5.00</span>
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-emerald-900 mb-1">ป้ายข้อความกำกับสถานะ</label>
                  <input
                    v-model="staffCriteria.greenLabel"
                    type="text"
                    required
                    placeholder="เช่น ดีเยี่ยม / ผลงานดีเด่น"
                    class="w-full text-sm px-3.5 py-2 rounded-xl border border-emerald-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            <!-- YELLOW TIER -->
            <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm"></span>
                  <span class="text-sm font-bold text-amber-950">ระดับสีเหลือง (ปานกลาง / พอใช้)</span>
                </div>
                <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  พรีวิว: {{ staffCriteria.yellowLabel || 'ปานกลาง' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-amber-900 mb-1">
                    คะแนนขั้นต่ำ (ระหว่าง {{ staffCriteria.yellowMin }} ถึง &lt; {{ staffCriteria.greenMin }})
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="staffCriteria.yellowMin"
                      type="number"
                      step="0.05"
                      min="0"
                      max="5"
                      required
                      class="w-full text-sm px-3.5 py-2 rounded-xl border border-amber-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <span class="absolute right-3 top-2 text-xs text-slate-400">/ 5.00</span>
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-amber-900 mb-1">ป้ายข้อความกำกับสถานะ</label>
                  <input
                    v-model="staffCriteria.yellowLabel"
                    type="text"
                    required
                    placeholder="เช่น ปานกลาง / พอใช้"
                    class="w-full text-sm px-3.5 py-2 rounded-xl border border-amber-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            </div>

            <!-- RED TIER -->
            <div class="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm"></span>
                  <span class="text-sm font-bold text-rose-950">ระดับสีแดง (ต้องปรับปรุงเร่งด่วน)</span>
                </div>
                <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  พรีวิว: {{ staffCriteria.redLabel || 'ต้องปรับปรุงเร่งด่วน' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-rose-900 mb-1">ช่วงคะแนนที่จัดอยู่ในเกณฑ์นี้</label>
                  <div class="w-full text-sm px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/60 font-semibold text-rose-800">
                    ต่ำกว่า {{ staffCriteria.yellowMin }} คะแนน
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-rose-900 mb-1">ป้ายข้อความกำกับสถานะ</label>
                  <input
                    v-model="staffCriteria.redLabel"
                    type="text"
                    required
                    placeholder="เช่น ต้องปรับปรุงเร่งด่วน"
                    class="w-full text-sm px-3.5 py-2 rounded-xl border border-rose-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end pt-2">
              <button
                type="submit"
                :disabled="isSavingCriteria"
                class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <span>💾 บันทึกเกณฑ์สีสำหรับบุคลากร</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Modal: Add New Round -->
      <div v-if="showAddRoundModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900">+ สร้างรอบการประเมินใหม่</h3>
            <button @click="showAddRoundModal = false" class="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>

          <form @submit.prevent="saveNewRound" class="space-y-3.5">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">ชื่อรอบการประเมิน <span class="text-rose-500">*</span></label>
              <input
                v-model="newRoundForm.name"
                type="text"
                required
                placeholder="เช่น รอบการประเมินประจำปีงบประมาณ 2571"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">ปีงบประมาณ <span class="text-rose-500">*</span></label>
              <input
                v-model="newRoundForm.year"
                type="text"
                required
                placeholder="เช่น 2571"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">วันที่เริ่มต้น</label>
                <input
                  v-model="newRoundForm.startDate"
                  type="date"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">วันที่สิ้นสุด</label>
                <input
                  v-model="newRoundForm.endDate"
                  type="date"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">คำอธิบาย</label>
              <input
                v-model="newRoundForm.description"
                type="text"
                placeholder="คำอธิบายหรือวัตถุประสงค์ของรอบ"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div class="flex items-center justify-end space-x-2 pt-3">
              <button
                type="button"
                @click="showAddRoundModal = false"
                class="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                สร้างรอบประเมิน
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Edit Evaluation Round -->
      <div v-if="showEditRoundModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900">✏️ แก้ไขรอบการประเมิน</h3>
            <button @click="showEditRoundModal = false" class="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>

          <form @submit.prevent="updateRound" class="space-y-3.5">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">ชื่อรอบการประเมิน <span class="text-rose-500">*</span></label>
              <input
                v-model="editRoundForm.name"
                type="text"
                required
                placeholder="เช่น รอบการประเมินประจำปีงบประมาณ 2570"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">ปีงบประมาณ <span class="text-rose-500">*</span></label>
                <input
                  v-model="editRoundForm.year"
                  type="text"
                  required
                  placeholder="เช่น 2570"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">สถานะรอบ</label>
                <select
                  v-model="editRoundForm.status"
                  class="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value="OPEN">🟢 เปิดให้ประเมิน (OPEN)</option>
                  <option value="CLOSED">🔴 ปิดรอบแล้ว (CLOSED)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">วันที่เริ่มต้น</label>
                <input
                  v-model="editRoundForm.startDate"
                  type="date"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">วันที่สิ้นสุด</label>
                <input
                  v-model="editRoundForm.endDate"
                  type="date"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">คำอธิบาย</label>
              <input
                v-model="editRoundForm.description"
                type="text"
                placeholder="คำอธิบายหรือวัตถุประสงค์ของรอบ"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div class="flex items-center justify-end space-x-2 pt-3">
              <button
                type="button"
                @click="showEditRoundModal = false"
                class="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Add New Building (HYBRID STAFF SELECTION) -->
      <div v-if="showAddBuildingModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900">+ เพิ่มข้อมูลอาคารใหม่</h3>
            <button @click="showAddBuildingModal = false" class="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>

          <form @submit.prevent="saveNewBuilding" class="space-y-3.5">
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-1">
                <label class="block text-xs font-medium text-slate-700 mb-1">รหัสอาคาร <span class="text-rose-500">*</span></label>
                <input
                  v-model="newBuilding.code"
                  type="text"
                  required
                  placeholder="เช่น B25"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-700 mb-1">ชื่ออาคาร <span class="text-rose-500">*</span></label>
                <input
                  v-model="newBuilding.name"
                  type="text"
                  required
                  placeholder="เช่น อาคารคณะวิทยาการจัดการ"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-1">
                <label class="block text-xs font-medium text-slate-700 mb-1">จำนวนชั้น</label>
                <input
                  v-model="newBuilding.floors"
                  type="number"
                  min="1"
                  placeholder="เช่น 5"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-700 mb-1">คำอธิบาย/หน่วยงานที่ตั้ง</label>
                <input
                  v-model="newBuilding.description"
                  type="text"
                  placeholder="เช่น คณะมนุษยศาสตร์และสังคมศาสตร์"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <!-- HYBRID STAFF PICKER -->
            <div class="border-t border-slate-100 pt-3 space-y-2">
              <label class="block text-xs font-semibold text-slate-800">
                แม่บ้าน/ผู้รับผิดชอบประจำอาคาร (ดึง SSO หรือพิมพ์ชื่อ Outsource)
              </label>

              <!-- Selected Staff Chips -->
              <div v-if="newBuildingStaffList.length > 0" class="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                <span
                  v-for="(staff, idx) in newBuildingStaffList"
                  :key="idx"
                  class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium"
                >
                  <span>👤 {{ staff }}</span>
                  <button
                    type="button"
                    @click="newBuildingStaffList.splice(idx, 1)"
                    class="text-indigo-400 hover:text-rose-600 transition-colors ml-1 font-bold"
                  >
                    ✕
                  </button>
                </span>
              </div>

              <!-- Search Input & Dropdown -->
              <div class="relative">
                <div class="flex gap-1.5">
                  <input
                    v-model="newStaffQuery"
                    @keyup.enter.prevent="addCustomStaffToNewBuilding"
                    type="text"
                    placeholder="พิมพ์ชื่อค้นหา SSO หรือพิมพ์ชื่อแม่บ้าน Outsource..."
                    class="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    @click="addCustomStaffToNewBuilding"
                    class="px-3.5 py-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl whitespace-nowrap"
                  >
                    + เพิ่มชื่อพิมพ์เอง
                  </button>
                </div>

                <!-- Suggestions Panel -->
                <div
                  v-if="newStaffQuery.trim().length > 0 && (filteredNewStaffPool.length > 0 || newStaffSsoSuggestions.length > 0)"
                  class="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 z-50 divide-y divide-slate-100 p-1"
                >
                  <!-- Outsource Custom Option -->
                  <div
                    @click="addCustomStaffToNewBuilding"
                    class="px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-50 rounded-xl cursor-pointer flex items-center justify-between font-semibold"
                  >
                    <span>➕ เพิ่ม "{{ newStaffQuery }}" เป็นพนักงานจ้างเหมา (Outsource)</span>
                    <span class="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">พิมพ์เอง</span>
                  </div>

                  <!-- SSO Matches -->
                  <div v-if="newStaffSsoSuggestions.length > 0" class="pt-1">
                    <p class="text-[10px] font-bold text-slate-400 px-2 py-0.5">🌐 ข้อมูลจาก BRU SSO:</p>
                    <div
                      v-for="s in newStaffSsoSuggestions"
                      :key="s.userlogin"
                      @click="selectStaffForNewBuilding(`${s.fullName} (${s.userlogin})`)"
                      class="px-2.5 py-1.5 text-xs hover:bg-purple-50 rounded-lg cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span class="font-medium text-slate-800">{{ s.fullName }}</span>
                        <span class="text-slate-400 font-mono ml-1 text-[11px]">({{ s.userlogin }})</span>
                        <p class="text-[10px] text-slate-400">{{ s.positionName }}</p>
                      </div>
                      <span class="text-[10px] text-purple-600 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">SSO</span>
                    </div>
                  </div>

                  <!-- Existing DB Staff Pool Matches -->
                  <div v-if="filteredNewStaffPool.length > 0" class="pt-1">
                    <p class="text-[10px] font-bold text-slate-400 px-2 py-0.5">💾 จากฐานข้อมูลแม่บ้านเดิม:</p>
                    <div
                      v-for="s in filteredNewStaffPool"
                      :key="s.staffName"
                      @click="selectStaffForNewBuilding(s.staffName)"
                      class="px-2.5 py-1.5 text-xs hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between"
                    >
                      <span class="font-medium text-slate-800">{{ s.staffName }}</span>
                      <span class="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">เคยบันทึกไว้</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-[11px] text-slate-400">
                💡 สามารถพิมพ์ชื่อแม่บ้าน Outsource แล้วกด Enter หรือคลิกเลือกจากผลค้นหา SSO ได้ทันที
              </p>
            </div>

            <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                @click="showAddBuildingModal = false"
                class="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                บันทึกอาคาร
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Edit Building & Responsible Staff (HYBRID STAFF SELECTION) -->
      <div v-if="showEditBuildingModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900">✏️ แก้ไขข้อมูลอาคารและผู้รับผิดชอบ</h3>
            <button @click="showEditBuildingModal = false" class="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>

          <form @submit.prevent="updateBuilding" class="space-y-3.5">
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-1">
                <label class="block text-xs font-medium text-slate-700 mb-1">รหัสอาคาร <span class="text-rose-500">*</span></label>
                <input
                  v-model="editBuildingForm.code"
                  type="text"
                  required
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-700 mb-1">ชื่ออาคาร <span class="text-rose-500">*</span></label>
                <input
                  v-model="editBuildingForm.name"
                  type="text"
                  required
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-1">
                <label class="block text-xs font-medium text-slate-700 mb-1">จำนวนชั้น</label>
                <input
                  v-model="editBuildingForm.floors"
                  type="number"
                  min="1"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-700 mb-1">คำอธิบาย/หน่วยงานที่ตั้ง</label>
                <input
                  v-model="editBuildingForm.description"
                  type="text"
                  placeholder="เช่น คณะมนุษยศาสตร์และสังคมศาสตร์"
                  class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <!-- HYBRID STAFF PICKER FOR EDIT -->
            <div class="border-t border-slate-100 pt-3 space-y-2">
              <label class="block text-xs font-semibold text-slate-800">
                แม่บ้าน/ผู้รับผิดชอบประจำอาคาร (ดึง SSO หรือพิมพ์ชื่อ Outsource)
              </label>

              <!-- Selected Staff Chips -->
              <div v-if="editBuildingStaffList.length > 0" class="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                <span
                  v-for="(staff, idx) in editBuildingStaffList"
                  :key="idx"
                  class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium"
                >
                  <span>👤 {{ staff }}</span>
                  <button
                    type="button"
                    @click="editBuildingStaffList.splice(idx, 1)"
                    class="text-indigo-400 hover:text-rose-600 transition-colors ml-1 font-bold"
                  >
                    ✕
                  </button>
                </span>
              </div>
              <div v-else class="text-xs text-slate-400 italic py-1">
                ยังไม่มีการระบุแม่บ้านประจำอาคารนี้
              </div>

              <!-- Search Input & Suggestions -->
              <div class="relative">
                <div class="flex gap-1.5">
                  <input
                    v-model="editStaffQuery"
                    @keyup.enter.prevent="addCustomStaffToEditBuilding"
                    type="text"
                    placeholder="พิมพ์ชื่อค้นหา SSO หรือพิมพ์ชื่อแม่บ้าน Outsource..."
                    class="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    @click="addCustomStaffToEditBuilding"
                    class="px-3.5 py-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl whitespace-nowrap"
                  >
                    + เพิ่มชื่อพิมพ์เอง
                  </button>
                </div>

                <!-- Suggestions Panel -->
                <div
                  v-if="editStaffQuery.trim().length > 0 && (filteredEditStaffPool.length > 0 || editStaffSsoSuggestions.length > 0)"
                  class="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 z-50 divide-y divide-slate-100 p-1"
                >
                  <!-- Outsource Custom Option -->
                  <div
                    @click="addCustomStaffToEditBuilding"
                    class="px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-50 rounded-xl cursor-pointer flex items-center justify-between font-semibold"
                  >
                    <span>➕ เพิ่ม "{{ editStaffQuery }}" เป็นพนักงานจ้างเหมา (Outsource)</span>
                    <span class="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">พิมพ์เอง</span>
                  </div>

                  <!-- SSO Matches -->
                  <div v-if="editStaffSsoSuggestions.length > 0" class="pt-1">
                    <p class="text-[10px] font-bold text-slate-400 px-2 py-0.5">🌐 ข้อมูลจาก BRU SSO:</p>
                    <div
                      v-for="s in editStaffSsoSuggestions"
                      :key="s.userlogin"
                      @click="selectStaffForEditBuilding(`${s.fullName} (${s.userlogin})`)"
                      class="px-2.5 py-1.5 text-xs hover:bg-purple-50 rounded-lg cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span class="font-medium text-slate-800">{{ s.fullName }}</span>
                        <span class="text-slate-400 font-mono ml-1 text-[11px]">({{ s.userlogin }})</span>
                        <p class="text-[10px] text-slate-400">{{ s.positionName }}</p>
                      </div>
                      <span class="text-[10px] text-purple-600 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">SSO</span>
                    </div>
                  </div>

                  <!-- Existing DB Staff Pool Matches -->
                  <div v-if="filteredEditStaffPool.length > 0" class="pt-1">
                    <p class="text-[10px] font-bold text-slate-400 px-2 py-0.5">💾 จากฐานข้อมูลแม่บ้านเดิม:</p>
                    <div
                      v-for="s in filteredEditStaffPool"
                      :key="s.staffName"
                      @click="selectStaffForEditBuilding(s.staffName)"
                      class="px-2.5 py-1.5 text-xs hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between"
                    >
                      <span class="font-medium text-slate-800">{{ s.staffName }}</span>
                      <span class="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">เคยบันทึกไว้</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-[11px] text-slate-400">
                💡 สามารถเลือกจากรายชื่อ SSO หรือพิมพ์ชื่อแม่บ้าน Outsource เองแล้วกด Enter ได้ทันที
              </p>
            </div>

            <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                @click="showEditBuildingModal = false"
                class="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Edit Question Item -->
      <div v-if="showEditQuestionModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900">✏️ แก้ไขข้อคำถามประเมิน</h3>
            <button @click="showEditQuestionModal = false" class="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>

          <form @submit.prevent="updateQuestion" class="space-y-3.5">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">หมวดข้อคำถาม</label>
              <select
                v-model="editQuestionForm.categoryId"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option v-for="c in categories" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">ลำดับข้อ</label>
              <input
                v-model="editQuestionForm.itemNumber"
                type="number"
                min="1"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">ข้อความคำถาม <span class="text-rose-500">*</span></label>
              <textarea
                v-model="editQuestionForm.title"
                rows="4"
                required
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              ></textarea>
            </div>

            <div class="flex items-center justify-end space-x-2 pt-3">
              <button
                type="button"
                @click="showEditQuestionModal = false"
                class="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Add Manual User / Appoint Admin -->
      <div v-if="showAddManualUserModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900">+ กำหนดสิทธิ์ / เพิ่มผู้ดูแลระบบโดยตรง</h3>
            <button @click="showAddManualUserModal = false" class="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>

          <form @submit.prevent="saveManualUser" class="space-y-3.5">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Username (BRU SSO) <span class="text-rose-500">*</span></label>
              <input
                v-model="manualUserForm.userlogin"
                type="text"
                required
                placeholder="เช่น chartwut, somchai"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">ชื่อ-นามสกุล <span class="text-rose-500">*</span></label>
              <input
                v-model="manualUserForm.fullName"
                type="text"
                required
                placeholder="เช่น อ.ชาติวุฒิ ธนาพรสิทธิ์"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">สิทธิ์การใช้งานในระบบ <span class="text-rose-500">*</span></label>
              <select
                v-model="manualUserForm.role"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              >
                <option value="ADMIN">🛡️ ผู้ดูแลระบบ (ADMIN) - จัดการข้อมูลหลัก รอบประเมิน และสิทธิ์</option>
                <option value="AUDITOR">📋 คณะกรรมการ (AUDITOR) - ตรวจประเมินอาคารและดูรายงาน</option>
                <option value="SUPERVISOR">👁️ หัวหน้างาน (SUPERVISOR) - กำกับติดตามผล</option>
                <option value="HOUSEKEEPER">🏢 ผู้รับผิดชอบ (HOUSEKEEPER) - แม่บ้าน/เจ้าหน้าที่ประจำอาคาร</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">ตำแหน่ง / หน่วยงาน</label>
              <input
                v-model="manualUserForm.positionName"
                type="text"
                placeholder="เช่น อาจารย์ประจำสาขาวิชา / เจ้าหน้าที่ศูนย์คอมฯ"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">อีเมล</label>
              <input
                v-model="manualUserForm.email"
                type="email"
                placeholder="เช่น chartwut@bru.ac.th"
                class="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div class="flex items-center justify-end space-x-2 pt-3">
              <button
                type="button"
                @click="showAddManualUserModal = false"
                class="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              >
                บันทึกและแต่งตั้งสิทธิ์
              </button>
            </div>
          </form>
        </div>
      </div>

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
          class="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium backdrop-blur-md pointer-events-auto max-w-sm"
          :class="toast.type === 'error'
            ? 'bg-rose-50/95 border-rose-200 text-rose-800 shadow-rose-900/10'
            : toast.type === 'info'
            ? 'bg-indigo-50/95 border-indigo-200 text-indigo-800 shadow-indigo-900/10'
            : 'bg-emerald-50/95 border-emerald-200 text-emerald-800 shadow-emerald-900/10'"
        >
          <span class="text-base flex-shrink-0">
            {{ toast.type === 'error' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '✅' }}
          </span>
          <span class="flex-1 leading-snug">{{ toast.message }}</span>
          <button
            type="button"
            @click="toast.show = false"
            class="text-slate-400 hover:text-slate-600 ml-1.5 p-0.5 rounded text-xs flex-shrink-0"
          >
            ✕
          </button>
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'

const adminTab = ref<'rounds' | 'sso' | 'buildings' | 'questions' | 'criteria-building' | 'criteria-staff'>('rounds')
const currentUserSession = useCookie<any>('bru_user_session')

// ========================
// COLOR CRITERIA MANAGEMENT
// ========================
const buildingCriteria = reactive({
  greenMin: 4.0,
  yellowMin: 2.0,
  greenLabel: 'ดีเยี่ยม / ผ่านเกณฑ์มาตรฐาน',
  yellowLabel: 'ปานกลาง / เฝ้าระวัง',
  redLabel: 'ต้องปรับปรุงเร่งด่วน'
})

const staffCriteria = reactive({
  greenMin: 4.0,
  yellowMin: 2.0,
  greenLabel: 'ดีเยี่ยม / ผลงานดีเด่น',
  yellowLabel: 'ปานกลาง / พอใช้',
  redLabel: 'ต้องปรับปรุงเร่งด่วน'
})

const isSavingCriteria = ref(false)

async function fetchColorCriteria() {
  try {
    const res: any = await $fetch('/api/settings/color-criteria')
    if (res?.data) {
      if (res.data.building) Object.assign(buildingCriteria, res.data.building)
      if (res.data.staff) Object.assign(staffCriteria, res.data.staff)
    }
  } catch (err) {
    console.error('Failed to load criteria', err)
  }
}

async function saveBuildingCriteria() {
  if (buildingCriteria.greenMin <= buildingCriteria.yellowMin) {
    showToast('คะแนนขั้นต่ำสีเขียวต้องมากกว่าสีเหลือง', 'error')
    return
  }
  isSavingCriteria.value = true
  try {
    const res: any = await $fetch('/api/settings/color-criteria', {
      method: 'PUT',
      body: { building: buildingCriteria }
    })
    if (res?.success) {
      showToast('บันทึกเกณฑ์สีสำหรับอาคารสำเร็จ!')
    }
  } catch (err: any) {
    showToast('เกิดข้อผิดพลาดในการบันทึก', 'error')
  } finally {
    isSavingCriteria.value = false
  }
}

async function saveStaffCriteria() {
  if (staffCriteria.greenMin <= staffCriteria.yellowMin) {
    showToast('คะแนนขั้นต่ำสีเขียวต้องมากกว่าสีเหลือง', 'error')
    return
  }
  isSavingCriteria.value = true
  try {
    const res: any = await $fetch('/api/settings/color-criteria', {
      method: 'PUT',
      body: { staff: staffCriteria }
    })
    if (res?.success) {
      showToast('บันทึกเกณฑ์สีสำหรับบุคลากรสำเร็จ!')
    }
  } catch (err: any) {
    showToast('เกิดข้อผิดพลาดในการบันทึก', 'error')
  } finally {
    isSavingCriteria.value = false
  }
}

function resetBuildingCriteria() {
  buildingCriteria.greenMin = 4.0
  buildingCriteria.yellowMin = 2.0
  buildingCriteria.greenLabel = 'ดีเยี่ยม / ผ่านเกณฑ์มาตรฐาน'
  buildingCriteria.yellowLabel = 'ปานกลาง / เฝ้าระวัง'
  buildingCriteria.redLabel = 'ต้องปรับปรุงเร่งด่วน'
}

function resetStaffCriteria() {
  staffCriteria.greenMin = 4.0
  staffCriteria.yellowMin = 2.0
  staffCriteria.greenLabel = 'ดีเยี่ยม / ผลงานดีเด่น'
  staffCriteria.yellowLabel = 'ปานกลาง / พอใช้'
  staffCriteria.redLabel = 'ต้องปรับปรุงเร่งด่วน'
}

// ========================
// TOAST NOTIFICATION
// ========================
const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info'
})
let toastTimer: any = null

function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  clearTimeout(toastTimer)
  toast.message = message
  toast.type = type
  toast.show = true
  toastTimer = setTimeout(() => {
    toast.show = false
  }, 2600)
}

// ========================
// 1. ROUNDS MANAGEMENT
// ========================
const rounds = ref<any[]>([])
const showAddRoundModal = ref(false)
const newRoundForm = reactive({
  name: '',
  year: '2571',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
  description: ''
})

const showEditRoundModal = ref(false)
const editRoundForm = reactive({
  id: '',
  name: '',
  year: '',
  status: 'OPEN',
  startDate: '',
  endDate: '',
  description: ''
})

function openEditRoundModal(r: any) {
  editRoundForm.id = r.id
  editRoundForm.name = r.name || ''
  editRoundForm.year = r.year || ''
  editRoundForm.status = r.status || 'OPEN'
  editRoundForm.startDate = r.startDate || ''
  editRoundForm.endDate = r.endDate || ''
  editRoundForm.description = r.description || ''
  showEditRoundModal.value = true
}

async function updateRound() {
  if (!editRoundForm.id || !editRoundForm.name || !editRoundForm.year) {
    showToast('กรุณากรอกชื่อรอบและปีงบประมาณให้ครบถ้วน', 'error')
    return
  }
  try {
    const res: any = await $fetch(`/api/rounds/${editRoundForm.id}`, {
      method: 'PUT',
      body: {
        name: editRoundForm.name,
        year: editRoundForm.year,
        status: editRoundForm.status,
        startDate: editRoundForm.startDate,
        endDate: editRoundForm.endDate,
        description: editRoundForm.description
      }
    })
    if (res?.ok) {
      showToast('บันทึกการแก้ไขข้อมูลรอบประเมินสำเร็จ!')
      showEditRoundModal.value = false
      await fetchRounds()
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'ไม่สามารถแก้ไขข้อมูลรอบประเมินได้', 'error')
  }
}

async function fetchRounds() {
  try {
    const res: any = await $fetch('/api/rounds')
    if (res?.data) rounds.value = res.data
  } catch (err) {
    console.error('Fetch rounds error', err)
  }
}

async function saveNewRound() {
  if (!newRoundForm.name) return
  try {
    const res: any = await $fetch('/api/rounds', {
      method: 'POST',
      body: newRoundForm
    })
    if (res?.ok) {
      showToast('สร้างรอบการประเมินสำเร็จ!')
      showAddRoundModal.value = false
      newRoundForm.name = ''
      await fetchRounds()
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'ไม่สามารถสร้างรอบประเมินได้', 'error')
  }
}

async function toggleRoundStatus(r: any) {
  const newStatus = r.status === 'OPEN' ? 'CLOSED' : 'OPEN'
  try {
    await $fetch(`/api/rounds/${r.id}`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    await fetchRounds()
  } catch (err) {
    console.error(err)
  }
}

async function deleteRound(id: string, name: string) {
  if (!confirm(`ต้องการลบรอบการประเมิน "${name}" ใช่หรือไม่?`)) return
  try {
    await $fetch(`/api/rounds/${id}`, { method: 'DELETE' })
    await fetchRounds()
  } catch (err) {
    console.error(err)
  }
}

// ========================
// 2. SSO USERS & COMMITTEE
// ========================
const ssoSearchKeyword = ref('')
const isSearchingSso = ref(false)
const ssoResults = ref<any[]>([])
const ssoSource = ref('')
const appointedUsers = ref<any[]>([])
const roleFilter = ref<'ALL' | 'ADMIN' | 'AUDITOR'>('ALL')

const showAddManualUserModal = ref(false)
const manualUserForm = reactive({
  userlogin: '',
  fullName: '',
  role: 'ADMIN',
  positionName: '',
  email: ''
})

const filteredAppointedUsers = computed(() => {
  if (roleFilter.value === 'ALL') return appointedUsers.value
  return appointedUsers.value.filter(u => u.role === roleFilter.value)
})

function formatRoleTitle(role: string) {
  switch (role) {
    case 'ADMIN': return 'ผู้ดูแลระบบ (Admin)'
    case 'AUDITOR': return 'คณะกรรมการตรวจประเมิน'
    case 'SUPERVISOR': return 'หัวหน้างาน'
    case 'HOUSEKEEPER': return 'ผู้รับผิดชอบอาคาร'
    default: return role
  }
}

async function fetchUsers() {
  try {
    const res: any = await $fetch('/api/users')
    if (res?.data) appointedUsers.value = res.data
  } catch (e) {}
}

async function searchSsoUsers() {
  isSearchingSso.value = true
  try {
    const keyword = encodeURIComponent(ssoSearchKeyword.value.trim())
    const res: any = await $fetch(`/api/sso/search?search=${keyword}`)
    if (res?.data) {
      ssoResults.value = res.data
      ssoSource.value = res.source || ''
    }
  } catch (err) {
    console.error(err)
  } finally {
    isSearchingSso.value = false
  }
}

async function assignRole(user: any, role: string) {
  const uLogin = user.userlogin || user.USERLOGIN
  const uName = user.fullName || user.FULL_NAME || user.name
  const uPosition = user.positionName || user.POSITIONNAME || 'บุคลากร'
  const uDept = user.departmentId || user.DEPARTMENTID || ''
  const uEmail = user.email || ''

  try {
    const res: any = await $fetch('/api/users/assign', {
      method: 'POST',
      body: {
        userlogin: uLogin,
        fullName: uName,
        email: uEmail,
        positionName: uPosition,
        departmentId: uDept,
        role
      }
    })
    if (res?.ok) {
      showToast(`แต่งตั้งคุณ ${uName} เป็น "${formatRoleTitle(role)}" เรียบร้อยแล้ว`)
      await fetchUsers()
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'เกิดข้อผิดพลาดในการแต่งตั้งสิทธิ์', 'error')
  }
}

async function changeUserRole(user: any, newRole: string) {
  if (user.role === newRole) return
  try {
    const res: any = await $fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      body: { role: newRole }
    })
    if (res?.ok) {
      user.role = newRole
      showToast(`เปลี่ยนสิทธิ์ของคุณ ${user.fullName} เป็น "${formatRoleTitle(newRole)}" เรียบร้อยแล้ว`)
      await fetchUsers()
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์', 'error')
  }
}

async function revokeUserRole(user: any) {
  if (currentUserSession.value?.userlogin === user.userlogin) {
    if (!confirm('คำเตือน: คุณกำลังจะยกเลิกสิทธิ์ของบัญชีที่คุณกำลังใช้งานอยู่ในขณะนี้! ยืนยันหรือไม่?')) {
      return
    }
  } else {
    if (!confirm(`ต้องการยกเลิกสิทธิ์ของคุณ "${user.fullName}" (${user.userlogin}) ใช่หรือไม่? บุคลากรท่านนี้จะไม่สามารถเข้าถึงสิทธิ์ "${formatRoleTitle(user.role)}" ได้อีก`)) {
      return
    }
  }

  try {
    const res: any = await $fetch(`/api/users/${user.id}`, {
      method: 'DELETE'
    })
    if (res?.ok) {
      showToast(`ยกเลิกสิทธิ์ของคุณ ${user.fullName} เรียบร้อยแล้ว`)
      await fetchUsers()
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'เกิดข้อผิดพลาดในการยกเลิกสิทธิ์', 'error')
  }
}

async function saveManualUser() {
  if (!manualUserForm.userlogin.trim() || !manualUserForm.fullName.trim()) {
    showToast('กรุณากรอก Username และชื่อ-นามสกุล', 'error')
    return
  }

  try {
    const res: any = await $fetch('/api/users/assign', {
      method: 'POST',
      body: {
        userlogin: manualUserForm.userlogin.trim(),
        fullName: manualUserForm.fullName.trim(),
        role: manualUserForm.role,
        positionName: manualUserForm.positionName.trim() || 'ผู้ดูแลระบบ',
        email: manualUserForm.email.trim() || `${manualUserForm.userlogin.trim()}@bru.ac.th`
      }
    })

    if (res?.ok) {
      showToast(`เพิ่มและแต่งตั้งสิทธิ์คุณ ${manualUserForm.fullName} สำเร็จ!`)
      showAddManualUserModal.value = false
      manualUserForm.userlogin = ''
      manualUserForm.fullName = ''
      manualUserForm.positionName = ''
      manualUserForm.email = ''
      await fetchUsers()
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'ไม่สามารถแต่งตั้งสิทธิ์ได้', 'error')
  }
}

// ==============================================
// 3. BUILDINGS & HYBRID STAFF MANAGEMENT
// ==============================================
const buildings = ref<any[]>([])
const buildingSearchQuery = ref('')

// Filtered buildings by building name, code, description, or caretaker/staff name
const filteredBuildings = computed(() => {
  const q = buildingSearchQuery.value.trim().toLowerCase()
  if (!q) return buildings.value

  return buildings.value.filter((b: any) => {
    // 1. Check building name, code, description
    const nameMatch = b.name && String(b.name).toLowerCase().includes(q)
    const codeMatch = b.code && String(b.code).toLowerCase().includes(q)
    const descMatch = b.description && String(b.description).toLowerCase().includes(q)
    const responsibleStaffMatch = b.responsibleStaff && String(b.responsibleStaff).toLowerCase().includes(q)

    // 2. Check caretakers / responsible staff
    const staffMatch = Array.isArray(b.staffs) && b.staffs.some((s: any) => {
      const sName = s.staffName || s.fullName || s.name || ''
      const sLogin = s.userlogin || s.username || ''
      return String(sName).toLowerCase().includes(q) || String(sLogin).toLowerCase().includes(q)
    })

    return nameMatch || codeMatch || descMatch || responsibleStaffMatch || staffMatch
  })
})
const showAddBuildingModal = ref(false)
const showEditBuildingModal = ref(false)
const staffPool = ref<{ staffName: string; source: string }[]>([])

// Add Building State
const newBuilding = reactive({ code: '', name: '', floors: 1, description: '' })
const newBuildingStaffList = ref<string[]>([])
const newStaffQuery = ref('')
const newStaffSsoSuggestions = ref<any[]>([])

// Edit Building State
const editBuildingForm = reactive({ id: '', code: '', name: '', floors: 1, description: '' })
const editBuildingStaffList = ref<string[]>([])
const editStaffQuery = ref('')
const editStaffSsoSuggestions = ref<any[]>([])

// Filter DB pool for Add Building
const filteredNewStaffPool = computed(() => {
  const q = newStaffQuery.value.trim().toLowerCase()
  if (!q) return []
  return staffPool.value.filter(s =>
    s.staffName.toLowerCase().includes(q) &&
    !newBuildingStaffList.value.includes(s.staffName)
  ).slice(0, 5)
})

// Filter DB pool for Edit Building
const filteredEditStaffPool = computed(() => {
  const q = editStaffQuery.value.trim().toLowerCase()
  if (!q) return []
  return staffPool.value.filter(s =>
    s.staffName.toLowerCase().includes(q) &&
    !editBuildingStaffList.value.includes(s.staffName)
  ).slice(0, 5)
})

let debounceTimerNew: any = null
watch(newStaffQuery, (newVal) => {
  clearTimeout(debounceTimerNew)
  const q = newVal.trim()
  if (q.length < 2) {
    newStaffSsoSuggestions.value = []
    return
  }
  debounceTimerNew = setTimeout(async () => {
    try {
      const res: any = await $fetch(`/api/sso/search?search=${encodeURIComponent(q)}`)
      if (res?.data) {
        newStaffSsoSuggestions.value = res.data.slice(0, 4)
      }
    } catch (e) {}
  }, 250)
})

let debounceTimerEdit: any = null
watch(editStaffQuery, (newVal) => {
  clearTimeout(debounceTimerEdit)
  const q = newVal.trim()
  if (q.length < 2) {
    editStaffSsoSuggestions.value = []
    return
  }
  debounceTimerEdit = setTimeout(async () => {
    try {
      const res: any = await $fetch(`/api/sso/search?search=${encodeURIComponent(q)}`)
      if (res?.data) {
        editStaffSsoSuggestions.value = res.data.slice(0, 4)
      }
    } catch (e) {}
  }, 250)
})

function addCustomStaffToNewBuilding() {
  const name = newStaffQuery.value.trim()
  if (!name) return
  if (!newBuildingStaffList.value.includes(name)) {
    newBuildingStaffList.value.push(name)
  }
  newStaffQuery.value = ''
  newStaffSsoSuggestions.value = []
}

function selectStaffForNewBuilding(staffName: string) {
  if (!newBuildingStaffList.value.includes(staffName)) {
    newBuildingStaffList.value.push(staffName)
  }
  newStaffQuery.value = ''
  newStaffSsoSuggestions.value = []
}

function addCustomStaffToEditBuilding() {
  const name = editStaffQuery.value.trim()
  if (!name) return
  if (!editBuildingStaffList.value.includes(name)) {
    editBuildingStaffList.value.push(name)
  }
  editStaffQuery.value = ''
  editStaffSsoSuggestions.value = []
}

function selectStaffForEditBuilding(staffName: string) {
  if (!editBuildingStaffList.value.includes(staffName)) {
    editBuildingStaffList.value.push(staffName)
  }
  editStaffQuery.value = ''
  editStaffSsoSuggestions.value = []
}

async function fetchBuildings() {
  try {
    const res: any = await $fetch('/api/buildings')
    if (res?.data) buildings.value = res.data
  } catch (e) {}
}

async function fetchStaffPool() {
  try {
    const res: any = await $fetch('/api/buildings/staff-pool')
    if (res?.data) staffPool.value = res.data
  } catch (e) {}
}

function openAddBuildingModal() {
  newBuilding.code = ''
  newBuilding.name = ''
  newBuilding.floors = 1
  newBuilding.description = ''
  newBuildingStaffList.value = []
  newStaffQuery.value = ''
  showAddBuildingModal.value = true
}

async function saveNewBuilding() {
  if (!newBuilding.code || !newBuilding.name) return
  try {
    const res: any = await $fetch('/api/buildings', {
      method: 'POST',
      body: {
        code: newBuilding.code,
        name: newBuilding.name,
        floors: newBuilding.floors,
        description: newBuilding.description,
        staffNames: newBuildingStaffList.value
      }
    })
    if (res?.ok) {
      showAddBuildingModal.value = false
      await fetchBuildings()
      await fetchStaffPool()
      showToast('เพิ่มอาคารใหม่พร้อมผู้รับผิดชอบสำเร็จ!')
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'ไม่สามารถเพิ่มข้อมูลอาคารได้', 'error')
  }
}

function openEditBuildingModal(b: any) {
  editBuildingForm.id = b.id
  editBuildingForm.code = b.code
  editBuildingForm.name = b.name
  editBuildingForm.floors = b.floors || 1
  editBuildingForm.description = b.description || ''
  editBuildingStaffList.value = (b.staffs || []).map((s: any) => s.staffName)
  editStaffQuery.value = ''
  showEditBuildingModal.value = true
}

async function updateBuilding() {
  if (!editBuildingForm.id || !editBuildingForm.code || !editBuildingForm.name) return
  try {
    const res: any = await $fetch(`/api/buildings/${editBuildingForm.id}`, {
      method: 'PUT',
      body: {
        code: editBuildingForm.code,
        name: editBuildingForm.name,
        floors: editBuildingForm.floors,
        description: editBuildingForm.description,
        staffNames: editBuildingStaffList.value
      }
    })
    if (res?.ok) {
      showEditBuildingModal.value = false
      await fetchBuildings()
      await fetchStaffPool()
      showToast('บันทึกการแก้ไขข้อมูลอาคารและผู้รับผิดชอบสำเร็จ!')
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'ไม่สามารถแก้ไขข้อมูลอาคารได้', 'error')
  }
}

async function deleteBuilding(id: string, name: string) {
  if (!confirm(`ต้องการลบอาคาร "${name}" ใช่หรือไม่?`)) return
  try {
    await $fetch(`/api/buildings/${id}`, { method: 'DELETE' })
    await fetchBuildings()
    await fetchStaffPool()
    showToast(`ลบอาคาร "${name}" เรียบร้อยแล้ว`)
  } catch (e) {}
}

// ========================
// 4. DYNAMIC QUESTIONS
// ========================
const categories = ref<any[]>([])
const questions = ref<any[]>([])
const selectedCategoryForQuestions = ref(1)
const newQuestionText = ref('')

const showEditQuestionModal = ref(false)
const editQuestionForm = reactive({ id: 0, title: '', categoryId: 1, itemNumber: 1 })

async function fetchQuestions() {
  try {
    const res: any = await $fetch('/api/questions')
    if (res?.ok) {
      categories.value = res.categories || []
      questions.value = res.questions || []
    }
  } catch (e) {}
}

const filteredQuestions = computed(() => {
  return questions.value.filter(q => q.categoryId === selectedCategoryForQuestions.value)
})

async function addQuestion() {
  if (!newQuestionText.value.trim()) return
  try {
    const res: any = await $fetch('/api/questions', {
      method: 'POST',
      body: {
        categoryId: selectedCategoryForQuestions.value,
        title: newQuestionText.value.trim()
      }
    })
    if (res?.ok) {
      newQuestionText.value = ''
      await fetchQuestions()
      showToast('เพิ่มข้อคำถามใหม่สำเร็จ!')
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'ไม่สามารถเพิ่มข้อคำถามได้', 'error')
  }
}

function openEditQuestionModal(q: any) {
  editQuestionForm.id = q.id
  editQuestionForm.title = q.title
  editQuestionForm.categoryId = q.categoryId
  editQuestionForm.itemNumber = q.itemNumber
  showEditQuestionModal.value = true
}

async function updateQuestion() {
  if (!editQuestionForm.id || !editQuestionForm.title.trim()) return
  try {
    const res: any = await $fetch(`/api/questions/${editQuestionForm.id}`, {
      method: 'PUT',
      body: {
        title: editQuestionForm.title.trim(),
        categoryId: editQuestionForm.categoryId,
        itemNumber: editQuestionForm.itemNumber
      }
    })
    if (res?.ok) {
      showEditQuestionModal.value = false
      await fetchQuestions()
      showToast('แก้ไขข้อคำถามสำเร็จ!')
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'ไม่สามารถแก้ไขข้อคำถามได้', 'error')
  }
}

async function deleteQuestion(id: number, title: string) {
  if (!confirm(`ต้องการลบข้อคำถาม "${title}"?`)) return
  try {
    await $fetch(`/api/questions/${id}`, { method: 'DELETE' })
    await fetchQuestions()
    showToast(`ลบข้อคำถาม "${title}" เรียบร้อยแล้ว`)
  } catch (e) {}
}

onMounted(() => {
  fetchRounds()
  fetchUsers()
  fetchBuildings()
  fetchStaffPool()
  fetchQuestions()
  searchSsoUsers()
  fetchColorCriteria()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
