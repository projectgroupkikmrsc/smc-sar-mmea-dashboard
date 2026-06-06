<template>
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; min-height: 100vh; color: white; display: flex; flex-direction: column; overflow-x: hidden;">
    
    <div v-if="currentScreen === 'welcome'" 
         :style="{ 
           backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(${heliBg})`, 
           backgroundSize: 'cover', 
           backgroundPosition: 'center' 
         }"
         style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 30px;"> 
      <div style="text-align: center; max-width: 400px; width: 100%; margin-top: -40px;">
        <div style="width: 100px; height: 100px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 15px auto; filter: drop-shadow(0 0 15px rgba(37,99,235,0.3));">
          <img :src="logoApmm" alt="Logo APMM" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        
        <div style="margin-bottom: 60px;">
          <h1 class="wave-text" style="margin: 0; font-size: 28px; letter-spacing: 4px; font-weight: 900; line-height: 1;">
            <span v-for="(char, index) in 'MARITIME'.split('')" :key="index" :style="{ animationDelay: index * 0.1 + 's' }">
              {{ char }}
            </span>
          </h1>
          <h2 style="margin: 0; font-size: 16px; letter-spacing: 2px; font-weight: 700; color: #f8fafc; opacity: 0.9;">SEARCH AND RESCUE</h2>
          <div style="font-size: 10px; color: #38bdf8; font-weight: bold; letter-spacing: 1px; margin-top: 10px; text-transform: uppercase;">AGENSI PENGUATKUASAAN MARITIM MALAYSIA</div>
        </div>

        <div v-if="!otpDihantar" class="fade-in-content" style="background: #1e293b; padding: 25px; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center;">
          <label style="display: block; font-size: 10px; font-weight: bold; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase;">NO. TELEFON PERANTI TAKTIKAL</label>
          <input type="tel" v-model="noTelefon" placeholder="+601XXXXXXXX" style="width: 100%; box-sizing: border-box; padding: 12px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: white; font-size: 14px; margin-bottom: 15px; font-weight: bold;" />
          
          <div style="display: flex; justify-content: center;">
            <button @click="hantarSmsOtp" :disabled="!noTelefon" style="background: #10b981; color: white; border: none; padding: 10px 24px; font-size: 12px; font-weight: 600; border-radius: 25px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
              Dapatkan Kod OTP
            </button>
          </div>
        </div>

        <div v-else class="fade-in-content" style="background: #1e293b; padding: 25px; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: left;">
          <div style="background: rgba(52,211,153,0.1); border: 1px solid #34d399; padding: 10px; border-radius: 6px; color: #34d399; font-size: 12px; margin-bottom: 15px; text-align: center; font-weight: 500;">
            Simulasi SMS: Kod pengesahan anda adalah <strong style="font-size: 14px; letter-spacing: 1px;">{{ simulasiOtp }}</strong>
          </div>
          
          <label style="display: block; font-size: 10px; font-weight: bold; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase;">MASUKKAN KOD KESELAMATAN 4-DIGIT</label>
          <input type="text" v-model="inputOtp" maxlength="4" placeholder="0 0 0 0" style="width: 100%; box-sizing: border-box; padding: 12px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: #38bdf8; font-size: 22px; text-align: center; letter-spacing: 8px; font-family: monospace; margin-bottom: 15px; font-weight: bold;" />
          
          <button @click="sahkanSmsOtp" :disabled="inputOtp.length !== 4" style="width: 100%; background: #10b981; color: white; border: none; padding: 14px; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer;">
            CONFIRM
          </button>
          
          <button @click="otpDihantar = false" style="width: 100%; background: transparent; color: #94a3b8; border: none; margin-top: 10px; font-size: 12px; cursor: pointer; text-decoration: underline;">
            Kembali
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="currentScreen === 'setup'" 
         :style="{ 
           backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url(${heliBg})`, 
           backgroundSize: 'cover', 
           backgroundPosition: 'center' 
         }"
         style="flex: 1; display: flex; flex-direction: column; padding: 40px 20px 20px 20px; justify-content: space-between;">
      <div class="fade-in-content">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0; font-size: 24px; font-weight: bold; color: #f8fafc;">Mission Setup</h2>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">Verify your MRSC jurisdiction and assigned asset before syncing mission data.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #94a3b8; margin-bottom: 6px; letter-spacing: 0.5px;">MARITIME RESCUE SUB-CENTER (MRSC)</label>
            <select v-model="selectedMrsc" @change="kendalikanTukarMrsc" style="width: 100%; padding: 12px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 14px; font-weight: bold; outline: none;">
              <option value="" disabled>-- PILIH JURISDIKSI MRSC --</option>
              <option value="MRSC Langkawi">MRSC LANGKAWI (Wilayah Utara)</option>
              <option value="MRSC Klang">MRSC KLANG (Wilayah Barat)</option>
              <option value="MRSC Johor Baharu">MRSC JOHOR BAHARU (Wilayah Selatan)</option>
              <option value="MRSC Kuantan">MRSC KUANTAN (Wilayah Timur)</option>
              <option value="MRSC Kota Kinabalu">MRSC KOTA KINABALU (Wilayah Sabah)</option>
              <option value="MRSC Kuching">MRSC KUCHING (Wilayah Sarawak)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #94a3b8; margin-bottom: 6px; letter-spacing: 0.5px;">ACTIVE SAR INCIDENT</label>
            <select v-model="selectedCaseId" :disabled="!selectedMrsc" @change="kendalikanTukarKes" style="width: 100%; padding: 12px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 14px; font-weight: bold; outline: none;" :style="!selectedMrsc ? 'opacity: 0.5;' : ''">
              <option value="" disabled>-- {{ selectedMrsc ? 'PILIH INSIDEN AKTIF' : 'SILA PILIH MRSC DAHULU' }} --</option>
              <option v-for="kes in senaraiKesTapis" :key="kes.id" :value="kes.id">
                #{{ kes.id }} - {{ kes.case_name }}
              </option>
            </select>
            <small v-if="selectedMrsc && senaraiKesTapis.length === 0" style="color: #f59e0b; font-size: 11px; display: block; margin-top: 5px;">⚠️ Tiada kes aktif didaftarkan oleh SMC di stesen ini.</small>
          </div>

          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #94a3b8; margin-bottom: 6px; letter-spacing: 0.5px;">BOAT / ASSET ID</label>
            <select v-model="selectedAsset" :disabled="!selectedCaseId" style="width: 100%; padding: 12px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 14px; font-weight: bold; outline: none;" :style="!selectedCaseId ? 'opacity: 0.5;' : ''">
              <option value="" disabled>-- {{ selectedCaseId ? 'PILIH ASET OPERASI' : 'SILA PILIH INSIDEN DAHULU' }} --</option>
              <option v-for="aset in senaraiAsetTapis" :key="aset.id" :value="aset.sru_name" :disabled="aset.isTaken">
                {{ aset.sru_name }} {{ aset.isTaken ? '🔒 (SEDANG DIGUNAKAN PERANTI LAIN)' : '🟢 READY' }}
              </option>
            </select>
            <small v-if="selectedCaseId && senaraiAsetTapis.length === 0" style="color: #f59e0b; font-size: 11px; display: block; margin-top: 5px;">⚠️ SMC belum memuat naik atau memplot pelan SRU bagi kes ini di web.</small>
          </div>
        </div>
      </div>

      <button @click="mulaSync" :disabled="!selectedMrsc || !selectedCaseId || !selectedAsset" class="fade-in-content" style="width: 100%; padding: 15px; border: none; border-radius: 6px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; transition: 0.3s; margin-top: 0px; cursor: pointer;" :style="(!selectedMrsc || !selectedCaseId || !selectedAsset) ? 'background-color: #334155; color: #64748b; cursor: not-allowed;' : 'background-color: #2563eb; color: white; box-shadow: 0 4px 14px rgba(37,99,235,0.4);'">
        Connect & Sync Data
      </button>
    </div>

    <div v-else-if="currentScreen === 'map'" 
         class="fade-in-content"
         :style="{ 
           backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url(${heliBg})`, 
           backgroundSize: 'cover', 
           backgroundPosition: 'center' 
         }"
         style="height: 100vh; display: flex; flex-direction: column; position: relative;">
      
      <div style="position: absolute; top: 10px; left: 10px; right: 10px; z-index: 999; display: flex; flex-direction: column; gap: 6px;">
        <!-- Bar 1: Data Telemetri -->
        <div style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(10px); border: 1px solid #334155; border-radius: 8px; padding: 8px; display: flex; gap: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
          <div style="flex: 1; background: rgba(15, 23, 42, 0.4); padding: 6px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40px;">
            <div style="font-size: 8px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">SPEED</div>
            <div style="font-size: 13px; color: #00ffff; font-family: monospace; font-weight: bold;">{{ botSpeed.toFixed(1) }} kts</div>
          </div>
          <div style="flex: 1; background: rgba(15, 23, 42, 0.4); padding: 6px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40px;">
            <div style="font-size: 8px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">HDG</div>
            <div style="font-size: 13px; color: #ffffff; font-family: monospace; font-weight: bold;">{{ botHeading !== '-' ? Number(botHeading).toFixed(1) : '-' }}°</div>
          </div>
          
          <template v-if="!telahTibaCsp">
            <div style="flex: 1; background: rgba(15, 23, 42, 0.4); padding: 6px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40px;">
              <div style="font-size: 8px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">COURSE</div>
              <div style="font-size: 13px; color: #fbbf24; font-family: monospace; font-weight: bold;">{{ courseToCsp }}°</div>
            </div>
            
            <!-- ETA Box (Sebelah Kiri Distance) -->
            <div style="flex: 1; background: rgba(15, 23, 42, 0.4); padding: 6px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40px;">
              <div style="font-size: 8px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">⏳ ETA</div>
              <div style="font-size: 13px; font-weight: bold; color: #fbbf24; font-family: monospace;">{{ computedETA }}</div>
            </div>
            
            <!-- Distance Box -->
            <div style="flex: 1; background: rgba(15, 23, 42, 0.4); padding: 6px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40px;">
              <div style="font-size: 8px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">DIST CSP</div>
              <div style="font-size: 13px; font-weight: bold; color: #4ade80; font-family: monospace;">{{ distanceToCsp }} NM</div>
            </div>
          </template>
          <div v-else style="flex: 1; text-align: center; display: flex; align-items: center; justify-content: center; min-height: 40px; background: rgba(15, 23, 42, 0.4); border-radius: 6px;">
             <div style="font-size: 13px; color: #facc15; font-weight: bold; animation: pulse 2s infinite;">📍 TELAH TIBA CSP</div>
          </div>
        </div>

        <!-- Bar 2: Maklumat Aset & Kedudukan (Sebaris) -->
        <div style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(10px); border: 1px solid #334155; border-radius: 8px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-size: 11px;">
           <span>ASET: <strong style="color: #60a5fa;">{{ selectedAsset }}</strong></span>
           <span style="color: #cbd5e1; font-family: monospace; font-weight: bold;">{{ formatCoordinate(currentLat, true) }} {{ formatCoordinate(currentLng, false) }}</span>
           <span :style="{color: isTracking ? '#4ade80' : '#f87171'}" style="font-weight: 900; letter-spacing: 0.5px;">{{ isTracking ? '● ONLINE' : '● OFFLINE' }}</span>
        </div>

        <!-- Bar 3: Layer Toggle & Recenter (Susunan bawah Status) -->
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
           <button @click="tukarModPeta" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(10px); border: 1px solid #334155; border-radius: 8px; padding: 6px; width: 38px; height: 38px; display: flex; justify-content: center; align-items: center; color: white; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
             <span v-if="isSatelit" style="font-size: 20px;">🗺️</span>
             <span v-else style="font-size: 20px;">🛰️</span>
           </button>
           
           <button @click="recenterMap" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(10px); border: 1px solid #334155; border-radius: 8px; padding: 6px; width: 38px; height: 38px; display: flex; justify-content: center; align-items: center; color: #60a5fa; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5);" :style="isFollowing ? 'color: #00ffff; border-color: #00ffff;' : ''">
             🎯
           </button>
        </div>
      </div>

      <div id="mapContainer" style="flex-grow: 1; width: 100%; z-index: 1;"></div>

      <div style="position: absolute; bottom: 15px; left: 15px; right: 15px; padding: 12px; background-color: rgba(15, 23, 42, 0.7); backdrop-filter: blur(10px); border: 1px solid #334155; border-radius: 12px; z-index: 10; box-shadow: 0 5px 25px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 10px;">
        <!-- Tactical Tapping Panels (Combined Transition for smooth switching) -->
        <transition name="slide-up" mode="out-in">
          <!-- MISSION SAP PANEL -->
          <div v-if="paparWaypointList" key="sap" class="scroll-taktikal" style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 8px; padding: 12px; height: 400px; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #1e293b; padding-bottom: 4px;">
              <span style="font-size: 11px; font-weight: bold; color: #fbbf24;">📋 Search Action Plan</span>
            </div>
            <div v-if="selectedPlanDetails" style="font-size: 11px; color: #94a3b8; display: flex; flex-direction: column; gap: 6px;">
              <div>SRU ID: <strong style="color: white;">{{ selectedPlanDetails.sru_name || '---' }}</strong></div>
              <div>Search Area: <strong style="color: white;">{{ selectedPlanDetails.zone_name || '---' }}</strong></div>
              <div>Search Pattern: <strong style="color: white;">{{ selectedPlanDetails.search_pattern }}</strong></div>
              <div>Search Speed: <strong style="color: white;">{{ selectedPlanDetails.search_speed }} kts</strong></div>
              <div>Length: <strong style="color: white;">{{ selectedPlanDetails.search_area_length }} NM</strong></div>
              <div>Width: <strong style="color: white;">{{ selectedPlanDetails.search_area_width }} NM</strong></div>
              <div>Total Area: <strong style="color: white;">{{ (selectedPlanDetails.search_area_length * selectedPlanDetails.search_area_width).toFixed(2) }} NM²</strong></div>
              <div>Track Spacing: <strong style="color: white;">{{ selectedPlanDetails.track_spacing }} NM</strong></div>
              
              <div style="margin-top: 10px; font-weight: bold; color: #60a5fa; border-top: 1px solid #1e293b; padding-top: 8px;">WAYPOINT LIST:</div>
              <div v-if="selectedPlanDetails.sortie_waypoints && selectedPlanDetails.sortie_waypoints.length > 0">
                <div v-for="(wp, index) in selectedPlanDetails.sortie_waypoints" :key="index" style="margin-bottom: 4px;">
                  WP {{ index + 1 }}: 
                  <span style="font-family: monospace;">{{ formatCoordinate(wp[0], true) }} {{ formatCoordinate(wp[1], false) }}</span>
                  <template v-if="index > 0">
                    (Course: {{ kiraBaringan(selectedPlanDetails.sortie_waypoints[index-1][0], selectedPlanDetails.sortie_waypoints[index-1][1], wp[0], wp[1]) }}°, 
                    Length: {{ calculateDistance(selectedPlanDetails.sortie_waypoints[index-1][0], selectedPlanDetails.sortie_waypoints[index-1][1], wp[0], wp[1]).toFixed(2) }} NM)
                  </template>
                </div>
              </div>
              <div v-else style="color: #f59e0b;">Tiada waypoint dikesan.</div>
            </div>
            <div v-else style="font-size: 11px; color: #f59e0b;">Sila pilih aset untuk melihat pelan SAR.</div>
          </div>

          <!-- MESSAGE PANEL -->
          <div v-else-if="paparChat" key="chat" style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 8px; padding: 12px; height: 400px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 4px;">
              <span style="font-size: 11px; font-weight: bold; color: #60a5fa;">💬 MESSAGE</span>
            </div>
            
            <div class="chat-box" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px;">
              <div v-for="msg in senaraiMesej" :key="msg.id" :style="{
                alignSelf: msg.sender === selectedAsset ? 'flex-end' : 'flex-start',
                background: msg.sender === selectedAsset ? '#2563eb' : '#334155',
                color: 'white', padding: '6px 10px', borderRadius: '6px', maxWidth: '85%', fontSize: '11px'
              }">
                <small style="display: block; font-size: 8px; color: #cbd5e1; margin-bottom: 2px;">{{ msg.sender }}</small>
                {{ msg.message }}
              </div>
            </div>

            <div style="display: flex; gap: 5px; margin-top: 5px;">
              <input v-model="mesejBaharu" @keyup.enter="hantarMesej" type="text" placeholder="Mesej ke HQ..." style="flex: 1; padding: 8px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 4px; font-size: 11px;" />
              <button @click="hantarMesej" style="background: #2563eb; color: white; border: none; padding: 0 10px; border-radius: 4px; font-weight: bold; font-size: 11px; cursor: pointer;">KIRIM</button>
            </div>
          </div>

          <!-- CONFIRMATION PANEL -->
          <div v-else-if="paparConfirmStop" key="confirm" style="background: rgba(15, 23, 42, 0.95); border: 1px solid #dc2626; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px; text-align: center;">
            <div style="font-size: 12px; font-weight: bold; color: #f87171;">⚠️ SAHKAN PENAMATAN MISI</div>
            <div style="font-size: 11px; color: #cbd5e1;">Adakah anda pasti ingin menghentikan penjejakan GPS dan menamatkan misi ini?</div>
            <div style="display: flex; gap: 8px; justify-content: center;">
              <button @click="currentScreen = 'setup'; hentiTracking(); paparConfirmStop = false;" style="background: #dc2626; color: white; border: none; padding: 8px 15px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
                YA, TAMATKAN MISI
              </button>
              <button @click="paparConfirmStop = false" style="background: #334155; color: #cbd5e1; border: none; padding: 8px 15px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
                BATAL
              </button>
            </div>
          </div>
        </transition>

        <!-- Minimalist 3-Button Action Bar -->
        <div style="display: flex; gap: 8px; justify-content: space-between; width: 100%;">
          <button @click="toggleWaypointList" style="flex: 1; background: rgba(30, 41, 59, 0.7); color: #60a5fa; border: 1px solid #334155; padding: 8px 0; border-radius: 8px; font-size: 8px; font-weight: 800; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1px; transition: 0.2s;">
            <span style="font-size: 16px;">📋</span> MISSION SAP
          </button>

          <button @click="paparConfirmStop = true; paparWaypointList = false; paparChat = false" style="flex: 1; background: rgba(30, 41, 59, 0.7); color: #f87171; border: 1px solid #334155; padding: 8px 0; border-radius: 8px; font-size: 8px; font-weight: 800; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1px; transition: 0.2s;">
            <span style="font-size: 16px;">🛑</span> STOP/END
          </button>

          <button @click="paparChat = !paparChat; paparWaypointList = false; paparConfirmStop = false; unreadCount = 0" style="flex: 1; background: rgba(30, 41, 59, 0.7); color: #60a5fa; border: 1px solid #334155; padding: 8px 0; border-radius: 8px; font-size: 8px; font-weight: 800; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1px; transition: 0.2s; position: relative;">
            <span v-if="unreadCount > 0" style="position: absolute; top: -5px; right: 5px; background: #ef4444; color: white; border-radius: 10px; padding: 1px 6px; font-size: 10px; font-weight: bold; border: 2px solid #1e293b;">{{ unreadCount }}</span>
            <span style="font-size: 16px;">💬</span> MESSAGE
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import logoApmm from './assets/logo_apmm.png'
import heliBg from './assets/heli.jpg'
import { ref, nextTick, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Geolocation } from '@capacitor/geolocation'

// =========================================================================
// INNESIALISASI DATABASE SUPABASE KAU (CUN MELECUN TERUS)
// =========================================================================
const supabaseUrl = 'https://ilizrmtuurenvlsygllk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaXpybXR1dXJlbnZsc3lnbGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNDA0NzcsImV4cCI6MjA5NDkxNjQ3N30.kRmx40LqGxp9H2fUPzhbFqHc1LedT1RCXrTWZT-8yXg'
const supabase = createClient(supabaseUrl, supabaseKey)

// STATE NAVIGATION & LOGIN SMS OTP
const currentScreen = ref('welcome') 
const noTelefon = ref('')
const otpDihantar = ref(false)
const simulasiOtp = ref('')
const inputOtp = ref('')

// STATE SELECTION BOXES
const selectedMrsc = ref('')
const selectedCaseId = ref('')
const selectedAsset = ref('')

// DATA MASTER (DITARIK DARI WEB)
const senaraiKesWebRaw = ref([])
const senaraiKesTapis = ref([])
const senaraiAsetTapis = ref([])

// MAPS, GPS, & TELEMETRY STATES
const map = ref(null)
const userMarker = ref(null)
const currentLat = ref(0)
const currentLng = ref(0)
const watchId = ref(null)
const isTracking = ref(false)
const cspLine = ref(null)
const selectedPlanDetails = ref(null) // State baru untuk menyimpan detail pelan SAROPS
const paparConfirmStop = ref(false) // State untuk popup pengesahan henti misi
const paparWaypointList = ref(false)
const isFollowing = ref(true) 
const trackHistoryCoordinates = ref([]) // Menyimpan array [lat, lng]
let trackPolylineInstance = null // Rujukan untuk garisan Polyline Leaflet
const streetLayer = ref(null)
const satelliteLayer = ref(null)
const labelLayer = ref(null)
const isSatelit = ref(false)
const cspMarker = ref(null)

// Koordinat Sasaran CSP (Dummy - dalam aplikasi sebenar perlu diambil dari data misi)
const targetCspLat = ref(null);
const targetCspLng = ref(null);

const botSpeed = ref(0)
const botHeading = ref('-')
const distanceToCsp = ref('0.00')
const courseToCsp = ref('-')
const telahTibaCsp = ref(false)

// CHAT REALTIME STATES
const paparChat = ref(false)
const senaraiMesej = ref([])
const unreadCount = ref(0)
const mesejBaharu = ref('')

// LUKISAN LOGIK ETA KOMPUTASI
const computedETA = computed(() => {
  const speed = parseFloat(botSpeed.value);
  const distance = parseFloat(distanceToCsp.value);

  if (isNaN(speed) || speed <= 0.5 || isNaN(distance) || distance <= 0) {
    return '-- Min';
  }

  // Formula: Masa (Jam) = Jarak (NM) / Kelajuan (Knot)
  const totalHours = distance / speed;
  const totalMinutes = Math.round(totalHours * 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} Minit`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours} Jam ${mins} Min`;
  }
});

// PEMETAAN JURISDIKSI REGION APMM (PADANAN FAIL WEB KAU)
const pemetaanMrscKeRegion = {
  'MRSC Langkawi': 'UTARA',
  'MRSC Klang': 'BARAT',
  'MRSC Johor Baharu': 'SELATAN',
  'MRSC Kuantan': 'TIMUR',
  'MRSC Kota Kinabalu': 'SABAH',
  'MRSC Kuching': 'SARAWAK'
}

// =========================================================================
// LOGIK FASA A: SIMULASI SMS OTP CODES
// =========================================================================
const hantarSmsOtp = () => {
  simulasiOtp.value = '1111'
  otpDihantar.value = true
}

const sahkanSmsOtp = () => {
  if (inputOtp.value === '1111') {
    currentScreen.value = 'setup'
    tarikDataAsalKesDariWeb()
    return
  }

  if (inputOtp.value === simulasiOtp.value) {
    currentScreen.value = 'setup'
    tarikDataAsalKesDariWeb()
  } else {
    alert("❌ Kod OTP tidak sah! Sila semak semula kod simulasi.")
  }
}

// =========================================================================
// LOGIK FASA B: PENAPISAN DAN KAWALAN INTEGRASI DATABASE WEB
// =========================================================================
const tarikDataAsalKesDariWeb = async () => {
  const { data, error } = await supabase.from('sar_incidents').select('*')
  if (!error && data) {
    senaraiKesWebRaw.value = data
  }
}

const kendalikanTukarMrsc = () => {
  selectedCaseId.value = ''
  selectedAsset.value = ''
  senaraiAsetTapis.value = []
  
  const kawasanTaktikal = pemetaanMrscKeRegion[selectedMrsc.value]
  senaraiKesTapis.value = senaraiKesWebRaw.value.filter(
    kes => kes.status === 'active' && kes.region === kawasanTaktikal
  )
}

const kendalikanTukarKes = async () => {
  selectedAsset.value = ''
  telahTibaCsp.value = false
  targetCspLat.value = null; // Reset CSP target when case changes
  targetCspLng.value = null; // Reset CSP target when case changes
  if (!selectedCaseId.value) return

  const { data: dataPelan, error: errorPelan } = await supabase
    .from('sar_plans')
    .select('id, sru_name')
    .eq('case_id', Number(selectedCaseId.value))

  const { data: dataTelemetry, error: errorTele } = await supabase
    .from('sru_telemetry')
    .select('boat_id, case_id')

  if (!errorPelan && dataPelan) {
    // Tapis nama bot yang memancar isyarat live KHAS untuk kes ini sahaja
    const sruAktifKesIni = dataTelemetry 
      ? dataTelemetry
          .filter(t => Number(t.case_id) === Number(selectedCaseId.value))
          .map(t => t.boat_id)
      : []
    
    senaraiAsetTapis.value = dataPelan.map(aset => ({
      id: aset.id,
      sru_name: aset.sru_name,
      isTaken: sruAktifKesIni.includes(aset.sru_name)
    }))
  }
}

// =========================================================================
// LOGIK FASA C: PENJEJAKAN GPS MAPS & REALTIME BROADCAST TELEMETRY
// =========================================================================
const mulaSync = async () => {
  currentScreen.value = 'map'
  await nextTick()
  initMap()
  mulaTracking()
  muatTurunMesej()
  dengarChatLive() // Menghidupkan talian realtime secara tersusun
}

const initMap = () => {
  const mapContainer = document.getElementById('mapContainer') || document.getElementById('map');
  if (!mapContainer || map.value) return;

  // 1. Cipta Enjin Peta Leaflet
  const enjinPeta = L.map(mapContainer, { zoomControl: false }).setView([4.2105, 101.9758], 6);

  // 2. Sediakan Lapisan-Lapisan (Simpan dalam refs supaya boleh diakses oleh tukarModPeta)
  streetLayer.value = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    zIndex: 1
  });

  satelliteLayer.value = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri',
    zIndex: 1
  });

  labelLayer.value = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Labels © Esri',
    zIndex: 2
  });

  const seaMapLayer = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
    attribution: '© OpenSeaMap contributors',
    zIndex: 10
  });

  // 3. Masukkan lapisan awal (Peta Biasa + Seamarks) sebagai DEFAULT
  streetLayer.value.addTo(enjinPeta);
  seaMapLayer.addTo(enjinPeta);
  isSatelit.value = false;

  map.value = enjinPeta;

  // INTEGRASI: Kekalkan listener dragstart supaya fungsi follow/recenter tidak ralat
  map.value.on('dragstart', () => {
    isFollowing.value = false
  });

  muatTurunPelanSAROPSDariWeb();
};

const tukarModPeta = () => {
  if (!map.value || !streetLayer.value || !satelliteLayer.value) return;
  
  if (isSatelit.value) {
    // Balik ke mod Peta Biasa
    map.value.removeLayer(satelliteLayer.value);
    map.value.removeLayer(labelLayer.value);
    streetLayer.value.addTo(map.value);
    isSatelit.value = false;
  } else {
    // Tukar ke mod Satelit
    map.value.removeLayer(streetLayer.value);
    satelliteLayer.value.addTo(map.value);
    labelLayer.value.addTo(map.value);
    isSatelit.value = true;
  }
};

const muatTurunDetailPelanSAROPS = async () => {
  if (!selectedCaseId.value || !selectedAsset.value) {
    selectedPlanDetails.value = null;
    return;
  }
  const { data, error } = await supabase
    .from('sar_plans')
    .select('*')
    .eq('case_id', Number(selectedCaseId.value))
    .eq('sru_name', selectedAsset.value)
    .single();

  if (!error && data) {
    // Memetakan nama kolum database secara selamat tanpa mengusik data sortie_waypoints
    selectedPlanDetails.value = {
      ...data,
      search_pattern: data.search_pattern || data.pattern_type || data.pattern_name || 'PARALLEL SEARCH',
      search_speed: data.search_speed || data.speed || 0,
      search_area_length: parseFloat(data.search_area_length || data.length || data.search_length || 0),
      search_area_width: parseFloat(data.search_area_width || data.width || data.search_width || 0),
      track_spacing: data.track_spacing || data.spacing || 0
    };
    console.log("📡 DATA INDUK PELAN BERJAYA DISERAGAMKAN:", selectedPlanDetails.value);
  } else {
    selectedPlanDetails.value = null;
  }
};
const muatTurunPelanSAROPSDariWeb = async () => {
  if (!selectedCaseId.value) return;

  const { data, error } = await supabase
    .from('sar_plans')
    .select('*')
    .eq('case_id', Number(selectedCaseId.value));

  if (error) {
    console.error("Gagal memuat turun pelan SAROPS:", error.message);
    return;
  }

  if (data) {
    data.forEach(pelan => {
      const warnaTema = '#10b981'; // Hijau taktikal standard SRU

      // 1. Lukis Kotak Sempadan Kawasan Carian (Search Area Polygon)
      if (pelan.corner_points && Array.isArray(pelan.corner_points) && pelan.corner_points.length >= 4) {
        const pts = pelan.corner_points.filter(p => p !== null);
        if (pts.length >= 4) {
          // Guna L.polygon untuk melukis kawasan tertutup bersegi
          L.polygon(pts, { 
            color: warnaTema, 
            weight: 2, 
            fillColor: warnaTema, 
            fillOpacity: 0.1 
          }).addTo(map.value).bindTooltip(`ZON KAWASAN: ${pelan.zone_name || 'ZON'}`);
        }
      }

      // 2. Lukis Garisan Laluan Carian Bot (Sortie Track / Waypoints)
      if (pelan.sortie_waypoints && Array.isArray(pelan.sortie_waypoints) && pelan.sortie_waypoints.length > 0) {
        const waypoints = pelan.sortie_waypoints.filter(p => p !== null);
        if (waypoints.length > 0) {
          // Guna L.polyline dengan dashArray untuk garisan taktikal putus-putus
          L.polyline(waypoints, { 
            color: '#fbbf24', // Warna oren/kuning amaran untuk track laluan
            weight: 2, 
            dashArray: '5, 8', 
            opacity: 0.9 
          }).addTo(map.value);
        }
      }

      // 3. Lukis Titik Mula Carian (CSP - Commence Search Point)
      if (pelan.csp_coord && Array.isArray(pelan.csp_coord)) {
        L.circleMarker(pelan.csp_coord, { 
          color: '#ef4444', 
          fillColor: '#ef4444', 
          fillOpacity: 1, 
          radius: 5 
        }).addTo(map.value).bindTooltip(`CSP (${pelan.sru_name})`, { permanent: false, direction: 'top' });

        // Jika CSP ini milik aset yang sedang dipilih, set sebagai target untuk pengiraan jarak dan garisan
        if (pelan.sru_name === selectedAsset.value) {
          targetCspLat.value = pelan.csp_coord[0];
          targetCspLng.value = pelan.csp_coord[1];
          console.log(`📡 CSP Dinamik Diterima [${selectedAsset.value}]: ${targetCspLat.value}, ${targetCspLng.value}`);
        }
      }
    });

    // Fokuskan peta secara automatik ke kawasan carian kes yang dipilih
    fokusKeKawasanSAR();
  }
};

// Cipta fungsi pembantu ini di bawah muatTurunPelanSAROPSDariWeb untuk auto-focus peta
const fokusKeKawasanSAR = async () => {
  const { data } = await supabase
    .from('sar_plans')
    .select('corner_points')
    .eq('case_id', Number(selectedCaseId.value));

  if (data && data.length > 0 && map.value) {
    const boundsKoleksi = [];
    data.forEach(p => {
      if (p.corner_points && Array.isArray(p.corner_points) && p.corner_points.length > 0) {
        p.corner_points.forEach(pt => {
          if (pt) boundsKoleksi.push(pt);
        });
      }
    });
    if (boundsKoleksi.length > 0) {
      map.value.fitBounds(L.latLngBounds(boundsKoleksi), { padding: [40, 40] });
    }
  }
};

const mulaTracking = async () => {
  try {
    isTracking.value = true;
    console.log("Memulakan penjejakan GPS...");

    try {
      // Mod Peranti Mudah Alih (Capacitor Engine)
      const permission = await Geolocation.requestPermissions()
      if (permission.location !== 'granted') {
        alert('Kebenaran Lokasi diperlukan untuk operasi SAR!');
        isTracking.value = false; // Set tracking to false if permission denied
        console.warn("Kebenaran lokasi ditolak.");
        return;
      }
      console.log("Kebenaran lokasi diberikan.");

      watchId.value = await Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Force fresh position
      }, (position, err) => { // Capacitor's watchPosition callback has two arguments
        if (err) {
          console.error("Ralat Capacitor Geolocation watchPosition:", err);
          // Optionally, alert the user or stop tracking if errors persist
          // alert('Ralat GPS peranti: ' + err.message);
          // hentiTracking(); // Consider stopping if critical error
          return;
        }
        if (position) {
          console.log("Posisi GPS diterima (Capacitor):", position.coords.latitude, position.coords.longitude, "Speed:", position.coords.speed, "Heading:", position.coords.heading);
          kemaskiniLokasiSatelit(position.coords.latitude, position.coords.longitude, position.coords.speed, position.coords.heading);
        } else {
          console.warn("Tiada posisi GPS diterima dari Capacitor.");
        }
      })
    } catch (webError) {
      // Mod Browser/Laptop Fallback (Penyelamat)
      if (webError.message.includes('Not implemented on web') || !window.Capacitor) { // Check if Capacitor is not available
        console.log("Menggunakan GPS Web Browser...");
        watchId.value = navigator.geolocation.watchPosition((position) => {
          console.log("Posisi GPS diterima (Web):", position.coords.latitude, position.coords.longitude, "Speed:", position.coords.speed, "Heading:", position.coords.heading);
          kemaskiniLokasiSatelit(position.coords.latitude, position.coords.longitude, position.coords.speed, position.coords.heading);
        }, (err) => {
          console.error("Ralat Web Geolocation watchPosition:", err);
          alert('Ralat GPS pelayar: ' + err.message);
          isTracking.value = false; // Set tracking to false on web error
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
      } else {
        // This catch block might also be hit for other Capacitor errors not related to 'Not implemented on web'
        console.error("Ralat umum Capacitor Geolocation:", webError);
        alert('Ralat umum GPS peranti: ' + webError.message);
        isTracking.value = false;
      }
    }
  } catch (e) {
    alert('Ralat membaca GPS hardware: ' + e.message);
    isTracking.value = false;
  }
}

const formatCoordinate = (coord, isLat) => {
  if (coord === 0 || coord === null || coord === undefined) {
    return isLat ? "00 00.000N" : "000 00.000E";
  }
  
  const absolute = Math.abs(coord);
  const degrees = Math.floor(absolute);
  const minutes = ((absolute - degrees) * 60).toFixed(3);
  
  const paddedDegrees = isLat 
    ? degrees.toString().padStart(2, '0') 
    : degrees.toString().padStart(3, '0');
  const paddedMinutes = minutes.padStart(6, '0'); 
  const suffix = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
  
  return `${paddedDegrees} ${paddedMinutes}${suffix}`;
};

const kemaskiniLokasiSatelit = (lat, lng, speed, heading) => {
  currentLat.value = lat;
  currentLng.value = lng;
  
  // LOGIK TRACK HISTORY
  if (lat && lng && lat !== 0 && lng !== 0) {
    trackHistoryCoordinates.value.push([lat, lng]);
    
    // Lukis atau kemaskini garisan sejarah atas peta peranti
    if (map.value) {
      if (!trackPolylineInstance) {
        trackPolylineInstance = L.polyline(trackHistoryCoordinates.value, {
          color: '#fbbf24', // Warna oren/kuning emas taktikal
          weight: 3,
          dashArray: '5, 5', // Garisan putus-putus sejarah
          opacity: 0.8
        }).addTo(map.value);
      } else {
        trackPolylineInstance.setLatLngs(trackHistoryCoordinates.value);
      }
    }
  }

  // 1. Baca kelajuan live (jika peranti pegun atau speed null, letak 0)
  // Geolocation bagi m/s, kita tukar ke Knots (kts) dengan darab 1.94384
  if (speed !== null && speed !== undefined) {
    botSpeed.value = speed * 1.94384;
  } else {
    botSpeed.value = 0;
  }

  // 2. Baca arah pergerakan live (heading/course).
  // Jika kelajuan bot 0, paparkan '-' untuk heading. Jika tidak, guna heading sebenar.
  if (botSpeed.value > 0.5) { // Anggap bot bergerak jika kelajuan lebih dari 0.5 kts
    if (heading !== null && heading !== undefined) {
      botHeading.value = heading;
    }
  } else {
    botHeading.value = '-'; // Bot tidak bergerak, paparkan '-'
  }


  // Ikon Marker Dinamik (Arrow) untuk pusingan heading
  const userIcon = L.divIcon({
    className: 'user-marker-icon',
    html: `<div style="transform: rotate(${botHeading.value !== '-' ? botHeading.value : 0}deg); transition: transform 0.3s ease-out;">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#00ffff" stroke="#013333" stroke-width="1"/>
             </svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  // 3. Update marker bot cyan atas peta peranti mudah alih
  if (!userMarker.value) {
    userMarker.value = L.marker([lat, lng], { icon: userIcon }).addTo(map.value);
    map.value.setView([lat, lng], 15);
  } else {
    userMarker.value.setLatLng([lat, lng]);
    userMarker.value.setIcon(userIcon);
  }

  // Logik auto-follow dengan anjakan offset Y
  if (isFollowing.value) {
    const zoom = map.value.getZoom();
    const userP = map.value.project([lat, lng], zoom);
    const shiftedP = userP.subtract([0, 100]); // Anjakkan titik tengah peta ke atas supaya marker di bawah
    const shiftedL = map.value.unproject(shiftedP, zoom);
    map.value.panTo(shiftedL);
  }

  // Kira jarak ke CSP (Course to Steer Point)
  if (targetCspLat.value !== null && targetCspLng.value !== null) {
    const dist = calculateDistance(currentLat.value, currentLng.value, targetCspLat.value, targetCspLng.value);
    distanceToCsp.value = dist.toFixed(2);

    // Logik tiba di CSP (0.2 NM)
    if (dist <= 0.2) {
      telahTibaCsp.value = true;
    }

    courseToCsp.value = kiraBaringan(currentLat.value, currentLng.value, targetCspLat.value, targetCspLng.value);
    
    // Lukis atau kemaskini garisan ke CSP
    const linePoints = [[lat, lng], [targetCspLat.value, targetCspLng.value]];
    if (!cspLine.value && map.value) { // Pastikan map.value wujud sebelum menambah layer
      cspLine.value = L.polyline(linePoints, { color: '#ef4444', weight: 2, dashArray: '5, 10' }).addTo(map.value);
      // Penanda CSP sudah dilukis dalam muatTurunPelanSAROPSDariWeb
      // cspMarker.value = L.circleMarker([targetCspLat.value, targetCspLng.value], { color: '#f87171', radius: 5, fillOpacity: 1 }).addTo(map.value).bindTooltip("CSP Target", { permanent: false });
    } else {
      cspLine.value.setLatLngs(linePoints);
    }
  } else {
    distanceToCsp.value = 0;
  }

  // 4. Tembak data satelit yang betul-betul live ini ke pangkalan data web
  hantarTelemetryKeWeb(lat, lng);
}

const hantarTelemetryKeWeb = async (lat, lng) => {
  if (!selectedAsset.value) return;

  try {
    // 1. Padam kedudukan lama bot ini dari bilik gerakan bagi mengelakkan data bertimbun
    await supabase.from('sru_telemetry').delete().eq('boat_id', selectedAsset.value);

    // Tentukan nilai course untuk dihantar. Pastikan sentiasa numerik untuk mengelakkan ralat database.
    let courseValue = Number(botHeading.value);
    if (isNaN(courseValue) || botHeading.value === '-') {
      courseValue = 0; 
    }

    // 2. Masukkan koordinat satelit terbaharu yang betul-betul segar
    const { error } = await supabase.from('sru_telemetry').insert([
      {
        boat_id: selectedAsset.value,
        latitude: Number(lat),
        longitude: Number(lng),
        speed: parseFloat(botSpeed.value.toFixed(1)), 
        course: courseValue, // Gunakan nilai course yang telah ditentukan
        csp: parseFloat(distanceToCsp.value) || 0 
      }
    ]);

    if (error) {
      console.error("Gagal memancarkan isyarat GPS ke bilik gerakan HQ:", error.message);
    }
  } catch (err) {
    console.error("Ralat telemetri:", err);
  }
};

// Haversine formula untuk mengira jarak antara dua titik latitud/longitud
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // jejari bumi dalam meter
  const φ1 = lat1 * Math.PI / 180; // latitud, longitud dalam radian
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceMeters = R * c; // dalam meter
  return distanceMeters / 1852; // Tukar kepada Batu Nautika (1 NM = 1852 meter)
};

// Fungsi mengira baringan (course) dari koordinat A ke B
const kiraBaringan = (lat1, lon1, lat2, lon2) => {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const bearing = (θ * 180 / Math.PI + 360) % 360;
  return Math.round(bearing);
};

const recenterMap = () => {
  isFollowing.value = true;
  fokusLokasiOffset();
};

const fokusLokasiOffset = () => {
  if (map.value && currentLat.value !== 0) {
    const zoom = 15;
    // Kita kira titik koordinat baru supaya marker GPS berada di bahagian bawah skrin.
    const userPoint = map.value.project([currentLat.value, currentLng.value], zoom);
    const shiftedPoint = userPoint.subtract([0, 100]); // Anjakkan pusat peta ke atas 100px
    const shiftedLatLng = map.value.unproject(shiftedPoint, zoom);
    map.value.flyTo(shiftedLatLng, zoom);
  }
};

const toggleWaypointList = async () => {
  paparWaypointList.value = !paparWaypointList.value;
  paparConfirmStop.value = false;
  paparChat.value = false; // Tutup chat jika buka waypoint list
  if (paparWaypointList.value) await muatTurunDetailPelanSAROPS();
};
const hentiTracking = async () => {
  if (watchId.value) {
    // Semak jika watchId adalah dari navigator.geolocation (nombor) atau Capacitor (objek dengan id)
    if (typeof watchId.value === 'number') { // Web Geolocation watchId is a number
      navigator.geolocation.clearWatch(watchId.value);
    } else if (watchId.value && watchId.value.id) { // Capacitor watchId is an object with an 'id' property
      await Geolocation.clearWatch({ id: watchId.value.id });
    }
  }
  
  await supabase.from('sru_telemetry').delete().eq('boat_id', selectedAsset.value)

  isTracking.value = false
  telahTibaCsp.value = false
  targetCspLat.value = null; // Reset CSP target
  targetCspLng.value = null; // Reset CSP target

  // RESET TRACK HISTORY
  trackHistoryCoordinates.value = [];
  if (trackPolylineInstance && map.value) {
    map.value.removeLayer(trackPolylineInstance);
    trackPolylineInstance = null;
  }

  if (cspLine.value) { map.value.removeLayer(cspLine.value); cspLine.value = null }
  if (cspMarker.value) { map.value.removeLayer(cspMarker.value); cspMarker.value = null }
  if (userMarker.value) { map.value.removeLayer(userMarker.value); userMarker.value = null }
  map.value = null
  currentScreen.value = 'setup'
}

// =========================================================================
// LOGIK FASA D: TAKTICAL REALTIME CHAT MENGIKUT KES SPESIFIK
// =========================================================================
const muatTurunMesej = async () => {
  const { data } = await supabase
    .from('sar_messages')
    .select('*')
    .eq('case_id', Number(selectedCaseId.value))
    .eq('chat_type', 'local')
    .order('created_at', { ascending: true })
    
  if (data) senaraiMesej.value = data
  autoScrollChat()
}

const hantarMesej = async () => {
  if (!mesejBaharu.value.trim()) return

  const customMsg = {
    case_id: Number(selectedCaseId.value),
    sender: selectedAsset.value,
    message: mesejBaharu.value.trim(),
    chat_type: 'local'
  }

  const { error } = await supabase.from('sar_messages').insert([customMsg])
  if (!error) {
    mesejBaharu.value = ''
  }
}

const dengarChatLive = () => {
  supabase
    .channel('sar-messages-live')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sar_messages' }, payload => {
      if (payload.new.case_id === Number(selectedCaseId.value) && payload.new.chat_type === 'local') {
        // Mencegah pertindihan data mesej yang sama masuk ke dalam array perbualan
        const mesejWujud = senaraiMesej.value.some(msg => msg.id === payload.new.id)
        if (!mesejWujud) {
          senaraiMesej.value.push(payload.new)
          if (!paparChat.value) {
            unreadCount.value++
          }
          autoScrollChat()
        }
      }
    })
    .subscribe()
}

const autoScrollChat = () => {
  nextTick(() => {
    const el = document.querySelector('.chat-box')
    if (el) el.scrollTop = el.scrollHeight
  })
}
</script>

<style scoped>
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
.chat-box::-webkit-scrollbar, .scroll-taktikal::-webkit-scrollbar { width: 4px; }
.chat-box::-webkit-scrollbar-thumb, .scroll-taktikal::-webkit-scrollbar-thumb { background: #60a5fa; border-radius: 2px; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in-content {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes wave {
  0%, 100% { transform: translateY(0) skewX(-2deg); }
  50% { transform: translateY(-5px) skewX(2deg); }
}
.wave-text span {
  display: inline-block;
  animation: wave 2s ease-in-out infinite;
  /* Rupa Chrome/Metallic */
  background: linear-gradient(to bottom, #ffffff 0%, #cbd5e1 45%, #475569 50%, #94a3b8 55%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* Kesan 3D Extrusion */
  filter: drop-shadow(1px 1px 0px #cbd5e1) 
          drop-shadow(2px 2px 0px #475569) 
          drop-shadow(4px 4px 6px rgba(0,0,0,0.7));
}

/* Animasi Slide Up untuk SAP & Message */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease-out;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

/* Animasi Pop untuk Confirmation */
.pop-enter-active, .pop-leave-active {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-enter-from, .pop-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>