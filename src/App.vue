<template>
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; min-height: 100dvh; min-width: 1280px; width: 100%; display: flex; flex-direction: column; color: #f1f5f9; overflow: auto; box-sizing: border-box; margin: 0; padding: 0;">

    <!-- 🚨 EMERGENCY BROADCAST POP-UP -->
    <div v-if="paparAmaran" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.9); z-index: 9999; display: flex; justify-content: center; align-items: center;">
      <div style="background-color: #ff0000; padding: 40px; border-radius: 10px; border: 5px solid white; text-align: center; max-width: 600px; box-shadow: 0 0 50px red;">
        <h1 style="color: white; font-size: 32px; font-weight: bold; margin-bottom: 20px;">🚨 ALLERT 🚨</h1>
        <p style="color: white; font-size: 24px; margin-bottom: 30px;">{{ amaranAdmin }}</p>
        <button @click="paparAmaran = false" style="background-color: white; color: red; font-size: 20px; font-weight: bold; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer;">SAYA MAKLUM & SAHKAN</button>
      </div>
    </div>
    
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
              <option disabled>──────────────</option>
              <option value="Admin System" style="color: #ef4444; font-weight: bold;">🛠️ Admin System (Maintenance)</option>
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
        <!-- STATUS KEHADIRAN (DIPAPARKAN KEPADA SEMUA USER) -->
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; background: rgba(15, 23, 42, 0.5); padding: 8px 16px; border-radius: 6px; border: 1px solid #1e293b; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); justify-content: flex-end;">
          <span style="color: #00ffcc; font-size: 10px; font-weight: 800; letter-spacing: 1px; opacity: 0.8; text-transform: uppercase;">Network Presence:</span>
          
          <div v-for="stesen in stesenList" :key="stesen" style="display: flex; align-items: center; gap: 6px;">
            <!-- Lampu Indikator Hijau (Online) / Kelabu (Offline) -->
            <span :style="{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: (onlineUsers.includes(stesen) || activeStation === stesen) ? '#22c55e' : '#475569',
              boxShadow: (onlineUsers.includes(stesen) || activeStation === stesen) ? '0 0 8px #22c55e' : 'none',
              transition: 'all 0.3s ease'
            }"></span>
            <span :style="{ 
              color: (onlineUsers.includes(stesen) || activeStation === stesen) ? '#f8fafc' : '#94a3b8', 
              fontSize: '10px', 
              fontWeight: (onlineUsers.includes(stesen) || activeStation === stesen) ? '800' : '500' 
            }">
              {{ stesen }}
            </span>
          </div>
        </div>
      </header>

      <div :style="{
        display: 'grid', gridTemplateColumns: '1fr 340px',
        gap: '12px',
        padding: '12px',
        flex: '1',
        minHeight: '0',
        boxSizing: 'border-box',
        width: '100%',
      }">
        
        <div style="position: relative; overflow: hidden; display: flex; flex-direction: column; min-height: 400px;">
          <div id="map" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1;"></div>
          
          <!-- Panel Kiri (Absolute) -->
          <div :style="{
            position: 'absolute', top: '0', left: '0', height: '100%',
            transform: isLeftPanelVisible ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease-in-out',
            zIndex: 20, display: 'flex'
          }">
            <!-- Kandungan Panel Kiri -->
            <div style="display: flex; flex-direction: column; gap: 12px; min-height: 0; width: 320px; background: rgba(11, 15, 25, 0.85); backdrop-filter: blur(8px); padding: 12px; border-right: 1px solid #334155;">
              <!-- 🛑 SYSTEM ADMIN CONTROL (GOD MODE) -->
              <div v-if="isAdmin" style="background: #2d0a0a; border-radius: 6px; border: 1px solid #7f1d1d; border-top: 3px solid #ef4444; padding: 12px; flex-shrink: 0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);">
                <h4 style="margin: 0 0 10px 0; font-size: 11px; color: #f87171; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">⚡ SYSTEM COMMAND PANEL</h4>
                
                <!-- Broadcast UI -->
                <div style="margin-bottom: 12px;">
                  <label style="display: block; font-size: 9px; font-weight: bold; color: #fca5a5; margin-bottom: 4px; text-transform: uppercase;">Global Emergency Broadcast</label>
                  <div style="display: flex; gap: 4px;">
                    <input type="text" v-model="mesejBroadcast" placeholder="Info ke semua stesen..." style="flex: 1; padding: 6px 10px; background: #000; border: 1px solid #7f1d1d; border-radius: 4px; color: white; font-size: 11px;" @keyup.enter="hantarBroadcast" />
                    <button @click="hantarBroadcast" style="background: #ef4444; color: white; border: none; padding: 0 8px; border-radius: 4px; font-weight: bold; font-size: 10px; cursor: pointer;">Hantar</button>
                  </div>
                </div>

                <!-- Data Management Tools -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <button @click="padamSemuaMesej" style="background: #ef4444; color: white; border: 1px solid #7f1d1d; padding: 6px; font-size: 10px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: 0.2s;">🧹 Padam Semua Mesej</button>
                  <button @click="padamSemuaPelan" style="background: #ef4444; color: white; border: 1px solid #7f1d1d; padding: 6px; font-size: 10px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: 0.2s;">🗺️ Padam Semua Pelan</button>
                </div>
              </div>
              
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

                <!-- Butang Cuci Sejarah GPS (untuk semua kecuali MRCC) -->
                <div v-if="activeStation !== 'MRCC Putrajaya'" style="margin-top: 10px;">
                  <button @click="bukaModalPadamGPS" style="width: 100%; background: #4c1d15; color: #fca5a5; border: 1px solid #7f1d1d; padding: 6px; font-size: 10px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: 0.2s;">🛰️ Padam Sejarah Pergerakan Aset</button>
                </div>
              </div>

              <!-- 2-TAB NAVIGATION BAR: [1. SAP (SAROPS)] vs [2. SIMULATION] -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; background: #0f172a; border-radius: 6px; padding: 3px; gap: 4px; border: 1px solid #334155; flex-shrink: 0;">
                <!-- TAB 1: SAP (Search Action Plan) -->
                <button 
                  @click="activeLeftPanelTab = 'sap'"
                  :style="{
                    background: activeLeftPanelTab === 'sap' ? '#0284c7' : 'transparent',
                    color: activeLeftPanelTab === 'sap' ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    padding: '8px 4px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }"
                >
                  <span>📋</span>
                  <span>SAP</span>
                </button>

                <!-- TAB 2: SIMULATION (Drift Simulation .nc) -->
                <button 
                  @click="activeLeftPanelTab = 'simulation'"
                  :style="{
                    background: activeLeftPanelTab === 'simulation' ? '#f59e0b' : 'transparent',
                    color: activeLeftPanelTab === 'simulation' ? '#000000' : '#94a3b8',
                    border: 'none',
                    padding: '8px 4px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }"
                >
                  <span>🌀</span>
                  <span>Simulation</span>
                  <span v-if="driftSimData" style="width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px #22c55e;"></span>
                </button>
              </div>

              <!-- KANDUNGAN TAB 1: SAP (SAROPS & SRU ASSIGNMENT) -->
              <template v-if="activeLeftPanelTab === 'sap'">
                <div v-if="activeStation !== 'MRCC Putrajaya'" style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #0284c7; padding: 12px; flex-shrink: 0;">
                  <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #38bdf8; text-transform: uppercase;">📤 SEARCH ACTION PLAN (SAROPS)</h4>
                  <label style="border: 2px dashed #475569; border-radius: 6px; padding: 15px 10px; text-align: center; color: #94a3b8; font-size: 11px; background-color: #0f172a; display: block; cursor: pointer;">
                    <span style="font-size: 20px; display: block; margin-bottom: 5px;">📄</span>
                    Klik untuk Muat Naik Taktikal SAROPS<br>
                    <span style="color:#f59e0b; font-size:10px;" v-if="selectedCaseId === 'ALL'">⚠️ Pilih kes spesifik dulu untuk ikat file</span>
                    <span v-else style="color:#34d399; font-weight: bold;">Auto-Save diaktifkan 🟢</span>
                    <input type="file" multiple accept=".txt,.gpx,.kml" @change="bacaFailSAROPS" style="display: none;" />
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
              </template>

              <!-- KANDUNGAN TAB 2: SIMULATION (DRIFT SIMULATION .NC) -->
              <template v-else-if="activeLeftPanelTab === 'simulation'">
                <div style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #f59e0b; padding: 12px; flex: 1; display: flex; flex-direction: column; min-height: 0; gap: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 style="margin: 0; font-size: 12px; color: #fbbf24; text-transform: uppercase; display: flex; align-items: center; gap: 6px;">
                      <span>🌀</span> DRIFT SIMULATION (.NC)
                    </h4>
                    <button 
                      v-if="driftSimData" 
                      @click="tutupDriftSimulasi" 
                      style="background: #4c1d15; color: #f87171; border: 1px solid #7f1d1d; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: bold; cursor: pointer;"
                      title="Tutup & Buang Simulasi Hanyutan"
                    >
                      ✕ Buang
                    </button>
                  </div>

                  <!-- Input Muat Naik Fail .nc -->
                  <label 
                    :style="{
                      border: '2px dashed',
                      borderColor: selectedCaseId === 'ALL' || !selectedCaseId ? '#475569' : '#f59e0b',
                      borderRadius: '6px',
                      padding: '18px 10px',
                      textAlign: 'center',
                      color: '#94a3b8',
                      fontSize: '11px',
                      backgroundColor: '#0f172a',
                      display: 'block',
                      cursor: selectedCaseId === 'ALL' || !selectedCaseId ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }"
                  >
                    <span style="font-size: 24px; display: block; margin-bottom: 6px;">🌊</span>
                    <span v-if="isDriftLoading" style="color: #38bdf8; font-weight: bold;">
                      ⏳ Sedang Memproses Grid POC...
                    </span>
                    <span v-else-if="driftSimData" style="color: #34d399; font-weight: bold;">
                      ✅ {{ driftFileName }}<br>
                      <small style="color: #94a3b8; font-weight: normal;">
                        {{ driftSimData.numParticles.toLocaleString() }} Partikel | {{ driftSimData.numTimeSteps }} Langkah Masa
                      </small>
                    </span>
                    <span v-else>
                      Klik untuk Muat Naik Partikel <strong style="color: #fbbf24;">.nc</strong><br>
                      <span style="color:#f59e0b; font-size:10px;" v-if="selectedCaseId === 'ALL' || !selectedCaseId">⚠️ Sila pilih kes spesifik terlebih dahulu</span>
                      <span v-else style="color:#38bdf8; font-size:10px;">Format NetCDF-4 / HDF5 didokong</span>
                    </span>
                    <input 
                      type="file" 
                      accept=".nc,.hdf5,.h5" 
                      :disabled="selectedCaseId === 'ALL' || !selectedCaseId || isDriftLoading" 
                      @change="bacaFailDriftNC" 
                      style="display: none;" 
                    />
                  </label>

                  <!-- Ringkasan Nilai Semasa Simulasi -->
                  <div v-if="driftSimData" style="padding: 10px; background: rgba(15, 23, 42, 0.9); border: 1px solid #334155; border-radius: 6px; font-size: 11px; display: flex; flex-direction: column; gap: 6px;">
                    <div style="font-size: 10px; font-weight: 800; color: #fbbf24; letter-spacing: 0.5px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
                      📊 STATUS SIMULASI SEMASA
                    </div>
                    <div style="display: flex; justify-content: space-between; color: #94a3b8;">
                      <span>Langkah Masa:</span>
                      <strong style="color: #38bdf8;">T{{ currentDriftStep + 1 }} / {{ driftSimData.numTimeSteps }} ({{ driftSimTimeStr }})</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: #94a3b8;">
                      <span>Jumlah Partikel:</span>
                      <strong style="color: #34d399;">{{ driftSimData.numParticles.toLocaleString() }} zarah</strong>
                    </div>
                    <div v-if="driftPeakPOC" style="display: flex; justify-content: space-between; color: #94a3b8;">
                      <span>⭐ Peak POC:</span>
                      <strong style="color: #facc15; font-family: monospace;">{{ formatLatLng(driftPeakPOC.lat, true) }}, {{ formatLatLng(driftPeakPOC.lon, false) }}</strong>
                    </div>
                    <div v-if="driftDistressPos" style="display: flex; justify-content: space-between; color: #94a3b8;">
                      <span>🚨 LKP / Datum:</span>
                      <strong style="color: #f87171; font-family: monospace;">{{ formatLatLng(driftDistressPos.lat, true) }}, {{ formatLatLng(driftDistressPos.lon, false) }}</strong>
                    </div>
                  </div>

                  <div v-else style="padding: 12px; background: rgba(15, 23, 42, 0.5); border: 1px dashed #334155; border-radius: 6px; text-align: center; color: #64748b; font-size: 11px;">
                    ℹ️ Muat naik fail <code>particles.nc</code> untuk menjana grid kebarangkalian (POC) dan animasi hanyutan partikel.
                  </div>
                </div>
              </template>
            </div>
            
            <!-- Butang Toggle Panel Kiri -->
            <div @click="isLeftPanelVisible = !isLeftPanelVisible" style="position: absolute; right: -20px; top: 50%; transform: translateY(-50%); width: 20px; height: 60px; background: #0f172a; border: 1px solid #334155; border-left: none; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 0 6px 6px 0; box-shadow: 2px 0 5px rgba(0,0,0,0.2);" title="Buka/Tutup Panel">
              <span :style="{ color: '#94a3b8', fontSize: '14px', transform: isLeftPanelVisible ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }">◀</span>
            </div>
          </div>
          
          <!-- TOP-RIGHT UNIFIED TACTICAL MAP TOOLBAR (DRAW TOOLS + FIXED SEARCH + LAYER DROPDOWN) -->
          <div 
            v-if="isLoggedIn" 
            style="position: absolute; top: 10px; right: 10px; z-index: 1000; display: flex; align-items: center; gap: 4px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(8px); border: 1px solid #475569; border-radius: 6px; padding: 3px 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); box-sizing: border-box; height: 34px;"
          >
            <!-- 1. ALATAN MELUKIS (IKON / SIMBOL SAHAJA) -->
            <button @click="aktifkanTool('circle')" :class="{ active: activeTool === 'circle' }" class="tool-btn-icon" title="Lukis Bulatan (Jejari NM & KM)">
              ⭕
            </button>
            <button @click="aktifkanTool('rect')" :class="{ active: activeTool === 'rect' }" class="tool-btn-icon" title="Lukis Segi Empat (Sisi NM & KM)">
              ⬛
            </button>
            <button @click="aktifkanTool('line')" :class="{ active: activeTool === 'line' }" class="tool-btn-icon" title="Ukur Jarak / Garisan (NM & KM)">
              📏
            </button>
            <button @click="aktifkanTool('marker')" :class="{ active: activeTool === 'marker' }" class="tool-btn-icon" title="Letak Pin Marker (Lat/Long)">
              📍
            </button>
            <button @click="aktifkanTool('text')" :class="{ active: activeTool === 'text' }" class="tool-btn-icon" title="Tulis Teks / Catatan Carta">
              📝
            </button>
            <button 
              @click="toggleDeleteMode" 
              class="tool-btn-icon-danger" 
              :class="{ active: isDeleteMode }"
              :style="isDeleteMode ? { background: '#ef4444', color: '#ffffff', borderColor: '#fca5a5', boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)' } : {}"
              title="Mod Padam Lukisan Individu (Klik lukisan untuk padam)"
            >
              🗑️
            </button>

            <!-- PEMBAHAGI -->
            <div style="width: 1px; height: 18px; background: #475569; margin: 0 3px;"></div>

            <!-- 2. RUANGAN CARIAN (STATIK & KEKAL LEBAR - TIDAK BERGERAK) -->
            <div style="position: relative; display: flex; align-items: center;">
              <input 
                type="text" 
                v-model="teksCarianPeta" 
                @keydown.enter="laksanakanCarianPeta" 
                placeholder="🔍 Cari lokasi atau Lat, Lon..." 
                style="width: 210px; height: 26px; background: #0f172a; border: 1px solid #334155; color: #ffffff; padding: 0 8px; border-radius: 4px; font-size: 11px; outline: none; box-sizing: border-box; transition: border-color 0.2s;"
                @focus="$event.target.style.borderColor = '#38bdf8'"
                @blur="$event.target.style.borderColor = '#334155'"
              />
            </div>

            <!-- PEMBAHAGI -->
            <div style="width: 1px; height: 18px; background: #475569; margin: 0 3px;"></div>

            <!-- 3. BUTANG & DROPDOWN PILIHAN LAYER (MSRR & PELANTAR BENUA) -->
            <div style="position: relative;">
              <button 
                @click="isLayerMenuOpen = !isLayerMenuOpen" 
                class="tool-btn-icon"
                :style="{ borderColor: isLayerMenuOpen ? '#38bdf8' : '#475569', background: isLayerMenuOpen ? '#334155' : '#1e293b' }"
                title="Pilihan Lapisan Sempadan (MSRR & Pelantar Benua)"
              >
                🥞
              </button>

              <!-- FLOATING DROPDOWN MENU UNTUK LAYER (TERAPUNG KE BAWAH TANPA MENGGANGGU KOTAK LAIN) -->
              <div 
                v-if="isLayerMenuOpen" 
                style="position: absolute; top: 34px; right: 0; z-index: 1015; background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(10px); border: 1.5px solid #38bdf8; border-radius: 8px; padding: 8px 10px; min-width: 240px; box-shadow: 0 10px 25px rgba(0,0,0,0.7); display: flex; flex-direction: column; gap: 6px; animation: popupAnim 0.15s ease-out;"
              >
                <!-- 1. TEMA PETA ASAS (BASE MAP) -->
                <div style="font-size: 9px; font-weight: 800; color: #38bdf8; letter-spacing: 0.5px; margin-bottom: 2px; text-transform: uppercase;">
                  🗺️ TEMA PETA ASAS
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; margin-bottom: 4px;">
                  <button 
                    @click="tukarBaseLayer('dark')"
                    :style="{ background: selectedBaseLayer === 'dark' ? '#0284c7' : '#1e293b', borderColor: selectedBaseLayer === 'dark' ? '#38bdf8' : '#334155' }"
                    style="border: 1px solid; color: #fff; padding: 4px 2px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;"
                  >
                    🌙 Gelap
                  </button>
                  <button 
                    @click="tukarBaseLayer('satellite')"
                    :style="{ background: selectedBaseLayer === 'satellite' ? '#0284c7' : '#1e293b', borderColor: selectedBaseLayer === 'satellite' ? '#38bdf8' : '#334155' }"
                    style="border: 1px solid; color: #fff; padding: 4px 2px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;"
                  >
                    🛰️ Satelit
                  </button>
                  <button 
                    @click="tukarBaseLayer('osm')"
                    :style="{ background: selectedBaseLayer === 'osm' ? '#0284c7' : '#1e293b', borderColor: selectedBaseLayer === 'osm' ? '#38bdf8' : '#334155' }"
                    style="border: 1px solid; color: #fff; padding: 4px 2px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;"
                  >
                    ☀️ Jalan
                  </button>
                </div>

                <!-- 2. LAPISAN MARITIM & SEMPADAN -->
                <div style="font-size: 9px; font-weight: 800; color: #38bdf8; letter-spacing: 0.5px; margin-bottom: 2px; margin-top: 4px; text-transform: uppercase;">
                  ⚓ LAPISAN MARITIM & SEMPADAN
                </div>
                
                <label style="display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: #f1f5f9; cursor: pointer; padding: 4px 6px; border-radius: 4px; background: #1e293b; border: 1px solid #334155;">
                  <input type="checkbox" v-model="showLayerMSRR" @change="togolLayerMSRR" style="width: 14px; height: 14px; accent-color: #2563eb; cursor: pointer;" />
                  <span>🛡️ Sempadan MSRR (SAR)</span>
                </label>

                <label style="display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: #f1f5f9; cursor: pointer; padding: 4px 6px; border-radius: 4px; background: #1e293b; border: 1px solid #334155;">
                  <input type="checkbox" v-model="showLayerPelantar" @change="togolLayerPelantar" style="width: 14px; height: 14px; accent-color: #2563eb; cursor: pointer;" />
                  <span>🌊 Pelantar Benua (1979)</span>
                </label>

                <label style="display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: #f1f5f9; cursor: pointer; padding: 4px 6px; border-radius: 4px; background: #1e293b; border: 1px solid #334155;">
                  <input type="checkbox" v-model="showOpenSeaMap" @change="togolOpenSeaMap" style="width: 14px; height: 14px; accent-color: #2563eb; cursor: pointer;" />
                  <span>⚓ Tanda Nautika (OpenSeaMap)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- TIMELINE PLAYBACK OVERLAY (BOTTOM RIGHT OF MAP) -->
          <div v-if="isLoggedIn && isTimelineOpen">
            <!-- FULL TIMELINE PANEL (WHEN NOT MINIMIZED) -->
            <div 
              v-if="!isTimelineMinimized" 
              style="position: absolute; bottom: 34px; right: 6px; z-index: 1000; width: 460px; max-width: calc(100% - 20px); background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); border: 1px solid #38bdf8; border-radius: 8px; padding: 8px 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); display: flex; flex-direction: column; gap: 6px; color: #f8fafc; animation: popupAnim 0.2s ease-out;"
            >
              <!-- HEADER ROW: TITLE, LIVE TIMESTAMP, ACTIVE SRU COUNT, MINIMIZE & CLOSE -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="background: #2563eb; color: white; padding: 1px 5px; border-radius: 3px; font-size: 9px; font-weight: 800; letter-spacing: 0.5px;">REPLAY</span>
                  <span style="font-size: 11px; font-weight: 800; color: #38bdf8;">
                    ⏱️ TIMELINE PLAYBACK
                  </span>
                </div>

                <div style="display: flex; align-items: center; gap: 6px;">
                  <!-- Active SRUs at this timestamp badge -->
                  <span style="font-size: 10px; color: #94a3b8; font-weight: bold; margin-right: 2px;">
                    Aset: <strong style="color: #60a5fa;">{{ replayActiveSruCount }}</strong> SRU
                  </span>

                  <!-- Minimize Button -->
                  <button 
                    @click="isTimelineMinimized = true" 
                    style="background: #334155; color: #cbd5e1; border: none; border-radius: 3px; padding: 2px 7px; font-size: 11px; cursor: pointer; font-weight: bold; line-height: 1;" 
                    title="Kecilkan / Minimize Tetingkap Replay"
                  >
                    🗕
                  </button>

                  <!-- Close Button -->
                  <button 
                    @click="tutupTimelinePlayback" 
                    style="background: #334155; color: #f87171; border: none; border-radius: 3px; padding: 2px 7px; font-size: 11px; cursor: pointer; font-weight: bold; line-height: 1;" 
                    title="Tutup Replay"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- TIMESTAMP ROW -->
              <div style="display: flex; justify-content: space-between; align-items: center; background: #020617; border: 1px solid #334155; border-radius: 4px; padding: 3px 8px;">
                <span style="font-size: 10px; color: #94a3b8;">🕒 Cap Masa Trek:</span>
                <span style="font-family: monospace; font-size: 11px; color: #00ffcc; font-weight: bold;">
                  {{ currentTimelineTime || 'Tiada Rekod' }}
                </span>
              </div>

              <!-- DATE & TIME RANGE SELECTOR ROW -->
              <div style="background: #0f172a; border: 1px solid #1e3a5f; border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; gap: 6px;">
                <span style="font-size: 9px; font-weight: 800; color: #38bdf8; letter-spacing: 0.5px; text-transform: uppercase;">📅 Julat Tarikh & Masa Replay</span>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <!-- Tarikh Mula -->
                  <div style="display: flex; flex-direction: column; gap: 2px;">
                    <label style="font-size: 9px; color: #64748b; font-weight: bold; text-transform: uppercase;">Mula</label>
                    <input
                      type="datetime-local"
                      v-model="playbackStartDate"
                      :disabled="isPlaybackLoading"
                      style="width: 100%; padding: 4px 6px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: #f8fafc; font-size: 10px; box-sizing: border-box; color-scheme: dark;"
                    />
                  </div>
                  <!-- Tarikh Tamat -->
                  <div style="display: flex; flex-direction: column; gap: 2px;">
                    <label style="font-size: 9px; color: #64748b; font-weight: bold; text-transform: uppercase;">Tamat</label>
                    <input
                      type="datetime-local"
                      v-model="playbackEndDate"
                      :disabled="isPlaybackLoading"
                      style="width: 100%; padding: 4px 6px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: #f8fafc; font-size: 10px; box-sizing: border-box; color-scheme: dark;"
                    />
                  </div>
                </div>
                <!-- Load Replay Button -->
                <button
                  @click="loadReplayData"
                  :disabled="isPlaybackLoading"
                  :style="{
                    background: isPlaybackLoading ? '#334155' : '#0284c7',
                    color: isPlaybackLoading ? '#64748b' : 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '800',
                    cursor: isPlaybackLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    width: '100%',
                    transition: 'all 0.2s',
                    boxShadow: isPlaybackLoading ? 'none' : '0 0 8px rgba(2, 132, 199, 0.35)'
                  }"
                  title="Muat data GPS dalam julat masa yang dipilih"
                >
                  <span v-if="isPlaybackLoading" style="display: inline-block; width: 10px; height: 10px; border: 2px solid #64748b; border-top-color: #38bdf8; border-radius: 50%; animation: spinLoader 0.7s linear infinite;"></span>
                  <span v-else>🔍</span>
                  <span>{{ isPlaybackLoading ? 'Memuatkan data...' : 'Load Replay' }}</span>
                </button>
              </div>

              <!-- SLIDER ROW -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 9px; font-family: monospace; color: #64748b;">{{ timelineStartTime || '00:00' }}</span>
                <input 
                  type="range" 
                  :min="0" 
                  :max="Math.max(0, timelinePoints.length - 1)" 
                  v-model.number="currentTimelineIndex" 
                  @input="onTimelineSliderChange"
                  :disabled="timelinePoints.length === 0"
                  style="flex: 1; accent-color: #00ffcc; cursor: pointer; height: 5px;" 
                />
                <span style="font-size: 9px; font-family: monospace; color: #64748b;">{{ timelineEndTime || '00:00' }}</span>
              </div>

              <!-- CONTROLS ROW: RESET, PLAY/PAUSE, STEP, SPEED SELECTOR -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <!-- Playback action buttons -->
                <div style="display: flex; align-items: center; gap: 4px;">
                  <!-- Reset Button -->
                  <button @click="resetReplay" :disabled="timelinePoints.length === 0" style="background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 3px;" title="Kembali ke Titik Awal">
                    ⏮ Reset
                  </button>

                  <!-- Step Back -->
                  <button @click="stepReplay(-1)" :disabled="timelinePoints.length === 0" style="background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 3px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; cursor: pointer;" title="Undur 1 Titik">
                    ◀
                  </button>

                  <!-- Play / Pause Button -->
                  <button @click="togglePlayReplay" :disabled="timelinePoints.length === 0" :style="{
                    background: isPlaying ? '#f59e0b' : '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '3px 12px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    fontWeight: '800',
                    cursor: timelinePoints.length === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: isPlaying ? '0 0 8px rgba(245, 158, 11, 0.4)' : '0 0 8px rgba(16, 185, 129, 0.4)'
                  }">
                    <span>{{ isPlaying ? '⏸ PAUSE' : '▶ PLAY' }}</span>
                  </button>

                  <!-- Step Forward -->
                  <button @click="stepReplay(1)" :disabled="timelinePoints.length === 0" style="background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 3px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; cursor: pointer;" title="Maju 1 Titik">
                    ▶
                  </button>

                  <span style="font-size: 9px; color: #94a3b8; margin-left: 4px;">
                    {{ timelinePoints.length > 0 ? `${currentTimelineIndex + 1}/${timelinePoints.length}` : 'Tiada rekod' }}
                  </span>
                </div>

                <!-- Speed selector buttons -->
                <div style="display: flex; align-items: center; gap: 2px; background: #020617; padding: 2px; border-radius: 3px; border: 1px solid #334155;">
                  <span style="font-size: 8px; font-weight: bold; color: #64748b; padding: 0 2px;">SPD:</span>
                  <button 
                    v-for="spd in [1, 2, 5, 10]" 
                    :key="spd" 
                    @click="tukarKelajuanReplay(spd)"
                    :style="{
                      background: playbackSpeed === spd ? '#2563eb' : 'transparent',
                      color: playbackSpeed === spd ? 'white' : '#94a3b8',
                      border: 'none',
                      padding: '2px 5px',
                      borderRadius: '2px',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }"
                  >
                    {{ spd }}x
                  </button>
                </div>
              </div>

            </div>

            <!-- MINIMIZED COMPACT REPLAY BAR -->
            <div 
              v-else-if="isTimelineMinimized" 
              style="position: absolute; bottom: 34px; right: 6px; z-index: 1000; height: 32px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(8px); border: 1px solid #38bdf8; border-radius: 6px; padding: 0 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 7px; color: #f8fafc; font-size: 11px; animation: popupAnim 0.15s ease-out; box-sizing: border-box;"
            >
              <!-- Indicator -->
              <span style="display: inline-flex; align-items: center; gap: 4px; font-weight: 800; color: #38bdf8; font-size: 10px; letter-spacing: 0.5px;">
                <span>⏱️</span>
                <span>REPLAY</span>
              </span>

              <!-- Mini Play/Pause Button -->
              <button 
                @click.stop="togglePlayReplay" 
                :disabled="timelinePoints.length === 0"
                :style="{
                  background: isPlaying ? '#f59e0b' : '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '2px 7px',
                  borderRadius: '3px',
                  fontSize: '9px',
                  fontWeight: '800',
                  cursor: timelinePoints.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  height: '20px',
                  boxShadow: isPlaying ? '0 0 6px rgba(245, 158, 11, 0.5)' : '0 0 6px rgba(16, 185, 129, 0.5)'
                }"
                :title="isPlaying ? 'Pause Replay' : 'Play Replay'"
              >
                <span>{{ isPlaying ? '⏸' : '▶' }}</span>
              </button>

              <!-- Counter / Timestamp -->
              <span style="font-family: monospace; font-size: 10px; color: #00ffcc; font-weight: bold; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{ currentTimelineTime || '00:00' }}
              </span>

              <span v-if="timelinePoints.length > 0" style="font-size: 9px; color: #94a3b8; font-weight: 700; background: #1e293b; padding: 1px 5px; border-radius: 3px; border: 1px solid #334155;">
                {{ currentTimelineIndex + 1 }}/{{ timelinePoints.length }}
              </span>

              <!-- Expand Button -->
              <button 
                @click="isTimelineMinimized = false" 
                style="background: #1e293b; border: 1px solid #38bdf8; color: #38bdf8; border-radius: 3px; padding: 2px 7px; font-size: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 3px; height: 20px;"
                title="Buka / Kembangkan Tetingkap Penuh Replay"
              >
                <span>🗖</span>
                <span>Buka</span>
              </button>

              <!-- Close Button -->
              <button 
                @click="tutupTimelinePlayback" 
                style="background: #334155; color: #f87171; border: none; border-radius: 3px; padding: 2px 6px; font-size: 10px; cursor: pointer; font-weight: bold; height: 20px; display: flex; align-items: center; justify-content: center;" 
                title="Tutup & Tamatkan Replay"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- 🌀 FLOATING DRIFT TIMELINE TOOLBAR (APABILA SIMULASI .NC AKTIF) -->
          <div 
            v-if="isLoggedIn && driftSimData" 
            style="position: absolute; bottom: 42px; left: 50%; transform: translateX(-50%); z-index: 1010; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); border: 1.5px solid #f59e0b; border-radius: 8px; padding: 6px 14px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7); display: flex; align-items: center; gap: 12px; max-width: 90vw; min-width: 520px; box-sizing: border-box;"
          >
            <!-- Tajuk Mini -->
            <div style="display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 900; color: #fbbf24; white-space: nowrap;">
              <span>🌀</span>
              <span>DRIFT POC</span>
            </div>

            <!-- Butang Play / Pause -->
            <button 
              @click="togglePlayDrift" 
              :style="{
                background: isDriftPlaying ? '#ef4444' : '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '26px'
              }"
              :title="isDriftPlaying ? 'Jeda Simulasi' : 'Mainkan Simulasi'"
            >
              <span>{{ isDriftPlaying ? '⏸ Jeda' : '▶ Main' }}</span>
            </button>

            <!-- Slider Langkah Masa -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; font-weight: bold;">
                <span>T0 (Mula)</span>
                <span style="color: #38bdf8;">Langkah {{ currentDriftStep + 1 }} / {{ driftSimData.numTimeSteps }} ({{ driftSimTimeStr }})</span>
                <span>T{{ driftSimData.numTimeSteps }}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                :max="driftSimData.numTimeSteps - 1" 
                v-model.number="currentDriftStep" 
                @input="kemaskiniPaparanDrift(currentDriftStep)"
                style="width: 100%; accent-color: #f59e0b; cursor: pointer; margin: 0;" 
              />
            </div>

            <!-- Pilihan Kelajuan -->
            <div style="display: flex; gap: 3px; align-items: center;">
              <button 
                v-for="spd in [1, 2, 5]" 
                :key="spd" 
                @click="driftPlaySpeed = spd"
                :style="{
                  background: driftPlaySpeed === spd ? '#f59e0b' : '#1e293b',
                  color: driftPlaySpeed === spd ? '#000000' : '#94a3b8',
                  border: '1px solid #475569',
                  borderRadius: '3px',
                  padding: '2px 6px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }"
              >
                {{ spd }}x
              </button>
            </div>

            <!-- Butang Tutup -->
            <button 
              @click="tutupDriftSimulasi" 
              style="background: #334155; color: #f87171; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; font-weight: bold;" 
              title="Tutup Simulasi"
            >
              ✕
            </button>
          </div>

          <!-- LIVE COORDINATE DISPLAY (SUDUT BAWAH KANAN PETA) -->
          <div 
            v-if="isLoggedIn" 
            style="position: absolute; bottom: 8px; right: 8px; z-index: 1000; background: rgba(15, 23, 42, 0.95); border: 1.5px solid #38bdf8; color: #38bdf8; font-family: monospace; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); pointer-events: none; white-space: nowrap; user-select: none; line-height: 1.4;"
          >
            🌐 {{ currentLat }} | {{ currentLng }}
          </div>
        </div>

        <!-- RIGHT SIDEBAR CONTAINER WITH 3-TAB SYSTEM -->
        <div style="display: flex; flex-direction: column; height: 100%; min-height: 0; z-index: 20; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #cbd5e1; overflow: hidden;">
          
          <!-- 3-TAB TOP NAVIGATION BAR -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); background: #0f172a; border-bottom: 2px solid #1d4ed8; padding: 4px; gap: 4px; flex-shrink: 0;">
            <!-- TAB 1: ACTIVE -->
            <button 
              @click="activeRightSidebarTab = 'active'"
              :style="{
                background: activeRightSidebarTab === 'active' ? '#2563eb' : 'transparent',
                color: activeRightSidebarTab === 'active' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '9px 4px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                position: 'relative'
              }"
            >
              <span :style="{
                width: '7px', height: '7px', borderRadius: '50%',
                backgroundColor: telemetriRealtime.length > 0 ? '#22c55e' : '#64748b',
                boxShadow: telemetriRealtime.length > 0 ? '0 0 6px #22c55e' : 'none'
              }"></span>
              Active
              <span v-if="telemetriRealtime.length > 0" style="background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid #22c55e; font-size: 9px; padding: 1px 5px; border-radius: 10px; font-weight: 800;">
                {{ telemetriRealtime.length }}
              </span>
            </button>

            <!-- TAB 2: HISTORY -->
            <button 
              @click="activeRightSidebarTab = 'history'; muatTurunSejarahSRU()"
              :style="{
                background: activeRightSidebarTab === 'history' ? '#2563eb' : 'transparent',
                color: activeRightSidebarTab === 'history' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '9px 4px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                position: 'relative'
              }"
            >
              <span>⏳</span>
              History
              <span v-if="senaraiSruSejarah.length > 0" style="background: #334155; color: #93c5fd; font-size: 9px; padding: 1px 5px; border-radius: 10px; font-weight: 800;">
                {{ senaraiSruSejarah.length }}
              </span>
            </button>

            <!-- TAB 3: COMMUNICATION -->
            <button 
              @click="activeRightSidebarTab = 'communication'; langganMesejRealtimeSupabase()"
              :style="{
                background: activeRightSidebarTab === 'communication' ? '#2563eb' : 'transparent',
                color: activeRightSidebarTab === 'communication' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '9px 4px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                position: 'relative'
              }"
            >
              <span>💬</span>
              Comm
              <span v-if="totalUnreadCount > 0" class="badge-unread" style="top: 2px; right: 4px;">
                {{ totalUnreadCount }}
              </span>
            </button>
          </div>

          <!-- TAB 1 CONTENT: ACTIVE SRU STATUS -->
          <div v-show="activeRightSidebarTab === 'active'" style="flex: 1; display: flex; flex-direction: column; padding: 14px; min-height: 0; overflow: hidden; background: #ffffff; color: #1e293b;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              <div>
                <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                  📡 LIVE SRU STATUS
                </h4>
                <span style="font-size: 10px; color: #64748b;">
                  {{ telemetriRealtime.length }} unit sedang memancarkan isyarat GPS
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button 
                  v-if="telemetriRealtime.length > 0"
                  @click="cuciSemuaTelemetriOffline"
                  title="Bersihkan semua rekod telemetri radar lama yang tersangkut di pangkalan data"
                  style="background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 3px;"
                >
                  🧹 Cuci Radar
                </button>
                <span :style="{
                  background: telemetriRealtime.length > 0 ? '#dcfce7' : '#f1f5f9',
                  color: telemetriRealtime.length > 0 ? '#15803d' : '#64748b',
                  border: telemetriRealtime.length > 0 ? '1px solid #86efac' : '1px solid #cbd5e1',
                  padding: '3px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px'
                }">
                  <span :style="{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: telemetriRealtime.length > 0 ? '#22c55e' : '#94a3b8',
                    animation: telemetriRealtime.length > 0 ? 'webSruPulse 2s infinite ease-out' : 'none'
                  }"></span>
                  {{ telemetriRealtime.length > 0 ? 'LIVE RADAR' : 'STANDBY' }}
                </span>
              </div>
            </div>

            <!-- TABLE OF LIVE SRUs -->
            <div style="flex: 1; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc;">
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <thead style="position: sticky; top: 0; background: #0f172a; color: #ffffff; z-index: 2;">
                  <tr style="text-align: left;">
                    <th style="padding: 8px 10px; font-weight: 700; font-size: 10px; letter-spacing: 0.5px;">BOAT ID</th>
                    <th style="padding: 8px 6px; font-weight: 700; font-size: 10px; letter-spacing: 0.5px;">KTS</th>
                    <th style="padding: 8px 6px; font-weight: 700; font-size: 10px; letter-spacing: 0.5px;">CRS</th>
                    <th style="padding: 8px 6px; font-weight: 700; font-size: 10px; letter-spacing: 0.5px;">MASA</th>
                    <th style="padding: 8px 10px; font-weight: 700; font-size: 10px; letter-spacing: 0.5px; text-align: right;">CSP (NM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tele in telemetriRealtime" :key="tele.boat_id" style="border-bottom: 1px solid #e2e8f0; transition: background 0.15s; background: #ffffff;">
                    <td style="padding: 8px 10px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                      <span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px #22c55e; flex-shrink: 0;"></span>
                      {{ tele.boat_id }}
                    </td>
                    <td style="padding: 8px 6px; color: #334155; font-weight: 600;">{{ tele.speed ? Number(tele.speed).toFixed(1) : '0.0' }}</td>
                    <td style="padding: 8px 6px; color: #334155; font-weight: 600;">{{ tele.course ? Math.round(tele.course) + '°' : '---' }}</td>
                    <td style="padding: 8px 6px; color: #15803d; font-weight: 700; font-size: 10px;">
                      {{ formatMasaLalu(tele.updated_at || tele.timestamp || tele.created_at || tele.time) }}
                    </td>
                    <td style="padding: 8px 10px; color: #2563eb; font-weight: 800; text-align: right;">{{ tele.csp || '0.0' }}</td>
                  </tr>
                  <tr v-if="telemetriRealtime.length === 0">
                    <td colspan="5" style="padding: 40px 15px; text-align: center; color: #94a3b8; font-style: italic;">
                      <div style="font-size: 28px; margin-bottom: 8px;">📡</div>
                      <strong style="color: #475569; font-size: 12px; display: block; margin-bottom: 4px;">Tiada Bot Online</strong>
                      <span>Aset bot yang memulakan penjejakan GPS akan muncul secara automatik di sini.</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- LIVE STATUS HELPER CARD -->
            <div style="margin-top: 10px; padding: 10px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
              <span style="color: #166534; font-weight: 600;">🛰️ Penjejakan GPS Satelit:</span>
              <span style="color: #15803d; font-weight: 800;">MMEA REALTIME NETWORK</span>
            </div>
          </div>

          <!-- TAB 2 CONTENT: HISTORY SRU TRACKS -->
          <div v-show="activeRightSidebarTab === 'history'" style="flex: 1; display: flex; flex-direction: column; padding: 14px; min-height: 0; overflow: hidden; background: #ffffff; color: #1e293b;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              <div>
                <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                  ⏳ SEJARAH PERGERAKAN SRU
                </h4>
                <span style="font-size: 10px; color: #64748b;">
                  Kes: <strong style="color: #2563eb;">{{ selectedCaseId === 'ALL' ? 'Semua Insiden (Global)' : `#${selectedCaseId} - ${dapatkanNamaKes(Number(selectedCaseId))}` }}</strong>
                </span>
              </div>
              <div style="display: flex; gap: 4px;">
                <button 
                  @click="bukaTimelinePlayback" 
                  title="Buka Pemain Garis Masa (Playback)"
                  style="background: #0284c7; border: 1px solid #0369a1; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 4px;"
                >
                  ⏱️ Replay
                </button>
                <button 
                  @click="muatTurunSejarahSRU" 
                  title="Muat Semula Rekod Sejarah"
                  style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 4px;"
                >
                  🔄
                </button>
              </div>
            </div>

            <!-- CONTROLS: SELECT ALL / DESELECT ALL -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 8px 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
              <span style="font-size: 11px; font-weight: 700; color: #334155;">
                Paparan Trek Peta ({{ senaraiSruSejarah.filter(s => s.isChecked).length }}/{{ senaraiSruSejarah.length }} Terpilih)
              </span>
              <div style="display: flex; gap: 6px;">
                <button 
                  @click="togolSemuaTrekSejarah(true)" 
                  style="background: #2563eb; color: white; border: none; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;"
                >
                  Pilih Semua
                </button>
                <button 
                  @click="togolSemuaTrekSejarah(false)" 
                  style="background: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;"
                >
                  Nyahpilih
                </button>
              </div>
            </div>

            <!-- LIST OF HISTORICAL SRUs -->
            <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 2px;">
              <div 
                v-for="sru in senaraiSruSejarah" 
                :key="sru.boat_id"
                @click="togolTrekSatuSRU(sru)"
                :style="{
                  background: sru.isChecked ? '#f0f9ff' : '#f8fafc',
                  border: sru.isChecked ? `1.5px solid ${sru.color}` : '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s',
                  boxShadow: sru.isChecked ? '0 2px 5px rgba(0,0,0,0.05)' : 'none'
                }"
              >
                <div style="display: flex; align-items: center; gap: 10px;">
                  <!-- CHECKBOX -->
                  <input 
                    type="checkbox" 
                    :checked="sru.isChecked" 
                    @click.stop
                    @change="togolTrekSatuSRU(sru, $event.target.checked)" 
                    style="width: 16px; height: 16px; cursor: pointer; accent-color: #2563eb;"
                  />
                  
                  <!-- COLOR BADGE & SRU INFO -->
                  <div style="display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span :style="{
                        width: '10px', height: '10px', borderRadius: '3px',
                        backgroundColor: sru.color,
                        boxShadow: `0 0 6px ${sru.color}`
                      }"></span>
                      <strong style="font-size: 12px; color: #0f172a;">{{ sru.boat_id }}</strong>
                      <span v-if="telemetriRealtime.some(t => t.boat_id === sru.boat_id)" style="background: #dcfce7; color: #15803d; font-size: 8px; padding: 1px 4px; border-radius: 3px; font-weight: 800;">ONLINE</span>
                      <span v-else style="background: #f1f5f9; color: #64748b; font-size: 8px; padding: 1px 4px; border-radius: 3px; font-weight: 600;">LOGGED</span>
                    </div>
                    <span style="font-size: 10px; color: #64748b; margin-top: 2px;">
                      📍 <strong>{{ sru.points_count }}</strong> Titik Jejak GPS • {{ formatMasaSejarah(sru.last_seen) }}
                    </span>
                  </div>
                </div>

                <span :style="{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: sru.isChecked ? sru.color : '#94a3b8'
                }">
                  {{ sru.isChecked ? 'ON PETA 👁️' : 'SEMBUNYI' }}
                </span>
              </div>

              <!-- EMPTY STATE -->
              <div v-if="senaraiSruSejarah.length === 0" style="text-align: center; padding: 40px 15px; color: #94a3b8;">
                <div style="font-size: 28px; margin-bottom: 8px;">⏳</div>
                <strong style="color: #475569; font-size: 12px; display: block; margin-bottom: 4px;">Tiada Sejarah Pergerakan</strong>
                <span style="font-size: 11px;">Belum ada sebarang rekod titik koordinat GPS yang disimpan bagi kes ini.</span>
              </div>
            </div>

            <!-- FOOTER INFO CARD -->
            <div style="margin-top: 10px; padding: 8px 12px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 10px; color: #64748b; display: flex; justify-content: space-between; align-items: center;">
              <span>💡 Tandakan kotak untuk lukis garisan laluan di peta.</span>
            </div>
          </div>

          <!-- TAB 3 CONTENT: SRU COMMUNICATION -->
          <div v-show="activeRightSidebarTab === 'communication'" style="flex: 1; display: flex; flex-direction: column; padding: 14px; min-height: 0; overflow: hidden; background: #ffffff; color: #1e293b;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px;">
                💬 SRU COMMUNICATION
              </h4>
            </div>

            <!-- SUB-TABS: GLOBAL & LOCAL INCIDENT -->
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button 
                @click="activeChatTab = 'global'; langganMesejRealtimeSupabase()" 
                :style="[tabButtonStyle, {
                  background: activeChatTab === 'global' ? '#2563eb' : '#f1f5f9',
                  color: activeChatTab === 'global' ? 'white' : '#64748b',
                  border: activeChatTab === 'global' ? 'none' : '1px solid #cbd5e1',
                  flex: '1'
                }]"
              >
                Global
                <span v-if="globalUnreadCount > 0" class="badge-unread">{{ globalUnreadCount }}</span>
              </button>
              <button 
                @click="activeChatTab = 'local'; langganMesejRealtimeSupabase()" 
                :style="[tabButtonStyle, {
                  background: activeChatTab === 'local' ? '#2563eb' : '#f1f5f9',
                  color: activeChatTab === 'local' ? 'white' : '#64748b',
                  border: activeChatTab === 'local' ? 'none' : '1px solid #cbd5e1',
                  flex: '1'
                }]"
              >
                Incident Message
                <span v-if="localUnreadCount > 0" class="badge-unread">{{ localUnreadCount }}</span>
              </button>
            </div>

            <!-- CHAT MESSAGES CONTAINER -->
            <div class="chat-messages-container" style="flex: 1; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 12px; font-size: 11px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
              <div v-for="msg in filteredMesejChat" :key="msg.id" :class="{'message-right': msg.sender === activeStation, 'message-left': msg.sender !== activeStation}" style="display: flex; flex-direction: column; gap: 4px;">
                <div :style="{ 'align-self': msg.sender === activeStation ? 'flex-end' : 'flex-start' }">
                  <span style="font-weight: 800; color: #334155; font-size: 10px;">{{ msg.sender }}</span>
                  <span style="color: #94a3b8; font-size: 9px; margin-left: 8px;">{{ formatMasaChat(msg.created_at) }}</span>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;" :style="{ 'flex-direction': msg.sender === activeStation ? 'row-reverse' : 'row', 'align-self': msg.sender === activeStation ? 'flex-end' : 'flex-start' }">
                  <div :style="{
                    background: msg.sender === activeStation ? '#dbeafe' : '#ffffff',
                    padding: '10px 14px',
                    borderRadius: msg.sender === activeStation ? '12px 0 12px 12px' : '0 12px 12px 12px',
                    border: msg.sender === activeStation ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                    color: '#1e293b',
                    lineHeight: '1.5',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    maxWidth: '100%'
                  }">
                    {{ msg.message }}
                  </div>
                  <!-- Individual message delete for Admin -->
                  <button v-if="isAdmin" @click="padamMesej(msg.id)" title="Padam Mesej" style="background: none; border: none; cursor: pointer; font-size: 11px; opacity: 0.4;">🗑️</button>
                </div>
              </div>
              <div v-if="filteredMesejChat.length === 0" style="text-align: center; color: #94a3b8; font-size: 11px; margin: auto; padding: 20px 0;">
                <span>💬 Tiada mesej dalam saluran ini.</span>
              </div>
            </div>

            <!-- CHAT INPUT -->
            <div style="margin-top: 12px; position: relative;">
              <input 
                type="text" 
                v-model="inputMesejBaru" 
                @keyup.enter="hantarMesejChatSupabase"
                @focus="isInputFocused = true; bersihkanUnread()"
                @blur="isInputFocused = false"
                :placeholder="localChatPlaceholder" 
                :disabled="isLocalChatInputDisabled"
                style="width: 100%; border: 1px solid #cbd5e1; padding: 12px 45px 12px 18px; border-radius: 25px; font-size: 11px; outline: none; transition: 0.2s;"
                :style="{ background: isLocalChatInputDisabled ? '#f1f5f9' : '#ffffff', color: isLocalChatInputDisabled ? '#94a3b8' : '#1e293b' }"
              />
              <button 
                @click="hantarMesejChatSupabase" 
                :disabled="isLocalChatInputDisabled"
                style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); color: white; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);"
                :style="{ background: isLocalChatInputDisabled ? '#94a3b8' : '#2563eb', cursor: isLocalChatInputDisabled ? 'not-allowed' : 'pointer' }"
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

      <!-- MODAL BARU: Padam Sejarah GPS -->
      <div v-if="showPadamGpsModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: #ffffff; width: 520px; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); overflow: hidden; color: #1e293b; font-family: sans-serif; animation: popupAnim 0.15s ease-out;">
          <div style="padding: 15px 20px 5px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0;">
            <h2 style="margin: 0; font-size: 16px; font-weight: bold; color: #ef4444;">🛰️ Padam Sejarah Pergerakan Aset</h2>
            <button @click="showPadamGpsModal = false" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b;">×</button>
          </div>
          
          <div style="padding: 15px; max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
            <p style="margin: 0; font-size: 11px; color: #64748b; font-style: italic;">Pilih aset yang sejarah pergerakannya ingin dipadamkan secara kekal:</p>
            
            <div v-if="senaraiTrekUntukPadam.length === 0" style="text-align: center; color: #94a3b8; font-size: 12px; padding: 20px;">Tiada sejarah pergerakan direkodkan.</div>

            <div v-for="trek in senaraiTrekUntukPadam" :key="trek.sru_id + '-' + trek.case_id" @click="sahkanPadamTrekSpesifik(trek.sru_id, trek.case_id)" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; background: #f8fafc; transition: 0.2s; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="font-size: 12px; color: #0f172a;">Aset: {{ trek.sru_id }}</strong><br>
                <span style="font-size: 10px; color: #64748b;">Kes: #{{ trek.case_id }} - {{ dapatkanNamaKes(trek.case_id) }}</span>
              </div>
              <span style="background: #7f1d1d; color: #fee2e2; padding: 2px 6px; font-size: 9px; font-weight: bold; border-radius: 3px;">HAPUSKAN</span>
            </div>
          </div>

          <div style="background: #f1f5f9; padding: 12px; display: flex; justify-content: flex-end;">
            <button @click="showPadamGpsModal = false" style="background: white; border: 1px solid #cbd5e1; padding: 6px 14px; font-size: 12px; font-weight: bold; border-radius: 6px; cursor: pointer;">Tutup</button>
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
import logoBclbb from './assets/logo_bclbb.png'
import bgLogin from './assets/background_1st_page.jpg'
import { readFullSARSimulation, computeTimeStepPOC, renderPOCToCanvasDataURL } from './services/driftSimulation'

// PAGE 1 MANAGEMENT
const isLoggedIn = ref(false)
const loginError = ref('')
const activeStation = ref('')
const activeRegion = ref('')
const isAdmin = computed(() => activeStation.value === 'Admin System');
const loginForm = ref({ stationId: '', password: '' })

// God Mode State
const amaranAdmin = ref('')
const paparAmaran = ref(false)
const mesejBroadcast = ref('')

// User Presence Logic
const onlineUsers = ref([]);
const stesenList = [
  'MRCC Putrajaya',
  'MRSC Langkawi',
  'MRSC Klang',
  'MRSC Johor Baharu',
  'MRSC Kuantan',
  'MRSC Kota Kinabalu',
  'MRSC Kuching'
];

let presenceChannel = null;

// Fungsi untuk memulakan sistem penjejakan status online
const mulakanPresence = () => {
  // 1. Serta-merta hidupkan status stesen pengguna sendiri (Optimistic Update)
  if (activeStation.value && activeStation.value !== 'Admin System') {
    if (!onlineUsers.value.includes(activeStation.value)) {
      onlineUsers.value.push(activeStation.value);
    }
  }

  // Buang channel lama jika ada untuk elakkan duplikasi
  if (presenceChannel) {
    try {
      supabase.removeChannel(presenceChannel);
    } catch (e) {
      console.warn("Ralat membuang presence channel lama:", e);
    }
  }

  presenceChannel = supabase.channel('online-users', {
    config: {
      presence: {
        key: activeStation.value || 'guest'
      }
    }
  });

  const kemaskiniStatePresence = () => {
    const state = presenceChannel.presenceState();
    const active = new Set();
    
    // Pastikan stesen sendiri sentiasa aktif jika log masuk
    if (activeStation.value && activeStation.value !== 'Admin System') {
      active.add(activeStation.value);
    }

    for (const id in state) {
      const presences = state[id];
      if (Array.isArray(presences)) {
        presences.forEach(p => {
          if (p?.station && p.station !== 'Admin System') {
            active.add(p.station);
          }
        });
      }
    }
    onlineUsers.value = Array.from(active);
  };

  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      kemaskiniStatePresence();
    })
    .on('presence', { event: 'join' }, () => {
      kemaskiniStatePresence();
    })
    .on('presence', { event: 'leave' }, () => {
      kemaskiniStatePresence();
    })
    .subscribe(async (status) => {
      // Hanya mula track selepas channel sah bersambung (SUBSCRIBED)
      if (status === 'SUBSCRIBED' && activeStation.value && activeStation.value !== 'Admin System') {
        try {
          await presenceChannel.track({ 
            station: activeStation.value,
            online_at: new Date().toISOString()
          });
        } catch (err) {
          console.warn("Gagal track presence:", err);
        }
      }
    });
};

// TELEMETRY MANAGEMENT (REAL-TIME GPS)
const telemetriRealtime = ref([])
const sruMarkersOnMap = ref({});
const sruCspLinesOnMap = ref({}); // Simpan garisan ke CSP
const sruReachedCsp = ref({}); // Tanda jika SRU sudah sampai ke CSP
let telemetrySubscription = null;

// Konfigurasi Had Masa Isyarat Aktif (Default: 5 Minit tanpa isyarat = dianggap offline)
const HAD_MASA_TELEMETRI_MINIT = 5;

const semakAdakahTelemetriAktif = (t) => {
  if (!t) return false;
  const isOffline = t.status === 'offline' || 
                    t.is_online === false || 
                    t.is_active === false || 
                    t.active === false;
  if (isOffline) return false;

  const lat = parseFloat(t.latitude);
  const lng = parseFloat(t.longitude);
  if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return false;

  // Semak cap masa untuk elak paparan data lama/lapuk (stale records)
  const tsStr = t.updated_at || t.timestamp || t.created_at || t.time || t.last_updated;
  if (tsStr) {
    const timeMs = new Date(tsStr).getTime();
    if (!isNaN(timeMs)) {
      const bezaMinit = (Date.now() - timeMs) / (1000 * 60);
      if (bezaMinit > HAD_MASA_TELEMETRI_MINIT) {
        return false; // Rekod lama yang tersangkut di pangkalan data
      }
    }
  }
  return true;
};

const formatMasaLalu = (dateStr) => {
  if (!dateStr) return 'Live';
  try {
    const d = new Date(dateStr);
    const bezaSaat = Math.floor((Date.now() - d.getTime()) / 1000);
    if (isNaN(bezaSaat) || bezaSaat < 0) return 'Live';
    if (bezaSaat < 60) return `${bezaSaat}s lalu`;
    const bezaMinit = Math.floor(bezaSaat / 60);
    if (bezaMinit < 60) return `${bezaMinit}m lalu`;
    const bezaJam = Math.floor(bezaMinit / 60);
    return `${bezaJam}j lalu`;
  } catch (e) {
    return 'Live';
  }
};

const muatTurunTelemetri = async () => {
  try {
    const { data, error } = await supabase.from('sru_telemetry').select('*');
    if (error) {
      console.error("Ralat muat turun telemetri awal:", error);
      return;
    }
    if (data) {
      telemetriRealtime.value = data.filter(t => semakAdakahTelemetriAktif(t));
      kemaskiniMarkerSRUAtasPeta();
    }
  } catch (err) {
    console.error("Ralat muatTurunTelemetri:", err);
  }
};

// Fungsi untuk membersihkan semua rekod telemetri lama yang tersangkut di Supabase
const cuciSemuaTelemetriOffline = async () => {
  if (!confirm("Padam SEMUA rekod telemetri radar yang tersangkut dari pangkalan data? Aset yang sedang aktif transmit dari app akan terus muncul semula.")) return;
  try {
    const { error } = await supabase.from('sru_telemetry').delete().neq('id', 0);
    if (!error) {
      telemetriRealtime.value = [];
      kemaskiniMarkerSRUAtasPeta();
      alert("Pangkalan data telemetri telah dibersihkan.");
    } else {
      alert("Ralat memadam telemetri: " + error.message);
    }
  } catch (e) {
    console.error("Ralat cuci telemetri:", e);
  }
};

// Pemasa automatik (Watchdog) untuk membuang bot yang terputus isyarat > 5 minit
setInterval(() => {
  if (telemetriRealtime.value.length > 0) {
    const asal = telemetriRealtime.value.length;
    telemetriRealtime.value = telemetriRealtime.value.filter(t => semakAdakahTelemetriAktif(t));
    if (telemetriRealtime.value.length !== asal) {
      kemaskiniMarkerSRUAtasPeta();
    }
  }
}, 15000);

const kemaskiniMarkerSRUAtasPeta = () => {
  if (!mapInstance) return; // Pastikan peta web dah sedia

  // Ambil senarai ID dan boat_id bot yang aktif sedia ada dalam telemetry
  const sruAktifId = telemetriRealtime.value.map(t => String(t.id));
  const sruAktifBoatId = telemetriRealtime.value.map(t => String(t.boat_id));

  // A: Bersihkan marker jika bot tersebut dah offline / padam tracking
  Object.keys(sruMarkersOnMap.value).forEach(idKey => {
    const isStillActive = sruAktifId.includes(String(idKey)) || sruAktifBoatId.includes(String(idKey));
    if (!isStillActive) {
      if (sruMarkersOnMap.value[idKey]) {
        mapInstance.removeLayer(sruMarkersOnMap.value[idKey]);
        delete sruMarkersOnMap.value[idKey];
      }
      
      if (sruCspLinesOnMap.value[idKey]) {
        mapInstance.removeLayer(sruCspLinesOnMap.value[idKey]);
        delete sruCspLinesOnMap.value[idKey];
      }
      delete sruReachedCsp.value[idKey];
    }
  });

  // B: Lukis atau gerakkan marker bot yang sedang memancarkan isyarat GPS
  telemetriRealtime.value.forEach(tele => {
    const lat = parseFloat(tele.latitude);
    const lng = parseFloat(tele.longitude);

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return;

    const currentPos = L.latLng(lat, lng);
    const key = tele.boat_id || tele.id;
    const tsStr = tele.updated_at || tele.timestamp || tele.created_at || tele.time;
    const lastSeenText = formatMasaLalu(tsStr);

    if (!sruMarkersOnMap.value[key]) {
      // Jika bot baru online, cipta icon bot taktikal (Kecil & Berkelip Neon)
      const newMarker = L.circleMarker(currentPos, {
        color: '#22c55e', // Hijau Neon
        fillColor: '#22c55e',
        fillOpacity: 1,
        radius: 5, // Saiz dikecilkan
        weight: 2,
        className: 'sru-marker-blink' // Class untuk animasi CSS
      }).addTo(mapInstance);

      // Ikat maklumat kelajuan dan arah bot pada popup di skrin komander
      newMarker.bindTooltip(`🛥️ SRU LIVE: <b>${tele.boat_id}</b><br>⚡ Kelajuan: ${tele.speed || '0.0'} kts<br>🧭 Arah: ${tele.course ? tele.course + '°' : '---'}<br>⏱️ Isyarat: ${lastSeenText}`, { permanent: false, direction: 'top' });

      sruMarkersOnMap.value[key] = newMarker;
    } else {
      // Jika bot sedia ada bergerak, cuma kemaskini koordinat dan kandungan tooltip secara live
      sruMarkersOnMap.value[key].setLatLng(currentPos);
      sruMarkersOnMap.value[key].setTooltipContent(`🛥️ SRU LIVE: <b>${tele.boat_id}</b><br>⚡ Kelajuan: ${tele.speed || '0.0'} kts<br>🧭 Arah: ${tele.course ? tele.course + '°' : '---'}<br>⏱️ Isyarat: ${lastSeenText}`);
    }

    // LOGIK BARU: Garisan putus-putus ke CSP
    const sruPlan = senaraiMasterSRU.value.find(s => s.nama === tele.boat_id);
    if (sruPlan && sruPlan.csp_coord) {
      const cspPos = L.latLng(sruPlan.csp_coord[0], sruPlan.csp_coord[1]);
      const distMeters = currentPos.distanceTo(cspPos);
      const distNM = distMeters / 1852; // Tukar meter ke Nautical Miles

      // ✅ KIRA ETA & CSP UNTUK PAPARAN JADUAL
      tele.csp = distNM.toFixed(2);
      const speedKts = parseFloat(tele.speed) || 0;
      if (distNM < 0.1) {
        tele.eta = "ARRIVED";
      } else if (speedKts > 0.5) {
        const totalMinutes = Math.round((distNM / speedKts) * 60);
        if (totalMinutes < 60) {
          tele.eta = totalMinutes + "m";
        } else {
          const h = Math.floor(totalMinutes / 60);
          const m = totalMinutes % 60;
          tele.eta = `${h}j ${m}m`;
        }
      } else {
        tele.eta = "STATIONARY";
      }

      // Jika jarak kurang dari 0.2 NM, tanda sebagai "sampai"
      if (distNM < 0.2) {
        sruReachedCsp.value[key] = true;
      }

      // Hanya lukis garisan jika belum sampai buat pertama kali
      if (!sruReachedCsp.value[key]) {
        if (!sruCspLinesOnMap.value[key]) {
          sruCspLinesOnMap.value[key] = L.polyline([currentPos, cspPos], {
            color: '#000000', // Warna Hitam untuk lebih jelas
            weight: 2,
            dashArray: '5, 10',
            opacity: 0.7,
            interactive: false
          }).addTo(mapInstance);
        } else {
          sruCspLinesOnMap.value[key].setLatLngs([currentPos, cspPos]);
        }
      } else if (sruCspLinesOnMap.value[key]) {
        // Hilangkan garisan jika sudah sampai
        mapInstance.removeLayer(sruCspLinesOnMap.value[key]);
        delete sruCspLinesOnMap.value[key];
      }
    } else {
      tele.csp = '---';
      tele.eta = '---';
    }
  });
};

const langganTelemetriMMEA = () => {
  if (telemetrySubscription) {
    supabase.removeChannel(telemetrySubscription);
  }

  telemetrySubscription = supabase
    .channel('sru_status_live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sru_telemetry' }, payload => {
      if (payload.eventType === 'INSERT') {
        if (!semakAdakahTelemetriAktif(payload.new)) return;

        const idx = telemetriRealtime.value.findIndex(t => 
          (payload.new.id && t.id === payload.new.id) || 
          (payload.new.boat_id && t.boat_id === payload.new.boat_id)
        );
        if (idx !== -1) {
          telemetriRealtime.value[idx] = payload.new;
        } else {
          telemetriRealtime.value.push(payload.new);
        }
      } 
      else if (payload.eventType === 'UPDATE') {
        if (!semakAdakahTelemetriAktif(payload.new)) {
          telemetriRealtime.value = telemetriRealtime.value.filter(t => 
            !(t.id === payload.new.id || (payload.new.boat_id && t.boat_id === payload.new.boat_id))
          );
        } else {
          const idx = telemetriRealtime.value.findIndex(t => 
            (payload.new.id && t.id === payload.new.id) || 
            (payload.new.boat_id && t.boat_id === payload.new.boat_id)
          );
          if (idx !== -1) {
            telemetriRealtime.value[idx] = payload.new;
          } else {
            telemetriRealtime.value.push(payload.new);
          }
        }
      } 
      else if (payload.eventType === 'DELETE') {
        const delId = payload.old?.id;
        const delBoatId = payload.old?.boat_id;
        telemetriRealtime.value = telemetriRealtime.value.filter(t => {
          if (delId && t.id === delId) return false;
          if (delBoatId && t.boat_id === delBoatId) return false;
          return true;
        });
      }
    })
    .subscribe();
};

const pemetaanStesenRegion = {
  'MRCC Putrajaya': 'NASIONAL', 
  'MRSC Langkawi': 'UTARA',
  'MRSC Klang': 'BARAT',
  'MRSC Johor Baharu': 'SELATAN',
  'MRSC Kuantan': 'TIMUR',
  'MRSC Kota Kinabalu': 'SABAH',
  'MRSC Kuching': 'SARAWAK',
  'Admin System': 'GLOBAL'
}

watch(() => loginForm.value.stationId, (val) => {
  if (val === 'Admin System') {
    const pw = prompt("Sila masukkan kata laluan Admin:");
    if (pw !== "zulhairy87") {
      alert("Kata laluan salah!");
      loginForm.value.stationId = '';
    }
  }
});

const hantarNotifikasiTaktikal = (sender, msg, isEmergency = false) => {
  // 1. Mainkan Bunyi (Cara paling berkesan untuk bilik operasi)
  // Bunyi Ping untuk mesej biasa, bunyi Siren untuk Emergency Broadcast
  const soundUrl = isEmergency 
    ? 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3' 
    : 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3';
  
  const audio = new Audio(soundUrl);
  audio.play().catch(() => {
    console.warn("Autoplay bunyi disekat oleh pelayar. Sila berinteraksi dengan peta dahulu.");
  });

  // 2. Notifikasi Desktop (Jika tab disorokkan/minimized)
  if (window.Notification && Notification.permission === 'granted' && document.hidden) {
    new Notification(`Mesej SAR: ${sender}`, {
      body: msg,
      icon: logoBclbb
    });
  }
};

const initializeDashboard = async () => {
  await nextTick()

  // Minta kebenaran notifikasi desktop sebaik sahaja masuk dashboard
  if (window.Notification && Notification.permission === 'default') {
    try {
      Notification.requestPermission();
    } catch (e) {}
  }

  await initMap()
  await tarikDataKes()

  if (isAdmin.value && mapInstance) {
    mapInstance.setView([4.5, 109.0], 5)
  } else if ((activeStation.value === 'MRSC Kota Kinabalu' || activeStation.value === 'MRSC Kuching') && mapInstance) {
    mapInstance.setView([4.0, 114.0], 7)
  }

  // Jalankan presence setiap kali dashboard di-initialize (login/refresh)
  mulakanPresence();

  await recallPlanDariSupabase()

  // Jika ada kes aktif untuk wilayah ini dan belum pilih kes spesifik, pilih kes tersebut secara automatik
  if (senaraiKesAktifSahaja.value.length > 0 && selectedCaseId.value === 'ALL') {
    selectedCaseId.value = senaraiKesAktifSahaja.value[0].id
  }
  tukarKesTaktikal()

  // Pastikan langganan realtime aktif
  langganTelemetriMMEA()
  await muatTurunTelemetri()
  langganMesejRealtimeSupabase()
  if (typeof langganPerubahanPelanSupabase === 'function') {
    langganPerubahanPelanSupabase()
  }

  // Langganan baru untuk sejarah trek GPS
  if (typeof langganSejarahTrekSupabase === 'function') {
    langganSejarahTrekSupabase();
  }

  await muatTurunSejarahSRU();
}

onMounted(async () => {
  // Semak jika ada sesi tersimpan dalam browser
  const savedStatus = localStorage.getItem('isLoggedIn')
  if (savedStatus === 'true') {
    activeStation.value = localStorage.getItem('activeStation') || ''
    activeRegion.value = pemetaanStesenRegion[activeStation.value] || localStorage.getItem('activeRegion') || ''
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
const activeRightSidebarTab = ref('active')
const activeLeftPanelTab = ref('sap') // 'sap' atau 'simulation'
const senaraiKes = ref([])
const selectedCaseId = ref('ALL') 
const senaraiMasterSRU = ref([]) 
const tacticalLogs = ref([])
const senaraiMesejChat = ref([])
const inputMesejBaru = ref('')
const activeChatTab = ref('global')
const globalUnreadCount = ref(0) // New ref for unread count
const localUnreadCount = ref(0)
const totalUnreadCount = computed(() => globalUnreadCount.value + localUnreadCount.value)
const isInputFocused = ref(false)
const paparkanTrekLaluan = ref(false)
const senaraiSruSejarah = ref([])
let chatChannelSubscription = null
const isLeftPanelVisible = ref(true)
let mapInstance = null
let sapLayerGroup = null
let trackHistoryPolylines = {}; // Simpan rujukan kepada setiap polyline SRU
let trackHistoryLayer = null

const warnaTrekSRU = ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#3b82f6', '#f43f5e', '#14b8a6', '#eab308', '#a855f7', '#0284c7', '#d97706']
const warnaSearchArea = ['#dc2626', '#2563eb', '#9333ea', '#ea580c', '#16a34a']

const showDeleteModal = ref(false)
const showAddCaseModal = ref(false)
const showEditCaseModal = ref(false)
const showLoadCaseModal = ref(false)
const showPadamGpsModal = ref(false)
const senaraiTrekUntukPadam = ref([])

const dapatkanNamaKes = (id) => senaraiKes.value.find(k => k.id === id)?.case_name || 'Tidak Diketahui';

const sruTargetToPadam = ref(null)
const formAddKes = ref({ case_no: '', case_name: '', search_object: '' })
const formEditKes = ref({ case_name: '' })

// FLOATING DRAW TOOLBAR STATE
const isDrawToolbarOpen = ref(true)

// TIMELINE PLAYBACK STATE
const isTimelineOpen = ref(false)
const isTimelineMinimized = ref(false)
const isPlaying = ref(false)
const playbackSpeed = ref(1) // 1, 2, 5, 10
const timelinePoints = ref([])
const playbackTracks = ref([])
const playbackStartDate = ref('')
const playbackEndDate = ref('')
const isPlaybackLoading = ref(false)
const currentTimelineIndex = ref(0)
const currentTimelineTime = ref('')
const timelineStartTime = ref('')
const timelineEndTime = ref('')
const replayActiveSruCount = ref(0)
let replayTimer = null
let replayLayer = null
let replayMarkers = {}
let replayPolylines = {}

// DRIFT SIMULATION STATE (NetCDF-4 / HDF5 .nc)
const driftSimData = ref(null)
const driftFileName = ref('')
const isDriftLoading = ref(false)
const currentDriftStep = ref(0)
const isDriftPlaying = ref(false)
const driftPlaySpeed = ref(1) // 1x, 2x, 5x
const driftDistressPos = ref(null)
const driftPeakPOC = ref(null)
const driftSimTimeStr = ref('')
const driftValidCount = ref(0)
let driftPlayTimer = null

// Leaflet Layers untuk Drift POC
let driftLayerGroup = null
let driftImageOverlay = null
let driftDistressMarker = null
let driftPeakMarker = null

// DRAWING TOOLS STATE
const activeTool = ref(null)
const isDeleteMode = ref(false)
let toolsLayer = null // FeatureGroup untuk semua lukisan taktikal
let tempDrawingLayer = null // For temporary preview shapes
const drawingStartPoint = ref(null) // Stores the first click for drawing
const isDrawing = ref(false)
const tempShape = ref(null)
let tempPoints = []

// MAP COORDINATE STATE (TUGASAN 1)
const currentLat = ref("00° 00.00' N")
const currentLng = ref("000° 00.00' E")

const formatLatLng = (value, isLat) => {
  if (value === null || value === undefined || isNaN(value)) {
    return isLat ? "00° 00.00' N" : "000° 00.00' E";
  }
  const dir = value < 0 ? (isLat ? 'S' : 'W') : (isLat ? 'N' : 'E');
  const absVal = Math.abs(value);
  const degrees = Math.floor(absVal);
  const minutes = ((absVal - degrees) * 60).toFixed(2);
  const padDeg = isLat ? String(degrees).padStart(2, '0') : String(degrees).padStart(3, '0');
  const minutesStr = parseFloat(minutes) < 10 ? '0' + minutes : minutes;
  return `${padDeg}° ${minutesStr}' ${dir}`;
};

// PARSING KOORDINAT MARITIM (DD, DDM, DMS)
const parseMaritimeCoordinates = (inputStr) => {
  if (!inputStr || typeof inputStr !== 'string') return null;
  const str = inputStr.trim();

  // 1. Format Decimal Degree: 3.15, 104.81 atau 3.15 104.81
  const ddMatch = str.match(/^([-+]?\d*\.?\d+)[,\s]+([-+]?\d*\.?\d+)$/);
  if (ddMatch) {
    const lat = parseFloat(ddMatch[1]);
    const lon = parseFloat(ddMatch[2]);
    if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      return { lat, lon };
    }
  }

  // 2. Format DDM / DMS Maritim: cth 03° 09.09' N, 104° 49.56' E atau 03 09.09 N 104 49.56 E
  const maritimeRegex = /([0-9]{1,2})[°\s]+([0-9]{1,2}(?:\.[0-9]+)?)(?:['\s]+([0-9]{1,2}(?:\.[0-9]+)?)["\s]*)?([NSns])?[,\s]+([0-9]{1,3})[°\s]+([0-9]{1,2}(?:\.[0-9]+)?)(?:['\s]+([0-9]{1,2}(?:\.[0-9]+)?)["\s]*)?([EWew])?/i;
  const mMatch = str.match(maritimeRegex);
  if (mMatch) {
    let latDeg = parseFloat(mMatch[1]) || 0;
    let latMin = parseFloat(mMatch[2]) || 0;
    let latSec = parseFloat(mMatch[3]) || 0;
    let latDir = (mMatch[4] || 'N').toUpperCase();

    let lonDeg = parseFloat(mMatch[5]) || 0;
    let lonMin = parseFloat(mMatch[6]) || 0;
    let lonSec = parseFloat(mMatch[7]) || 0;
    let lonDir = (mMatch[8] || 'E').toUpperCase();

    let lat = latDeg + (latMin / 60) + (latSec / 3600);
    if (latDir === 'S') lat = -lat;

    let lon = lonDeg + (lonMin / 60) + (lonSec / 3600);
    if (lonDir === 'W') lon = -lon;

    if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      return { lat, lon };
    }
  }

  return null;
};

// MAP HEADER CONTROLS (SEARCH & LAYERS)
const teksCarianPeta = ref('')
const isLayerMenuOpen = ref(false)
const showLayerMSRR = ref(false)
const showLayerPelantar = ref(false)
const selectedBaseLayer = ref('osm') // 'osm' (Cerah/Jalan - Lalai) | 'dark' | 'satellite'
const showOpenSeaMap = ref(false)

let layerMSRRInstance = null
let layerPelantarInstance = null
let layerSeaMapInstance = null
let baseLayers = {}
let searchMarker = null

const laksanakanCarianPeta = async () => {
  const val = teksCarianPeta.value.trim()
  if (!val || !mapInstance) return

  const executeGoTo = (targetLat, targetLon, label = "🎯 TARGET CARIAN") => {
    mapInstance.flyTo([targetLat, targetLon], 11, { animate: true })
    if (searchMarker) mapInstance.removeLayer(searchMarker)
    searchMarker = L.marker([targetLat, targetLon], {
      icon: L.divIcon({
        html: '<div style="font-size: 24px; filter: drop-shadow(0 0 5px rgba(255,0,0,0.5));">🚩</div>',
        className: 'target-marker-icon',
        iconAnchor: [5, 24]
      })
    }).addTo(mapInstance)
    const coordLabel = `${formatLatLng(targetLat, true)} | ${formatLatLng(targetLon, false)}`;
    searchMarker.bindTooltip(`${label}<br><span style="font-family:monospace; font-size:10px;">${coordLabel}</span>`, { direction: 'top', offset: [0, -20] }).openTooltip()
    tacticalLogs.value.unshift(`🚩 Carian peta dipusatkan ke: ${coordLabel}`);
  }

  // 1. Cuba parsing sebagai koordinat terus (DD / DDM / DMS)
  const parsedCoords = parseMaritimeCoordinates(val);
  if (parsedCoords) {
    executeGoTo(parsedCoords.lat, parsedCoords.lon, "🎯 KOORDINAT TARGET");
    return;
  }

  // 2. Jika bukan koordinat, hantar ke carian geocoding nama tempat (Nominatim)
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`)
    const data = await res.json()
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat)
      const lon = parseFloat(data[0].lon)
      executeGoTo(lat, lon, `🎯 ${data[0].display_name.split(',')[0]}`)
    } else {
      alert("📍 Lokasi atau koordinat tidak dapat dikenal pasti.")
    }
  } catch (err) {
    console.error("Search Error:", err)
    alert("⚠️ Ralat semasa melakukan carian.")
  }
}

const tukarBaseLayer = (jenis) => {
  selectedBaseLayer.value = jenis
  if (!mapInstance || !baseLayers) return

  // Buang semua base layer sedia ada
  Object.values(baseLayers).forEach(layer => {
    if (mapInstance.hasLayer(layer)) mapInstance.removeLayer(layer)
  })

  // Tambah base layer yang dipilih
  if (baseLayers[jenis]) {
    baseLayers[jenis].addTo(mapInstance)
    baseLayers[jenis].bringToBack()
  }
}

const togolOpenSeaMap = () => {
  if (!mapInstance || !layerSeaMapInstance) return
  if (showOpenSeaMap.value) {
    mapInstance.addLayer(layerSeaMapInstance)
  } else {
    mapInstance.removeLayer(layerSeaMapInstance)
  }
}

const togolLayerMSRR = () => {
  if (!mapInstance || !layerMSRRInstance) return
  if (showLayerMSRR.value) {
    mapInstance.addLayer(layerMSRRInstance)
  } else {
    mapInstance.removeLayer(layerMSRRInstance)
  }
}

const togolLayerPelantar = () => {
  if (!mapInstance || !layerPelantarInstance) return
  if (showLayerPelantar.value) {
    mapInstance.addLayer(layerPelantarInstance)
  } else {
    mapInstance.removeLayer(layerPelantarInstance)
  }
}

const senaraiKesAktifSahaja = computed(() => {
  if (!senaraiKes.value || !Array.isArray(senaraiKes.value)) return [];
  
  if (activeStation.value === 'MRCC Putrajaya' || activeStation.value === 'Admin System' || !activeRegion.value) {
    return senaraiKes.value.filter(kes => (kes.status || '').toLowerCase() === 'active');
  }

  const regUser = (activeRegion.value || '').toUpperCase().trim();
  return senaraiKes.value.filter(kes => {
    const s = (kes.status || '').toLowerCase().trim();
    const r = (kes.region || '').toUpperCase().trim();
    return s === 'active' && (r === regUser || r.includes(regUser) || regUser.includes(r));
  });
})

// Pemilihan kes aktif secara automatik dan reaktif
watch(senaraiKesAktifSahaja, (newVal) => {
  if (newVal && newVal.length > 0) {
    const wujud = newVal.some(k => Number(k.id) === Number(selectedCaseId.value));
    if (!wujud || selectedCaseId.value === 'ALL') {
      selectedCaseId.value = newVal[0].id;
    }
  }
}, { immediate: true });

watch(selectedCaseId, () => {
  tukarKesTaktikal();
});

const isGlobalChatActive = computed(() => activeChatTab.value === 'global');
const isLocalChatActive = computed(() => activeChatTab.value === 'local');
const isCaseSelected = computed(() => selectedCaseId.value !== 'ALL');
const isCaseOwnedByStation = computed(() => {
  if (selectedCaseId.value === 'ALL') return true; // Benarkan pelepasan penuh jika pilih ALL
  if (activeStation.value === 'MRCC Putrajaya') return true;
  return selectedCase.value && (selectedCase.value.region || '').toUpperCase().includes((activeRegion.value || '').toUpperCase());
});

const selectedCase = computed(() => {
  if (selectedCaseId.value === 'ALL') return null
  return senaraiKes.value.find(k => Number(k.id) === Number(selectedCaseId.value))
})

const paparanSRUKesAktif = computed(() => {
  if (selectedCaseId.value === 'ALL') {
    const idKesAktif = senaraiKesAktifSahaja.value.map(k => Number(k.id));
    return senaraiMasterSRU.value.filter(sru => idKesAktif.includes(Number(sru.caseId)));
  } 
  return senaraiMasterSRU.value.filter(sru => Number(sru.caseId) === Number(selectedCaseId.value));
})

const filteredMesejChat = computed(() => {
  if (isGlobalChatActive.value) {
    return senaraiMesejChat.value.filter(m => m.chat_type === 'global' && m.case_id === null);
  } else if (isLocalChatActive.value) {
    // Jika pilih ALL, paparkan semua mesej local yang terikat di bawah wilayah stesen tersebut
    if (selectedCaseId.value === 'ALL') {
      const idKesWilayah = senaraiKesAktifSahaja.value.map(k => k.id)
      return senaraiMesejChat.value.filter(m => m.chat_type === 'local' && idKesWilayah.includes(m.case_id));
    }
    return senaraiMesejChat.value.filter(m => m.chat_type === 'local' && m.case_id === Number(selectedCaseId.value));
  }
  return [];
})

const bersihkanUnread = () => {
  if (activeChatTab.value === 'global') globalUnreadCount.value = 0
  else localUnreadCount.value = 0
}

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
    return '⚠️ SILA PILIH KES SPESIFIK UNTUK MULA MENGHANTAR MESEJ INSIDEN...'
  }
  if (isLocalChatInputDisabled.value) {
    return '🔒 CHANNEL LOCKED: ANDA TIDAK MEMPUNYAI AKSES UNTUK TRANSMIT KE INSIDEN INI.'
  }
  return 'Transmit message...'
})

const tabButtonStyle = {
  border: 'none',
  padding: '7px 16px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '800',
  cursor: 'pointer',
  transition: '0.2s',
  position: 'relative'
}

const initMap = async () => {
  let mapContainer = document.getElementById('map')
  let retries = 0
  while (!mapContainer && retries < 30) {
    await new Promise(r => setTimeout(r, 50))
    mapContainer = document.getElementById('map')
    retries++
  }
  if (!mapContainer) {
    console.error("Gagal mengesan kontena #map dalam DOM")
    return
  }

  if (mapInstance) {
    try {
      mapInstance.remove()
    } catch (e) {}
    mapInstance = null
  }

  mapInstance = L.map('map', { 
    zoomControl: false
  }).setView([4.2, 109.5], 5)

  // Inisialisasi Base Layers
  baseLayers = {
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: '&copy; CartoDB &copy; OpenStreetMap' }),
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles &copy; Esri' })
  };

  // Muat base layer terpilih (Lalai: Jalan/OSM Cerah)
  if (baseLayers[selectedBaseLayer.value]) {
    baseLayers[selectedBaseLayer.value].addTo(mapInstance);
  } else {
    baseLayers.osm.addTo(mapInstance);
  }

  // Lapisan Maritim OpenSeaMap (Overlay)
  layerSeaMapInstance = L.tileLayer('https://tiles.openseamap.org/seamap/{z}/{x}/{y}.png', { maxZoom: 18 });
  if (showOpenSeaMap.value) {
    layerSeaMapInstance.addTo(mapInstance);
  }

  // ============================================================================
  // 1. LAYER MSRR (Sempadan Carian & Menyelamat) - Menggunakan Polyline
  // ============================================================================

  // MSRR Selat Melaka & Laut China Selatan (Semenanjung)
  const msrrBarat = L.polyline([
    [6.4333, 100.1333], // Titik 1: Sempadan Pantai Barat (Perlis/Thailand)
    [6.5000, 99.0000],  // Titik 2
    [7.2500, 98.0000],  // Titik 3
    [10.0000, 96.5000], // Titik 4
    [10.0000, 94.4167], // Titik 5
    [6.0000, 94.4167],  // Titik 6
    [6.0000, 97.5000],  // Titik 7
    [1.6500, 102.1667], // Titik 8
    [1.2833, 103.6000], // Titik 9
    [1.2833, 103.6333], // Titik 10
    [1.2833, 104.0833], // Titik 11
    [1.2167, 104.2167], // Titik 12
    [1.3833, 104.5000], // Titik 13
    [1.9000, 105.0833], // Titik 14
    [4.0000, 105.0833], // Titik 15
    [6.0000, 106.0000], // Titik 16
    [7.8333, 103.0500], // Titik 17
    [6.2333, 102.1167]  // Titik 18: Sempadan Pantai Timur (Kelantan/Thailand)
  ], { color: 'blue', weight: 2, dashArray: '5, 5' }).bindPopup("MSRR: Selat Melaka / Semenanjung");

  // MSRR Laut China Selatan & Laut Sulu (Borneo)
  const msrrTimur = L.polyline([
    [2.0833, 109.6467], // Titik 19: Pantai Tg. Datu (Sempadan Sarawak)
    [6.2833, 109.6333], // Titik 20
    [10.0000, 111.5000], // Titik 21
    [10.0000, 116.0000], // Titik 22
    [7.6833, 116.0000], // Titik 23
    [7.6833, 118.0000], // Titik 24
    [6.3333, 118.0000], // Titik 25
    [6.0000, 118.3333], // Titik 26
    [6.0000, 118.9167], // Titik 27
    [5.2667, 119.5833], // Titik 28
    [4.7000, 119.0000], // Titik 29
    [4.4000, 119.0000], // Titik 30
    [4.4000, 120.0000], // Titik 31
    [4.0000, 120.0000], // Titik 32
    [4.0000, 118.0000], // Titik 33
    [4.1667, 117.8995]  // Titik 34: Pantai Sempadan Sabah/Kalimantan
  ], { color: 'red', weight: 2, dashArray: '5, 5' }).bindPopup("MSRR: Borneo (Sabah & Sarawak)");

  layerMSRRInstance = L.layerGroup([msrrBarat, msrrTimur]);
  layerPelantarInstance = L.layerGroup([pelantarSemenanjung, pelantarBorneo]);

  // 3. LIVE COORDINATE TRACKER (PENJEJAK LATLONG TETIKUS)
  // 3. LIVE COORDINATE TRACKER (PENJEJAK LATLONG TETIKUS)
  const updateCoords = (latlng) => {
    if (!latlng || isNaN(latlng.lat) || isNaN(latlng.lng)) return;
    currentLat.value = formatLatLng(latlng.lat, true);
    currentLng.value = formatLatLng(latlng.lng, false);
  };

  mapInstance.on('mousemove', (e) => {
    if (e && e.latlng) updateCoords(e.latlng);
  });

  // Setup tools layer secara bersih
  if (toolsLayer && mapInstance.hasLayer(toolsLayer)) {
    toolsLayer.clearLayers();
  }
  toolsLayer = L.featureGroup().addTo(mapInstance);

  if (tempDrawingLayer && mapInstance.hasLayer(tempDrawingLayer)) {
    tempDrawingLayer.clearLayers();
  }
  tempDrawingLayer = L.layerGroup().addTo(mapInstance);

  if (sapLayerGroup && mapInstance.hasLayer(sapLayerGroup)) {
    sapLayerGroup.clearLayers();
  }
  sapLayerGroup = L.layerGroup().addTo(mapInstance);

  trackHistoryLayer = L.layerGroup().addTo(mapInstance);
  replayLayer = L.layerGroup().addTo(mapInstance);
  driftLayerGroup = L.layerGroup().addTo(mapInstance);
  driftImageOverlay = null;
  driftDistressMarker = null;
  driftPeakMarker = null;
  trackHistoryPolylines = {};
  replayMarkers = {};
  replayPolylines = {};

  // Daftarkan event Leaflet secara bersih (Hanya Click & Mousemove)
  mapInstance.on('mousemove', onMapMouseMove);
  mapInstance.on('click', onMapClick);

  mapInstance.invalidateSize();
}

const aktifkanTool = (tool) => {
  if (isDeleteMode.value) {
    toggleDeleteMode();
  }

  activeTool.value = activeTool.value === tool ? null : tool;
  drawingStartPoint.value = null;
  isDrawing.value = false;
  if (tempDrawingLayer) tempDrawingLayer.clearLayers();
  tempShape.value = null;

  if (mapInstance && mapInstance._container) {
    if (activeTool.value) {
      L.DomUtil.addClass(mapInstance._container, 'pencil-cursor');
      tacticalLogs.value.unshift(`🛠️ ALATAN AKTIF: ${tool.toUpperCase()}. Klik pada peta untuk mula.`);
    } else {
      L.DomUtil.removeClass(mapInstance._container, 'pencil-cursor');
      tacticalLogs.value.unshift(`🛠️ ALATAN DINYAHAKTIFKAN.`);
    }
  }
}

const toggleDeleteMode = () => {
  isDeleteMode.value = !isDeleteMode.value;
  if (isDeleteMode.value) {
    if (activeTool.value) {
      activeTool.value = null;
      drawingStartPoint.value = null;
      isDrawing.value = false;
      if (tempDrawingLayer) tempDrawingLayer.clearLayers();
      if (mapInstance && mapInstance._container) {
        L.DomUtil.removeClass(mapInstance._container, 'pencil-cursor');
      }
    }
  }

  const mapEl = document.getElementById('map');
  if (mapEl) {
    mapEl.style.cursor = isDeleteMode.value ? 'crosshair' : '';
  }
  if (mapInstance && mapInstance._container) {
    if (isDeleteMode.value) {
      L.DomUtil.addClass(mapInstance._container, 'delete-cursor');
    } else {
      L.DomUtil.removeClass(mapInstance._container, 'delete-cursor');
    }
  }

  if (isDeleteMode.value) {
    tacticalLogs.value.unshift(`🗑️ MOD PADAM INDIVIDU AKTIF: Klik pada mana-mana bentuk atau teks untuk memadamnya.`);
  } else {
    tacticalLogs.value.unshift(`🛠️ MOD PADAM DINYAHAKTIFKAN.`);
  }
}

const onMapMouseMove = (e) => {
  if (e && e.latlng) {
    currentLat.value = formatLatLng(e.latlng.lat, true);
    currentLng.value = formatLatLng(e.latlng.lng, false);
  }

  if (!isDrawing.value || !drawingStartPoint.value || !activeTool.value || !tempDrawingLayer) return;
  if (activeTool.value === 'marker' || activeTool.value === 'text') return;

  tempDrawingLayer.clearLayers();
  const currentLatLng = e.latlng;
  let newTempShape = null;

  if (activeTool.value === 'circle') {
    const radius = drawingStartPoint.value.distanceTo(currentLatLng);
    newTempShape = L.circle(drawingStartPoint.value, { radius, color: '#38bdf8', weight: 2, fillOpacity: 0.25, dashArray: '5, 5' });
  } else if (activeTool.value === 'rect') {
    newTempShape = L.rectangle([drawingStartPoint.value, currentLatLng], { color: '#fbbf24', weight: 2, fillOpacity: 0.25, dashArray: '5, 5' });
  } else if (activeTool.value === 'line') {
    newTempShape = L.polyline([drawingStartPoint.value, currentLatLng], { color: '#ef4444', weight: 3, dashArray: '5, 5' });
  }

  if (newTempShape) {
    newTempShape.addTo(tempDrawingLayer);
    tempShape.value = newTempShape;
  }
}

const onMapClick = (e) => {
  if (isDeleteMode.value || !toolsLayer) return;
  const latlng = e.latlng;

  // 1. PIN MARKER (1-KLIK)
  if (activeTool.value === 'marker') {
    const coordText = `${formatLatLng(latlng.lat, true)} | ${formatLatLng(latlng.lng, false)}`;
    const pinIcon = L.divIcon({
      html: '<div style="font-size: 26px; line-height: 1; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.8)); transform: translate(-10px, -24px);">📍</div>',
      className: 'custom-area-label',
      iconAnchor: [13, 26]
    });
    const pinMarker = L.marker(latlng, { icon: pinIcon }).addTo(toolsLayer);
    const labelMarker = L.marker(latlng, {
      icon: L.divIcon({
        html: `<div style="background:rgba(15,23,42,0.92); color:#38bdf8; font-family:monospace; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px; border:1px solid #38bdf8; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.5); transform:translateY(-28px);">📍 ${coordText}</div>`,
        className: 'custom-area-label',
        iconAnchor: [50, 0]
      })
    }).addTo(toolsLayer);
    pinMarker._measureLabel = labelMarker;

    pinMarker.on('click', (ev) => {
      if (isDeleteMode.value) {
        L.DomEvent.stopPropagation(ev);
        toolsLayer.removeLayer(labelMarker);
        toolsLayer.removeLayer(pinMarker);
        tacticalLogs.value.unshift(`🗑️ Marker dipadam.`);
      }
    });

    tacticalLogs.value.unshift(`📍 Marker diletakkan: ${coordText}`);
    aktifkanTool(null);
    return;
  }

  // 2. TEKS CARTA (1-KLIK)
  if (activeTool.value === 'text') {
    const msg = prompt("Tulis teks / catatan pada carta:");
    if (msg && msg.trim()) {
      const textMarker = L.marker(latlng, {
        icon: L.divIcon({
          html: `<div style="background:rgba(15,23,42,0.92); color:#ffffff; font-family:sans-serif; font-size:12px; font-weight:bold; padding:3px 8px; border-radius:4px; border:1.5px dashed #38bdf8; white-space:nowrap; box-shadow:0 3px 8px rgba(0,0,0,0.6); text-shadow: 1px 1px 2px #000;">📝 ${msg.trim()}</div>`,
          className: 'custom-area-label',
          iconAnchor: [10, 10]
        })
      }).addTo(toolsLayer);

      textMarker.on('click', (ev) => {
        if (isDeleteMode.value) {
          L.DomEvent.stopPropagation(ev);
          toolsLayer.removeLayer(textMarker);
          tacticalLogs.value.unshift(`🗑️ Teks carta dipadam.`);
        }
      });

      tacticalLogs.value.unshift(`📝 Teks ditambah pada carta: "${msg.trim()}"`);
    }
    aktifkanTool(null);
    return;
  }

  if (!activeTool.value) return;

  // 3. BENTUK GEOMETRI (BULATAN, SEGI EMPAT, GARISAN) - 2 KLIK
  if (!drawingStartPoint.value) {
    // KLIK 1: Tetapkan titik permulaan
    drawingStartPoint.value = latlng;
    isDrawing.value = true;
    tacticalLogs.value.unshift(`📍 Titik mula ditetapkan (${formatLatLng(latlng.lat, true)}, ${formatLatLng(latlng.lng, false)}). Sila klik titik kedua untuk selesaikan bentuk.`);
  } else {
    // KLIK 2: Selesaikan bentuk
    const startPt = drawingStartPoint.value;
    const endPt = latlng;
    const currentTool = activeTool.value;

    if (currentTool === 'circle') {
      const radiusMeters = startPt.distanceTo(endPt);
      const radKM = (radiusMeters / 1000).toFixed(2);
      const radNM = (radiusMeters / 1852).toFixed(2);
      const areaNM2 = (Math.PI * Math.pow(radiusMeters / 1852, 2)).toFixed(2);

      const circleLayer = L.circle(startPt, { radius: radiusMeters, color: '#38bdf8', weight: 2, fillOpacity: 0.25 }).addTo(toolsLayer);
      const measureLabel = L.marker(startPt, {
        icon: L.divIcon({
          html: `<div style="background:rgba(15,23,42,0.92); color:#38bdf8; font-family:monospace; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px; border:1px solid #38bdf8; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.5);">⭕ Jejari: ${radNM} NM (${radKM} KM) | Luas: ${areaNM2} NM²</div>`,
          className: 'custom-area-label',
          iconAnchor: [85, 0]
        })
      }).addTo(toolsLayer);
      circleLayer._measureLabel = measureLabel;

      circleLayer.on('click', (ev) => {
        if (isDeleteMode.value) {
          L.DomEvent.stopPropagation(ev);
          toolsLayer.removeLayer(measureLabel);
          toolsLayer.removeLayer(circleLayer);
          tacticalLogs.value.unshift(`🗑️ Bulatan dipadam.`);
        }
      });
      tacticalLogs.value.unshift(`⭕ Bulatan siap (Jejari: ${radNM} NM / ${radKM} KM, Luas: ${areaNM2} NM²)`);
    } else if (currentTool === 'rect') {
      const bounds = L.latLngBounds(startPt, endPt);
      const sw = bounds.getSouthWest();
      const se = bounds.getSouthEast();
      const nw = bounds.getNorthWest();
      const widthMeters = sw.distanceTo(se);
      const heightMeters = sw.distanceTo(nw);
      const wKM = (widthMeters / 1000).toFixed(2);
      const wNM = (widthMeters / 1852).toFixed(2);
      const hKM = (heightMeters / 1000).toFixed(2);
      const hNM = (heightMeters / 1852).toFixed(2);
      const areaNM2 = ((widthMeters / 1852) * (heightMeters / 1852)).toFixed(2);

      const rectLayer = L.rectangle(bounds, { color: '#fbbf24', weight: 2, fillOpacity: 0.25 }).addTo(toolsLayer);
      const measureLabel = L.marker(bounds.getCenter(), {
        icon: L.divIcon({
          html: `<div style="background:rgba(15,23,42,0.92); color:#fbbf24; font-family:monospace; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px; border:1px solid #fbbf24; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.5);">⬛ Sisi: ${wNM} x ${hNM} NM (${wKM} x ${hKM} KM) | Luas: ${areaNM2} NM²</div>`,
          className: 'custom-area-label',
          iconAnchor: [95, 0]
        })
      }).addTo(toolsLayer);
      rectLayer._measureLabel = measureLabel;

      rectLayer.on('click', (ev) => {
        if (isDeleteMode.value) {
          L.DomEvent.stopPropagation(ev);
          toolsLayer.removeLayer(measureLabel);
          toolsLayer.removeLayer(rectLayer);
          tacticalLogs.value.unshift(`🗑️ Segi empat dipadam.`);
        }
      });
      tacticalLogs.value.unshift(`⬛ Segi empat siap (Sisi: ${wNM}x${hNM} NM, Luas: ${areaNM2} NM²)`);
    } else if (currentTool === 'line') {
      const distMeters = startPt.distanceTo(endPt);
      const distKM = (distMeters / 1000).toFixed(2);
      const distNM = (distMeters / 1852).toFixed(2);
      const center = L.latLngBounds(startPt, endPt).getCenter();

      const lineLayer = L.polyline([startPt, endPt], { color: '#ef4444', weight: 3 }).addTo(toolsLayer);
      const measureLabel = L.marker(center, {
        icon: L.divIcon({
          html: `<div style="background:rgba(15,23,42,0.92); color:#ef4444; font-family:monospace; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px; border:1px solid #ef4444; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.5);">📏 Jarak: ${distNM} NM (${distKM} KM)</div>`,
          className: 'custom-area-label',
          iconAnchor: [55, 0]
        })
      }).addTo(toolsLayer);
      lineLayer._measureLabel = measureLabel;

      lineLayer.on('click', (ev) => {
        if (isDeleteMode.value) {
          L.DomEvent.stopPropagation(ev);
          toolsLayer.removeLayer(measureLabel);
          toolsLayer.removeLayer(lineLayer);
          tacticalLogs.value.unshift(`🗑️ Garisan dipadam.`);
        }
      });
      tacticalLogs.value.unshift(`📏 Garisan/Jarak diukur: ${distNM} NM (${distKM} KM)`);
    }

    // Reset state melukis
    drawingStartPoint.value = null;
    isDrawing.value = false;
    tempShape.value = null;
    tempDrawingLayer.clearLayers();
    aktifkanTool(null);
  }
}

const makeMovable = (layer) => {
  layer.on('mousedown', (e) => {
    if (activeTool.value || isDeleteMode.value) return;
    const map = mapInstance;
    const startLatLng = e.latlng;
    const startCoords = layer.getLatLng ? layer.getLatLng() : layer.getLatLngs();
    const isPoint = !Array.isArray(startCoords);

    map.dragging.disable();
    L.DomEvent.stopPropagation(e);

    const onMove = (me) => {
      const deltaLat = me.latlng.lat - startLatLng.lat;
      const deltaLng = me.latlng.lng - startLatLng.lng;

      if (isPoint) {
        layer.setLatLng([startCoords.lat + deltaLat, startCoords.lng + deltaLng]);
      } else {
        const transform = (p) => {
          if (Array.isArray(p)) return p.map(transform);
          return { lat: p.lat + deltaLat, lng: p.lng + deltaLng };
        };
        layer.setLatLngs(transform(startCoords));
      }
      
      if (layer._measureLabel) {
        const bounds = layer.getBounds ? layer.getBounds() : L.latLngBounds(layer.getLatLngs());
        layer._measureLabel.setLatLng(bounds.getCenter());
      }
    };

    const onUp = () => {
      map.off('mousemove', onMove);
      map.off('mouseup', onUp);
      map.dragging.enable();
    };

    map.on('mousemove', onMove);
    map.on('mouseup', onUp);
  });
  
  layer.on('mouseover', () => {
    if (!activeTool.value && !isDeleteMode.value && layer.getElement()) layer.getElement().style.cursor = 'move';
  });
}

const bersihkanLukisan = () => {
  if (toolsLayer) toolsLayer.clearLayers();
  if (tempDrawingLayer) tempDrawingLayer.clearLayers();
  drawingStartPoint.value = null;
  tempShape.value = null;

  const mapEl = document.getElementById('map');
  if (mapEl) mapEl.style.cursor = '';
  activeTool.value = null;
  isDeleteMode.value = false;
  tacticalLogs.value.unshift(`🗑️ Semua lukisan taktikal dibersihkan.`);
}

// ============================================================================
// 🌊 MODUL SIMULASI HANYUTAN SAR (NETCDF-4 / HDF5 .NC)
// ============================================================================

// BACA FAIL DRIFT SIMULATION (.NC)
const bacaFailDriftNC = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (selectedCaseId.value === 'ALL' || !selectedCaseId.value) {
    alert("⚠️ Sila pilih kes SAR spesifik terlebih dahulu sebelum memuat naik simulasi hanyutan.");
    event.target.value = '';
    return;
  }

  try {
    isDriftLoading.value = true;
    tacticalLogs.value.unshift(`🌀 Membaca fail simulasi hanyutan: ${file.name}...`);

    const arrayBuffer = await file.arrayBuffer();
    const result = await readFullSARSimulation(arrayBuffer);

    driftFileName.value = file.name;
    driftSimData.value = result;
    currentDriftStep.value = 0;
    isDriftPlaying.value = false;
    if (driftPlayTimer) clearInterval(driftPlayTimer);

    tacticalLogs.value.unshift(`✅ Simulasi hanyutan berjaya dimuatkan: ${result.numParticles.toLocaleString()} partikel, ${result.numTimeSteps} langkah masa.`);

    // Kemaskini paparan langkah masa pertama
    kemaskiniPaparanDrift(0, true);

  } catch (err) {
    console.error("Gagal membaca fail simulasi hanyutan:", err);
    alert(`Ralat memuatkan fail .nc: ${err.message || 'Format tidak sah'}`);
    tacticalLogs.value.unshift(`❌ Ralat membaca fail simulasi: ${err.message}`);
  } finally {
    isDriftLoading.value = false;
    event.target.value = '';
  }
};

// KEMASKINI PAPARAN DRIFT POC PADA LANGKAH MASA TERTENTU
const kemaskiniPaparanDrift = (stepIndex, autoFit = false) => {
  if (!driftSimData.value || !mapInstance) return;
  if (!driftLayerGroup) {
    driftLayerGroup = L.layerGroup().addTo(mapInstance);
  }

  const stepData = computeTimeStepPOC(driftSimData.value, stepIndex);
  currentDriftStep.value = stepIndex;
  driftDistressPos.value = stepData.distressPos;
  driftPeakPOC.value = stepData.peakPOC;
  driftValidCount.value = stepData.validCount;

  // Format teks masa langkah
  if (stepData.timeValue !== null && stepData.timeValue !== undefined) {
    const totalMins = stepIndex * 20; // 20 minit selang standard
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    driftSimTimeStr.value = `+${hours}j ${mins}m`;
  } else {
    driftSimTimeStr.value = `T+${stepIndex}`;
  }

  // 1. Render Overlay Heatmap POC
  const imgUrl = renderPOCToCanvasDataURL(stepData.grid, stepData.maxDensity);
  const bounds = stepData.bounds;

  if (driftImageOverlay) {
    driftLayerGroup.removeLayer(driftImageOverlay);
  }
  driftImageOverlay = L.imageOverlay(imgUrl, bounds, {
    opacity: 0.85,
    interactive: false
  }).addTo(driftLayerGroup);

  // 2. Marker LKP / Datum 🚨 (Kekal pada lokasi kejadian)
  if (stepData.distressPos && !driftDistressMarker) {
    const dPos = [stepData.distressPos.lat, stepData.distressPos.lon];
    const lkpIcon = L.divIcon({
      html: `<div style="background:rgba(220,38,38,0.95); color:#fff; font-family:sans-serif; font-size:11px; font-weight:900; padding:2px 6px; border-radius:4px; border:1.5px solid #fff; white-space:nowrap; box-shadow:0 3px 8px rgba(0,0,0,0.7); transform:translateY(-14px);">🚨 LKP / DATUM</div>`,
      className: 'custom-area-label',
      iconAnchor: [40, 0]
    });
    driftDistressMarker = L.marker(dPos, { icon: lkpIcon }).addTo(driftLayerGroup);
    driftDistressMarker.bindPopup(`<b>🚨 Lokasi Asal Kejadian (LKP / Datum)</b><br>Lat: ${formatLatLng(dPos[0], true)}<br>Lon: ${formatLatLng(dPos[1], false)}`);
  }

  // 3. Marker Peak POC ⭐ (Bergerak mengikut kebarangkalian tertinggi langkah masa semasa)
  if (stepData.peakPOC) {
    const peakPos = [stepData.peakPOC.lat, stepData.peakPOC.lon];

    if (driftPeakMarker) {
      driftPeakMarker.setLatLng(peakPos);
      driftPeakMarker.setPopupContent(`<b>⭐ Titik Kebarangkalian Tertinggi (Peak POC)</b><br>Langkah: T${stepIndex + 1} (${driftSimTimeStr.value})<br>Lat: ${formatLatLng(peakPos[0], true)}<br>Lon: ${formatLatLng(peakPos[1], false)}`);
    } else {
      const peakIcon = L.divIcon({
        html: `<div style="background:rgba(234,179,8,0.95); color:#000; font-family:sans-serif; font-size:10px; font-weight:900; padding:2px 6px; border-radius:4px; border:1.5px solid #fff; white-space:nowrap; box-shadow:0 3px 8px rgba(0,0,0,0.7); transform:translateY(-14px);">⭐ PEAK POC</div>`,
        className: 'custom-area-label',
        iconAnchor: [35, 0]
      });
      driftPeakMarker = L.marker(peakPos, { icon: peakIcon }).addTo(driftLayerGroup);
      driftPeakMarker.bindPopup(`<b>⭐ Titik Kebarangkalian Tertinggi (Peak POC)</b><br>Langkah: T${stepIndex + 1} (${driftSimTimeStr.value})<br>Lat: ${formatLatLng(peakPos[0], true)}<br>Lon: ${formatLatLng(peakPos[1], false)}`);
    }
  }

  if (autoFit && bounds && mapInstance) {
    mapInstance.fitBounds(bounds, { padding: [40, 40] });
  }
};

// MAIN BALIK / JEDA SIMULASI HANYUTAN
const togglePlayDrift = () => {
  if (!driftSimData.value) return;

  isDriftPlaying.value = !isDriftPlaying.value;

  if (isDriftPlaying.value) {
    if (currentDriftStep.value >= driftSimData.value.numTimeSteps - 1) {
      currentDriftStep.value = 0;
    }
    const intervalMs = Math.max(100, Math.floor(400 / driftPlaySpeed.value));
    driftPlayTimer = setInterval(() => {
      if (currentDriftStep.value < driftSimData.value.numTimeSteps - 1) {
        currentDriftStep.value++;
        kemaskiniPaparanDrift(currentDriftStep.value);
      } else {
        isDriftPlaying.value = false;
        clearInterval(driftPlayTimer);
      }
    }, intervalMs);
  } else {
    if (driftPlayTimer) clearInterval(driftPlayTimer);
  }
};

watch(driftPlaySpeed, () => {
  if (isDriftPlaying.value) {
    togglePlayDrift();
    togglePlayDrift();
  }
});

// TUTUP & BERSIHKAN SIMULASI HANYUTAN
const tutupDriftSimulasi = () => {
  if (driftPlayTimer) clearInterval(driftPlayTimer);
  isDriftPlaying.value = false;
  driftSimData.value = null;
  driftFileName.value = '';
  currentDriftStep.value = 0;
  driftDistressPos.value = null;
  driftPeakPOC.value = null;

  if (driftLayerGroup && mapInstance) {
    driftLayerGroup.clearLayers();
  }
  driftImageOverlay = null;
  driftDistressMarker = null;
  driftPeakMarker = null;

  tacticalLogs.value.unshift(`🌀 Simulasi hanyutan ditutup dan dibersihkan dari peta.`);
};

const recallPlanDariSupabase = async () => {
  try {
    const { data, error } = await supabase.from('sar_plans').select('*')
    if (!error && data) {
      senaraiMasterSRU.value = data.map((row) => ({
        id: row.id,
        caseId: Number(row.case_id),
        nama: row.sru_name,
        corak: row.pattern_name || row.search_pattern || 'VISUAL',
        kawasanNama: row.zone_name,
        csp_coord: row.csp_coord,
        corner_points: row.corner_points,
        sortie_waypoints: row.sortie_waypoints
      }))

      tukarKesTaktikal()
    }
  } catch (err) {
    console.error("Ralat recallPlanDariSupabase:", err)
  }
}

const bukaModalLoadKes = async () => { 
  await tarikDataKes()
  showLoadCaseModal.value = true 
}

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
      .from('sar_incidents')
      .insert([{ 
        case_no: formAddKes.value.case_no.trim(),
        case_name: formAddKes.value.case_name.trim(), 
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
  trackHistoryPolylines = {}; // Reset polylines apabila tukar kes

  if (!sapLayerGroup) {
    sapLayerGroup = L.layerGroup().addTo(mapInstance);
  }
  sapLayerGroup.clearLayers();

  const boundsKoleksi = [];
  const sruList = paparanSRUKesAktif.value || [];

  sruList.forEach((sru, idx) => {
    const warnaTema = warnaSearchArea[idx % warnaSearchArea.length];

    // 1. Sempadan Zon Pencarian (Corner Points)
    if (sru.corner_points && Array.isArray(sru.corner_points) && sru.corner_points.length >= 4) {
      const pts = sru.corner_points.filter(p => p !== null && Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]));
      if (pts.length >= 4) {
        const kotakPoly = L.polygon(pts, { 
          color: warnaTema, 
          weight: 2.5, 
          fillOpacity: 0.15, 
          fillColor: warnaTema, 
          opacity: 0.95 
        });
        kotakPoly.bindTooltip(`Zon ${sru.kawasanNama || ''} (${sru.nama || ''})`, { direction: 'top' });
        sapLayerGroup.addLayer(kotakPoly);
        boundsKoleksi.push(kotakPoly.getBounds());
      }
    }

    // 2. Laluan Sapuan (Sortie Waypoints)
    if (sru.sortie_waypoints && Array.isArray(sru.sortie_waypoints) && sru.sortie_waypoints.length > 0) {
      const waypoints = sru.sortie_waypoints.filter(p => p !== null && Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]));
      if (waypoints.length > 0) {
        const laluanPoly = L.polyline(waypoints, { 
          color: warnaTema, 
          weight: 2.5, 
          dashArray: '6, 6', 
          opacity: 0.95 
        });
        sapLayerGroup.addLayer(laluanPoly);
        boundsKoleksi.push(laluanPoly.getBounds());
      }
    }

    // 3. Titik Permulaan Sapuan (CSP)
    if (sru.csp_coord && Array.isArray(sru.csp_coord) && !isNaN(sru.csp_coord[0]) && !isNaN(sru.csp_coord[1])) {
      const dotCSP = L.circleMarker(sru.csp_coord, { 
        color: '#ffffff', 
        fillColor: '#ef4444', 
        fillOpacity: 1, 
        radius: 6, 
        weight: 2 
      });
      dotCSP.bindTooltip(`📍 CSP ${sru.kawasanNama || ''} (${sru.nama || ''})`, { 
        permanent: false, 
        direction: 'right' 
      });
      sapLayerGroup.addLayer(dotCSP);
      boundsKoleksi.push(L.latLngBounds(sru.csp_coord, sru.csp_coord));
    }
  });

  try {
    const validBounds = boundsKoleksi.filter(b => b && (typeof b.isValid === 'function' ? b.isValid() : true));
    if (validBounds.length > 0) {
      let combinedBounds = validBounds[0];
      for (let i = 1; i < validBounds.length; i++) { 
        combinedBounds.extend(validBounds[i]); 
      }
      if (combinedBounds && (typeof combinedBounds.isValid === 'function' ? combinedBounds.isValid() : true)) {
        mapInstance.fitBounds(combinedBounds, { padding: [50, 50] });
      }
    } else { 
      // Default view if no graphics or bounds
      if (activeStation.value === 'MRCC Putrajaya' || isAdmin.value) {
        mapInstance.setView([4.5, 109.0], 5);
      } else if (activeStation.value === 'MRSC Kota Kinabalu' || activeStation.value === 'MRSC Kuching') {
        mapInstance.setView([4.0, 114.0], 7);
      } else {
        mapInstance.setView([3.85, 103.5], 7);
      }
    }
  } catch (errBounds) {
    console.warn("Ralat fitBounds:", errBounds);
  }

  try {
    mapInstance.invalidateSize();
  } catch (e) {}
};

const ekstrakSatuKoordinat = (teks) => {
  if (!teks) return null;
  
  const matchPC = teks.match(/(\d{1,2})-([\d\.]+)([NS])\s+(\d{1,3})-([\d\.]+)([EW])/);
  const matchWeb = teks.match(/(\d{1,2})-(\d{2})([NS])\s+(\d{1,3})-(\d{2})([EW])/);

  if (matchPC) {
    let lat = parseInt(matchPC[1]) + parseFloat(matchPC[2]) / 60; 
    if (matchPC[3] === 'S') lat = -lat;
    let lon = parseInt(matchPC[4]) + parseFloat(matchPC[5]) / 60; 
    if (matchPC[6] === 'W') lon = -lon;
    return [lat, lon];
  } else if (matchWeb) {
    let lat = parseInt(matchWeb[1]) + parseInt(matchWeb[2]) / 60; 
    if (matchWeb[3] === 'S') lat = -lat;
    let lon = parseInt(matchWeb[4]) + parseInt(matchWeb[2]) / 60; 
    if (matchWeb[6] === 'W') lon = -lon;
    return [lat, lon];
  }
  return null;
};

const bacaFailSAROPS = (event) => {
  // 🛡️ Guard: Mesti pilih incident spesifik dlu (Bukan 'ALL' atau kosong)
  if (!selectedCaseId.value || selectedCaseId.value === 'ALL') {
    alert("⚠️ Sila pilih satu kes (incident) spesifik terlebih dahulu sebelum memuat naik fail SAROPS!");
    event.target.value = ''; // Reset input fail
    return;
  }

  const files = event.target.files;
  if (!files || files.length === 0) return;

  console.log(`📂 MENERIMA ${files.length} FAIL UNTUK DIPROSES...`);
  const currentActiveCaseId = Number(selectedCaseId.value);

  // Loop melalui setiap fail yang dimuat naik serentak
  for (let f = 0; f < files.length; f++) {
    const file = files[f];
    const namaFail = file.name;
    const extension = namaFail.split('.').pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const kandunganRAW = e.target.result;
      let garisanLaluan = [];
      let pt1 = null, pt2 = null, pt3 = null, pt4 = null;
      let koordinatCenter = null, koordinatCSP = null;
      let namaSru = 'BOT SAYA';
      let kawasanNama = 'SEARCH AREA';
      let corakPenuh = 'PARALLEL';
      let panjangArea = 0, lebarArea = 0, jarakSpacing = 0, kelajuanCarian = 0;

      const barisPertama = kandunganRAW.split('\n')[0]?.trim() || '';
      const matchPattern = kandunganRAW.match(/(?:SEARCH PATTERN NAME|PATTERN)[^\:\n]*?\:\s*([^\n\r]+)/i);
      const matchSruId = kandunganRAW.match(/(?:SRU ID|SRU NAME|ASSET)[^\:\n]*?\:\s*([^\n\r]+)/i);
      const matchCaseName = kandunganRAW.match(/(?:CASE NAME|INCIDENT)[^\:\n]*?\:\s*([^\n\r]+)/i);
      const matchZone = kandunganRAW.match(/(?:ZONE|AREA)[^\:\n]*?\:\s*([^\n\r]+)/i);

      let patternField = matchPattern ? matchPattern[1].trim() : '';

      if (patternField.includes(':')) {
        const parts = patternField.split(':');
        kawasanNama = parts[0]?.trim() || 'SEARCH AREA';
        corakPenuh = parts[1]?.trim() || patternField;
      } else if (patternField) {
        corakPenuh = patternField;
      }

      if (matchSruId) namaSru = matchSruId[1].trim();
      if (matchZone) kawasanNama = matchZone[1].trim();
      if (matchCaseName && !kawasanNama) kawasanNama = matchCaseName[1].trim();

      // ENJIN 1: GPX 
      // ==========================================
      if (extension === 'gpx') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kandunganRAW, "text/xml");
        const route = xmlDoc.getElementsByTagName('rte')[0] || xmlDoc.getElementsByTagName('trk')[0];
        const routeName = route ? route.getElementsByTagName('name')[0]?.textContent || '' : '';
        if (routeName) corakPenuh = routeName;
        
        const points = xmlDoc.querySelectorAll('rtept, trkpt');
        for (let i = 0; i < points.length; i++) {
          const lat = parseFloat(points[i].getAttribute('lat'));
          const lon = parseFloat(points[i].getAttribute('lon'));
          if (!isNaN(lat) && !isNaN(lon)) {
            if (i === 0) koordinatCSP = [lat, lon];
            garisanLaluan.push([lat, lon]);
          }
        }
      } 
      // ENJIN 2: KML
      // ==========================================
      else if (extension === 'kml') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kandunganRAW, "text/xml");
        const descriptions = xmlDoc.getElementsByTagName('description');
        let teksLaporan = '';
        
        for (let i = 0; i < descriptions.length; i++) {
          if (descriptions[i].textContent.includes('SEARCH PATTERN NAME') || descriptions[i].textContent.includes('SEARCH AREA LENGTH')) {
            teksLaporan = descriptions[i].textContent;
            break;
          }
        }

        if (teksLaporan) {
          koordinatCenter = ekstrakSatuKoordinat(teksLaporan.match(/CENTER\s*:\s*([^\n\r]+)/)?.[1]);
          koordinatCSP = ekstrakSatuKoordinat(teksLaporan.match(/CSP\s*:\s*([^\n\r]+)/)?.[1]);
          pt1 = ekstrakSatuKoordinat(teksLaporan.match(/CORNER PT\s*#1\s*:\s*([^\n\r]+)/)?.[1]);
          pt2 = ekstrakSatuKoordinat(teksLaporan.match(/CORNER PT\s*#2\s*:\s*([^\n\r]+)/)?.[1]);
          pt3 = ekstrakSatuKoordinat(teksLaporan.match(/CORNER PT\s*#3\s*:\s*([^\n\r]+)/)?.[1]);
          pt4 = ekstrakSatuKoordinat(teksLaporan.match(/CORNER PT\s*#4\s*:\s*([^\n\r]+)/)?.[1]);
        }

        const lineStrings = xmlDoc.getElementsByTagName('LineString');
        for (let j = 0; j < lineStrings.length; j++) {
          const coordsText = lineStrings[j].getElementsByTagName('coordinates')[0]?.textContent?.trim();
          if (!coordsText) continue;
          const points = coordsText.split(/\s+/);
          const path = [];
          points.forEach(pt => {
            const [lon, lat] = pt.split(',');
            if (lat && lon) path.push([parseFloat(lat), parseFloat(lon)]);
          });
          if (path.length > garisanLaluan.length) {
            garisanLaluan = path;
          }
        }
      }
      // ==========================================
      // ENJIN 3: TXT (Flexible Sortie Key)
      // ==========================================
      else if (extension === 'txt') {
        const baris = kandunganRAW.split('\n');
        let bacaWaypoints = false;

        baris.forEach(line => {
          const cleanLine = line.trim().replace('\r', '');

          if (cleanLine.includes('CENTER')) {
            koordinatCenter = ekstrakSatuKoordinat(cleanLine);
          } else if (cleanLine.includes('CORNER PT #1')) {
            pt1 = ekstrakSatuKoordinat(cleanLine);
          } else if (cleanLine.includes('CORNER PT #2')) {
            pt2 = ekstrakSatuKoordinat(cleanLine);
          } else if (cleanLine.includes('CORNER PT #3')) {
            pt3 = ekstrakSatuKoordinat(cleanLine);
          } else if (cleanLine.includes('CORNER PT #4')) {
            pt4 = ekstrakSatuKoordinat(cleanLine);
          } else if (cleanLine.includes('CSP')) {
            koordinatCSP = ekstrakSatuKoordinat(cleanLine);
          }

          if (cleanLine.toUpperCase().includes('WAYPOINT LIST') || cleanLine.toUpperCase().includes('SORTIE DETAILS')) {
            bacaWaypoints = true;
          }

          if (bacaWaypoints) {
            const matchWpBaris = cleanLine.match(/^\s*(\d+|WP\s*\d+)\s+/i);
            if (matchWpBaris) {
              const kl = ekstrakSatuKoordinat(cleanLine);
              if (kl) garisanLaluan.push(kl);
            }
          }
        });
      }

      await supabase.from('sar_plans').insert([{
        case_id: currentActiveCaseId,
        sru_name: namaSru,
        pattern_name: corakPenuh.replace(/\s*SEARCH$/i, '').trim() || 'PARALLEL',
        zone_name: kawasanNama,
        center_coord: koordinatCenter,
        csp_coord: koordinatCSP,
        corner_points: pt1 && pt2 && pt3 && pt4 ? [pt1, pt2, pt3, pt4] : null,
        sortie_waypoints: garisanLaluan,
        search_length: panjangArea,
        length: panjangArea,
        search_width: lebarArea,
        width: lebarArea,
        track_spacing: jarakSpacing,
        spacing: jarakSpacing,
        search_speed: kelajuanCarian,
        search_pattern: corakPenuh
      }]);
    };

    reader.readAsText(file);
  }

  setTimeout(() => {
    alert("🎯 Kesemua fail SAROPS berjaya diproses serentak!");
    if (typeof recallPlanDariSupabase === 'function') recallPlanDariSupabase();
  }, 800);
};

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
  try {
    if (activeStation.value && pemetaanStesenRegion[activeStation.value]) {
      activeRegion.value = pemetaanStesenRegion[activeStation.value];
    }
    const { data, error } = await supabase.from('sar_incidents').select('*').order('id', { ascending: false })
    if (!error && data) {
      senaraiKes.value = data
    } else if (error) {
      console.error("Ralat tarikDataKes:", error)
    }
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
  let query = supabase.from('sar_messages').select('*')
  
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

  const { data, error } = await query.order('created_at', { ascending: true })
  if (!error) {
    senaraiMesejChat.value = data
    autoScrollChatKeBawah()
  }
}

// 📡 FUNGSI RADAR REALTIME (MENANGKAP MESEJ DARI STESEN LAIN)
const langganMesejRealtimeSupabase = () => {
  if (chatChannelSubscription) {
    supabase.removeChannel(chatChannelSubscription)
  }
  
  fetchChatMessages() 

  // ✅ KOD BARU: Guna nama channel raw untuk bypass proxy Cloudflare
  chatChannelSubscription = supabase.channel('sar-messages-live')
    .on(
      'postgres_changes', 
      { event: '*', schema: 'public', table: 'sar_messages' }, 
      (payload) => {
        if (payload.eventType === 'INSERT') {
          const r = payload.new
          if (r.sender === 'PENGUMUMAN ADMIN') {
            amaranAdmin.value = r.message
            paparAmaran.value = true
            hantarNotifikasiTaktikal('ADMIN', r.message, true);
          } else {
            if (r.sender === activeStation.value) return
            if (!senaraiMesejChat.value.some(m => m.id === r.id)) senaraiMesejChat.value.push(r)
            
            // Notifikasi untuk setiap mesej masuk dari stesen lain
            hantarNotifikasiTaktikal(r.sender, r.message, false);

            if (r.chat_type === 'global') {
              if (!(isGlobalChatActive.value && isInputFocused.value)) globalUnreadCount.value++
            } else if (r.chat_type === 'local') {
              // HANYA NOTIFY jika kes tersebut milik wilayah stesen ini atau stesen adalah HQ
              const isRelevantCase = senaraiKes.value.some(k => k.id === r.case_id);
              if (isRelevantCase && (selectedCaseId.value === 'ALL' || r.case_id === Number(selectedCaseId.value))) {
                if (!(isLocalChatActive.value && isInputFocused.value)) {
                  localUnreadCount.value++
                }
              }
            }
            autoScrollChatKeBawah()
          }
        } else if (payload.eventType === 'DELETE') {
          senaraiMesejChat.value = senaraiMesejChat.value.filter(m => m.id !== payload.old.id)
        }
      }
    )
    .subscribe((status) => {
      console.log("📡 Status Langganan Chat:", status)
    })
}

// 📡 FUNGSI RADAR REALTIME (MENANGKAP PERUBAHAN PELAN SAR DARI STESEN LAIN)
const langganPerubahanPelanSupabase = () => {
  supabase.channel('sar-plans-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sar_plans' }, async (payload) => {
      console.log("🔄 Perubahan Aset (SRU) dikesan dari pelayan lain!");
      await recallPlanDariSupabase();
    })
    .subscribe();
};

// ============================================================================
// ⏳ PENGURUSAN SEJARAH TREK GPS PER-SRU (TAB HISTORY)
// ============================================================================

const dapatkanWarnaTrek = (boatId, index) => {
  if (index !== undefined && index >= 0) {
    return warnaTrekSRU[index % warnaTrekSRU.length];
  }
  let hash = 0;
  for (let i = 0; i < (boatId || '').length; i++) {
    hash = boatId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % warnaTrekSRU.length;
  return warnaTrekSRU[idx];
};

const formatMasaSejarah = (dateStr) => {
  if (!dateStr) return '---';
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString([], { day: '2-digit', month: 'short' });
  } catch (e) {
    return dateStr;
  }
};

// ─────────────────────────────────────────────────────────────────
// HELPER: Tarik SEMUA rekod sru_track_history tanpa had baris.
// Supabase PostgREST lalai had 1000 baris — helper ini loop
// menggunakan .range() dalam kelompok 1000 sehingga habis.
// ─────────────────────────────────────────────────────────────────
const fetchAllTrackHistory = async (buildQuery) => {
  const PAGE_SIZE = 1000;
  let page = 0;
  let allData = [];

  while (true) {
    const from = page * PAGE_SIZE;
    const to   = from + PAGE_SIZE - 1;

    const { data, error } = await buildQuery().range(from, to);

    if (error) throw error;
    if (!data || data.length === 0) break;

    allData = allData.concat(data);

    // Jika bilangan rekod yang dikembalikan kurang dari PAGE_SIZE,
    // bermakna kita sudah sampai ke penghujung data.
    if (data.length < PAGE_SIZE) break;

    page++;
  }

  // Pastikan susunan kronologi (ascending created_at) terjaga
  // walaupun data dari pelbagai halaman.
  allData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return allData;
};

const muatTurunSejarahSRU = async () => {
  try {
    const data = await fetchAllTrackHistory(() => {
      let q = supabase
        .from('sru_track_history')
        .select('id, boat_id, case_id, latitude, longitude, created_at')
        .order('created_at', { ascending: true });
      if (selectedCaseId.value !== 'ALL' && selectedCaseId.value !== '') {
        q = q.eq('case_id', Number(selectedCaseId.value));
      }
      return q;
    });

    // Mengelompokkan titik koordinat mengikut boat_id
    const sruMap = {};
    (data || []).forEach((row) => {
      if (!row.boat_id || row.latitude === null || row.longitude === null) return;
      const lat = parseFloat(row.latitude);
      const lng = parseFloat(row.longitude);
      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;

      if (!sruMap[row.boat_id]) {
        sruMap[row.boat_id] = {
          boat_id: row.boat_id,
          case_id: row.case_id,
          coords: [],
          points_count: 0,
          last_seen: row.created_at,
          isChecked: false,
          color: '#06b6d4'
        };
      }
      sruMap[row.boat_id].coords.push([lat, lng]);
      sruMap[row.boat_id].points_count++;
      sruMap[row.boat_id].last_seen = row.created_at;
    });

    // Kekalkan status isChecked jika bot sudah sedia wujud dalam senarai
    const existingCheckedMap = {};
    senaraiSruSejarah.value.forEach(s => {
      existingCheckedMap[s.boat_id] = s.isChecked;
    });

    const sruList = Object.values(sruMap).map((item, idx) => {
      const isChecked = existingCheckedMap[item.boat_id] !== undefined ? existingCheckedMap[item.boat_id] : false;
      const color = dapatkanWarnaTrek(item.boat_id, idx);
      return {
        ...item,
        isChecked,
        color
      };
    });

    senaraiSruSejarah.value = sruList;
    kemaskiniPaparanTrekPeta();
  } catch (err) {
    console.error("Ralat muatTurunSejarahSRU:", err);
  }
};

const kemaskiniPaparanTrekPeta = () => {
  if (!mapInstance || !trackHistoryLayer) return;

  senaraiSruSejarah.value.forEach((sru) => {
    const boatId = sru.boat_id;
    if (sru.isChecked && sru.coords && sru.coords.length > 0) {
      if (trackHistoryPolylines[boatId]) {
        trackHistoryPolylines[boatId].setLatLngs(sru.coords);
        trackHistoryPolylines[boatId].setStyle({ color: sru.color });
      } else {
        const polyline = L.polyline(sru.coords, {
          color: sru.color,
          weight: 3,
          opacity: 0.9,
          dashArray: '5, 5'
        }).addTo(trackHistoryLayer);

        polyline.bindTooltip(`📍 TREK SEJARAH: <b>${boatId}</b> (${sru.points_count} pts)`, {
          sticky: true,
          direction: 'top'
        });

        trackHistoryPolylines[boatId] = polyline;
      }
    } else {
      if (trackHistoryPolylines[boatId]) {
        trackHistoryLayer.removeLayer(trackHistoryPolylines[boatId]);
        delete trackHistoryPolylines[boatId];
      }
    }
  });

  // Bersihkan mana-mana polyline yang sudah tiada dalam senarai
  const activeSruIds = senaraiSruSejarah.value.map(s => s.boat_id);
  Object.keys(trackHistoryPolylines).forEach((idKey) => {
    if (!activeSruIds.includes(idKey)) {
      trackHistoryLayer.removeLayer(trackHistoryPolylines[idKey]);
      delete trackHistoryPolylines[idKey];
    }
  });
};

const togolSemuaTrekSejarah = (status) => {
  senaraiSruSejarah.value.forEach(s => {
    s.isChecked = status;
  });
  kemaskiniPaparanTrekPeta();

  if (isTimelineOpen.value) {
    sediakanDataTimeline().then(() => {
      kemaskiniFrameReplay();
    });
  }
};

const togolTrekSatuSRU = (sru, directVal = null) => {
  if (typeof directVal === 'boolean') {
    sru.isChecked = directVal;
  } else {
    sru.isChecked = !sru.isChecked;
  }
  kemaskiniPaparanTrekPeta();

  if (isTimelineOpen.value) {
    sediakanDataTimeline().then(() => {
      kemaskiniFrameReplay();
    });
  }
};

let trackHistorySubscription = null;

// 📡 FUNGSI RADAR REALTIME (MENANGKAP PERUBAHAN SEJARAH TREK DARI STESEN LAIN)
const langganSejarahTrekSupabase = () => {
  if (trackHistorySubscription) {
    supabase.removeChannel(trackHistorySubscription);
  }

  trackHistorySubscription = supabase.channel('sru-tracks-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sru_track_history' }, async (payload) => {
      if (payload.eventType === 'DELETE') {
        await muatTurunSejarahSRU();
        return;
      }

      if (payload.eventType === 'INSERT') {
        const newTrack = payload.new;
        if (!newTrack || !newTrack.boat_id || newTrack.latitude === null || newTrack.longitude === null) return;

        const caseId = Number(selectedCaseId.value);
        const isRelevant = selectedCaseId.value === 'ALL' || Number(newTrack.case_id) === caseId;

        if (!isRelevant) return;

        const boatId = newTrack.boat_id;
        const lat = parseFloat(newTrack.latitude);
        const lng = parseFloat(newTrack.longitude);
        if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;
        const newCoord = [lat, lng];

        let sruItem = senaraiSruSejarah.value.find(s => s.boat_id === boatId);
        if (sruItem) {
          sruItem.coords.push(newCoord);
          sruItem.points_count++;
          sruItem.last_seen = newTrack.created_at;

          if (sruItem.isChecked) {
            if (trackHistoryPolylines[boatId]) {
              trackHistoryPolylines[boatId].addLatLng(newCoord);
            } else {
              kemaskiniPaparanTrekPeta();
            }
          }
        } else {
          const newSru = {
            boat_id: boatId,
            case_id: newTrack.case_id,
            coords: [newCoord],
            points_count: 1,
            last_seen: newTrack.created_at,
            isChecked: false,
            color: dapatkanWarnaTrek(boatId, senaraiSruSejarah.value.length)
          };
          senaraiSruSejarah.value.push(newSru);
        }
      }
    })
    .subscribe();
};

// ============================================================================
// ⏱️ PENGURUSAN TIMELINE PLAYBACK SLIDER (REPLAY SIMULATION)
// ============================================================================

const formatTimelineDisplayTime = (dateStr) => {
  if (!dateStr) return '---';
  try {
    const d = new Date(dateStr);
    const dateFormatted = d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = d.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${dateFormatted}, ${timeFormatted}`;
  } catch (e) {
    return dateStr;
  }
};

const formatTimeOnly = (dateStr) => {
  if (!dateStr) return '--:--';
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateStr;
  }
};

const formatToDatetimeLocal = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    return '';
  }
};

const sediakanDataTimeline = async () => {
  try {
    // Ambil senarai bot yang ditanda (checked) dalam tab History
    const checkedBoats = senaraiSruSejarah.value.filter(s => s.isChecked).map(s => s.boat_id);

    const data = await fetchAllTrackHistory(() => {
      let q = supabase
        .from('sru_track_history')
        .select('id, boat_id, case_id, latitude, longitude, created_at')
        .order('created_at', { ascending: true });
      if (selectedCaseId.value !== 'ALL' && selectedCaseId.value !== '') {
        q = q.eq('case_id', Number(selectedCaseId.value));
      }
      if (checkedBoats.length > 0) {
        q = q.in('boat_id', checkedBoats);
      }
      return q;
    });

    const validPoints = data.filter(p => {
      if (!p.boat_id || p.latitude === null || p.longitude === null) return false;
      if (checkedBoats.length > 0 && !checkedBoats.includes(p.boat_id)) return false;
      const lat = parseFloat(p.latitude);
      const lng = parseFloat(p.longitude);
      return !isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0);
    });

    timelinePoints.value = validPoints;
    playbackTracks.value = validPoints;

    if (validPoints.length > 0) {
      timelineStartTime.value = formatTimeOnly(validPoints[0].created_at);
      timelineEndTime.value = formatTimeOnly(validPoints[validPoints.length - 1].created_at);
      currentTimelineIndex.value = 0;
      currentTimelineTime.value = formatTimelineDisplayTime(validPoints[0].created_at);
      
      playbackStartDate.value = formatToDatetimeLocal(validPoints[0].created_at);
      playbackEndDate.value = formatToDatetimeLocal(validPoints[validPoints.length - 1].created_at);
    } else {
      timelineStartTime.value = '--:--';
      timelineEndTime.value = '--:--';
      currentTimelineIndex.value = 0;
      currentTimelineTime.value = checkedBoats.length > 0 ? 'Tiada data jejak untuk aset dipilih' : 'Tiada data jejak GPS';
      playbackStartDate.value = '';
      playbackEndDate.value = '';
    }
  } catch (err) {
    console.error("Ralat sediakanDataTimeline:", err);
  }
};

const loadReplayData = async () => {
  if (!playbackStartDate.value || !playbackEndDate.value) {
    alert("Sila pilih kedua-dua tarikh/masa Mula dan Tamat terlebih dahulu.");
    return;
  }
  
  isPlaybackLoading.value = true;
  try {
    const startISO = new Date(playbackStartDate.value).toISOString();
    const endISO = new Date(playbackEndDate.value).toISOString();
    const checkedBoats = senaraiSruSejarah.value.filter(s => s.isChecked).map(s => s.boat_id);

    const data = await fetchAllTrackHistory(() => {
      let q = supabase
        .from('sru_track_history')
        .select('id, boat_id, case_id, latitude, longitude, created_at')
        .gte('created_at', startISO)
        .lte('created_at', endISO)
        .order('created_at', { ascending: true });
      if (selectedCaseId.value !== 'ALL' && selectedCaseId.value !== '') {
        q = q.eq('case_id', Number(selectedCaseId.value));
      }
      if (checkedBoats.length > 0) {
        q = q.in('boat_id', checkedBoats);
      }
      return q;
    });

    const validPoints = data.filter(p => {
      if (!p.boat_id || p.latitude === null || p.longitude === null) return false;
      if (checkedBoats.length > 0 && !checkedBoats.includes(p.boat_id)) return false;
      const lat = parseFloat(p.latitude);
      const lng = parseFloat(p.longitude);
      return !isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0);
    });

    playbackTracks.value = validPoints;
    timelinePoints.value = validPoints;

    if (validPoints.length > 0) {
      timelineStartTime.value = formatTimeOnly(validPoints[0].created_at);
      timelineEndTime.value = formatTimeOnly(validPoints[validPoints.length - 1].created_at);
      currentTimelineIndex.value = 0;
      currentTimelineTime.value = formatTimelineDisplayTime(validPoints[0].created_at);
    } else {
      timelineStartTime.value = '--:--';
      timelineEndTime.value = '--:--';
      currentTimelineIndex.value = 0;
      currentTimelineTime.value = checkedBoats.length > 0 ? 'Tiada data jejak untuk aset dipilih dalam julat masa ini' : 'Tiada data jejak GPS dalam julat masa ini';
    }

    if (replayLayer) {
      replayLayer.clearLayers();
    }
    replayMarkers = {};
    replayPolylines = {};

    kemaskiniFrameReplay();
  } catch (err) {
    console.error("Ralat semasa loadReplayData:", err);
    alert("Berlaku ralat sistem semasa memuat data.");
  } finally {
    isPlaybackLoading.value = false;
  }
};

const bukaTimelinePlayback = async () => {
  isTimelineOpen.value = true;
  isTimelineMinimized.value = false;
  await sediakanDataTimeline();

  if (!replayLayer && mapInstance) {
    replayLayer = L.layerGroup().addTo(mapInstance);
  } else if (replayLayer) {
    replayLayer.clearLayers();
  }
  replayMarkers = {};
  replayPolylines = {};

  kemaskiniFrameReplay();
};

const tutupTimelinePlayback = () => {
  if (replayTimer) {
    clearInterval(replayTimer);
    replayTimer = null;
  }
  isPlaying.value = false;
  if (replayLayer) {
    replayLayer.clearLayers();
  }
  replayMarkers = {};
  replayPolylines = {};
  isTimelineOpen.value = false;
  isTimelineMinimized.value = false;
};

const togglePlayReplay = () => {
  if (timelinePoints.value.length === 0) return;

  if (isPlaying.value) {
    jedaReplay();
  } else {
    mulaReplay();
  }
};

const mulaReplay = () => {
  if (timelinePoints.value.length === 0) return;
  if (currentTimelineIndex.value >= timelinePoints.value.length - 1) {
    currentTimelineIndex.value = 0;
  }

  isPlaying.value = true;
  if (replayTimer) clearInterval(replayTimer);

  const delayMs = Math.max(60, Math.floor(600 / playbackSpeed.value));
  replayTimer = setInterval(() => {
    if (currentTimelineIndex.value < timelinePoints.value.length - 1) {
      currentTimelineIndex.value++;
      kemaskiniFrameReplay();
    } else {
      jedaReplay();
    }
  }, delayMs);
};

const jedaReplay = () => {
  isPlaying.value = false;
  if (replayTimer) {
    clearInterval(replayTimer);
    replayTimer = null;
  }
};

const resetReplay = () => {
  jedaReplay();
  currentTimelineIndex.value = 0;
  kemaskiniFrameReplay();
};

const stepReplay = (delta) => {
  jedaReplay();
  const nextIdx = currentTimelineIndex.value + delta;
  if (nextIdx >= 0 && nextIdx < timelinePoints.value.length) {
    currentTimelineIndex.value = nextIdx;
    kemaskiniFrameReplay();
  }
};

const tukarKelajuanReplay = (speed) => {
  playbackSpeed.value = speed;
  if (isPlaying.value) {
    mulaReplay(); // Restart timer with new interval
  }
};

const onTimelineSliderChange = () => {
  kemaskiniFrameReplay();
};

const kemaskiniFrameReplay = () => {
  if (!replayLayer || timelinePoints.value.length === 0) return;

  const sliceIndex = currentTimelineIndex.value;
  const currentPoint = timelinePoints.value[sliceIndex];
  if (!currentPoint) return;

  currentTimelineTime.value = formatTimelineDisplayTime(currentPoint.created_at);

  // Ambil semua titik dari indeks 0 sehingga sliceIndex
  const activePoints = timelinePoints.value.slice(0, sliceIndex + 1);

  // Kumpulkan titik mengikut boat_id
  const boatGroups = {};
  activePoints.forEach(p => {
    if (!boatGroups[p.boat_id]) boatGroups[p.boat_id] = [];
    boatGroups[p.boat_id].push([parseFloat(p.latitude), parseFloat(p.longitude)]);
  });

  const activeBoatIds = Object.keys(boatGroups);
  replayActiveSruCount.value = activeBoatIds.length;

  activeBoatIds.forEach((boatId, idx) => {
    const coords = boatGroups[boatId];
    const latestCoord = coords[coords.length - 1];
    const sruColor = dapatkanWarnaTrek(boatId, idx);

    // 1. Lukis atau kemaskini garisan jejak (trail) sehingga masa ini
    if (replayPolylines[boatId]) {
      replayPolylines[boatId].setLatLngs(coords);
      replayPolylines[boatId].setStyle({ color: sruColor });
    } else {
      replayPolylines[boatId] = L.polyline(coords, {
        color: sruColor,
        weight: 3,
        opacity: 0.9,
        dashArray: '3, 6'
      }).addTo(replayLayer);
    }

    // 2. Lukis atau gerakkan marker bot pada kedudukan terkini frame ini
    const tooltipText = `🛥️ <b>${boatId}</b><br>🕒 Cap Masa: ${formatTimelineDisplayTime(currentPoint.created_at)}<br>📍 ${formatLatLng(latestCoord[0], true)}, ${formatLatLng(latestCoord[1], false)}`;

    if (replayMarkers[boatId]) {
      replayMarkers[boatId].setLatLng(latestCoord);
      replayMarkers[boatId].setTooltipContent(tooltipText);
    } else {
      const marker = L.circleMarker(latestCoord, {
        color: sruColor,
        fillColor: '#ffffff',
        fillOpacity: 1,
        radius: 7,
        weight: 3,
        className: 'replay-active-marker'
      }).addTo(replayLayer);

      marker.bindTooltip(tooltipText, {
        permanent: false,
        direction: 'top'
      });

      replayMarkers[boatId] = marker;
    }
  });

  // Buang mana-mana marker/polyline jika belum wujud pada frame masa ini
  Object.keys(replayMarkers).forEach(boatId => {
    if (!activeBoatIds.includes(boatId)) {
      replayLayer.removeLayer(replayMarkers[boatId]);
      delete replayMarkers[boatId];
    }
  });

  Object.keys(replayPolylines).forEach(boatId => {
    if (!activeBoatIds.includes(boatId)) {
      replayLayer.removeLayer(replayPolylines[boatId]);
      delete replayPolylines[boatId];
    }
  });
};

// Watcher untuk memuat semula sejarah trek apabila kes ditukar
watch(selectedCaseId, async () => {
  if (isTimelineOpen.value) {
    await sediakanDataTimeline();
    kemaskiniFrameReplay();
  }
  muatTurunSejarahSRU();
  fetchChatMessages();
});

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

  const { error } = await supabase.from('sar_messages').insert([{
    case_id: currentTab === 'global' ? null : Number(selectedCaseId.value),
    sender: activeStation.value,
    message: teksMesej,
    chat_type: currentTab
  }])
  if (error) {
    console.error("Gagal hantar mesej:", error)
  }
}

// ============================================================================
// GOD MODE FUNCTIONS (ADMIN ONLY)
// ============================================================================

// A: Padam satu mesej chat
const padamMesej = async (mesejId) => {
  if (!confirm("Padam mesej ini?")) return;
  await supabase.from('sar_messages').delete().eq('id', mesejId);
};

// B: Padam SEMUA mesej chat
const padamSemuaMesej = async () => {
  if (!confirm("AMARAN: Anda pasti mahu memadam KESEMUA sejarah mesej operasi?")) return;
  await supabase.from('sar_messages').delete().neq('id', 0); // Padam semua rekod
  alert("Semua mesej telah dibersihkan.");
};

// C: Padam SEMUA pelan/lukisan operasi di peta
const padamSemuaPelan = async () => {
  if (!confirm("AMARAN: Anda pasti mahu memadam KESEMUA lukisan pelan SAR di peta?")) return;
  await supabase.from('sar_plans').delete().neq('id', 0);
  alert("Semua pelan SAR telah dibersihkan dari peta.");
};

// D: Cuci sejarah Telemetri GPS (Kosongkan jadual sru_telemetry)
const bukaModalPadamGPS = async () => {
  // Bina query untuk dapatkan senarai trek
  let query = supabase.from('sru_tracks').select('sru_id, case_id');

  // Jika pengguna bukan Admin atau MRCC, tapis trek berdasarkan wilayah mereka
  if (activeStation.value !== 'Admin System' && activeStation.value !== 'MRCC Putrajaya') {
    const idKesWilayah = senaraiKes.value.filter(k => k.region === activeRegion.value).map(k => k.id);
    query = query.in('case_id', idKesWilayah);
  }

  const { data, error } = await query;
  if (error) {
    alert("Gagal mendapatkan senarai trek: " + error.message);
    return;
  }

  const uniqueTracks = data.reduce((acc, current) => {
    const key = `${current.sru_id}-${current.case_id}`;
    if (!acc.find(item => `${item.sru_id}-${item.case_id}` === key)) {
      acc.push(current);
    }
    return acc;
  }, []);

  senaraiTrekUntukPadam.value = uniqueTracks;
  showPadamGpsModal.value = true;
};

const sahkanPadamTrekSpesifik = async (sruId, caseId) => {
  const namaKes = dapatkanNamaKes(caseId);
  if (!confirm(`Anda pasti mahu memadam semua sejarah pergerakan untuk aset '${sruId}' dalam kes '#${caseId} - ${namaKes}'?`)) return;
  await supabase.from('sru_track_history').delete().match({ boat_id: sruId, case_id: caseId });
  await supabase.from('sru_tracks').delete().match({ sru_id: sruId, case_id: caseId });
  alert(`Sejarah pergerakan untuk aset '${sruId}' telah dipadam.`);
  showPadamGpsModal.value = false;
  await muatTurunSejarahSRU();
};

// E: Hantar Pengumuman Am (Broadcast)
const hantarBroadcast = async () => {
  if (!mesejBroadcast.value) return;
  
  const { error } = await supabase.from('sar_messages').insert([{ 
    sender: 'PENGUMUMAN ADMIN', 
    message: mesejBroadcast.value,
    chat_type: 'global'
  }]);

  if (!error) {
    alert("Pengumuman dihantar!");
    mesejBroadcast.value = '';
  }
};

watch(telemetriRealtime, () => {
  kemaskiniMarkerSRUAtasPeta();
}, { deep: true });
</script>

<style>
:global(body) { margin: 0 !important; padding: 0 !important; width: 100vw; height: 100vh; overflow: hidden; background-color: #020617; }
:global(#app) { max-width: none !important; padding: 0 !important; margin: 0 !important; width: 100%; height: 100%; display: flex; }
*, *::before, *::after { box-sizing: border-box; }

/* BUTTON ICONS FOR TOP-RIGHT UNIFIED TOOLBAR */
.tool-btn-icon {
  background: #1e293b;
  border: 1px solid #475569;
  color: #f8fafc;
  width: 26px;
  height: 26px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.15s;
  box-sizing: border-box;
}
.tool-btn-icon:hover {
  background: #334155;
  border-color: #38bdf8;
}
.tool-btn-icon.active {
  background: #2563eb;
  border-color: #38bdf8;
  color: #ffffff;
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
}

.tool-btn-icon-danger {
  background: #451a1a;
  border: 1px solid #7f1d1d;
  color: #fca5a5;
  width: 26px;
  height: 26px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.15s;
  box-sizing: border-box;
}
.tool-btn-icon-danger:hover {
  background: #991b1b;
  border-color: #ef4444;
  color: #ffffff;
}

/* Sembunyikan tanda Leaflet OpenStreetMap watermark */
.leaflet-control-attribution {
  display: none !important;
}

.pencil-cursor, .pencil-cursor * {
  cursor: crosshair !important;
}

.delete-cursor, .delete-cursor * {
  cursor: crosshair !important;
}

.custom-area-label { background: none !important; border: none !important; }

/* REPLAY SIMULATION MARKER ANIMATION */
.replay-active-marker {
  animation: webReplayPulse 1.5s infinite ease-out;
  transform-origin: center;
}

@keyframes webReplayPulse {
  0% {
    filter: drop-shadow(0 0 3px #ffffff);
    stroke-width: 2px;
  }
  50% {
    filter: drop-shadow(0 0 12px #00ffff);
    stroke-width: 4px;
  }
  100% {
    filter: drop-shadow(0 0 3px #ffffff);
    stroke-width: 2px;
  }
}

/* Animasi Mentol Berkelip untuk SRU */
/* 📡 ANIMASI RADAR PULSING UNTUK SRU DI WEB */
.sru-marker-blink {
  animation: webSruPulse 2s infinite ease-out;
  transform-origin: center;
  stroke-width: 2px;
}

@keyframes webSruPulse {
  0% {
    r: 4px;                  /* Saiz asal bulatan kecil */
    stroke-opacity: 1;
    fill-opacity: 0.9;
    stroke: #00ffff;         /* Warna Cyan Neon */
    filter: drop-shadow(0 0 2px #00ffff);
  }
  50% {
    fill-opacity: 0.6;
    filter: drop-shadow(0 0 15px #00ffff);
  }
  100% {
    r: 18px;                 /* Ombak mengembang besar */
    stroke-opacity: 0;       /* Pudar di penghujung */
    fill-opacity: 0;
    stroke: #00ffff;
  }
}

@keyframes popupAnim { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

@keyframes spinLoader {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.badge-unread {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 800;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 10;
}
</style>