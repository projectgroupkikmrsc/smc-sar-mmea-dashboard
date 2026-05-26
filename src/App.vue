<template>
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; min-height: 100dvh; min-width: 1280px; width: 100%; display: flex; flex-direction: column; color: #f1f5f9; overflow: auto; box-sizing: border-box; margin: 0; padding: 0;">
    
    <div v-if="!isLoggedIn" :style="{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }">
      <div style="position: absolute; width: 100%; height: 100%; opacity: 0.03; background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 20px 20px;"></div>
      <div style="background: #ffffff; width: 420px; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); overflow: hidden; color: #1e293b; z-index: 10; border: 1px solid #cbd5e1; animation: popupAnim 0.2s ease-out;">
        <div style="background: #0f172a; padding: 25px; text-align: center; border-bottom: 4px solid #2563eb; color: white;">
          <img :src="logoBclbb" alt="Logo" style="height: 60px; margin-bottom: 10px;" />
          <h2 style="margin: 0; font-size: 16px; letter-spacing: 1px; font-weight: 800; color: #f8fafc;">SEARCH AND RESCUE</h2>
          <span style="font-size: 11px; color: #38bdf8; font-weight: bold; letter-spacing: 0.5px;">MALAYSIA MARITIME ENFORCEMENT AGENCY</span>
        </div>
        <div style="padding: 25px; display: flex; flex-direction: column; gap: 16px;">
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: bold; color: #0f172a;">Personnel Authentication</h3>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Enter your credentials to access the secure command network.</p>
          </div>
          <div>
            <label style="display: block; font-size: 10px; font-weight: bold; color: #475569; margin-bottom: 5px; text-transform: uppercase;">USERNAME / STATION ID</label>
            <select v-model="loginForm.stationId" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-weight: 600; background-color: #f8fafc; color: #0f172a;">
              <option value="" disabled>-- Pilih Stesen Operator --</option>
              <option value="MRCC Putrajaya" style="font-weight: bold; color: #2563eb;">⭐ MRCC Putrajaya (HQ Kebangsaan)</option>
              <option disabled>──────────────</option>
              <option value="MRSC Langkawi">MRSC Langkawi (Wilayah Utara)</option>
              <option value="MRSC Klang">MRSC Klang (Wilayah Barat)</option>
              <option value="MRSC Johor Baharu">MRSC Johor Baharu (Wilayah Selatan)</option>
              <option value="MRSC Kuantan">MRSC Kuantan (Wilayah Timur)</option>
              <option value="MRSC Kota Kinabalu">MRSC Kota Kinabalu (Wilayah Sabah)</option>
              <option value="MRSC Kuching">MRSC Kuching (Wilayah Sarawak)</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 10px; font-weight: bold; color: #475569; margin-bottom: 5px; text-transform: uppercase;">SECURITY PASSWORD</label>
            <input type="password" v-model="loginForm.password" placeholder="••••••••" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" @keyup.enter="prosesLoginMMEA" />
          </div>
          <div v-if="loginError" style="background: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c; padding: 8px 12px; border-radius: 6px; font-size: 11px; font-weight: bold;">
            ❌ {{ loginError }}
          </div>
          <button @click="prosesLoginMMEA" style="width: 100%; background: #2563eb; color: white; border: none; padding: 12px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer; text-align: center;">
            Initialize Login Session &gt;
          </button>
        </div>
        <div style="background: #f8fafc; padding: 12px 25px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0;">
          <span>V6.1.0-SECURITY-LOCK</span>
          <span style="color: #ef4444; font-weight: bold;">ROLES SEGREGATION ACTIVE</span>
        </div>
      </div>
    </div>

    <div v-else style="flex: 1; display: flex; flex-direction: column; height: 100vh; width: 100vw; overflow: hidden;">
      
      <div style="background-color: #020617; color: #64748b; padding: 6px 20px; font-size: 10px; font-weight: bold; display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; flex-shrink: 0; z-index: 50;">
        <div>MALAYSIA MARITIME ENFORCEMENT AGENCY (MMEA) • {{ activeStation.toUpperCase() }}</div>
        <div style="display: flex; gap: 15px; align-items: center;">
          <span v-if="activeStation === 'MRCC Putrajaya'"><strong style="color: #fbbf24;">🖥️ MODE OVERSEER: HAK MENONTON SAHAJA</strong></span>
          <span v-else>REGION TAKTIKAL: <strong style="color: #38bdf8;">WILAYAH {{ activeRegion }}</strong></span>
          <button @click="prosesLogKeluar" style="background: #334155; color: #f87171; border: 1px solid #475569; padding: 1px 6px; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold;">LOGOUT 🔓</button>
        </div>
      </div>

      <header style="background-color: #0f172a; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1d4ed8; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 50;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img :src="logoBclbb" alt="BCLBB Logo" style="height: 45px; width: auto;" />
          <div>
            <h1 style="margin: 0; font-size: 18px; letter-spacing: 1px; color: #f8fafc;">SAR MISSION COORDINATOR DASHBOARD</h1>
            <span style="font-size: 11px; color: #38bdf8; font-weight: bold; letter-spacing: 0.5px;">STESEN: {{ activeStation }} // OPERATIONS OVERSEER SYSTEM</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; text-align: right; gap: 2px;">
          <div style="font-size: 11px; font-weight: bold; color: #34d399; text-transform: uppercase;">
            🟢 CONNECTED TO DATABASE
          </div>
          <div style="font-size: 9px; font-weight: 600; color: #38bdf8; text-transform: uppercase; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ tacticalLogs[0] || 'WAITING FOR SYSTEM LOGS...' }}
          </div>
        </div>
      </header>

      <div style="display: grid; grid-template-columns: 320px 1fr 340px; gap: 12px; padding: 12px; flex: 1; min-height: 0; box-sizing: border-box; width: 100%;">
        
        <div style="display: flex; flex-direction: column; gap: 12px; min-height: 0; z-index: 20;">
          
          <div style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #38bdf8; padding: 12px; flex-shrink: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 12px; color: #38bdf8; text-transform: uppercase;">
                🌐 INCIDENT SETUP {{ activeStation === 'MRCC Putrajaya' ? '(HQ)' : `(${activeRegion})` }}
              </h4>
              
              <div style="display: flex; gap: 6px;">
                <button @click="bukaModalLoadKes" style="background: #0284c7; color: white; border: none; padding: 3px 10px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;">
                  📂 Load
                </button>
                
                <button v-if="activeStation !== 'MRCC Putrajaya'" @click="bukaModalTambahKes" style="background: #2563eb; color: white; border: none; padding: 3px 10px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;">
                  + New
                </button>
              </div>
            </div>

            <div style="margin-bottom: 8px;">
              <label style="display: block; font-size: 10px; font-weight: bold; color: #94a3b8; margin-bottom: 4px;">SAR CASE IDENTITY</label>
              
              <div style="display: grid; grid-template-columns: 1fr auto; gap: 6px; align-items: center; width: 100%;">
                <select v-model="selectedCaseId" @change="tukarKesTaktikal" style="width: 100%; padding: 7px; border: 1px solid #475569; border-radius: 4px; font-size: 12px; font-weight: bold; background-color: #0f172a; color: #f8fafc; height: 34px;">
                  <option value="ALL" :disabled="activeChatTab === 'local'">
                    {{ activeStation === 'MRCC Putrajaya' ? '🌍 [PANDANGAN GLOBAL NASIONAL - SEMUA KES]' : `🌍 [SEMUA KES AKTIF WILAYAH ${activeRegion}]` }}
                  </option>
                  
                  <template v-if="activeStation === 'MRCC Putrajaya'"> 
                    <option disabled value="">-- KES AKTIF MENYELURUH --</option>
                    <option v-for="kes in senaraiKesAktifSahaja" :key="kes.id" :value="kes.id">
                      [{{ kes.region }}] #{{ kes.id }} - {{ kes.case_name }}
                    </option>
                  </template>

                  <template v-else>
                    <option value="" disabled>-- Sila Pilih Kes Spesifik --</option>
                    <option v-for="kes in senaraiKesAktifSahaja" :key="kes.id" :value="kes.id">
                      #{{ kes.id }} - {{ kes.case_name }}
                    </option>
                  </template>
                </select>

                <button v-if="selectedCaseId !== 'ALL' && selectedCaseId !== ''" @click="bukaModalEditKes" style="background: #334155; color: #38bdf8; border: 1px solid #475569; width: 36px; height: 34px; border-radius: 4px; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;">
                  ✏️
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeStation !== 'MRCC Putrajaya'" style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #0284c7; padding: 12px; flex-shrink: 0;">
            <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #38bdf8; text-transform: uppercase;">📤 SEARCH ACTION PLAN (SAROPS)</h4>
            <label style="border: 2px dashed #475569; border-radius: 6px; padding: 15px 10px; text-align: center; color: #94a3b8; font-size: 11px; background-color: #0f172a; display: block; cursor: pointer;">
              <span style="font-size: 20px; display: block; margin-bottom: 5px;">📄</span>
              Klik untuk Muat Naik Taktikal SAROPS<br>
              <span style="color:#f59e0b; font-size:10px;" v-if="selectedCaseId === 'ALL'">⚠️ Pilih kes spesifik dulu untuk ikat file</span>
              <span v-else style="color:#34d399; font-weight: bold;">Auto-Save diaktifkan 🟢</span>
              <input type="file" multiple accept=".txt" @change="bacaFailSAROPS" style="display: none;" />
            </label>
          </div>

          <div style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #10b981; padding: 12px; flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #34d399; text-transform: uppercase;">⚓ SRU ASSIGNMENT</h4>
            <div style="display: flex; flex-direction: column; gap: 6px; flex: 1; overflow-y: auto; padding-right: 2px;">
              <div v-for="(sru) in paparanSRUKesAktif" :key="sru.id" style="padding: 6px; background:#0f172a; border-radius:4px; border-left: 3px solid #10b981; border: 1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="font-size:11px; color:#fff;">{{ sru.nama }}</strong>
                  <span style="background: #1e3a8a; color: #93c5fd; font-size: 8px; padding: 1px 3px; border-radius: 3px; margin-left: 5px; font-weight: bold;">ZON {{ sru.kawasanNama }}</span>
                  <br/>
                  <span style="font-size:9px; color:#64748b;">PAT: {{ sru.corak }}</span>
                </div>
                
                <button v-if="activeStation !== 'MRCC Putrajaya'" @click="bukaPopUpPadam(sru)" style="background: #4c1d15; color: #f87171; border: 1px solid #991b1b; padding: 4px 8px; font-size: 10px; font-weight: bold; border-radius: 4px; cursor: pointer;">🗑️ Padam</button>
              </div>
              <div v-if="paparanSRUKesAktif.length === 0" style="text-align: center; color: #64748b; font-size: 11px; margin-top: 20px;">📭 Tiada SRU diplot.</div>
            </div>
          </div>
        </div>

        <div style="background-color: #e2e8f0; border-radius: 6px; border: 1px solid #334155; position: relative; overflow: hidden; display: flex; flex-direction: column; min-height: 400px;">
          <div id="map" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1;"></div>
          
          <!-- Map Drawing Toolbar -->
          <div v-if="isLoggedIn" class="map-toolbar">
            <button @click="aktifkanTool('circle')" :class="{ active: activeTool === 'circle' }" title="Draw Circle">⭕</button>
            <button @click="aktifkanTool('rect')" :class="{ active: activeTool === 'rect' }" title="Draw Rectangle">⬛</button>
            <button @click="aktifkanTool('line')" :class="{ active: activeTool === 'line' }" title="Measure Distance / Arrow">📏</button>
            <button @click="aktifkanTool('text')" :class="{ active: activeTool === 'text' }" title="Add Text">abc</button>
            <div style="height: 1px; background: #334155; margin: 2px 0;"></div>
            <button @click="bersihkanLukisan" style="color: #f87171;" title="Clear Tools">🗑️</button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; min-height: 0; z-index: 20;">
          <!-- CARD 1: SRU STATUS -->
          <div style="background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 16px; color: #1e293b; display: flex; flex-direction: column; border: 1px solid #e2e8f0; flex-shrink: 0;">
            <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px;">📡 SRU STATUS</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
              <thead>
                <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b; text-align: left;">
                  <th style="padding-bottom: 10px; font-weight: 700;">BOAT ID</th>
                  <th style="padding-bottom: 10px; font-weight: 700;">KTS</th>
                  <th style="padding-bottom: 10px; font-weight: 700;">CRS</th>
                  <th style="padding-bottom: 10px; font-weight: 700;">CSP (NM)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tele in telemetriRealtime" :key="tele.id" style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 800; color: #0f172a;">{{ tele.boat_id }}</td>
                  <td style="padding: 10px 0;">{{ tele.speed || '0.0' }}</td>
                  <td style="padding: 10px 0;">{{ tele.course ? tele.course + '°' : '---' }}</td>
                  <td style="padding: 10px 0; color: #2563eb; font-weight: 800;">{{ tele.csp || '0.0' }} NM</td>
                </tr>
                <tr v-if="telemetriRealtime.length === 0">
                  <td colspan="4" style="padding: 30px 0; text-align: center; color: #94a3b8; font-style: italic;">No live GPS tracking active</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TRACK HISTORY TOGGLE CARD -->
          <div style="background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 12px; border: 1px solid #e2e8f0; flex-shrink: 0;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none;">
              <input type="checkbox" v-model="paparkanTrekLaluan" style="width: 16px; height: 16px; cursor: pointer;" />
              <span style="font-size: 11px; font-weight: 800; color: #1e293b; letter-spacing: 0.3px;">
                ⏳ PAPAR TREK LALUAN TAKTIKAL
              </span>
            </label>
          </div>

          <!-- CARD 2: COMM LINK -->
          <div style="background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 16px; color: #1e293b; flex: 1; display: flex; flex-direction: column; min-height: 0; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px;">💬 SRU COMMUNICATION</h4>
              <span v-if="globalUnreadCount > 0 && activeChatTab !== 'global'" style="background: #fee2e2; color: #ef4444; font-size: 9px; font-weight: 900; padding: 3px 8px; border-radius: 20px; border: 1px solid #fecaca;">
                {{ globalUnreadCount }} UNREAD
              </span>
            </div>

            <!-- TABS SYSTEM: GLOBAL & LOCAL -->
            <div style="display: flex; gap: 8px; margin-bottom: 15px;">
              <button 
                @click="activeChatTab = 'global'; langganMesejRealtimeSupabase()" 
                :style="{
                  background: activeChatTab === 'global' ? '#2563eb' : '#e2e8f0',
                  color: activeChatTab === 'global' ? 'white' : '#64748b',
                  border: activeChatTab === 'global' ? 'none' : '1px solid #e2e8f0',
                  padding: '7px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', transition: '0.2s', flex: '1'
                }"
              >Global</button>
              <button 
                @click="activeChatTab = 'local'; langganMesejRealtimeSupabase()" 
                :style="{
                  background: activeChatTab === 'local' ? '#2563eb' : '#e2e8f0',
                  color: activeChatTab === 'local' ? 'white' : '#64748b',
                  border: activeChatTab === 'local' ? 'none' : '1px solid #e2e8f0',
                  padding: '7px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', transition: '0.2s', flex: '1'
                }"
              >Local</button>
            </div>

            <div class="chat-messages-container" style="flex: 1; background-color: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; padding: 12px; font-size: 11px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
               <div v-for="msg in filteredMesejChat" :key="msg.id" :class="{'message-right': msg.sender === activeStation, 'message-left': msg.sender !== activeStation}" style="display: flex; flex-direction: column; gap: 4px;">
                 <div :style="{ 'align-self': msg.sender === activeStation ? 'flex-end' : 'flex-start' }">
                   <span style="font-weight: 800; color: #334155; font-size: 10px;">{{ msg.sender }}</span>
                   <span style="color: #94a3b8; font-size: 9px; margin-left: 8px;">{{ formatMasaChat(msg.created_at) }}</span>
                 </div>
                 <div :style="{
                   background: msg.sender === activeStation ? '#e0f2fe' : '#ffffff',
                   padding: '10px 14px',
                   borderRadius: msg.sender === activeStation ? '12px 0 12px 12px' : '0 12px 12px 12px',
                   border: msg.sender === activeStation ? '1px solid #90cdf4' : '1px solid #e2e8f0',
                   color: '#1e293b',
                   lineHeight: '1.5',
                   boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                   maxWidth: '80%',
                   'align-self': msg.sender === activeStation ? 'flex-end' : 'flex-start'
                 }">
                   {{ msg.message }}
                 </div>
               </div>
            </div>

            <div style="margin-top: 15px; position: relative;">
              <input 
                type="text" 
                v-model="inputMesejBaru" 
                @keyup.enter="hantarMesejChatSupabase"
                :placeholder="localChatPlaceholder" 
                :disabled="isLocalChatInputDisabled"
                style="width: 100%; border: 1px solid #e2e8f0; padding: 12px 45px 12px 18px; border-radius: 25px; font-size: 11px; outline: none; transition: 0.2s;"
                :style="{ background: isLocalChatInputDisabled ? '#1e293b' : '#f8fafc', color: isLocalChatInputDisabled ? '#94a3b8' : '#1e293b' }"
              />
              <button 
                @click="hantarMesejChatSupabase" 
                :disabled="isLocalChatInputDisabled"
                style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); color: white; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);"
                :style="{ background: isLocalChatInputDisabled ? '#334155' : '#2563eb' }"
              >
                <span style="font-size: 14px;">➤</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <div v-if="showAddCaseModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: #ffffff; width: 440px; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); overflow: hidden; color: #1e293b; font-family: sans-serif; animation: popupAnim 0.15s ease-out;">
          <div style="padding: 15px 20px 5px 20px; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="margin: 0; font-size: 18px; font-weight: bold; color: #2563eb;">New Incident</h2>
            <button @click="showAddCaseModal = false" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b;">×</button>
          </div>
          <p style="margin: 0 20px 15px 20px; font-size: 12px; color: #64748b;">Fill required case details to create a new incident in Region <strong>{{ activeRegion }}</strong>.</p>
          
          <div style="padding: 0 20px 20px 20px; display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-size: 10px; font-weight: bold; color: #475569; margin-bottom: 4px; text-transform: uppercase;">CASE NO *</label>
              <input type="text" v-model="formAddKes.case_no" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
            </div>
            <div>
              <label style="display: block; font-size: 10px; font-weight: bold; color: #475569; margin-bottom: 4px; text-transform: uppercase;">CASE IDENTITY / NAME *</label>
              <input type="text" v-model="formAddKes.case_name" placeholder="E.g., MV Ocean Voyager - Engine Failure" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
            </div>
            <div>
              <label style="display: block; font-size: 10px; font-weight: bold; color: #475569; margin-bottom: 4px; text-transform: uppercase;">SEARCH OBJECT</label>
              <input type="text" v-model="formAddKes.search_object" placeholder="E.g., Blue Hull Fishing Vessel" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
            </div>
          </div>

          <div style="padding: 0 20px 20px 20px; display: flex; flex-direction: column; gap: 8px;">
            <button @click="simpanKesBaruSupabase" style="width: 100%; background: #2563eb; color: white; border: none; padding: 10px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer;">Create Incident</button>
            <button @click="showAddCaseModal = false" style="width: 100%; background: white; color: #475569; border: 1px solid #cbd5e1; padding: 10px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer;">Cancel</button>
          </div>
        </div>
      </div>

      <div v-if="showLoadCaseModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: #ffffff; width: 520px; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); overflow: hidden; color: #1e293b; font-family: sans-serif; animation: popupAnim 0.15s ease-out;">
          <div style="padding: 15px 20px 5px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0;">
            <h2 style="margin: 0; font-size: 16px; font-weight: bold; color: #0284c7;">📁 Archive & History Explorer {{ activeStation === 'MRCC Putrajaya' ? '(Nasional)' : `(Wilayah ${activeRegion})` }}</h2>
            <button @click="showLoadCaseModal = false" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b;">×</button>
          </div>
          
          <div style="padding: 15px; max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
            <p style="margin: 0; font-size: 11px; color: #64748b; font-style: italic;">Pilih mana-mana kes lama/arkib untuk diaktifkan semula ke skrin taktikal:</p>
            
            <div v-for="oldKes in senaraiKes" :key="oldKes.id" @click="pilihDanLoadKesLama(oldKes.id)" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; background: #f8fafc; transition: 0.2s; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="font-size: 12px; color: #0f172a;">#{{ oldKes.id }} - {{ oldKes.case_name }}</strong><br>
                <span style="font-size: 10px; color: #64748b;">Wilayah: {{ oldKes.region }}</span>
              </div>
              
              <span v-if="oldKes.status === 'accomplished'" style="background: #064e3b; color: #34d399; padding: 2px 6px; font-size: 9px; font-weight: bold; border-radius: 3px;">✅ ACCOMPLISHED</span>
              <span v-else style="background: #1e3a8a; color: #93c5fd; padding: 2px 6px; font-size: 9px; font-weight: bold; border-radius: 3px;">🟢 ACTIVE</span>
            </div>
          </div>

          <div style="background: #f1f5f9; padding: 12px; display: flex; justify-content: flex-end;">
            <button @click="showLoadCaseModal = false" style="background: white; border: 1px solid #cbd5e1; padding: 6px 14px; font-size: 12px; font-weight: bold; border-radius: 6px; cursor: pointer;">Tutup</button>
          </div>
        </div>
      </div>

      <div v-if="showEditCaseModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: #ffffff; width: 440px; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); overflow: hidden; color: #1e293b; font-family: sans-serif; animation: popupAnim 0.15s ease-out;">
          <div style="padding: 15px 20px 5px 20px; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="margin: 0; font-size: 18px; font-weight: bold; color: #1d4ed8;">
              {{ activeStation === 'MRCC Putrajaya' ? 'Case Parameters (View Only)' : 'Update Parameters' }}
            </h2>
            <button @click="showEditCaseModal = false" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b;">×</button>
          </div>
          <div style="padding: 15px 20px; display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-size: 10px; font-weight: bold; color: #475569; margin-bottom: 4px;">CASE IDENTITY / NAME</label>
              <input type="text" v-model="formEditKes.case_name" :readonly="activeStation === 'MRCC Putrajaya'" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" :style="activeStation === 'MRCC Putrajaya' ? 'background:#f1f5f9; color:#64748b;' : ''" />
            </div>
          </div>
          
          <div style="padding: 0 20px 20px 20px; display: flex; flex-direction: column; gap: 8px;">
            <template v-if="activeStation !== 'MRCC Putrajaya'">
              <button @click="kemaskiniNamaKesSupabase" style="width: 100%; background: #2563eb; color: white; border: none; padding: 10px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer;">Update Details</button>
              <button @click="deactivateKesTaktikalSupabase" style="width: 100%; background: #16a34a; color: white; border: none; padding: 10px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer;">✅ Mission Accomplished / Deactivate Case</button>
              <button @click="padamKesDariSupabase" style="width: 100%; background: #7f1d1d; color: #fee2e2; border: 1px solid #991b1b; padding: 10px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer;">🚨 DELETE PERMANENT</button>
            </template>
            <button v-else @click="showEditCaseModal = false" style="width: 100%; background: #334155; color: white; border: none; padding: 10px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer;">Close Parameters</button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: #1e293b; width: 380px; border-radius: 8px; border: 1px solid #475569; overflow: hidden; animation: popupAnim 0.15s ease-out;">
          <div style="background: #991b1b; padding: 12px 15px; font-weight: bold; font-size: 13px; display: flex; align-items: center; gap: 8px;">⚠️ PENGESAHAN PADAM TAKTIKAL</div>
          <div style="padding: 20px 15px;">
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #cbd5e1;">Adakah anda pasti ingin memadam unit SRU ini?</p>
            <div style="background: #0f172a; padding: 10px; border-radius: 4px;">
              <strong style="color: white; font-size: 13px; display: block;">{{ sruTargetToPadam?.nama }}</strong>
              <span style="color: #38bdf8; font-size: 11px;">Sektor: {{ sruTargetToPadam?.kawasanNama }}</span>
            </div>
          </div>
          <div style="background: #0f172a; padding: 10px 15px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #334155;">
            <button @click="showDeleteModal = false" style="background: #334155; color: #cbd5e1; border: none; padding: 6px 12px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;">Batal</button>
            <button @click="sahkanPadamSRU" style="background: #dc2626; color: white; border: none; padding: 6px 16px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;">Ya, Padam</button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { supabase } from './supabase'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import logoBclbb from './assets/logo_bclbb.jpg'
import bgLogin from './assets/background_1st_page.jpg'

// PAGE 1 MANAGEMENT
const isLoggedIn = ref(false)
const loginError = ref('')
const activeStation = ref('')
const activeRegion = ref('')
const loginForm = ref({ stationId: '', password: '' })

// TELEMETRY MANAGEMENT (REAL-TIME GPS)
const telemetriRealtime = ref([])

const langganTelemetriMMEA = () => {
  supabase
    .channel('sru_status_live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sru_telemetry' }, payload => {
      if (payload.eventType === 'INSERT') {
        telemetriRealtime.value.push(payload.new)
      } else if (payload.eventType === 'UPDATE') {
        const idx = telemetriRealtime.value.findIndex(t => t.id === payload.new.id)
        if (idx !== -1) telemetriRealtime.value[idx] = payload.new
      } else if (payload.eventType === 'DELETE') {
        telemetriRealtime.value = telemetriRealtime.value.filter(t => t.id !== payload.old.id)
      }
    })
    .subscribe()
}

const pemetaanStesenRegion = {
  'MRCC Putrajaya': 'NASIONAL', 
  'MRSC Langkawi': 'UTARA',
  'MRSC Klang': 'BARAT',
  'MRSC Johor Baharu': 'SELATAN',
  'MRSC Kuantan': 'TIMUR',
  'MRSC Kota Kinabalu': 'SABAH',
  'MRSC Kuching': 'SARAWAK'
}

const initializeDashboard = async () => {
  await nextTick()
  await tarikDataKes()
  initMap()
  await recallPlanDariSupabase()
  langganTelemetriMMEA()
  langganMesejRealtimeSupabase()
}

onMounted(async () => {
  // Semak jika ada sesi tersimpan dalam browser
  const savedStatus = localStorage.getItem('isLoggedIn')
  if (savedStatus === 'true') {
    activeStation.value = localStorage.getItem('activeStation') || ''
    activeRegion.value = localStorage.getItem('activeRegion') || ''
    isLoggedIn.value = true
    await initializeDashboard()
  }
})

const prosesLoginMMEA = async () => {
  if (!loginForm.value.stationId) { loginError.value = 'Sila pilih Username / Station ID anda!'; return }
  if (loginForm.value.password !== 'mrsc@123') { loginError.value = 'Security Password tidak sah!'; return }

  activeStation.value = loginForm.value.stationId
  activeRegion.value = pemetaanStesenRegion[loginForm.value.stationId]
  
  // Simpan sesi ke localStorage
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('activeStation', activeStation.value)
  localStorage.setItem('activeRegion', activeRegion.value)
  
  loginError.value = ''
  isLoggedIn.value = true

  tacticalLogs.value.unshift(`🔑 HQ INTERFACE LOCKED: ${activeStation.value}`)
  await initializeDashboard()
}

const prosesLogKeluar = () => {
  if (!confirm("Adakah anda pasti ingin log keluar dari sistem?")) return

  isLoggedIn.value = false
  loginForm.value.password = ''
  localStorage.clear() // Padam semua sesi tersimpan
  
  if(mapInstance) { mapInstance.remove(); mapInstance = null }
  supabase.removeAllChannels()
}

// PAGE 2 MANAGEMENT
const senaraiKes = ref([])
const selectedCaseId = ref('ALL') 
const senaraiMasterSRU = ref([]) 
const tacticalLogs = ref([])
const senaraiMesejChat = ref([])
const inputMesejBaru = ref('')
const activeChatTab = ref('global')
const globalUnreadCount = ref(0) // New ref for unread count
const paparkanTrekLaluan = ref(false)
let chatChannelSubscription = null
let mapInstance = null
let trackHistoryLayer = null

const warnaSearchArea = ['#dc2626', '#2563eb', '#9333ea', '#ea580c', '#16a34a']

const showDeleteModal = ref(false)
const showAddCaseModal = ref(false)
const showEditCaseModal = ref(false)
const showLoadCaseModal = ref(false)

const sruTargetToPadam = ref(null)
const formAddKes = ref({ case_no: '', case_name: '', search_object: '' })
const formEditKes = ref({ case_name: '' })

// DRAWING TOOLS STATE
const activeTool = ref(null)
const toolsLayer = L.layerGroup()
const tempDrawingLayer = L.layerGroup() // For temporary preview shapes
const drawingStartPoint = ref(null) // Stores the first click for drawing
const isDrawing = ref(false)
const tempShape = ref(null)
let tempPoints = []

const senaraiKesAktifSahaja = computed(() => {
  if (activeStation.value === 'MRCC Putrajaya') {
    return senaraiKes.value.filter(kes => kes.status === 'active')
  }
  return senaraiKes.value.filter(kes => kes.status === 'active' && kes.region === activeRegion.value)
})

const isGlobalChatActive = computed(() => activeChatTab.value === 'global');
const isLocalChatActive = computed(() => activeChatTab.value === 'local');
const isCaseSelected = computed(() => selectedCaseId.value !== 'ALL');
const isCaseOwnedByStation = computed(() => selectedCase.value && selectedCase.value.region === activeRegion.value);

const selectedCase = computed(() => {
  if (selectedCaseId.value === 'ALL') return null
  return senaraiKes.value.find(k => k.id === Number(selectedCaseId.value))
})

const paparanSRUKesAktif = computed(() => {
  if (selectedCaseId.value === 'ALL') {
    const idKesAktif = senaraiKesAktifSahaja.value.map(k => k.id)
    return senaraiMasterSRU.value.filter(sru => idKesAktif.includes(sru.caseId))
  } 
  return senaraiMasterSRU.value.filter(sru => sru.caseId === Number(selectedCaseId.value))
})

const filteredMesejChat = computed(() => {
  if (isGlobalChatActive.value) {
    // Reset unread count when global tab is active
    globalUnreadCount.value = 0;
    return senaraiMesejChat.value.filter(m => m.chat_type === 'global' && m.case_id === null);
  } else if (isLocalChatActive.value) {
    if (!isCaseSelected.value) return []; // No messages if no case selected

    // Security Access Control: Only display messages if the case belongs to the active station's region
    if (!isCaseOwnedByStation.value) {
      return []; // Access restricted, return empty array
    }

    return senaraiMesejChat.value.filter(m =>
      m.chat_type === 'local' &&
      m.case_id === Number(selectedCaseId.value)
    );
  }
  return []; // Default empty
})

const isLocalChatInputDisabled = computed(() => {
  if (isLocalChatActive.value) {
    if (!isCaseSelected.value) return true; // Disabled if 'ALL' is selected in local tab
    // Disabled if selected case does not belong to the active station's region
    return !isCaseOwnedByStation.value;
  }
  return false
})

const localChatPlaceholder = computed(() => {
  if (isLocalChatActive.value && !isCaseSelected.value) {
    return '⚠️ SILA PILIH KES SPESIFIK UNTUK MULA BERSEMBANG...'
  }
  if (isLocalChatInputDisabled.value) {
    return '🔒 CHANNEL LOCKED: STATIONS OUTSIDE THIS INCIDENT AREA CANNOT TRANSMIT.'
  }
  return 'Transmit message...'
})

const initMap = () => {
  const mapContainer = document.getElementById('map')
  if (!mapContainer) return
  mapInstance = L.map('map', { 
    zoomControl: false
  }).setView([4.2, 109.5], 5) 

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    attribution: '&copy; OpenStreetMap' 
  }).addTo(mapInstance)

  // 1. LIVE COORDINATE TRACKER (PENJEJAK LATLONG TETIKUS - BOTTOM LEFT)
  const MousePositionControl = L.Control.extend({
    options: { position: 'bottomleft' },
    onAdd: function () {
      this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
      this._container.style.backgroundColor = '#0f172a';
      this._container.style.border = '1px solid #38bdf8';
      this._container.style.color = '#38bdf8';
      this._container.style.fontFamily = 'monospace';
      this._container.style.fontSize = '11px';
      this._container.style.fontWeight = 'bold';
      this._container.style.padding = '4px 8px';
      this._container.style.borderRadius = '4px';
      this._container.innerHTML = '🌐 LAT: 0.0000 | LON: 0.0000';
      return this._container;
    },
    updateCoords: function (latlng) {
      this._container.innerHTML = `🌐 LAT: ${latlng.lat.toFixed(4)} | LON: ${latlng.lng.toFixed(4)}`;
    }
  });
  const mousePos = new MousePositionControl();
  mousePos.addTo(mapInstance);
  mapInstance.on('mousemove', (e) => mousePos.updateCoords(e.latlng));

  // 2. TACTICAL SEARCH & COORDINATE GO-TO BAR (TOP RIGHT)
  let searchMarker = null;
  const SearchGoToControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function () {
      const container = L.DomUtil.create('div', 'leaflet-control-search-goto');
      const input = L.DomUtil.create('input', 'search-input', container);
      input.type = 'text';
      input.placeholder = '🔍 Cari lokasi atau Lat, Lon...';
      input.style.width = '240px';
      input.style.backgroundColor = '#1e293b';
      input.style.color = '#ffffff';
      input.style.border = '1px solid #475569';
      input.style.padding = '8px 12px';
      input.style.borderRadius = '4px';
      input.style.outline = 'none';
      input.style.fontSize = '12px';
      input.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';

      L.DomEvent.disableClickPropagation(container);

      input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          const val = input.value.trim();
          if (!val) return;
          let lat, lon;
          // Logik A: Input Koordinat (Format: "3.85, 103.5" atau "3.85 103.5")
          const coordRegex = /^([-+]?\d*\.?\d+)[,\s]+([-+]?\d*\.?\d+)$/;
          const match = val.match(coordRegex);

          if (match) {
            lat = parseFloat(match[1]); lon = parseFloat(match[2]);
            executeGoTo(lat, lon);
          } else {
            // Logik B: Geocoding Nama Tempat (Nominatim API)
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`);
              const data = await res.json();
              if (data && data.length > 0) {
                lat = parseFloat(data[0].lat); lon = parseFloat(data[0].lon);
                executeGoTo(lat, lon);
              } else { alert("📍 Lokasi tidak dijumpai."); }
            } catch (err) { console.error("Search Error:", err); }
          }
        }
      });
      const executeGoTo = (targetLat, targetLon) => {
        mapInstance.flyTo([targetLat, targetLon], 11, { animate: true });
        if (searchMarker) mapInstance.removeLayer(searchMarker);
        searchMarker = L.marker([targetLat, targetLon], { icon: L.divIcon({ html: '<div style="font-size: 24px; filter: drop-shadow(0 0 5px rgba(255,0,0,0.5));">🚩</div>', className: 'target-marker-icon', iconAnchor: [5, 24] }) }).addTo(mapInstance);
        searchMarker.bindTooltip("🎯 SEARCH TARGET RESULT", { direction: 'top', offset: [0, -20] }).openTooltip();
      };
      return container;
    }
  });
  new SearchGoToControl().addTo(mapInstance);

  toolsLayer.clearLayers()
  toolsLayer.addTo(mapInstance)
  tempDrawingLayer.addTo(mapInstance) // Add temporary drawing layer
  trackHistoryLayer = L.layerGroup().addTo(mapInstance) // Initialize track history layer

  // Event for Drawing Tools
  mapInstance.on('click', (e) => {
    if (!activeTool.value) return
    kendalikanKlikPeta(e.latlng)
  })

  // Interaction events for drag-drawing
  mapInstance.on('mousedown', handleMouseDown)
  mapInstance.on('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  mapInstance.invalidateSize() // Initial invalidateSize
}

const aktifkanTool = (tool) => {
  activeTool.value = activeTool.value === tool ? null : tool
  
  drawingStartPoint.value = null
  isDrawing.value = false
  tempDrawingLayer.clearLayers()
  tempShape.value = null

  if (mapInstance) {
    if (activeTool.value) {
      mapInstance.dragging.disable() // Lock map movement when tool active
      L.DomUtil.addClass(mapInstance._container, 'pencil-cursor')
    } else {
      mapInstance.dragging.enable()
      L.DomUtil.removeClass(mapInstance._container, 'pencil-cursor')
    }
  }

  if (activeTool.value) {
    tacticalLogs.value.unshift(`🛠️ ALATAN AKTIF: ${tool.toUpperCase()}. Tekan & seret pada peta.`)
  } else {
    tacticalLogs.value.unshift(`🛠️ ALATAN DINYAHAKTIFKAN. Kursor peta diaktifkan semula.`)
  }
}

const handleMouseDown = (e) => {
  if (!activeTool.value || activeTool.value === 'text') return
  isDrawing.value = true
  drawingStartPoint.value = e.latlng
}

const handleMouseUp = () => {
  if (!isDrawing.value) return
  
  if (tempShape.value) {
    finalizeShape(tempShape.value)
  }
  
  isDrawing.value = false
  drawingStartPoint.value = null
  tempShape.value = null
  tempDrawingLayer.clearLayers()
}

const finalizeShape = (shape) => {
  let finalLayer
  const opts = { color: shape.options.color, weight: shape.options.weight, fillOpacity: 0.3 }
  
  if (activeTool.value === 'circle') {
    finalLayer = L.circle(shape.getLatLng(), { ...opts, radius: shape.getRadius() })
  } else if (activeTool.value === 'rect') {
    finalLayer = L.rectangle(shape.getBounds(), opts)
  } else if (activeTool.value === 'line') {
    finalLayer = L.polyline(shape.getLatLngs(), opts)
    const latlngs = finalLayer.getLatLngs()
    const distMeters = latlngs[0].distanceTo(latlngs[1])
    const distKM = (distMeters / 1000).toFixed(2)
    const distNM = (distMeters / 1852).toFixed(2)
    const center = L.latLngBounds(latlngs[0], latlngs[1]).getCenter()
    
    const measureLabel = L.marker(center, {
      icon: L.divIcon({ 
        html: `<div style="background:rgba(0,0,0,0.8); color:#fff; font-size:10px; padding:2px 4px; border-radius:3px; border:1px solid #fff; white-space:nowrap;">
                ${distKM} KM / ${distNM} NM
               </div>`, 
        className: 'custom-area-label',
        iconAnchor: [30, 0]
      })
    }).addTo(toolsLayer)
    finalLayer._measureLabel = measureLabel
  }

  if (finalLayer) {
    finalLayer.addTo(toolsLayer)
    makeMovable(finalLayer)
  }
}

const makeMovable = (layer) => {
  layer.on('mousedown', (e) => {
    if (activeTool.value) return // Jangan gerakkan jika sedang dalam mod melukis
    const map = mapInstance
    const startLatLng = e.latlng
    const startCoords = layer.getLatLng ? layer.getLatLng() : layer.getLatLngs()
    const isPoint = !Array.isArray(startCoords)

    map.dragging.disable()
    L.DomEvent.stopPropagation(e)

    const onMove = (me) => {
      const deltaLat = me.latlng.lat - startLatLng.lat
      const deltaLng = me.latlng.lng - startLatLng.lng

      if (isPoint) {
        layer.setLatLng([startCoords.lat + deltaLat, startCoords.lng + deltaLng])
      } else {
        const transform = (p) => {
          if (Array.isArray(p)) return p.map(transform)
          return { lat: p.lat + deltaLat, lng: p.lng + deltaLng }
        }
        layer.setLatLngs(transform(startCoords))
      }
      
      if (layer._measureLabel) {
        const bounds = layer.getBounds ? layer.getBounds() : L.latLngBounds(layer.getLatLngs())
        layer._measureLabel.setLatLng(bounds.getCenter())
      }
    }

    const onUp = () => {
      map.off('mousemove', onMove)
      map.off('mouseup', onUp)
      map.dragging.enable()
    }

    map.on('mousemove', onMove)
    map.on('mouseup', onUp)
  })
  
  layer.on('mouseover', () => {
    if (!activeTool.value && layer.getElement()) layer.getElement().style.cursor = 'move'
  })
}

const handleMouseMove = (e) => {
  if (!isDrawing.value || !drawingStartPoint.value || !activeTool.value || activeTool.value === 'text') return

  // Clear previous temporary shape
  if (tempShape.value) {
    tempDrawingLayer.removeLayer(tempShape.value)
    tempShape.value = null
  }

  const currentLatLng = e.latlng
  let newTempShape = null

  if (activeTool.value === 'circle') {
    const radius = drawingStartPoint.value.distanceTo(currentLatLng)
    newTempShape = L.circle(drawingStartPoint.value, { radius, color: '#38bdf8', weight: 2, fillOpacity: 0.2, dashArray: '5, 5' })
  } else if (activeTool.value === 'rect') {
    newTempShape = L.rectangle([drawingStartPoint.value, currentLatLng], { color: '#fbbf24', weight: 2, fillOpacity: 0.2, dashArray: '5, 5' })
  } else if (activeTool.value === 'line') {
    newTempShape = L.polyline([drawingStartPoint.value, currentLatLng], { color: '#ef4444', weight: 3, dashArray: '5, 5' })
  }

  if (newTempShape) {
    newTempShape.addTo(tempDrawingLayer)
    tempShape.value = newTempShape
  }
}

const kendalikanKlikPeta = (latlng) => {
  if (activeTool.value === 'text') {
    const textMarker = L.marker(latlng, {
      draggable: true,
      icon: L.divIcon({
        html: `<div contenteditable="true" class="editable-text-marker" style="color:#fff; text-shadow: 1px 1px 2px #000; font-weight:bold; white-space:nowrap; min-width: 50px; padding: 2px 5px; border: 1px dashed #fff; background: rgba(0,0,0,0.5);">Taip di sini...</div>`,
        className: 'custom-area-label',
        iconAnchor: [0, 0] // Adjust anchor to top-left of the div
      })
    }).addTo(toolsLayer)

    // Get the editable div element
    const editableDiv = textMarker.getElement().querySelector('.editable-text-marker')
    if (editableDiv) {
      editableDiv.focus()
      // Select all text for easy editing
      const range = document.createRange()
      range.selectNodeContents(editableDiv)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)

      const finalizeText = () => {
        const finalMsg = editableDiv.innerText.trim()
        toolsLayer.removeLayer(textMarker) // Remove editable marker

        if (finalMsg && finalMsg !== 'Taip di sini...') {
          L.marker(latlng, {
            icon: L.divIcon({ html: `<div style="color:#fff; text-shadow: 1px 1px 2px #000; font-weight:bold; white-space:nowrap;">${finalMsg}</div>`, className: 'custom-area-label' })
          }).addTo(toolsLayer)
          tacticalLogs.value.unshift(`📝 Teks ditambah: "${finalMsg}" @ ${latlng.lat.toFixed(3)}, ${latlng.lng.toFixed(3)}`)
        }
        // Reset tool and cursor
        aktifkanTool(null) // Deactivate the tool
      }

      editableDiv.addEventListener('blur', finalizeText)
      editableDiv.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault() // Prevent new line
          finalizeText()
        }
      })
    }
    return // Exit after handling text tool
  }
}

const bersihkanLukisan = () => {
  toolsLayer.clearLayers()
  tempDrawingLayer.clearLayers() // Clear temporary layer as well
  drawingStartPoint.value = null // Reset drawing start point
  tempShape.value = null // Clear temporary shape reference

  const mapEl = document.getElementById('map')
  if (mapEl) mapEl.style.cursor = ''
  activeTool.value = null
  tacticalLogs.value.unshift(`🗑️ Semua lukisan taktikal dibersihkan.`)
}

const recallPlanDariSupabase = async () => {
  const { data, error } = await supabase.from('sar_plans').select('*')
  if (!error && data) {
    senaraiMasterSRU.value.forEach(sru => {
      if (sru.grafikPeta) { sru.grafikPeta.forEach(l => mapInstance.removeLayer(l)) }
    })
    senaraiMasterSRU.value = []

    data.forEach((row) => {
      const elemenGrafikPeta = []
      const warnaTema = warnaSearchArea[senaraiMasterSRU.value.length % warnaSearchArea.length]

      if (mapInstance) {
        if (row.corner_points && row.corner_points.length >= 4) {
          const pt1 = row.corner_points[0], pt2 = row.corner_points[1], pt3 = row.corner_points[2], pt4 = row.corner_points[3]
          const kotakPoly = L.polyline([pt1, pt2, pt3, pt4, pt1], { color: warnaTema, weight: 2, opacity: 0.9 }).addTo(mapInstance)

          elemenGrafikPeta.push(kotakPoly)
        }
        if (row.sortie_waypoints && row.sortie_waypoints.length > 0) {
          const laluanPoly = L.polyline(row.sortie_waypoints, { color: warnaTema, weight: 2, dashArray: '5, 5', opacity: 0.85 }).addTo(mapInstance)
          elemenGrafikPeta.push(laluanPoly)
        }
        if (row.csp_coord) {
          const dotCSP = L.circleMarker(row.csp_coord, { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1, radius: 4 }).addTo(mapInstance)
          dotCSP.bindTooltip(`CSP ${row.zone_name} (${row.sru_name})`)
          elemenGrafikPeta.push(dotCSP)
        }
      }

      senaraiMasterSRU.value.push({
        id: row.id, caseId: row.case_id, nama: row.sru_name, corak: row.pattern_name, kawasanNama: row.zone_name, grafikPeta: elemenGrafikPeta
      })
    })
    tukarKesTaktikal()
  }
}

const bukaModalLoadKes = () => { showLoadCaseModal.value = true }
const pilihDanLoadKesLama = async (idKes) => {
  showLoadCaseModal.value = false
  const kesTarget = senaraiKes.value.find(k => k.id === idKes)
  
  if (kesTarget && kesTarget.status === 'accomplished' && activeStation.value !== 'MRCC Putrajaya') {
    const { error } = await supabase.from('sar_incidents').update({ status: 'active' }).eq('id', idKes)
    if (!error) {
      tacticalLogs.value.unshift(`⚡ RE-ACTIVATED: Kes ID #${idKes} diaktifkan semula!`)
      await tarikDataKes()
    }
  }
  selectedCaseId.value = idKes
  tukarKesTaktikal()
}

const bukaModalTambahKes = () => {
  formAddKes.value.case_no = 'CASE-' + new Date().getFullYear() + '-' + activeRegion.value.substring(0,3).toUpperCase() + Math.floor(10 + Math.random() * 90)
  formAddKes.value.case_name = ''
  formAddKes.value.search_object = ''
  showAddCaseModal.value = true
}

const simpanKesBaruSupabase = async () => {
  if (!formAddKes.value.case_name.trim() || !formAddKes.value.case_no.trim()) { alert("Sila masukkan No Kes dan Nama Kes!"); return }
  
  try {
    const { data, error } = await supabase
      .from('sar_incidents') // Sila pastikan nama table di Dashboard Supabase tepat 'sar_incidents'
      .insert([{ 
        case_no: formAddKes.value.case_no.trim(),
        case_name: formAddKes.value.case_name.toUpperCase().trim(), 
        search_object: formAddKes.value.search_object.trim(),
        status: 'active', 
        region: activeRegion.value 
      }])
      .select()

    if (error) {
      console.error("Supabase Error:", error)
      alert("Gagal mencipta kes: " + error.message)
      return
    }

    if (data && data.length > 0) {
      await tarikDataKes()
      selectedCaseId.value = data[0].id 
      tukarKesTaktikal()
      showAddCaseModal.value = false
    }
  } catch (err) {
    console.error("Fatal Error:", err)
    alert("Ralat sistem: Sila pastikan peranti anda mempunyai capaian internet ke pelayan Supabase.")
  }
}

const bukaModalEditKes = () => {
  const kesTerpilih = senaraiKes.value.find(k => k.id === Number(selectedCaseId.value))
  if (kesTerpilih) { formEditKes.value.case_name = kesTerpilih.case_name; showEditCaseModal.value = true }
}

const kemaskiniNamaKesSupabase = async () => {
  if (!formEditKes.value.case_name.trim()) return
  const { error } = await supabase.from('sar_incidents').update({ case_name: formEditKes.value.case_name.toUpperCase().trim() }).eq('id', Number(selectedCaseId.value))
  if (!error) { await tarikDataKes(); showEditCaseModal.value = false }
}

const deactivateKesTaktikalSupabase = async () => {
  const targetId = Number(selectedCaseId.value)
  const konfirm = confirm("🎯 Tukar status kes ini ke ACCOMPLISHED?")
  if (!konfirm) return
  const { error } = await supabase.from('sar_incidents').update({ status: 'accomplished' }).eq('id', targetId)
  if (!error) {
    senaraiMasterSRU.value.forEach(sru => {
      if (sru.caseId === targetId && sru.grafikPeta) { sru.grafikPeta.forEach(layer => mapInstance.removeLayer(layer)) }
    })
    await tarikDataKes()
    selectedCaseId.value = 'ALL'
    tukarKesTaktikal()
    showEditCaseModal.value = false
  }
}

const padamKesDariSupabase = async () => {
  const sah = confirm(`⚠️ Padam kekal dari Supabase?`)
  if (!sah) return
  const kesIdYangDipadam = Number(selectedCaseId.value)
  const { error } = await supabase.from('sar_incidents').delete().eq('id', kesIdYangDipadam)
  if (!error) { await tarikDataKes(); selectedCaseId.value = 'ALL'; await recallPlanDariSupabase(); showEditCaseModal.value = false }
}

const tukarKesTaktikal = () => {
  if (!mapInstance) return

  supabase.removeAllChannels()
  langganTelemetriMMEA()
  langganMesejRealtimeSupabase()

  // Clear existing map graphics
  senaraiMasterSRU.value.forEach(sru => {
    if (sru.grafikPeta) { sru.grafikPeta.forEach(layer => mapInstance.removeLayer(layer)) }
  })

  let sruAdaGrafik = false; let boundsKoleksi = []
  paparanSRUKesAktif.value.forEach(sru => {
    if (sru.grafikPeta) {
      sru.grafikPeta.forEach(layer => {
        layer.addTo(mapInstance)
        if (layer.getBounds) boundsKoleksi.push(layer.getBounds())
        else if (layer.getLatLng) boundsKoleksi.push(L.latLngBounds(layer.getLatLng(), layer.getLatLng()))
      })
      sruAdaGrafik = true
    }
  })

  if (sruAdaGrafik && boundsKoleksi.length > 0) {
    let combinedBounds = boundsKoleksi[0]
    for (let i = 1; i < boundsKoleksi.length; i++) { combinedBounds.extend(boundsKoleksi[i]) }
    mapInstance.fitBounds(combinedBounds, { padding: [50, 50] })
  } else { 
    // Default view if no graphics or bounds
    if (activeStation.value === 'MRCC Putrajaya') mapInstance.setView([4.2, 109.5], 5)
    else mapInstance.setView([3.85, 103.5], 7) 
  }

  // Refresh track history if enabled
  if (paparkanTrekLaluan.value) loadTrackHistory()

  mapInstance.invalidateSize() // Ensure map renders correctly after case change
}

const ekstrakSatuKoordinat = (teks) => {
  // Regex for parsing coordinates
  if (!teks) return null
  const match = teks.match(/(\d{2})-(\d{2}\.\d{3})([NS])\s+(\d{3})-(\d{2}\.\d{3})([EW])/)
  if (!match) return null
  let lat = parseInt(match[1]) + parseFloat(match[2]) / 60; if (match[3] === 'S') lat = -lat
  let lon = parseInt(match[4]) + parseFloat(match[5]) / 60; if (match[6] === 'W') lon = -lon
  return [lat, lon]
}

const bacaFailSAROPS = (event) => {
  // SAROPS file parsing logic
  if (selectedCaseId.value === 'ALL' || !selectedCaseId.value) { alert("⚠️ Sila pilih kes spesifik dulu."); event.target.value = ''; return }
  const files = event.target.files; if (!files.length) return
  const currentActiveCaseId = Number(selectedCaseId.value)

  Array.from(files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const kandungan = e.target.result
      const namaSru = kandungan.match(/SRU ID \(TAIL\/HULL\)\s*:\s*(.+)/)?.[1].trim() || 'UNKNOWN SRU'
      const corakPenuh = kandungan.match(/SEARCH PATTERN NAME\s*:\s*(.+)/)?.[1].trim() || ''
      const koordinatCenter = ekstrakSatuKoordinat(kandungan.match(/CENTER\s*:\s*([^\n\r]+)/)?.[1])
      let kawasanNama = corakPenuh ? corakPenuh.split(':')[0].trim() : 'ZON'
      const koordinatCSP = ekstrakSatuKoordinat(kandungan.match(/CSP\s*:\s*([^\n\r]+)/)?.[1])
      const pt1 = ekstrakSatuKoordinat(kandungan.match(/CORNER PT #1\s*:\s*([^\n\r]+)/)?.[1])
      const pt2 = ekstrakSatuKoordinat(kandungan.match(/CORNER PT #2\s*:\s*([^\n\r]+)/)?.[1])
      const pt3 = ekstrakSatuKoordinat(kandungan.match(/CORNER PT #3\s*:\s*([^\n\r]+)/)?.[1])
      const pt4 = ekstrakSatuKoordinat(kandungan.match(/CORNER PT #4\s*:\s*([^\n\r]+)/)?.[1])

      const garisanLaluan = []
      let kawasanSortie = false; const barisTeks = kandungan.split('\n')
      let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180
      if (pt1 && pt2 && pt3 && pt4) {
        [pt1, pt2, pt3, pt4].forEach(pt => {
          if (pt[0] < minLat) minLat = pt[0]; if (pt[0] > maxLat) maxLat = pt[0]
          if (pt[1] < minLon) minLon = pt[1]; if (pt[1] > maxLon) maxLon = pt[1]
        })
        minLat -= 0.1; maxLat += 0.1; minLon -= 0.1; maxLon += 0.1
      }

      for (let baris of barisTeks) {
        if (baris.includes('---  --------------  ----------------------')) { kawasanSortie = true; continue }
        if (kawasanSortie) {
          if (baris.trim() === '' || baris.includes('}')) continue
          const matchKoordinat = baris.match(/\d{2}-\d{2}\.\d{3}[NS]\s+\d{3}-\d{2}\.\d{3}[EW]/)
          if (matchKoordinat) {
            const titikDecimal = ekstrakSatuKoordinat(matchKoordinat[0])
            if (titikDecimal) {
              if (pt1 && (titikDecimal[0] < minLat || titikDecimal[0] > maxLat || titikDecimal[1] < minLon || titikDecimal[1] > maxLon)) continue
              garisanLaluan.push(titikDecimal)
            }
          }
        }
      }

      const { error } = await supabase.from('sar_plans').insert([{
        case_id: currentActiveCaseId, sru_name: namaSru, pattern_name: corakPenuh.split('-')[0], zone_name: kawasanNama,
        center_coord: koordinatCenter,
        csp_coord: koordinatCSP, corner_points: [pt1, pt2, pt3, pt4], sortie_waypoints: garisanLaluan
      }])
      if (error) {
        console.error("Gagal simpan plan:", error.message)
        alert("Ralat Simpan Plan: " + error.message)
      } else { await recallPlanDariSupabase() }
    }
    reader.readAsText(file)
  })
}

const bukaPopUpPadam = (sru) => { sruTargetToPadam.value = sru; showDeleteModal.value = true }
const sahkanPadamSRU = async () => {
  const sru = sruTargetToPadam.value
  if (sru) {
    const { error } = await supabase.from('sar_plans').delete().eq('id', sru.id)
    if (!error) await recallPlanDariSupabase()
  }
  showDeleteModal.value = false; sruTargetToPadam.value = null
}

const tarikDataKes = async () => {
  let query = supabase.from('sar_incidents').select('*')
  if (activeStation.value !== 'MRCC Putrajaya') {
    query = query.eq('region', activeRegion.value)
  }
  try {
    const { data, error } = await query.order('id', { ascending: false })
    if (!error) senaraiKes.value = data || []
  } catch (err) {
    console.error("Gagal menarik data kes:", err)
  }
}

// CHAT MANAGEMENT
const formatMasaChat = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const autoScrollChatKeBawah = () => {
  nextTick(() => {
    const container = document.querySelector('.chat-messages-container')
    if (container) container.scrollTop = container.scrollHeight
  })
}

const putuskanLanggananChatRealtime = () => {
  if (chatChannelSubscription) {
    supabase.removeChannel(chatChannelSubscription)
    chatChannelSubscription = null
  }
}

const fetchChatMessages = async () => {
  let query = supabase.from('sar_messages').select('*').order('created_at', { ascending: true })
  
  if (activeChatTab.value === 'global') {
    query = query.eq('chat_type', 'global').is('case_id', null)
  } else {
    if (selectedCaseId.value !== 'ALL') {
      // Security Access Control: Only fetch local messages if the case belongs to the active station's region
      if (!isCaseOwnedByStation.value) {
        senaraiMesejChat.value = [] // Clear chat if access restricted
        return
      }
      query = query.eq('chat_type', 'local').eq('case_id', Number(selectedCaseId.value))
    } else {
      senaraiMesejChat.value = []
      return
    }
  }

  const { data, error } = await query
  if (!error) {
    senaraiMesejChat.value = data
    autoScrollChatKeBawah()
  }
}

// 📡 FUNGSI RADAR REALTIME (MENANGKAP MESEJ DARI STESEN LAIN)
const langganMesejRealtimeSupabase = () => {
  putuskanLanggananChatRealtime() // Bersihkan frekuensi lama
  fetchChatMessages() // Ambil sejarah mesej lama

  chatChannelSubscription = supabase.channel('sar_messages_realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sar_messages' }, (payload) => {
      const r = payload.new
      
      // 🛡️ PENAPIS PENTING: Abaikan mesej pantulan dari diri sendiri sebab kita dah lukis awal
      if (r.sender === activeStation.value) return

      // Logik Penapisan Taktikal Tab
      if (r.chat_type === 'global' && r.case_id === null) {
        // Global message received
        if (isGlobalChatActive.value) {
          senaraiMesejChat.value.push(r);
        } else {
          globalUnreadCount.value++; // Increment unread count if global tab is not active
        }
      } else {
        // Local message received
        if (!isCaseSelected.value) return; // No local messages for 'ALL' view

        // Security Access Control: Only push if the case belongs to the active station's region AND local tab is active
        if (!isCaseOwnedByStation.value || !isLocalChatActive.value) {
          return; // Access restricted or not in local tab, do not push
        }

        if (r.chat_type === 'local' && r.case_id === Number(selectedCaseId.value)) { // Ensure case ID matches
          senaraiMesejChat.value.push(r)
        }
      }
      
      autoScrollChatKeBawah()
    }).subscribe()
}

// ⏳ FUNGSI AMBIL DATA TRACK HISTORY DARI SUPABASE
const loadTrackHistory = async () => {
  if (!mapInstance || !trackHistoryLayer) return
  trackHistoryLayer.clearLayers()
  
  // Abaikan jika toggle mati atau tiada kes spesifik dipilih
  if (!paparkanTrekLaluan.value || selectedCaseId.value === 'ALL') return

  const { data, error } = await supabase
    .from('sru_tracks')
    .select('sru_id, latitude, longitude')
    .eq('case_id', Number(selectedCaseId.value))
    .order('created_at', { ascending: true })

  if (error) {
    console.error("Error loading track history:", error)
    return
  }

  // Kumpulkan titik koordinat mengikut bot (sru_id)
  const tracks = {}
  data.forEach(point => {
    if (!tracks[point.sru_id]) tracks[point.sru_id] = []
    tracks[point.sru_id].push([point.latitude, point.longitude])
  })

  // Lukis garisan taktikal bagi setiap SRU
  Object.values(tracks).forEach(coords => {
    L.polyline(coords, { 
      color: '#06b6d4', 
      weight: 3, 
      dashArray: '6, 8', 
      opacity: 0.85 
    }).addTo(trackHistoryLayer)
  })
}

// Watcher untuk mengawal paparan trek laluan secara reaktif
watch(paparkanTrekLaluan, (baru) => {
  if (baru) loadTrackHistory()
  else if (trackHistoryLayer) trackHistoryLayer.clearLayers()
})

// 🚀 FUNGSI HANTAR MESEJ (DENGAN OPTIMISTIC UI)
const hantarMesejChatSupabase = async () => {
  if (!inputMesejBaru.value.trim()) return
  
  // Security Access Control: Prevent sending if input is disabled (via computed property)
  if (isLocalChatInputDisabled.value) {
    // This alert is redundant if the input is disabled, but kept for explicit feedback
    // if the user tries to bypass the disabled state (e.g., via console)
    alert("Akses Disekat: Sila pilih kes spesifik dulu untuk menghantar mesej."); 
    return 
  }
  
  const teksMesej = inputMesejBaru.value.trim()
  const currentTab = activeChatTab.value
  inputMesejBaru.value = ''

  const mesejLokal = {
    id: Date.now(), 
    case_id: currentTab === 'global' ? null : Number(selectedCaseId.value),
    sender: activeStation.value,
    message: teksMesej,
    created_at: new Date().toISOString(),
    chat_type: currentTab
  }
  senaraiMesejChat.value.push(mesejLokal)
  autoScrollChatKeBawah()

  const { error } = await supabase.from('sar_messages').insert({
    case_id: currentTab === 'global' ? null : Number(selectedCaseId.value),
    sender: activeStation.value,
    message: teksMesej,
    chat_type: currentTab
  })
  if (error) {
    console.error("Gagal hantar mesej:", error)
  }
}
</script>

<style>
:global(body) { margin: 0 !important; padding: 0 !important; width: 100vw; height: 100vh; overflow: hidden; background-color: #020617; }
:global(#app) { max-width: none !important; padding: 0 !important; margin: 0 !important; width: 100%; height: 100%; display: flex; }
*, *::before, *::after { box-sizing: border-box; }
.custom-area-label { background: none !important; border: none !important; }

.map-toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: #1e293b;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid #334155;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}
.map-toolbar button {
  background: #0f172a;
  border: 1px solid #334155;
  color: white;
  padding: 6px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  transition: 0.2s;
}
.map-toolbar button:hover { background: #334155; }
.map-toolbar button.active { background: #2563eb; border-color: #38bdf8; }

@keyframes popupAnim { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>