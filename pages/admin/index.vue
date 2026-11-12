<template>
  <div class="min-h-screen bg-slate-50/70 pb-20">
    <Navbar />

    <main class="max-w-5xl mx-auto px-4 py-8 space-y-6">
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

      <!-- Quick Evaluator Impersonation Card -->
      <section class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center space-x-2">
          <span class="text-xl">🎭</span>
          <h3 class="font-bold text-sm sm:text-base text-white">สวมบทบาทเป็นผู้ประเมิน</h3>
          <span class="bg-amber-400/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
            ดูหน้าจอผู้ประเมิน
          </span>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <!-- Autocomplete Search Input -->
          <div class="relative w-full sm:w-72">
            <div class="relative">
              <input
                v-model="impersonateSearchQuery"
                @focus="showImpersonateDropdown = true"
                @blur="onImpersonateInputBlur"
                @keyup.enter="handleQuickImpersonate"
                type="text"
                placeholder="พิมพ์ค้นหาชื่อ-สกุล ผู้ประเมิน..."
                class="w-full text-xs bg-slate-800/90 text-white placeholder:text-slate-400 border border-indigo-400/40 rounded-xl pl-8 pr-7 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:bg-slate-800 outline-none font-medium transition-all"
              />
              <span class="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
              <button
                v-if="impersonateSearchQuery"
                type="button"
                @mousedown.prevent="clearImpersonateSearch"
                class="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                title="ล้างคำค้นหา"
              >
                ✕
              </button>
            </div>

            <!-- Floating Suggestions Dropdown -->
            <div
              v-if="showImpersonateDropdown"
              class="absolute left-0 right-0 top-full mt-1.5 bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 rounded-xl shadow-xl max-h-56 overflow-y-auto z-30 p-1 divide-y divide-slate-800"
            >
              <div
                v-for="aud in filteredEvaluators"
                :key="aud.id"
                @mousedown.prevent="selectEvaluatorForImpersonate(aud)"
                class="p-2 rounded-lg hover:bg-indigo-600/30 cursor-pointer transition-colors flex items-center justify-between text-xs"
                :class="selectedImpersonateUser?.id === aud.id ? 'bg-indigo-600/40 text-amber-300 font-semibold' : 'text-slate-200'"
              >
                <div class="truncate mr-2">
                  <div class="font-medium truncate flex items-center gap-1.5">
                    <span>👤</span>
                    <span class="truncate">{{ aud.fullName }}</span>
                  </div>
                  <div class="text-[10px] text-slate-400 truncate">
                    {{ aud.positionName || formatRoleTitle(aud.role) }} • <span class="font-mono text-indigo-300">{{ aud.userlogin }}</span>
                  </div>
                </div>
                <span v-if="selectedImpersonateUser?.id === aud.id" class="text-amber-400 text-xs shrink-0">✓</span>
              </div>

              <div v-if="filteredEvaluators.length === 0" class="p-3 text-center text-xs text-slate-400">
                ไม่พบผู้ประเมินที่ตรงกับคำค้นหา
              </div>
            </div>
          </div>

          <!-- Impersonate Button -->
          <button
            type="button"
            @click="handleQuickImpersonate"
            :disabled="isImpersonatingAction"
            class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <span v-if="!isImpersonatingAction">🚀</span>
            <span v-else class="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
            <span>สวมบทบาท (ไปหน้าประเมิน)</span>
          </button>
        </div>
      </section>

      <!-- Admin Navigation Tabs (Multi-row Grid: 4 columns on desktop, 2 columns on mobile) -->
      <nav aria-label="เมนูหลักผู้ดูแลระบบ" class="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <!-- Item 1: รอบการประเมิน -->
          <button
            type="button"
            @click="adminTab = 'rounds'"
            class="px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 text-left cursor-pointer"
            :class="adminTab === 'rounds'
              ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-500/20'
              : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-slate-300'"
          >
            <span class="text-base shrink-0">🗓️</span>
            <span class="truncate">1. รอบการประเมิน</span>
          </button>

          <!-- Item 2: สิทธิ์กรรมการและผู้ดูแลระบบ -->
          <button
            type="button"
            @click="adminTab = 'sso'"
            class="px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 text-left cursor-pointer"
            :class="adminTab === 'sso'
              ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-500/20'
              : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-slate-300'"
          >
            <span class="text-base shrink-0">👥</span>
            <span class="truncate">2. สิทธิ์กรรมการและผู้ดูแล</span>
          </button>

          <!-- Item 3: จัดการอาคารและผู้รับผิดชอบ -->
          <button
            type="button"
            @click="adminTab = 'buildings'"
            class="px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 text-left cursor-pointer"
            :class="adminTab === 'buildings'
              ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-500/20'
              : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-slate-300'"
          >
            <span class="text-base shrink-0">🏢</span>
            <span class="truncate">3. อาคารและผู้รับผิดชอบ</span>
          </button>

          <!-- Item 4: จัดการข้อคำถามในหมวด -->
          <button
            type="button"
            @click="adminTab = 'questions'"
            class="px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 text-left cursor-pointer"
            :class="adminTab === 'questions'
              ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-500/20'
              : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-slate-300'"
          >
            <span class="text-base shrink-0">📝</span>
            <span class="truncate">4. ข้อคำถามในหมวด</span>
          </button>

          <!-- Item 5: เกณฑ์สีสำหรับอาคาร -->
          <button
            type="button"
            @click="adminTab = 'criteria-building'"
            class="px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 text-left cursor-pointer"
            :class="adminTab === 'criteria-building'
              ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-500/20'
              : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-slate-300'"
          >
            <span class="text-base shrink-0">🎨</span>
            <span class="truncate">5. เกณฑ์สีสำหรับอาคาร</span>
          </button>

          <!-- Item 6: เกณฑ์สีสำหรับบุคลากร -->
          <button
            type="button"
            @click="adminTab = 'criteria-staff'"
            class="px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 text-left cursor-pointer"
            :class="adminTab === 'criteria-staff'
              ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-500/20'
              : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-slate-300'"
          >
            <span class="text-base shrink-0">👤</span>
            <span class="truncate">6. เกณฑ์สีสำหรับบุคลากร</span>
          </button>

          <!-- Item 7: รายงานการประเมิน (span 2 คอลัมน์เพื่อจัดแถวล่างให้เต็มและเด่นชัด) -->
          <button
            type="button"
            @click="adminTab = 'reports'"
            class="col-span-2 md:col-span-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 text-left cursor-pointer"
            :class="adminTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-500/20'
              : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-slate-300'"
          >
            <span class="text-base shrink-0">📊</span>
            <span class="truncate">7. รายงานการประเมิน</span>
          </button>
        </div>
      </nav>

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
            <div class="relative flex-1">
              <input
                v-model="ssoSearchKeyword"
                @keyup.enter="searchSsoUsers"
                type="text"
                placeholder="พิมพ์ชื่อ, สกุล หรือ userlogin แล้วกดค้นหา..."
                class="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span class="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
              <button
                v-if="ssoSearchKeyword"
                type="button"
                @click="clearSsoSearch"
                class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="ล้างคำค้นหา"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              @click="searchSsoUsers"
              :disabled="isSearchingSso || !ssoSearchKeyword.trim()"
              class="px-5 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
            >
              <span v-if="isSearchingSso">กำลังค้นหา...</span>
              <span v-else>🔍 ค้นหา</span>
            </button>
          </div>

          <!-- Search Results (แสดงเฉพาะเมื่อมีการพิมพ์คำค้นหาและมีผลลัพธ์) -->
          <div v-if="ssoSearchKeyword.trim() && ssoResults.length > 0" class="space-y-2 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-semibold text-slate-700">ผลการค้นหาบุคลากร ({{ ssoResults.length }} รายการ):</h4>
              <button
                type="button"
                @click="clearSsoSearch"
                class="text-[11px] text-indigo-600 hover:underline cursor-pointer"
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
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center space-x-1 cursor-pointer"
                    title="แต่งตั้งเป็นผู้ดูแลระบบ (Admin)"
                  >
                    <span>🛡️</span>
                    <span>ตั้งเป็น Admin</span>
                  </button>
                  <button
                    type="button"
                    @click="assignRole(u, 'AUDITOR')"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center space-x-1 cursor-pointer"
                    title="แต่งตั้งเป็นคณะกรรมการตรวจประเมิน"
                  >
                    <span>📋</span>
                    <span>ตั้งเป็น กรรมการ</span>
                  </button>
                  <button
                    type="button"
                    @click="assignRole(u, 'HOUSEKEEPER')"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1 cursor-pointer"
                    title="กำหนดเป็นผู้รับผิดชอบอาคาร"
                  >
                    <span>🏢</span>
                    <span>ผู้รับผิดชอบ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state when searched but no results found -->
          <div v-else-if="hasSearchedSso && ssoSearchKeyword.trim() && !isSearchingSso" class="py-6 text-center text-xs text-slate-400 space-y-1">
            <div class="text-2xl">🔍</div>
            <p class="font-medium text-slate-600">ไม่พบข้อมูลบุคลากรที่ตรงกับคำค้นหา "{{ ssoSearchKeyword }}"</p>
            <p class="text-slate-400 text-[11px]">ลองตรวจสอบตัวสะกด หรือพิมพ์ชื่อ สกุล หรือ Username อื่น หรือใช้ปุ่ม "+ กำหนดสิทธิ์ด้วยตนเอง"</p>
          </div>

          <!-- Initial state before searching -->
          <div v-else-if="!isSearchingSso && !ssoSearchKeyword.trim()" class="py-4 text-center text-xs text-slate-400">
            💡 กรุณาพิมพ์ชื่อ, สกุล หรือ Username ในช่องค้นหาด้านบน แล้วกด <strong>ค้นหา</strong> เพื่อดึงข้อมูลบุคลากร
          </div>
        </div>

        <!-- Appointed Committee & Authorized Personnel List -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-sm font-bold text-slate-900">รายชื่อบุคลากรและคณะกรรมการที่มีสิทธิ์ในระบบปัจจุบัน ({{ appointedUsers.length }} ท่าน)</h3>
              <p class="text-xs text-slate-500">สามารถเปลี่ยนสิทธิ์ หรือยกเลิกสิทธิ์การเข้าถึงระบบได้ทันที</p>
            </div>

            <!-- Role Filter Pills -->
            <div class="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
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
              <button
                type="button"
                @click="roleFilter = 'HOUSEKEEPER'"
                class="px-2.5 py-1 rounded-lg font-medium transition-all"
                :class="roleFilter === 'HOUSEKEEPER' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
              >
                🏢 ผู้รับผิดชอบ ({{ appointedUsers.filter(u => u.role === 'HOUSEKEEPER').length }})
              </button>
              <button
                v-if="appointedUsers.some(u => u.role === 'SUPERVISOR')"
                type="button"
                @click="roleFilter = 'SUPERVISOR'"
                class="px-2.5 py-1 rounded-lg font-medium transition-all"
                :class="roleFilter === 'SUPERVISOR' ? 'bg-teal-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
              >
                👁️ หัวหน้างาน ({{ appointedUsers.filter(u => u.role === 'SUPERVISOR').length }})
              </button>
            </div>
          </div>

          <!-- Search Toolbar for Appointed Personnel -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="relative flex-1">
              <input
                v-model="appointedUserSearchQuery"
                type="text"
                placeholder="ค้นหาตามชื่อ-สกุล, ตำแหน่ง หรือ Username (userlogin)..."
                class="w-full text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
              />
              <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              <button
                v-if="appointedUserSearchQuery"
                type="button"
                @click="appointedUserSearchQuery = ''"
                class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="ล้างคำค้นหา"
              >
                ✕
              </button>
            </div>
            <div v-if="appointedUserSearchQuery || roleFilter !== 'ALL'" class="text-xs text-slate-500 flex items-center gap-2 self-start sm:self-center flex-shrink-0">
              <span>พบ <strong>{{ filteredAppointedUsers.length }}</strong> จาก {{ appointedUsers.length }} ท่าน</span>
              <button
                type="button"
                @click="clearAppointedUserFilters"
                class="text-indigo-600 hover:text-indigo-700 hover:underline font-medium cursor-pointer"
              >
                ✕ ล้างการค้นหา/ตัวกรอง
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
                <!-- Impersonate Button -->
                <button
                  type="button"
                  @click="impersonateUser(u, '/evaluate')"
                  :disabled="isImpersonatingAction"
                  class="px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-all flex items-center space-x-1 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
                  title="สวมบทบาทเป็นบุคลากรท่านนี้ เพื่อดูหน้าจอและมุมมองการประเมิน"
                >
                  <span>🎭</span>
                  <span>สวมบทบาท</span>
                </button>

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

            <div v-if="filteredAppointedUsers.length === 0" class="py-8 text-center text-xs text-slate-400 space-y-2">
              <div class="text-2xl">🔍</div>
              <p class="font-medium text-slate-600">
                {{ appointedUserSearchQuery ? `ไม่พบรายชื่อบุคลากรที่ตรงกับ "${appointedUserSearchQuery}"` : 'ไม่มีรายชื่อบุคลากรในหมวดหมู่นี้' }}
              </p>
              <div v-if="appointedUserSearchQuery || roleFilter !== 'ALL'" class="pt-1">
                <button
                  type="button"
                  @click="clearAppointedUserFilters"
                  class="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                >
                  ล้างตัวกรองและการค้นหา
                </button>
              </div>
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

        <!-- Search Bar: Separated by Building Name and Staff Name -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Box 1: ค้นหาด้วยชื่ออาคาร / รหัสอาคาร -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <span>🏢</span>
                <span>ค้นหาด้วยชื่ออาคาร</span>
              </label>
              <div class="relative">
                <input
                  v-model="searchBuildingName"
                  type="text"
                  placeholder="พิมพ์ชื่ออาคาร หรือรหัสอาคาร (เช่น อาคาร 15, B15)..."
                  class="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                />
                <span class="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
                <button
                  v-if="searchBuildingName"
                  type="button"
                  @click="searchBuildingName = ''"
                  class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  title="ล้างคำค้นหาชื่ออาคาร"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Box 2: ค้นหาด้วยชื่อบุคลากร / แม่บ้าน -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <span>🧹</span>
                <span>ค้นหาด้วยชื่อบุคลากร (ผู้รับผิดชอบ/แม่บ้าน)</span>
              </label>
              <div class="relative">
                <input
                  v-model="searchStaffName"
                  type="text"
                  placeholder="พิมพ์ชื่อ-สกุล ผู้รับผิดชอบ หรือแม่บ้านประจำอาคาร..."
                  class="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
                />
                <span class="absolute left-3 top-3 text-slate-400 text-xs">👤</span>
                <button
                  v-if="searchStaffName"
                  type="button"
                  @click="searchStaffName = ''"
                  class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  title="ล้างคำค้นหาชื่อบุคลากร"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Result Count / Filter Indicator -->
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 px-0.5">
            <div>
              พบอาคาร <strong>{{ filteredBuildings.length }}</strong> จากทั้งหมด <strong>{{ buildings.length }}</strong> แห่ง
              <span v-if="searchBuildingName" class="text-indigo-600 font-medium ml-1.5">
                • อาคาร: "{{ searchBuildingName }}"
              </span>
              <span v-if="searchStaffName" class="text-purple-600 font-medium ml-1.5">
                • บุคลากร: "{{ searchStaffName }}"
              </span>
            </div>
            <button
              v-if="searchBuildingName || searchStaffName"
              type="button"
              @click="clearAllBuildingSearches"
              class="text-indigo-600 hover:text-indigo-700 hover:underline font-medium cursor-pointer"
            >
              ✕ ล้างการค้นหาทั้งหมด
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

              <!-- Assigned Committee Auditors Chips -->
              <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                <span class="font-medium text-slate-500">คณะกรรมการประจำอาคาร:</span>
                <span
                  v-for="(aud, aIdx) in (b.auditors || [])"
                  :key="aud.userlogin || aud.userId || aIdx"
                  class="inline-flex items-center bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-medium text-xs border border-emerald-200/80"
                >
                  📋 {{ aud.fullName }}
                </span>
                <span v-if="!b.auditors || b.auditors.length === 0" class="text-slate-400 italic text-xs">
                  (ยังไม่ได้กำหนดกรรมการประจำอาคาร)
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
            {{ (searchBuildingName || searchStaffName) ? 'ไม่พบอาคารที่ตรงกับเงื่อนไขการค้นหา' : 'ยังไม่มีข้อมูลอาคารในระบบ' }}
          </p>
          <p v-if="searchBuildingName || searchStaffName" class="text-xs text-slate-400 max-w-sm mx-auto">
            ไม่พบผลลัพธ์ที่ตรงกับเงื่อนไขที่ระบุ ลองปรับเปลี่ยนคำค้นหาชื่ออาคาร หรือชื่อผู้รับผิดชอบ/แม่บ้าน
          </p>
          <div v-if="searchBuildingName || searchStaffName" class="pt-2">
            <button
              type="button"
              @click="clearAllBuildingSearches"
              class="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200"
            >
              ล้างคำค้นหาทั้งหมด
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

      <!-- TAB 7: Evaluation Reports -->
      <section v-else-if="adminTab === 'reports'" class="space-y-4">
        <!-- Header & Action Card -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-1">
                <span>📊 รายงานสรุปผลการประเมิน</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-slate-900">รายงานการตรวจประเมินรายรายการ</h3>
              <p class="text-xs text-slate-500">แสดงรายการผลการตรวจประเมิน วันที่ประเมิน ผู้ประเมิน ผู้ถูกประเมิน อาคารที่รับผิดชอบ และคะแนนเฉลี่ย</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="exportEvaluationsExcel"
                :disabled="filteredReportAssessments.length === 0"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                <span>📥</span>
                <span>ส่งออก Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                @click="fetchReportAssessments"
                :disabled="isLoadingReports"
                class="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                <span :class="isLoadingReports ? 'animate-spin' : ''">🔄</span>
                <span>รีเฟรช</span>
              </button>
            </div>
          </div>

          <!-- Filters Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <!-- Round Filter -->
            <div>
              <label class="block text-[11px] font-medium text-slate-500 mb-1">รอบการประเมิน</label>
              <select
                v-model="reportRoundFilter"
                @change="fetchReportAssessments"
                class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">ทุกรอบการประเมิน</option>
                <option v-for="r in rounds" :key="r.id" :value="r.id">
                  {{ r.name }}
                </option>
              </select>
            </div>

            <!-- Building Filter -->
            <div>
              <label class="block text-[11px] font-medium text-slate-500 mb-1">อาคาร</label>
              <select
                v-model="reportBuildingFilter"
                class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">ทุกอาคาร ({{ buildings.length }} อาคาร)</option>
                <option v-for="b in buildings" :key="b.id" :value="b.name">
                  {{ b.name }}
                </option>
              </select>
            </div>

            <!-- Search Query -->
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-medium text-slate-500 mb-1">ค้นหา (ชื่อผู้ประเมิน / ผู้ถูกประเมิน / อาคาร)</label>
              <div class="relative">
                <input
                  v-model="reportSearchQuery"
                  type="text"
                  placeholder="พิมพ์ค้นหาชื่อผู้ประเมิน, ผู้ถูกประเมิน หรืออาคาร..."
                  class="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <span class="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
                <button
                  v-if="reportSearchQuery"
                  @click="reportSearchQuery = ''"
                  class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Sub-bar: Name display toggle & Count summary -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div class="flex items-center space-x-2">
              <span class="text-slate-400">แสดงผล:</span>
              <span class="font-bold text-slate-900">{{ filteredReportAssessments.length }}</span>
              <span>รายการ</span>
              <span v-if="filteredReportAssessments.length > 0" class="text-slate-400">
                (คะแนนเฉลี่ยรวม: <strong class="text-indigo-600 font-bold">{{ reportOverallAverage.toFixed(2) }}</strong> / 5.00)
              </span>
            </div>

            <!-- Name format selector -->
            <div class="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-[11px]">
              <span class="text-slate-500 px-1.5 font-medium">รูปแบบชื่อ:</span>
              <button
                type="button"
                @click="nameDisplayMode = 'FIRST_ONLY'"
                class="px-2.5 py-0.5 rounded-lg font-medium transition-all"
                :class="nameDisplayMode === 'FIRST_ONLY' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
              >
                เฉพาะชื่อ (First Name)
              </button>
              <button
                type="button"
                @click="nameDisplayMode = 'FULL_WITHOUT_PREFIX'"
                class="px-2.5 py-0.5 rounded-lg font-medium transition-all"
                :class="nameDisplayMode === 'FULL_WITHOUT_PREFIX' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
              >
                ชื่อ-นามสกุล (ไม่เอาคำนำหน้า)
              </button>
            </div>
          </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-semibold">
                  <th class="py-3 px-4 w-12 text-center text-slate-400">#</th>
                  <th class="py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-slate-100/60" @click="toggleReportSort('date')">
                    <div class="flex items-center space-x-1">
                      <span>วันที่ประเมิน</span>
                      <span class="text-[10px] text-slate-400">{{ reportSortBy.startsWith('date') ? (reportSortBy === 'date_desc' ? '▼' : '▲') : '↕' }}</span>
                    </div>
                  </th>
                  <th class="py-3 px-4 whitespace-nowrap">ผู้ประเมิน (เฉพาะชื่อ)</th>
                  <th class="py-3 px-4 whitespace-nowrap">ผู้ถูกประเมิน (เฉพาะชื่อ)</th>
                  <th class="py-3 px-4 whitespace-nowrap">อาคารที่รับผิดชอบ</th>
                  <th class="py-3 px-4 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100/60" @click="toggleReportSort('score')">
                    <div class="flex items-center justify-center space-x-1">
                      <span>คะแนนเฉลี่ย</span>
                      <span class="text-[10px] text-slate-400">{{ reportSortBy.startsWith('score') ? (reportSortBy === 'score_desc' ? '▼' : '▲') : '↕' }}</span>
                    </div>
                  </th>
                  <th class="py-3 px-4 text-center whitespace-nowrap">จัดการ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr
                  v-for="(item, idx) in filteredReportAssessments"
                  :key="item.id"
                  class="hover:bg-slate-50/70 transition-colors"
                >
                  <td class="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">{{ idx + 1 }}</td>
                  <td class="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
                    {{ formatReportDate(item.assessedAt || item.createdAt) }}
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap font-semibold text-slate-900" :title="item.assessor?.fullName || item.assessorName">
                    👤 {{ formatReportDisplayName(item.assessor?.fullName || item.assessorName) }}
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap text-slate-800" :title="item.responsibleStaffText">
                    🧹 {{ formatReportDisplayName(item.responsibleStaffText) }}
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
                    🏢 {{ item.building?.name || item.buildingName || '-' }}
                  </td>
                  <td class="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      class="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs"
                      :class="getScoreBadgeClass(getAssessmentAverageScore(item))"
                    >
                      {{ getAssessmentAverageScore(item).toFixed(2) }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      @click="deleteReportAssessment(item)"
                      class="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer inline-flex items-center space-x-1"
                      title="รีเซ็ตและล้างข้อมูลการประเมินรายการนี้ในรอบนี้"
                    >
                      <span>🔄</span>
                      <span>รีเซ็ต</span>
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredReportAssessments.length === 0">
                  <td colspan="7" class="py-12 text-center text-slate-400 space-y-1">
                    <p class="text-base">📋</p>
                    <p class="text-xs font-medium">ไม่พบข้อมูลผลการตรวจประเมินที่ตรงตามเงื่อนไข</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

            <!-- COMMITTEE AUDITORS PICKER FOR ADD -->
            <div class="border-t border-slate-100 pt-3 space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-slate-800">
                  คณะกรรมการผู้ตรวจประเมินประจำอาคาร (เลือกได้หลายท่าน)
                </label>
                <span class="text-[11px] text-emerald-600 font-medium">
                  เลือกแล้ว {{ newBuildingAuditors.length }} ท่าน
                </span>
              </div>

              <!-- Search Input for Committee -->
              <div class="relative">
                <input
                  v-model="newAuditorSearchQuery"
                  type="text"
                  placeholder="พิมพ์ค้นหาชื่อกรรมการ หรือ username..."
                  class="w-full text-xs px-3 py-2 pl-8 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <span class="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
                <button
                  v-if="newAuditorSearchQuery"
                  type="button"
                  @click="newAuditorSearchQuery = ''"
                  class="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs w-4 h-4 rounded-full flex items-center justify-center"
                >✕</button>
              </div>

              <!-- Selected Auditor Chips -->
              <div v-if="newBuildingAuditors.length > 0" class="flex flex-wrap gap-1.5 p-2 bg-emerald-50/40 rounded-xl border border-emerald-200/70">
                <span
                  v-for="(aud, aIdx) in newBuildingAuditors"
                  :key="aud.userlogin || aud.userId || aIdx"
                  class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-medium"
                >
                  <span>📋 {{ aud.fullName }}</span>
                  <button
                    type="button"
                    @click="newBuildingAuditors.splice(aIdx, 1)"
                    class="text-emerald-500 hover:text-rose-600 transition-colors ml-1 font-bold"
                  >
                    ✕
                  </button>
                </span>
              </div>

              <!-- Quick Toggle List of Committee Members -->
              <div class="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50/50 space-y-1">
                <div
                  v-for="aud in filteredCommitteeUsersForNew"
                  :key="aud.id || aud.userlogin"
                  @click="toggleAuditorForNewBuilding(aud)"
                  class="px-2.5 py-1.5 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors"
                  :class="isAuditorSelected(newBuildingAuditors, aud)
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/60'"
                >
                  <div class="flex items-center space-x-1.5 truncate">
                    <span>{{ isAuditorSelected(newBuildingAuditors, aud) ? '✓' : '＋' }}</span>
                    <span class="truncate">{{ aud.fullName }}</span>
                    <span class="text-[10px] opacity-75 font-mono">({{ aud.userlogin }})</span>
                  </div>
                  <span class="text-[10px] px-1.5 py-0.5 rounded" :class="isAuditorSelected(newBuildingAuditors, aud) ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'">
                    {{ aud.role === 'ADMIN' ? 'Admin' : 'กรรมการ' }}
                  </span>
                </div>
                <div v-if="filteredCommitteeUsersForNew.length === 0" class="text-center text-xs text-slate-400 py-2">
                  {{ newAuditorSearchQuery ? `ไม่พบกรรมการที่ตรงกับ "${newAuditorSearchQuery}"` : 'ยังไม่มีรายชื่อกรรมการในระบบ (สามารถเพิ่มได้ที่แท็บ 2)' }}
                </div>
              </div>
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

            <!-- COMMITTEE AUDITORS PICKER FOR EDIT -->
            <div class="border-t border-slate-100 pt-3 space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-slate-800">
                  คณะกรรมการผู้ตรวจประเมินประจำอาคาร (เลือกได้หลายท่าน)
                </label>
                <span class="text-[11px] text-emerald-600 font-medium">
                  เลือกแล้ว {{ editBuildingAuditors.length }} ท่าน
                </span>
              </div>

              <!-- Search Input for Committee in Edit Modal -->
              <div class="relative">
                <input
                  v-model="editAuditorSearchQuery"
                  type="text"
                  placeholder="พิมพ์ค้นหาชื่อกรรมการ หรือ username..."
                  class="w-full text-xs px-3 py-2 pl-8 pr-7 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <span class="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
                <button
                  v-if="editAuditorSearchQuery"
                  type="button"
                  @click="editAuditorSearchQuery = ''"
                  class="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs w-4 h-4 rounded-full flex items-center justify-center"
                >✕</button>
              </div>

              <!-- Selected Auditor Chips -->
              <div v-if="editBuildingAuditors.length > 0" class="flex flex-wrap gap-1.5 p-2 bg-emerald-50/40 rounded-xl border border-emerald-200/70">
                <span
                  v-for="(aud, aIdx) in editBuildingAuditors"
                  :key="aud.userlogin || aud.userId || aIdx"
                  class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-medium"
                >
                  <span>📋 {{ aud.fullName }}</span>
                  <button
                    type="button"
                    @click="editBuildingAuditors.splice(aIdx, 1)"
                    class="text-emerald-500 hover:text-rose-600 transition-colors ml-1 font-bold"
                  >
                    ✕
                  </button>
                </span>
              </div>
              <div v-else class="text-xs text-slate-400 italic py-1">
                ยังไม่ได้กำหนดกรรมการประจำอาคารนี้
              </div>

              <!-- Quick Toggle List of Committee Members -->
              <div class="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50/50 space-y-1">
                <div
                  v-for="aud in filteredCommitteeUsersForEdit"
                  :key="aud.id || aud.userlogin"
                  @click="toggleAuditorForEditBuilding(aud)"
                  class="px-2.5 py-1.5 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors"
                  :class="isAuditorSelected(editBuildingAuditors, aud)
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/60'"
                >
                  <div class="flex items-center space-x-1.5 truncate">
                    <span>{{ isAuditorSelected(editBuildingAuditors, aud) ? '✓' : '＋' }}</span>
                    <span class="truncate">{{ aud.fullName }}</span>
                    <span class="text-[10px] opacity-75 font-mono">({{ aud.userlogin }})</span>
                  </div>
                  <span class="text-[10px] px-1.5 py-0.5 rounded" :class="isAuditorSelected(editBuildingAuditors, aud) ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'">
                    {{ aud.role === 'ADMIN' ? 'Admin' : 'กรรมการ' }}
                  </span>
                </div>
                <div v-if="filteredCommitteeUsersForEdit.length === 0" class="text-center text-xs text-slate-400 py-2">
                  {{ editAuditorSearchQuery ? `ไม่พบกรรมการที่ตรงกับ "${editAuditorSearchQuery}"` : 'ยังไม่มีรายชื่อกรรมการในระบบ (สามารถเพิ่มได้ที่แท็บ 2)' }}
                </div>
              </div>
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
import * as XLSX from 'xlsx'

const adminTab = ref<'rounds' | 'sso' | 'buildings' | 'questions' | 'criteria-building' | 'criteria-staff' | 'reports'>('rounds')
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
const roleFilter = ref<string>('ALL')
const appointedUserSearchQuery = ref('')

function clearAppointedUserFilters() {
  appointedUserSearchQuery.value = ''
  roleFilter.value = 'ALL'
}

const showAddManualUserModal = ref(false)
const manualUserForm = reactive({
  userlogin: '',
  fullName: '',
  role: 'ADMIN',
  positionName: '',
  email: ''
})

const filteredAppointedUsers = computed(() => {
  const q = appointedUserSearchQuery.value.trim().toLowerCase()
  return appointedUsers.value.filter((u: any) => {
    // 1. Role filter
    const matchRole = roleFilter.value === 'ALL' || u.role === roleFilter.value
    if (!matchRole) return false

    // 2. Search query matching fullName, userlogin, positionName, email
    if (!q) return true
    const nameMatch = u.fullName && String(u.fullName).toLowerCase().includes(q)
    const loginMatch = u.userlogin && String(u.userlogin).toLowerCase().includes(q)
    const posMatch = u.positionName && String(u.positionName).toLowerCase().includes(q)
    const emailMatch = u.email && String(u.email).toLowerCase().includes(q)
    return !!(nameMatch || loginMatch || posMatch || emailMatch)
  })
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

// ========================
// EVALUATOR IMPERSONATION
// ========================
const impersonateSearchQuery = ref('')
const selectedImpersonateUser = ref<any>(null)
const showImpersonateDropdown = ref(false)
const isImpersonatingAction = ref(false)

const evaluatorList = computed(() => {
  const auditors = appointedUsers.value.filter(u => u.role === 'AUDITOR')
  if (auditors.length > 0) return auditors
  return appointedUsers.value
})

const filteredEvaluators = computed(() => {
  const q = impersonateSearchQuery.value.trim().toLowerCase()
  if (!q) return evaluatorList.value
  return evaluatorList.value.filter((u: any) => {
    const nameMatch = u.fullName && String(u.fullName).toLowerCase().includes(q)
    const loginMatch = u.userlogin && String(u.userlogin).toLowerCase().includes(q)
    const posMatch = u.positionName && String(u.positionName).toLowerCase().includes(q)
    return !!(nameMatch || loginMatch || posMatch)
  })
})

function selectEvaluatorForImpersonate(user: any) {
  selectedImpersonateUser.value = user
  impersonateSearchQuery.value = user.fullName
  showImpersonateDropdown.value = false
}

function clearImpersonateSearch() {
  impersonateSearchQuery.value = ''
  selectedImpersonateUser.value = null
  showImpersonateDropdown.value = true
}

function onImpersonateInputBlur() {
  setTimeout(() => {
    showImpersonateDropdown.value = false
  }, 200)
}

async function handleQuickImpersonate() {
  let target = selectedImpersonateUser.value
  if (!target && impersonateSearchQuery.value.trim()) {
    const q = impersonateSearchQuery.value.trim().toLowerCase()
    target = evaluatorList.value.find((u: any) =>
      u.fullName?.toLowerCase().includes(q) || u.userlogin?.toLowerCase().includes(q)
    )
  }
  if (!target) {
    if (evaluatorList.value.length > 0) {
      target = evaluatorList.value[0]
      selectEvaluatorForImpersonate(target)
    } else {
      showToast('ไม่พบรายชื่อผู้ประเมินในระบบ', 'error')
      return
    }
  }
  await impersonateUser(target, '/evaluate')
}

async function impersonateUser(target: any, redirectPath = '/evaluate') {
  if (isImpersonatingAction.value) return
  isImpersonatingAction.value = true

  let userId: string | undefined = undefined
  let userlogin: string | undefined = undefined
  let displayName = ''

  if (typeof target === 'string') {
    if (target === '__DEMO__') {
      userlogin = 'evaluator_demo'
      displayName = 'กรรมการตรวจประเมิน (ทดสอบ)'
    } else {
      userId = target
      const found = appointedUsers.value.find(u => u.id === target)
      displayName = found?.fullName || ''
    }
  } else if (target && typeof target === 'object') {
    userId = target.id
    userlogin = target.userlogin
    displayName = target.fullName || ''
  } else if (!target && evaluatorList.value.length > 0) {
    userId = evaluatorList.value[0].id
    displayName = evaluatorList.value[0].fullName
  }

  try {
    const res: any = await $fetch('/api/auth/impersonate', {
      method: 'POST',
      body: { userId, userlogin }
    })
    if (res?.ok) {
      currentUserSession.value = res.user
      showToast(res.message || `สวมบทบาทเป็น "${displayName || res.user?.fullName}" เรียบร้อยแล้ว`)
      setTimeout(() => {
        navigateTo(redirectPath)
      }, 500)
    }
  } catch (err: any) {
    showToast(err?.message || 'เกิดข้อผิดพลาดในการสวมบทบาท', 'error')
  } finally {
    isImpersonatingAction.value = false
  }
}

async function fetchUsers() {
  try {
    const res: any = await $fetch('/api/users')
    if (res?.data) appointedUsers.value = res.data
  } catch (e) {}
}

const hasSearchedSso = ref(false)

function clearSsoSearch() {
  ssoSearchKeyword.value = ''
  ssoResults.value = []
  hasSearchedSso.value = false
}

async function searchSsoUsers() {
  const kw = ssoSearchKeyword.value.trim()
  if (!kw) {
    ssoResults.value = []
    hasSearchedSso.value = false
    return
  }
  isSearchingSso.value = true
  hasSearchedSso.value = true
  try {
    const keyword = encodeURIComponent(kw)
    const res: any = await $fetch(`/api/sso/search?search=${keyword}`)
    if (res?.data) {
      ssoResults.value = res.data
      ssoSource.value = res.source || ''
    } else {
      ssoResults.value = []
    }
  } catch (err) {
    console.error(err)
    ssoResults.value = []
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
const searchBuildingName = ref('')
const searchStaffName = ref('')

function clearAllBuildingSearches() {
  searchBuildingName.value = ''
  searchStaffName.value = ''
}

// Filtered buildings by building name/code/desc and/or staff/caretaker name
const filteredBuildings = computed(() => {
  const bQuery = searchBuildingName.value.trim().toLowerCase()
  const sQuery = searchStaffName.value.trim().toLowerCase()

  if (!bQuery && !sQuery) return buildings.value

  return buildings.value.filter((b: any) => {
    let matchesBuilding = true
    if (bQuery) {
      const nameMatch = b.name && String(b.name).toLowerCase().includes(bQuery)
      const codeMatch = b.code && String(b.code).toLowerCase().includes(bQuery)
      const descMatch = b.description && String(b.description).toLowerCase().includes(bQuery)
      matchesBuilding = !!(nameMatch || codeMatch || descMatch)
    }

    let matchesStaff = true
    if (sQuery) {
      const responsibleStaffMatch = b.responsibleStaff && String(b.responsibleStaff).toLowerCase().includes(sQuery)
      const staffMatch = Array.isArray(b.staffs) && b.staffs.some((s: any) => {
        const sName = s.staffName || s.fullName || s.name || ''
        const sLogin = s.userlogin || s.username || ''
        return String(sName).toLowerCase().includes(sQuery) || String(sLogin).toLowerCase().includes(sQuery)
      })
      const auditorMatch = Array.isArray(b.auditors) && b.auditors.some((a: any) => {
        return String(a.fullName || '').toLowerCase().includes(sQuery) || String(a.userlogin || '').toLowerCase().includes(sQuery)
      })
      matchesStaff = !!(responsibleStaffMatch || staffMatch || auditorMatch)
    }

    return matchesBuilding && matchesStaff
  })
})
const showAddBuildingModal = ref(false)
const showEditBuildingModal = ref(false)
const staffPool = ref<{ staffName: string; source: string }[]>([])

// Add Building State
const newBuilding = reactive({ code: '', name: '', floors: 1, description: '' })
const newBuildingStaffList = ref<string[]>([])
const newBuildingAuditors = ref<{ userId?: string; userlogin: string; fullName: string }[]>([])
const newAuditorSearchQuery = ref('')
const newStaffQuery = ref('')
const newStaffSsoSuggestions = ref<any[]>([])

// Edit Building State
const editBuildingForm = reactive({ id: '', code: '', name: '', floors: 1, description: '' })
const editBuildingStaffList = ref<string[]>([])
const editBuildingAuditors = ref<{ userId?: string; userlogin: string; fullName: string }[]>([])
const editAuditorSearchQuery = ref('')
const editStaffQuery = ref('')
const editStaffSsoSuggestions = ref<any[]>([])

const availableCommitteeUsers = computed(() => {
  return appointedUsers.value.filter(u => u.role === 'AUDITOR' || u.role === 'ADMIN')
})

const filteredCommitteeUsersForNew = computed(() => {
  const q = newAuditorSearchQuery.value.trim().toLowerCase()
  if (!q) return availableCommitteeUsers.value
  return availableCommitteeUsers.value.filter((u: any) =>
    (u.fullName && String(u.fullName).toLowerCase().includes(q)) ||
    (u.userlogin && String(u.userlogin).toLowerCase().includes(q)) ||
    (u.positionName && String(u.positionName).toLowerCase().includes(q))
  )
})

const filteredCommitteeUsersForEdit = computed(() => {
  const q = editAuditorSearchQuery.value.trim().toLowerCase()
  if (!q) return availableCommitteeUsers.value
  return availableCommitteeUsers.value.filter((u: any) =>
    (u.fullName && String(u.fullName).toLowerCase().includes(q)) ||
    (u.userlogin && String(u.userlogin).toLowerCase().includes(q)) ||
    (u.positionName && String(u.positionName).toLowerCase().includes(q))
  )
})

function isAuditorSelected(list: { userId?: string; userlogin: string; fullName: string }[], aud: any): boolean {
  return list.some(item =>
    (item.userId && aud.id && item.userId === aud.id) ||
    (item.userlogin && aud.userlogin && item.userlogin.toLowerCase() === aud.userlogin.toLowerCase())
  )
}

function toggleAuditorInList(list: { userId?: string; userlogin: string; fullName: string }[], aud: any) {
  const idx = list.findIndex(item =>
    (item.userId && aud.id && item.userId === aud.id) ||
    (item.userlogin && aud.userlogin && item.userlogin.toLowerCase() === aud.userlogin.toLowerCase())
  )
  if (idx >= 0) {
    list.splice(idx, 1)
  } else {
    list.push({
      userId: aud.id,
      userlogin: aud.userlogin,
      fullName: aud.fullName
    })
  }
}

function toggleAuditorForNewBuilding(aud: any) {
  toggleAuditorInList(newBuildingAuditors.value, aud)
}

function toggleAuditorForEditBuilding(aud: any) {
  toggleAuditorInList(editBuildingAuditors.value, aud)
}

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
  newBuildingAuditors.value = []
  newAuditorSearchQuery.value = ''
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
        staffNames: newBuildingStaffList.value,
        auditors: newBuildingAuditors.value
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
  editBuildingAuditors.value = Array.isArray(b.auditors)
    ? b.auditors.map((a: any) => ({
        userId: a.userId,
        userlogin: a.userlogin,
        fullName: a.fullName
      }))
    : []
  editAuditorSearchQuery.value = ''
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
        staffNames: editBuildingStaffList.value,
        auditors: editBuildingAuditors.value
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

// ========================
// 7. EVALUATION REPORTS
// ========================
const reportAssessments = ref<any[]>([])
const isLoadingReports = ref(false)
const reportRoundFilter = ref('')
const reportBuildingFilter = ref('')
const reportSearchQuery = ref('')
const reportSortBy = ref<'date_desc' | 'date_asc' | 'score_desc' | 'score_asc'>('date_desc')
const nameDisplayMode = ref<'FIRST_ONLY' | 'FULL_WITHOUT_PREFIX'>('FIRST_ONLY')

async function fetchReportAssessments() {
  isLoadingReports.value = true
  try {
    const res: any = await $fetch('/api/assessments', {
      params: {
        roundId: reportRoundFilter.value || undefined
      }
    })
    if (res?.ok && Array.isArray(res.data)) {
      reportAssessments.value = res.data
    } else {
      reportAssessments.value = []
    }
  } catch (err) {
    console.error('Failed to fetch evaluation report data', err)
  } finally {
    isLoadingReports.value = false
  }
}

async function deleteReportAssessment(item: any) {
  if (!item?.id) return
  const staffDisplay = formatReportDisplayName(item.responsibleStaffText)
  const assessorDisplay = formatReportDisplayName(item.assessor?.fullName || item.assessorName)
  const buildingDisplay = item.building?.name || item.buildingName || 'อาคาร'
  const roundObj = rounds.value.find((r: any) => r.id === item.roundId)
  const roundDisplay = roundObj?.name || item.roundId || 'รอบการประเมินนี้'

  if (!confirm(`ยืนยันการรีเซ็ต/ล้างข้อมูลการประเมินของ "${staffDisplay}" (${buildingDisplay})\nในรอบ: ${roundDisplay}\nโดยผู้ประเมิน: ${assessorDisplay} ใช่หรือไม่?\n\nข้อมูลการประเมินครั้งนี้จะถูกล้างออกจากระบบ เพื่อให้สามารถประเมินใหม่ได้`)) {
    return
  }

  try {
    const res: any = await $fetch(`/api/assessments/${item.id}`, {
      method: 'DELETE'
    })
    if (res?.ok) {
      showToast('รีเซ็ตและล้างข้อมูลการประเมินเรียบร้อยแล้ว')
      await fetchReportAssessments()
    }
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'ไม่สามารถรีเซ็ตผลการประเมินได้', 'error')
  }
}

function getAssessmentAverageScore(item: any): number {
  if (item.totalMaxScore && item.totalMaxScore > 0) {
    return Number(((item.totalScoreObtained / item.totalMaxScore) * 5).toFixed(2))
  }
  if (item.percentage !== undefined && item.percentage !== null) {
    return Number(((item.percentage / 100) * 5).toFixed(2))
  }
  if (Array.isArray(item.scores) && item.scores.length > 0) {
    const valid = item.scores.filter((s: any) => !s.isNA && s.score !== null && s.score !== undefined)
    if (valid.length > 0) {
      const sum = valid.reduce((acc: number, curr: any) => acc + Number(curr.score), 0)
      return Number((sum / valid.length).toFixed(2))
    }
  }
  return 0
}

function cleanThaiPrefixes(name?: string): string {
  if (!name) return ''
  let str = String(name).trim()
  const prefixRegex = /^(?:ว่าที่\s*ร้อยตรี|ว่าที่\s*ร\.ต\.|ผศ\.\s*ดร\.|รศ\.\s*ดร\.|ศ\.\s*ดร\.|อาจารย์\s*ดร\.|อาจารย์\s*|ผศ\.|รศ\.|ศ\.|ดร\.|อ\.|นาย|นางสาว|นาง|น\.ส\.)\s*/i
  let prev = ''
  while (prev !== str) {
    prev = str
    str = str.replace(prefixRegex, '').trim()
  }
  return str
}

function extractFirstNameOnly(name?: string): string {
  if (!name) return '-'
  const cleaned = cleanThaiPrefixes(name)
  if (!cleaned) return name
  const parts = cleaned.split(/\s+/)
  return parts[0] || cleaned
}

function extractNameWithoutPrefix(name?: string): string {
  if (!name) return '-'
  const cleaned = cleanThaiPrefixes(name)
  return cleaned || name
}

function formatReportDisplayName(name?: string): string {
  if (nameDisplayMode.value === 'FIRST_ONLY') {
    return extractFirstNameOnly(name)
  }
  return extractNameWithoutPrefix(name)
}

function formatReportDate(dateStr?: string | Date): string {
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

function getScoreBadgeClass(score: number): string {
  if (score >= (buildingCriteria.greenMin || 4.0)) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  if (score >= (buildingCriteria.yellowMin || 2.0)) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  return 'bg-rose-50 text-rose-700 border-rose-200'
}

function toggleReportSort(col: 'date' | 'score') {
  if (col === 'date') {
    reportSortBy.value = reportSortBy.value === 'date_desc' ? 'date_asc' : 'date_desc'
  } else if (col === 'score') {
    reportSortBy.value = reportSortBy.value === 'score_desc' ? 'score_asc' : 'score_desc'
  }
}

const filteredReportAssessments = computed(() => {
  let list = [...reportAssessments.value]

  if (reportBuildingFilter.value) {
    const bName = reportBuildingFilter.value.trim().toLowerCase()
    list = list.filter(item => {
      const currentB = (item.building?.name || item.buildingName || '').toLowerCase()
      return currentB.includes(bName)
    })
  }

  if (reportSearchQuery.value.trim()) {
    const q = reportSearchQuery.value.trim().toLowerCase()
    list = list.filter(item => {
      const assessor = (item.assessor?.fullName || item.assessorName || '').toLowerCase()
      const staff = (item.responsibleStaffText || '').toLowerCase()
      const bName = (item.building?.name || item.buildingName || '').toLowerCase()
      return assessor.includes(q) || staff.includes(q) || bName.includes(q)
    })
  }

  if (reportSortBy.value === 'date_desc') {
    list.sort((a, b) => new Date(b.assessedAt || b.createdAt).getTime() - new Date(a.assessedAt || a.createdAt).getTime())
  } else if (reportSortBy.value === 'date_asc') {
    list.sort((a, b) => new Date(a.assessedAt || a.createdAt).getTime() - new Date(b.assessedAt || b.createdAt).getTime())
  } else if (reportSortBy.value === 'score_desc') {
    list.sort((a, b) => getAssessmentAverageScore(b) - getAssessmentAverageScore(a))
  } else if (reportSortBy.value === 'score_asc') {
    list.sort((a, b) => getAssessmentAverageScore(a) - getAssessmentAverageScore(b))
  }

  return list
})

const reportOverallAverage = computed(() => {
  if (filteredReportAssessments.value.length === 0) return 0
  const sum = filteredReportAssessments.value.reduce((acc, item) => acc + getAssessmentAverageScore(item), 0)
  return sum / filteredReportAssessments.value.length
})

function exportEvaluationsExcel() {
  if (filteredReportAssessments.value.length === 0) return
  const rows = filteredReportAssessments.value.map((item, index) => ({
    'ลำดับ': index + 1,
    'วันที่ประเมิน': formatReportDate(item.assessedAt || item.createdAt),
    'ผู้ประเมิน (เฉพาะชื่อ)': formatReportDisplayName(item.assessor?.fullName || item.assessorName),
    'ผู้ถูกประเมิน (เฉพาะชื่อ)': formatReportDisplayName(item.responsibleStaffText),
    'อาคารที่รับผิดชอบ': item.building?.name || item.buildingName || '-',
    'คะแนนเฉลี่ย': getAssessmentAverageScore(item).toFixed(2)
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'รายงานการประเมิน')
  XLSX.writeFile(workbook, `รายงานการประเมิน_${new Date().toISOString().split('T')[0]}.xlsx`)
}

watch(adminTab, (tab) => {
  if (tab === 'reports' && reportAssessments.value.length === 0) {
    fetchReportAssessments()
  }
})

onMounted(() => {
  fetchRounds()
  fetchUsers()
  fetchBuildings()
  fetchStaffPool()
  fetchQuestions()
  fetchColorCriteria()
  fetchReportAssessments()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
