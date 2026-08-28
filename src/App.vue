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
    
    <!-- LOGIN PAGE -->
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
      </div>
    </div>

    <!-- MAIN DASHBOARD -->
    <div v-else style="flex: 1; display: flex; flex-direction: column; height: 100vh; width: 100vw; overflow: hidden;">
      
      <!-- Top Overseer Status Bar -->
      <div style="background-color: #020617; color: #64748b; padding: 6px 20px; font-size: 10px; font-weight: bold; display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; flex-shrink: 0; z-index: 50;">
        <div>MALAYSIA MARITIME ENFORCEMENT AGENCY (MMEA) • {{ activeStation.toUpperCase() }}</div>
        <div style="display: flex; gap: 15px; align-items: center;">
          <span v-if="activeStation === 'MRCC Putrajaya'"><strong style="color: #fbbf24;">🖥️ MODE OVERSEER: NASIONAL</strong></span>
          <span v-else>REGION TAKTIKAL: <strong style="color: #38bdf8;">WILAYAH {{ activeRegion }}</strong></span>
          <button @click="prosesLogKeluar" style="background: #334155; color: #f87171; border: 1px solid #475569; padding: 1px 6px; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold;">LOGOUT 🔓</button>
        </div>
      </div>

      <!-- Main App Header -->
      <header style="background-color: #0f172a; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1d4ed8; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 50;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img :src="logoBclbb" alt="Logo" style="height: 45px; width: auto;" />
          <div>
            <h1 style="margin: 0; font-size: 18px; letter-spacing: 1px; color: #f8fafc;">SAR MISSION COORDINATOR DASHBOARD</h1>
            <span style="font-size: 11px; color: #38bdf8; font-weight: bold; letter-spacing: 0.5px;">STESEN: {{ activeStation }} // OPERATIONS OVERSEER SYSTEM</span>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; background: rgba(15, 23, 42, 0.5); padding: 8px 16px; border-radius: 6px; border: 1px solid #1e293b;">
          <span style="color: #00ffcc; font-size: 10px; font-weight: 800; text-transform: uppercase;">Presence:</span>
          <div v-for="stesen in stesenList" :key="stesen" style="display: flex; align-items: center; gap: 6px;">
            <span :style="{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: (onlineUsers.includes(stesen) || activeStation === stesen) ? '#22c55e' : '#475569',
              boxShadow: (onlineUsers.includes(stesen) || activeStation === stesen) ? '0 0 6px #22c55e' : 'none'
            }"></span>
            <span :style="{ color: (onlineUsers.includes(stesen) || activeStation === stesen) ? '#f8fafc' : '#94a3b8', fontSize: '10px', fontWeight: 'bold' }">{{ stesen }}</span>
          </div>
        </div>
      </header>

      <!-- Main Operational Workspace -->
      <div style="display: grid; grid-template-columns: 1fr 340px; gap: 12px; padding: 12px; flex: 1; min-height: 0; box-sizing: border-box; width: 100%;">
        
        <!-- PETA LEAFLET -->
        <div style="position: relative; overflow: hidden; display: flex; flex-direction: column; min-height: 400px;">
          <div id="map" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1;"></div>
          
          <!-- Panel Kiri Taktikal -->
          <div :style="{
            position: 'absolute', top: '0', left: '0', height: '100%',
            transform: isLeftPanelVisible ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease-in-out',
            zIndex: 20, display: 'flex'
          }">
            <div style="display: flex; flex-direction: column; gap: 12px; min-height: 0; width: 320px; background: rgba(11, 15, 25, 0.85); backdrop-filter: blur(8px); padding: 12px; border-right: 1px solid #334155; overflow-y: auto;">
              
              <div style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #38bdf8; padding: 12px; flex-shrink: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h4 style="margin: 0; font-size: 12px; color: #38bdf8; text-transform: uppercase;">
                    🌐 INCIDENT SETUP ({{ activeRegion }})
                  </h4>
                  <div style="display: flex; gap: 6px;">
                    <button @click="showLoadCaseModal = true" style="background: #0284c7; color: white; border: none; padding: 3px 10px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;">📂 Load</button>
                    <button v-if="activeStation !== 'MRCC Putrajaya'" @click="bukaModalTambahKes" style="background: #2563eb; color: white; border: none; padding: 3px 10px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;">+ New</button>
                  </div>
                </div>

                <div style="margin-bottom: 8px;">
                  <label style="display: block; font-size: 10px; font-weight: bold; color: #94a3b8; margin-bottom: 4px;">SAR CASE IDENTITY</label>
                  <div style="display: grid; grid-template-columns: 1fr auto; gap: 6px; align-items: center;">
                    <select v-model="selectedCaseId" @change="tukarKesTaktikal" style="width: 100%; padding: 7px; border: 1px solid #475569; border-radius: 4px; font-size: 12px; font-weight: bold; background-color: #0f172a; color: #f8fafc; height: 34px;">
                      <option value="ALL">🌍 [SEMUA KES AKTIF {{ activeStation === 'MRCC Putrajaya' ? 'NASIONAL' : activeRegion }}]</option>
                      <option v-for="kes in senaraiKesAktifSahaja" :key="kes.id" :value="kes.id">
                        #{{ kes.id }} - {{ kes.case_name }} ({{ kes.region }})
                      </option>
                    </select>
                    <button v-if="selectedCaseId !== 'ALL' && selectedCaseId !== ''" @click="bukaModalEditKes" style="background: #334155; color: #38bdf8; border: 1px solid #475569; width: 34px; height: 34px; border-radius: 4px; cursor: pointer; font-size: 12px;" title="Urus / Selesai Kes">
                      ✏️
                    </button>
                  </div>
                </div>
              </div>

              <!-- SAP vs SIMULATION TAB SWITCHER -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; background: #0f172a; border-radius: 6px; padding: 3px; gap: 4px; border: 1px solid #334155; flex-shrink: 0;">
                <button @click="activeLeftPanelTab = 'sap'" :style="{ background: activeLeftPanelTab === 'sap' ? '#0284c7' : 'transparent', color: activeLeftPanelTab === 'sap' ? '#fff' : '#94a3b8' }" style="border:none; padding:8px 4px; border-radius:4px; font-size:11px; font-weight:800; cursor:pointer;">
                  📋 SAP
                </button>
                <button @click="activeLeftPanelTab = 'simulation'" :style="{ background: activeLeftPanelTab === 'simulation' ? '#f59e0b' : 'transparent', color: activeLeftPanelTab === 'simulation' ? '#000' : '#94a3b8' }" style="border:none; padding:8px 4px; border-radius:4px; font-size:11px; font-weight:800; cursor:pointer;">
                  🌀 SIMULATION
                </button>
              </div>

              <!-- TAB 1: SAP -->
              <template v-if="activeLeftPanelTab === 'sap'">
                <div v-if="activeStation !== 'MRCC Putrajaya'" style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #0284c7; padding: 12px; flex-shrink: 0;">
                  <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #38bdf8; text-transform: uppercase;">📤 UPLOAD SAROPS</h4>
                  <label style="border: 2px dashed #475569; border-radius: 6px; padding: 14px 10px; text-align: center; color: #94a3b8; font-size: 11px; background-color: #0f172a; display: block; cursor: pointer; transition: 0.2s;">
                    📄 Klik Muat Naik (.txt, .gpx, .kml)
                    <input type="file" multiple accept=".txt,.gpx,.kml" @change="bacaFailSAROPS" style="display: none;" />
                  </label>
                </div>

                <div style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #10b981; padding: 12px; flex: 1; display: flex; flex-direction: column;">
                  <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #34d399; text-transform: uppercase;">⚓ SRU ASSIGNMENT</h4>
                  <div style="display: flex; flex-direction: column; gap: 6px; overflow-y: auto;">
                    <div v-for="sru in paparanSRUKesAktif" :key="sru.id" style="padding: 8px; background:#0f172a; border-radius:4px; border-left: 3px solid #10b981; border: 1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <strong style="font-size:11px; color:#fff;">{{ sru.nama }}</strong>
                        <div style="font-size:9px; color:#93c5fd;">{{ sru.kawasanNama }} • {{ sru.corak }}</div>
                      </div>
                      <button v-if="activeStation !== 'MRCC Putrajaya'" @click="bukaPopUpPadam(sru)" style="background: #4c1d15; color: #f87171; border: 1px solid #991b1b; padding: 2px 6px; font-size: 9px; border-radius: 3px; cursor: pointer;">🗑️</button>
                    </div>
                    <div v-if="paparanSRUKesAktif.length === 0" style="text-align: center; color: #64748b; font-size: 11px; margin-top: 10px;">Tiada SRU diplot.</div>
                  </div>
                </div>
              </template>

              <!-- TAB 2: SIMULATION (.nc) -->
              <template v-else>
                <div v-if="activeStation !== 'MRCC Putrajaya'" style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #f59e0b; padding: 12px; flex-shrink: 0;">
                  <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #fbbf24; text-transform: uppercase;">📤 UPLOAD SIMULATION</h4>
                  <label style="border: 2px dashed #f59e0b; border-radius: 6px; padding: 14px 10px; text-align: center; color: #94a3b8; font-size: 11px; background-color: #0f172a; display: block; cursor: pointer; transition: 0.2s;">
                    🌊 Klik Muat Naik Fail (.nc, .hdf5, .h5)
                    <input type="file" multiple accept=".nc,.hdf5,.h5" @change="bacaFailDriftNC" style="display: none;" />
                  </label>
                </div>

                <div style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #f59e0b; padding: 12px; flex: 1; display: flex; flex-direction: column;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; font-size: 12px; color: #fbbf24; text-transform: uppercase;">🌀 SIMULATION FILES</h4>
                    <span style="font-size: 9px; color: #94a3b8;">{{ paparanSimulasiKesAktif.length }} Fail</span>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 6px; overflow-y: auto;">
                    <div 
                      v-for="sim in paparanSimulasiKesAktif" 
                      :key="sim.id" 
                      @click="pilihSimulasiUntukMain(sim)"
                      :style="{ 
                        borderLeft: simulasiAktifId === sim.id ? '4px solid #f59e0b' : '3px solid #475569',
                        background: simulasiAktifId === sim.id ? '#1e1b4b' : '#0f172a',
                        borderColor: simulasiAktifId === sim.id ? '#f59e0b' : '#334155'
                      }"
                      style="padding: 8px; border-radius: 4px; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s;"
                    >
                      <div style="flex: 1; min-width: 0; padding-right: 6px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <strong style="font-size: 11px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ sim.fileName }}</strong>
                          <span v-if="simulasiAktifId === sim.id" style="background: #f59e0b; color: #000; font-size: 8px; font-weight: 900; padding: 1px 4px; border-radius: 3px;">AKTIF</span>
                        </div>
                        <div style="font-size: 9px; color: #93c5fd; margin-top: 2px;">
                          {{ sim.numParticles.toLocaleString() }} partikel • {{ sim.numTimeSteps }} langkah
                        </div>
                      </div>
                      <button 
                        v-if="activeStation !== 'MRCC Putrajaya'" 
                        @click.stop="padamFailSimulasi(sim)" 
                        style="background: #4c1d15; color: #f87171; border: 1px solid #991b1b; padding: 2px 6px; font-size: 9px; border-radius: 3px; cursor: pointer;"
                        title="Padam Fail Simulasi"
                      >
                        🗑️
                      </button>
                    </div>

                    <div v-if="paparanSimulasiKesAktif.length === 0" style="text-align: center; color: #64748b; font-size: 11px; margin-top: 10px;">
                      Tiada fail simulasi dimuat naik.
                    </div>
                  </div>
                </div>
              </template>

            </div>
            
            <!-- Handle Buka/Tutup Panel Kiri -->
            <div @click="isLeftPanelVisible = !isLeftPanelVisible" style="position: absolute; right: -20px; top: 50%; transform: translateY(-50%); width: 20px; height: 60px; background: #0f172a; border: 1px solid #334155; border-left: none; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 0 6px 6px 0; box-shadow: 2px 0 6px rgba(0,0,0,0.5);">
              <span style="color: #94a3b8; font-size: 12px;">{{ isLeftPanelVisible ? '◀' : '▶' }}</span>
            </div>
          </div>

          <!-- UNIFIED TACTICAL MAP TOOLBAR (TOP RIGHT) -->
          <div style="position: absolute; top: 10px; right: 10px; z-index: 1000; display: flex; align-items: center; gap: 4px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(8px); border: 1px solid #475569; border-radius: 6px; padding: 3px 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            <button @click="aktifkanTool('circle')" :class="{ active: activeTool === 'circle' }" class="tool-btn-icon" title="Bulatan (2-Klik)">⭕</button>
            <button @click="aktifkanTool('rect')" :class="{ active: activeTool === 'rect' }" class="tool-btn-icon" title="Segi Empat (2-Klik)">⬛</button>
            <button @click="aktifkanTool('line')" :class="{ active: activeTool === 'line' }" class="tool-btn-icon" title="Ukur Jarak / Garisan (2-Klik)">📏</button>
            <button @click="aktifkanTool('marker')" :class="{ active: activeTool === 'marker' }" class="tool-btn-icon" title="Pin Marker (1-Klik)">📍</button>
            <button @click="aktifkanTool('text')" :class="{ active: activeTool === 'text' }" class="tool-btn-icon" title="Catatan Teks (1-Klik)">📝</button>
            <button @click="toggleDeleteMode" :class="{ active: isDeleteMode }" class="tool-btn-icon-danger" title="Mod Padam Lukisan">🗑️</button>
            <button @click="bersihkanLukisan" class="tool-btn-icon" title="Padam Semua Lukisan" style="color: #f87171;">🧹</button>

            <div style="width: 1px; height: 18px; background: #475569; margin: 0 3px;"></div>

            <!-- SEARCH / GO-TO -->
            <input type="text" v-model="teksCarianPeta" @keydown.enter="laksanakanCarianPeta" placeholder="🔍 Lokasi / Lat, Lon..." style="width: 170px; height: 26px; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 0 6px; border-radius: 4px; font-size: 11px;" />

            <div style="width: 1px; height: 18px; background: #475569; margin: 0 3px;"></div>

            <!-- LAYERS DROPDOWN -->
            <div style="position: relative;">
              <button @click="isLayerMenuOpen = !isLayerMenuOpen" class="tool-btn-icon" title="Lapisan Peta">🥞</button>
              <div v-if="isLayerMenuOpen" style="position: absolute; top: 32px; right: 0; z-index: 1015; background: rgba(15, 23, 42, 0.98); border: 1.5px solid #38bdf8; border-radius: 6px; padding: 8px; min-width: 200px; display: flex; flex-direction: column; gap: 6px; animation: popupAnim 0.15s ease-out; box-shadow: 0 8px 20px rgba(0,0,0,0.7);">
                <div style="font-size: 9px; font-weight: 800; color: #38bdf8;">TEMA ASAS</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3px;">
                  <button @click="tukarBaseLayer('osm')" :style="{ background: selectedBaseLayer === 'osm' ? '#0284c7' : '#1e293b' }" style="color:#fff; border:1px solid #334155; font-size:9px; padding:4px; border-radius:3px; cursor:pointer;">OSM</button>
                  <button @click="tukarBaseLayer('dark')" :style="{ background: selectedBaseLayer === 'dark' ? '#0284c7' : '#1e293b' }" style="color:#fff; border:1px solid #334155; font-size:9px; padding:4px; border-radius:3px; cursor:pointer;">Dark</button>
                  <button @click="tukarBaseLayer('satellite')" :style="{ background: selectedBaseLayer === 'satellite' ? '#0284c7' : '#1e293b' }" style="color:#fff; border:1px solid #334155; font-size:9px; padding:4px; border-radius:3px; cursor:pointer;">Satelit</button>
                </div>
                <div style="font-size: 9px; font-weight: 800; color: #38bdf8; margin-top: 4px;">SEMPADAN MARITIM</div>
                <label style="display:flex; align-items:center; gap:6px; font-size:10px; cursor:pointer;"><input type="checkbox" v-model="showLayerMSRR" @change="togolLayerMSRR" /> Sempadan MSRR</label>
                <label style="display:flex; align-items:center; gap:6px; font-size:10px; cursor:pointer;"><input type="checkbox" v-model="showLayerPelantar" @change="togolLayerPelantar" /> Pelantar Benua 1979</label>
                <label style="display:flex; align-items:center; gap:6px; font-size:10px; cursor:pointer;"><input type="checkbox" v-model="showOpenSeaMap" @change="togolOpenSeaMap" /> OpenSeaMap</label>
              </div>
            </div>
          </div>

          <!-- ⏱️ FLOATING REPLAY TIMELINE CONTROLLER (GLASSMORPHISM BAR) -->
          <div 
            v-if="isTimelineOpen" 
            style="position: absolute; bottom: 44px; right: 12px; z-index: 1005; width: 460px; background: rgba(15, 23, 42, 0.96); backdrop-filter: blur(12px); border: 1.5px solid #38bdf8; border-radius: 8px; padding: 10px 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.7); display: flex; flex-direction: column; gap: 8px; animation: popupAnim 0.15s ease-out;"
          >
            <!-- Header Bar Replay -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 4px;">
              <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; color: #38bdf8;">
                <span>⏱️ REPLAY PERGERAKAN ASET</span>
                <span style="background: #1e293b; color: #94a3b8; font-size: 9px; padding: 1px 6px; border-radius: 10px; border: 1px solid #475569;">{{ timelinePoints.length }} Titik</span>
              </div>
              <button @click="tutupTimelinePlayback" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 13px; font-weight: bold;">✕</button>
            </div>

            <!-- Current Time & Position Display -->
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1; font-family: monospace; background: #020617; padding: 4px 8px; border-radius: 4px; border: 1px solid #1e293b;">
              <span style="color: #4ade80;">{{ currentTimelineTime || 'Sedia untuk Replay' }}</span>
              <span style="color: #94a3b8;">{{ timelinePoints.length > 0 ? `${currentTimelineIndex + 1}/${timelinePoints.length}` : '0/0' }}</span>
            </div>

            <!-- Slider Bar -->
            <input 
              type="range" 
              :min="0" 
              :max="Math.max(0, timelinePoints.length - 1)" 
              v-model.number="currentTimelineIndex" 
              @input="kemaskiniFrameReplay" 
              :disabled="timelinePoints.length === 0"
              style="width: 100%; accent-color: #0284c7; cursor: pointer; margin: 0;" 
            />

            <!-- Controls Row: Reset, Step, Play/Pause, Speed -->
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <button @click="resetReplay" :disabled="timelinePoints.length === 0" style="background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: bold; cursor: pointer;" title="Reset Titik Awal">⏮ Reset</button>
                <button @click="stepReplay(-1)" :disabled="timelinePoints.length === 0" style="background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: bold; cursor: pointer;" title="Undur 1 Titik">◀</button>
                <button @click="togglePlayReplay" :disabled="timelinePoints.length === 0" :style="{ background: isPlaying ? '#f59e0b' : '#10b981' }" style="color: white; border: none; padding: 3px 12px; border-radius: 3px; font-size: 10px; font-weight: 800; cursor: pointer;">
                  {{ isPlaying ? '⏸ PAUSE' : '▶ PLAY' }}
                </button>
                <button @click="stepReplay(1)" :disabled="timelinePoints.length === 0" style="background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: bold; cursor: pointer;" title="Maju 1 Titik">▶</button>
              </div>

              <!-- Speed Selector -->
              <div style="display: flex; align-items: center; gap: 2px; background: #020617; padding: 2px; border-radius: 3px; border: 1px solid #334155;">
                <span style="font-size: 8px; font-weight: bold; color: #64748b; padding: 0 3px;">SPD:</span>
                <button v-for="spd in [1, 2, 5, 10]" :key="spd" @click="playbackSpeed = spd" :style="{ background: playbackSpeed === spd ? '#0284c7' : 'transparent', color: playbackSpeed === spd ? '#fff' : '#94a3b8' }" style="border:none; padding:2px 5px; font-size:9px; border-radius:2px; cursor:pointer; font-weight:bold;">
                  {{ spd }}x
                </button>
              </div>
            </div>
          </div>

          <!-- 🌀 FLOATING SIMULATION TIMELINE TOOLBAR (APABILA SIMULASI .NC AKTIF) -->
          <div 
            v-if="driftSimData" 
            style="position: absolute; bottom: 44px; left: 50%; transform: translateX(-50%); z-index: 1005; background: rgba(15, 23, 42, 0.96); backdrop-filter: blur(10px); border: 1.5px solid #f59e0b; border-radius: 8px; padding: 8px 14px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7); display: flex; align-items: center; gap: 12px; min-width: 540px; max-width: 90vw; animation: popupAnim 0.15s ease-out;"
          >
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 900; color: #fbbf24; white-space: nowrap;">
                <span>🌀</span><span>SIMULATION POC</span>
              </div>
              <div style="font-size: 9px; color: #94a3b8; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                {{ driftFileName }}
              </div>
            </div>

            <button @click="togglePlayDrift" :style="{ background: isDriftPlaying ? '#ef4444' : '#10b981' }" style="color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; white-space: nowrap;">
              {{ isDriftPlaying ? '⏸ Jeda' : '▶ Main' }}
            </button>

            <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold;">
                <span style="color: #4ade80; font-family: monospace;">⏱️ Waktu: {{ driftSimTimeStr }}</span>
                <span style="color: #38bdf8;">Langkah {{ currentDriftStep + 1 }}/{{ driftSimData.numTimeSteps }}</span>
              </div>
              <input type="range" min="0" :max="driftSimData.numTimeSteps - 1" v-model.number="currentDriftStep" @input="kemaskiniPaparanDrift(currentDriftStep)" style="width: 100%; accent-color: #f59e0b; cursor: pointer; margin: 0;" />
            </div>

            <div style="display: flex; gap: 2px; align-items: center;">
              <button v-for="spd in [1, 2, 5]" :key="spd" @click="driftPlaySpeed = spd" :style="{ background: driftPlaySpeed === spd ? '#f59e0b' : '#1e293b', color: driftPlaySpeed === spd ? '#000' : '#94a3b8' }" style="border: 1px solid #475569; border-radius: 3px; padding: 3px 6px; font-size: 9px; font-weight: bold; cursor: pointer;">
                {{ spd }}x
              </button>
            </div>

            <button @click="tutupDriftSimulasi" style="background: #334155; color: #f87171; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; font-weight: bold;" title="Tutup Simulasi">✕</button>
          </div>

          <!-- BOTTOM-RIGHT LIVE COORDINATES (PENJEJAK KURSOR TETIKUS) -->
          <div style="position: absolute; bottom: 8px; right: 8px; z-index: 1000; background: rgba(15, 23, 42, 0.95); border: 1.5px solid #38bdf8; color: #38bdf8; font-family: monospace; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; pointer-events: none; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.6); backdrop-filter: blur(8px);">
            🌐 {{ currentLat }} | {{ currentLng }}
          </div>
        </div>

        <!-- RIGHT SIDEBAR (3-TAB SYSTEM) -->
        <div style="display: flex; flex-direction: column; height: 100%; min-height: 0; z-index: 20; background: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; overflow: hidden;">
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); background: #0f172a; border-bottom: 2px solid #1d4ed8; padding: 4px; gap: 4px; flex-shrink: 0;">
            <button @click="activeRightSidebarTab = 'active'" :style="{ background: activeRightSidebarTab === 'active' ? '#2563eb' : 'transparent', color: activeRightSidebarTab === 'active' ? '#fff' : '#94a3b8' }" class="sidebar-tab-btn">
              <span :style="{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: telemetriRealtime.length > 0 ? '#22c55e' : '#64748b', display: 'inline-block', marginRight: '4px' }"></span>
              Active ({{ telemetriRealtime.length }})
            </button>
            <button @click="activeRightSidebarTab = 'history'; muatTurunSejarahSRU()" :style="{ background: activeRightSidebarTab === 'history' ? '#2563eb' : 'transparent', color: activeRightSidebarTab === 'history' ? '#fff' : '#94a3b8' }" class="sidebar-tab-btn">
              History
            </button>
            <button @click="activeRightSidebarTab = 'communication'" :style="{ background: activeRightSidebarTab === 'communication' ? '#2563eb' : 'transparent', color: activeRightSidebarTab === 'communication' ? '#fff' : '#94a3b8' }" class="sidebar-tab-btn">
              Comm
            </button>
          </div>

          <!-- TAB 1: ACTIVE LIVE SRU STATUS -->
          <div v-show="activeRightSidebarTab === 'active'" style="flex: 1; padding: 12px; overflow-y: auto; color: #1e293b; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 12px; font-weight: bold; color: #0f172a;">📡 LIVE SRU STATUS</h4>
              <button @click="cuciSemuaTelemetriOffline" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-size: 9px; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-weight: bold;" title="Padam bot yang tersangkut">🧹 Cuci Offline</button>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
              <thead>
                <tr style="border-bottom: 1px solid #cbd5e1; color: #64748b;">
                  <th style="padding: 6px 0; text-align: left;">BOAT ID</th>
                  <th style="padding: 6px 0; text-align: left;">KTS</th>
                  <th style="padding: 6px 0; text-align: left;">CRS</th>
                  <th style="padding: 6px 0; text-align: right;">CSP (NM)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tele in telemetriRealtime" :key="tele.boat_id || tele.id" style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background-color: #22c55e;"></span>
                      {{ tele.boat_id }}
                    </div>
                  </td>
                  <td style="padding: 8px 0; color: #475569;">{{ tele.speed || '0.0' }}</td>
                  <td style="padding: 8px 0; color: #475569;">{{ tele.course ? tele.course + '°' : '---' }}</td>
                  <td style="padding: 8px 0; text-align: right; color: #2563eb; font-weight: bold;">{{ tele.csp || '---' }}</td>
                </tr>
                <tr v-if="telemetriRealtime.length === 0">
                  <td colspan="4" style="padding: 40px 0; text-align: center; color: #94a3b8;">
                    <div style="font-size: 24px; margin-bottom: 6px;">🛰️</div>
                    Tiada isyarat GPS bot aktif buat masa ini.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 2: HISTORY (SEJARAH PERGERAKAN MENGIKUT KES AKTIF) -->
          <div v-show="activeRightSidebarTab === 'history'" style="flex: 1; display:flex; flex-direction:column; padding: 12px; min-height: 0; color: #1e293b; gap: 10px;">
            
            <!-- HEADER ATAS -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; flex-shrink: 0;">
              <div>
                <h4 style="margin: 0; font-size: 12px; font-weight: bold; color: #0f172a;">⏳ SEJARAH PERGERAKAN</h4>
                <div style="font-size: 9px; color: #0284c7; font-weight: bold; margin-top: 2px;">
                  Kes: {{ selectedCaseId === 'ALL' ? 'Semua Kes Aktif' : `#${selectedCaseId}` }}
                </div>
              </div>
              <span style="font-size: 9px; background: #eff6ff; color: #2563eb; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #bfdbfe;">
                📱 Mobile Transmit
              </span>
            </div>

            <!-- SENARAI ASET KES (MOBILE TRANSMITTED) DI BAHAGIAN TENGAH -->
            <div style="display: flex; flex-direction: column; gap: 6px; overflow-y: auto; flex: 1; min-height: 120px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 2px;">
                <span style="font-size: 10px; font-weight: bold; color: #64748b;">ASET TRANSMIT ({{ senaraiSruSejarah.length }} Bot):</span>
                <span style="font-size: 9px; color: #94a3b8;">Tandakan (✓) untuk muat turun</span>
              </div>

              <div v-for="sru in senaraiSruSejarah" :key="sru.boat_id" style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; font-size:11px;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" v-model="sru.isChecked" @change="kemaskiniPaparanTrekPeta" style="accent-color: #2563eb; cursor: pointer;" />
                  <strong style="color: #0f172a;">{{ sru.boat_id }}</strong>
                </label>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span :style="{ color: sru.points_count > 0 ? '#16a34a' : '#94a3b8', fontWeight: sru.points_count > 0 ? 'bold' : 'normal' }" style="font-size:10px; font-family: monospace;">
                    {{ sru.points_count > 0 ? `${sru.points_count.toLocaleString()} pts` : 'Belum Load' }}
                  </span>
                </div>
              </div>

              <div v-if="senaraiSruSejarah.length === 0" style="text-align:center; color:#94a3b8; padding:25px 10px; font-size:11px; background:#f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px;">
                Tiada rekod transmisi aplikasi mudah alih (mobile) dijumpai untuk kes ini.
              </div>
            </div>

            <!-- KAWASAN KAWALAN DI BAHAGIAN BAWAH -->
            <div style="display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; border-top: 1px solid #e2e8f0; padding-top: 8px;">
              
              <!-- 1. PENAPIS MASA (MULA & TAMAT) -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
                <div style="font-size: 10px; font-weight: bold; color: #475569; display: flex; justify-content: space-between; align-items: center;">
                  <span>📅 PENAPIS MASA (Pilihan)</span>
                  <button v-if="filterMasaMula || filterMasaTamat" @click="resetFilterMasa" style="background: none; border: none; color: #ef4444; font-size: 9px; cursor: pointer; padding: 0;">Reset</button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <div>
                    <label style="display: block; font-size: 8px; font-weight: bold; color: #64748b; margin-bottom: 2px;">MULA (Dari):</label>
                    <input type="datetime-local" v-model="filterMasaMula" style="width: 100%; font-size: 9px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 3px; background: #fff;" />
                  </div>
                  <div>
                    <label style="display: block; font-size: 8px; font-weight: bold; color: #64748b; margin-bottom: 2px;">TAMAT (Hingga):</label>
                    <input type="datetime-local" v-model="filterMasaTamat" style="width: 100%; font-size: 9px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 3px; background: #fff;" />
                  </div>
                </div>
              </div>

              <!-- 2. BUTANG LOAD TRACK DATA DI BAWAH PENAPIS MASA -->
              <button 
                @click="muatTurunSejarahSRU" 
                :disabled="isMengecasSejarah || senaraiSruSejarah.length === 0"
                style="width: 100%; background: #2563eb; color: white; border: none; padding: 8px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 4px rgba(37,99,235,0.2);"
              >
                <span v-if="isMengecasSejarah">⏳ Memuat Turun Data...</span>
                <span v-else>📥 Muat Turun Rekod (Load Track)</span>
              </button>

              <!-- 3. BUTANG REPLAY DI BAWAH BUTTON LOAD -->
              <button 
                @click="bukaTimelinePlayback" 
                :disabled="totalLoadedPoints === 0" 
                :style="{ background: totalLoadedPoints > 0 ? '#0284c7' : '#94a3b8', cursor: totalLoadedPoints > 0 ? 'pointer' : 'not-allowed' }"
                style="width: 100%; color: white; border: none; padding: 8px; font-size: 11px; border-radius: 4px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
              >
                <span>⏱️</span><span>Replay Track ({{ totalLoadedPoints.toLocaleString() }} pts)</span>
              </button>

            </div>

          </div>

          <!-- TAB 3: COMM (MESEJ PUSAT OPERASI) -->
          <div v-show="activeRightSidebarTab === 'communication'" style="flex: 1; display: flex; flex-direction: column; padding: 12px; min-height: 0;">
            <div class="chat-messages-container" style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
              <div v-for="msg in filteredMesejChat" :key="msg.id" style="font-size: 11px; color: #1e293b; background: #ffffff; padding: 6px 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; font-size: 9px; color: #64748b; margin-bottom: 2px;">
                  <strong>{{ msg.sender }}</strong>
                  <span>{{ formatMasaChat(msg.created_at) }}</span>
                </div>
                <div style="color: #0f172a;">{{ msg.message }}</div>
              </div>
              <div v-if="filteredMesejChat.length === 0" style="text-align: center; color: #94a3b8; margin: auto; font-size: 11px;">
                Tiada mesej komunikasi.
              </div>
            </div>
            <input type="text" v-model="inputMesejBaru" @keyup.enter="hantarMesejChatSupabase" placeholder="Taip mesej taktikal..." style="margin-top: 8px; width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px;" />
          </div>

        </div>

      </div>

      <!-- LOAD CASE MODAL -->
      <div v-if="showLoadCaseModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(4px);">
        <div style="background: white; width: 480px; border-radius: 8px; padding: 18px; color: #1e293b; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #0f172a;">📂 Arkib Insiden SAR</h3>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Pilih kes untuk memuatkan data taktikal & sejarah</div>
            </div>
            <button @click="showLoadCaseModal = false" style="background:none; border:none; color:#64748b; font-size:16px; cursor:pointer;">✕</button>
          </div>
          <div style="max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px;">
            <div 
              v-for="oldKes in senaraiKes" 
              :key="oldKes.id" 
              @click="selectedCaseId = oldKes.id; tukarKesTaktikal(); showLoadCaseModal = false" 
              :style="{ 
                borderColor: (oldKes.status || '').toLowerCase() === 'active' ? '#86efac' : '#e2e8f0',
                backgroundColor: (oldKes.status || '').toLowerCase() === 'active' ? '#f0fdf4' : '#fafafa'
              }"
              style="padding: 10px; border: 1.5px solid #e2e8f0; border-radius: 6px; cursor: pointer; transition: 0.2s;"
            >
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: bold; color: #0f172a;">
                <span>#{{ oldKes.id }} - {{ oldKes.case_name }}</span>
                <div style="display: flex; gap: 4px; align-items: center;">
                  <span style="font-size: 9px; color: #2563eb; background: #eff6ff; padding: 1px 6px; border-radius: 4px; border: 1px solid #bfdbfe;">
                    {{ oldKes.region }}
                  </span>
                  <span 
                    :style="{
                      background: (oldKes.status || '').toLowerCase() === 'active' ? '#dcfce7' : '#f1f5f9',
                      color: (oldKes.status || '').toLowerCase() === 'active' ? '#15803d' : '#64748b',
                      borderColor: (oldKes.status || '').toLowerCase() === 'active' ? '#86efac' : '#cbd5e1'
                    }"
                    style="font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 4px; border: 1px solid; text-transform: uppercase;"
                  >
                    {{ (oldKes.status || '').toLowerCase() === 'active' ? '🟢 AKTIF' : '⚪ ' + (oldKes.status || 'SELESAI') }}
                  </span>
                </div>
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
                No Kes: <strong>{{ oldKes.case_no || '-' }}</strong> • Objek: {{ oldKes.search_object || 'Tiada' }}
              </div>
            </div>
          </div>
          <button @click="showLoadCaseModal = false" style="margin-top: 12px; width: 100%; padding: 8px; background: #334155; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;">Tutup</button>
        </div>
      </div>
      <div v-if="showAddCaseModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(4px);">
        <div style="background: white; width: 420px; border-radius: 8px; padding: 20px; color: #1e293b;">
          <h3 style="margin-top: 0; font-size: 15px; font-weight: bold; color: #0f172a;">➕ Cipta Insiden SAR Baharu</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">NO. KES</label>
              <input type="text" v-model="formAddKes.case_no" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;" />
            </div>
            <div>
              <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">NAMA INSIDEN / KES</label>
              <input type="text" v-model="formAddKes.case_name" placeholder="Contoh: BOT FIBER KARAM..." style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;" />
            </div>
            <div>
              <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">OBJEK PENCARIAN</label>
              <input type="text" v-model="formAddKes.search_object" placeholder="Contoh: 1x Mangsa / Bot 20 Kaki" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;" />
            </div>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button @click="simpanKesBaruSupabase" style="flex: 1; padding: 10px; background: #2563eb; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px;">Simpan & Mulakan</button>
            <button @click="showAddCaseModal = false" style="padding: 10px 16px; background: #94a3b8; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px;">Batal</button>
          </div>
        </div>
      </div>

      <!-- MODAL PADAM SRU -->
      <div v-if="showDeleteModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: white; width: 360px; border-radius: 8px; padding: 18px; color: #1e293b; text-align: center;">
          <h4 style="margin: 0 0 10px 0; color: #dc2626;">Padam SRU Assignment</h4>
          <p style="font-size: 12px; color: #475569;">Adakah anda pasti mahu memadam pelan carian untuk aset <strong>{{ sruTargetToPadam?.nama }}</strong>?</p>
          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 14px;">
            <button @click="sahkanPadamSRU" style="padding: 6px 14px; background: #dc2626; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11px;">Ya, Padam</button>
            <button @click="showDeleteModal = false" style="padding: 6px 14px; background: #64748b; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11px;">Batal</button>
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

// STATE PENGGUNA & AUTH
const isLoggedIn = ref(false)
const loginError = ref('')
const activeStation = ref('')
const activeRegion = ref('')
const isAdmin = computed(() => activeStation.value === 'Admin System')
const loginForm = ref({ stationId: '', password: '' })
const amaranAdmin = ref('')
const paparAmaran = ref(false)
const onlineUsers = ref([])
const stesenList = ['MRCC Putrajaya', 'MRSC Langkawi', 'MRSC Klang', 'MRSC Johor Baharu', 'MRSC Kuantan', 'MRSC Kota Kinabalu', 'MRSC Kuching']

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

// FORMAT PENUKARAN KOORDINAT DDM (DD° MM.MM' N/S)
const toDDM = (deg, isLng) => {
  if (deg === null || deg === undefined || isNaN(deg)) return isLng ? "000° 00.00' E" : "00° 00.00' N"
  const absDeg = Math.abs(deg)
  const degrees = Math.floor(absDeg)
  const minutes = ((absDeg - degrees) * 60).toFixed(2)
  const direction = isLng ? (deg >= 0 ? 'E' : 'W') : (deg >= 0 ? 'N' : 'S')
  const degreesStr = String(degrees).padStart(isLng ? 3 : 2, '0')
  const minutesStr = parseFloat(minutes) < 10 ? '0' + minutes : minutes
  return `${degreesStr}° ${minutesStr}' ${direction}`
}

const formatLatLng = (value, isLat) => toDDM(value, !isLat)

// GLOBAL LEAFLET REFERENCES
let mapInstance = null
let toolsLayer = null
let tempDrawingLayer = null
let sapLayerGroup = null
let trackHistoryLayer = null
let replayLayer = null
let driftLayerGroup = null
let layerMSRRInstance = null
let layerPelantarInstance = null
let layerSeaMapInstance = null
let baseLayers = {}
let sruMarkersOnMap = {}
let sruCspLinesOnMap = {}
let trackHistoryPolylines = {}
let replayMarkers = {}
let presenceChannel = null
let telemetrySubscription = null
let replayTimer = null
let driftPlayTimer = null
let driftImageOverlay = null
let driftDistressMarker = null
let driftPeakMarker = null

// PENJEJAK KOORDINAT TETIKUS & ALATAN MELUKIS
const currentLat = ref("00° 00.00' N")
const currentLng = ref("000° 00.00' E")
const activeTool = ref(null)
const isDeleteMode = ref(false)
const drawingStartPoint = ref(null)
const isDrawing = ref(false)

// DATA OPERASI
const activeRightSidebarTab = ref('active')
const activeLeftPanelTab = ref('sap')
const isLeftPanelVisible = ref(true)
const senaraiKes = ref([])
const selectedCaseId = ref('ALL')
const senaraiMasterSRU = ref([])
const telemetriRealtime = ref([])
const senaraiSruSejarah = ref([])
const senaraiMesejChat = ref([])
const inputMesejBaru = ref('')
const showLoadCaseModal = ref(false)
const showAddCaseModal = ref(false)
const showDeleteModal = ref(false)
const sruTargetToPadam = ref(null)
const formAddKes = ref({ case_no: '', case_name: '', search_object: '' })

// PENAPIS MASA SEJARAH (TRACK HISTORY FILTERS)
const filterMasaMula = ref('')
const filterMasaTamat = ref('')
const isMengecasSejarah = ref(false)
const totalLoadedPoints = computed(() => {
  return senaraiSruSejarah.value
    .filter(s => s.isChecked)
    .reduce((acc, s) => acc + (s.coords ? s.coords.length : 0), 0)
})

// MAP TOOLS & LAYERS CONTROLS
const teksCarianPeta = ref('')
const isLayerMenuOpen = ref(false)
const showLayerMSRR = ref(false)
const showLayerPelantar = ref(false)
const showOpenSeaMap = ref(false)
const selectedBaseLayer = ref('osm')

// TIMELINE & REPLAY STATE
const isTimelineOpen = ref(false)
const isPlaying = ref(false)
const playbackSpeed = ref(1)
const timelinePoints = ref([])
const currentTimelineIndex = ref(0)
const currentTimelineTime = ref('')

// DRIFT & SIMULATION STATE
const driftSimData = ref(null)
const driftFileName = ref('')
const isDriftPlaying = ref(false)
const currentDriftStep = ref(0)
const driftPlaySpeed = ref(1)
const driftSimTimeStr = ref('')
const senaraiFailSimulasi = ref([])
const simulasiAktifId = ref(null)

const paparanSimulasiKesAktif = computed(() => {
  if (!senaraiFailSimulasi.value || senaraiFailSimulasi.value.length === 0) return []
  const idKesAktifWilayah = senaraiKesAktifSahaja.value.map(k => String(k.id))
  const targetId = String(selectedCaseId.value || 'ALL')

  if (targetId === 'ALL') {
    return senaraiFailSimulasi.value.filter(s => s.caseId === 'ALL' || !s.caseId || idKesAktifWilayah.includes(String(s.caseId)))
  }
  return senaraiFailSimulasi.value.filter(s => String(s.caseId) === targetId || s.caseId === 'ALL' || !s.caseId)
})

// WARNA-WARNA TEMA
const warnaTrekSRU = ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#3b82f6', '#f43f5e', '#14b8a6', '#eab308']
const warnaSearchArea = ['#dc2626', '#2563eb', '#9333ea', '#ea580c', '#16a34a']

// ============================================================================
// 1. PRESENCE (STATUS PENGGUNA DALAM TALIAN)
// ============================================================================
const mulakanPresence = () => {
  if (activeStation.value && activeStation.value !== 'Admin System') {
    if (!onlineUsers.value.includes(activeStation.value)) {
      onlineUsers.value.push(activeStation.value)
    }
  }

  if (presenceChannel) {
    try { supabase.removeChannel(presenceChannel) } catch (e) {}
  }

  presenceChannel = supabase.channel('online-users', {
    config: { presence: { key: activeStation.value || 'guest' } }
  })

  const kemaskiniStatePresence = () => {
    const state = presenceChannel.presenceState()
    const active = new Set()
    if (activeStation.value && activeStation.value !== 'Admin System') {
      active.add(activeStation.value)
    }
    for (const id in state) {
      const presences = state[id]
      if (Array.isArray(presences)) {
        presences.forEach(p => {
          if (p?.station && p.station !== 'Admin System') {
            active.add(p.station)
          }
        })
      }
    }
    onlineUsers.value = Array.from(active)
  }

  presenceChannel
    .on('presence', { event: 'sync' }, kemaskiniStatePresence)
    .on('presence', { event: 'join' }, kemaskiniStatePresence)
    .on('presence', { event: 'leave' }, kemaskiniStatePresence)
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED' && activeStation.value && activeStation.value !== 'Admin System') {
        try {
          await presenceChannel.track({ station: activeStation.value, online_at: new Date().toISOString() })
        } catch (err) {
          console.warn("Gagal track presence:", err)
        }
      }
    })
}

// ============================================================================
// 2. PENAPISAN TELEMETRI AKTIF (MEMBUANG SRU LAMA & OFFLINE)
// ============================================================================
const HAD_MASA_TELEMETRI_MINIT = 5

const semakAdakahTelemetriAktif = (t) => {
  if (!t) return false
  if (t.status === 'offline' || t.is_online === false || t.is_active === false) return false
  const lat = parseFloat(t.latitude)
  const lng = parseFloat(t.longitude)
  if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return false

  const tsStr = t.updated_at || t.timestamp || t.created_at || t.time
  if (tsStr) {
    const timeMs = new Date(tsStr).getTime()
    if (!isNaN(timeMs) && (Date.now() - timeMs) / (1000 * 60) > HAD_MASA_TELEMETRI_MINIT) {
      return false
    }
  }
  return true
}

const muatTurunTelemetri = async () => {
  try {
    const { data, error } = await supabase.from('sru_telemetry').select('*')
    if (!error && data) {
      telemetriRealtime.value = data.filter(t => semakAdakahTelemetriAktif(t))
      kemaskiniMarkerSRUAtasPeta()
    }
  } catch (err) {
    console.error("Ralat muatTurunTelemetri:", err)
  }
}

const cuciSemuaTelemetriOffline = async () => {
  if (!confirm("Padam SEMUA rekod telemetri radar offline dari pangkalan data? Aset yang sedang aktif memancar akan terus muncul semula.")) return
  try {
    const { error } = await supabase.from('sru_telemetry').delete().neq('id', 0)
    if (!error) {
      telemetriRealtime.value = []
      kemaskiniMarkerSRUAtasPeta()
      alert("Pangkalan data telemetri telah dibersihkan.")
    }
  } catch (e) {
    console.error("Ralat cuci telemetri:", e)
  }
}

setInterval(() => {
  if (telemetriRealtime.value.length > 0) {
    const asal = telemetriRealtime.value.length
    telemetriRealtime.value = telemetriRealtime.value.filter(t => semakAdakahTelemetriAktif(t))
    if (telemetriRealtime.value.length !== asal) {
      kemaskiniMarkerSRUAtasPeta()
    }
  }
}, 15000)

const kemaskiniMarkerSRUAtasPeta = () => {
  if (!mapInstance) return
  const sruAktifId = telemetriRealtime.value.map(t => String(t.id))
  const sruAktifBoatId = telemetriRealtime.value.map(t => String(t.boat_id))

  Object.keys(sruMarkersOnMap).forEach(idKey => {
    const isStillActive = sruAktifId.includes(String(idKey)) || sruAktifBoatId.includes(String(idKey))
    if (!isStillActive) {
      if (sruMarkersOnMap[idKey]) {
        mapInstance.removeLayer(sruMarkersOnMap[idKey])
        delete sruMarkersOnMap[idKey]
      }
      if (sruCspLinesOnMap[idKey]) {
        mapInstance.removeLayer(sruCspLinesOnMap[idKey])
        delete sruCspLinesOnMap[idKey]
      }
    }
  })

  telemetriRealtime.value.forEach(tele => {
    const lat = parseFloat(tele.latitude)
    const lng = parseFloat(tele.longitude)
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return

    const currentPos = L.latLng(lat, lng)
    const key = tele.boat_id || tele.id

    if (!sruMarkersOnMap[key]) {
      const newMarker = L.circleMarker(currentPos, {
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 1,
        radius: 6,
        weight: 2
      }).addTo(mapInstance)

      newMarker.bindTooltip(`🛥️ SRU: <b>${tele.boat_id}</b><br>⚡ Kelajuan: ${tele.speed || '0.0'} kts<br>🧭 Arah: ${tele.course ? tele.course + '°' : '---'}`, { direction: 'top' })
      sruMarkersOnMap[key] = newMarker
    } else {
      sruMarkersOnMap[key].setLatLng(currentPos)
      sruMarkersOnMap[key].setTooltipContent(`🛥️ SRU: <b>${tele.boat_id}</b><br>⚡ Kelajuan: ${tele.speed || '0.0'} kts<br>🧭 Arah: ${tele.course ? tele.course + '°' : '---'}`)
    }
  })
}

const langganTelemetriMMEA = () => {
  if (telemetrySubscription) supabase.removeChannel(telemetrySubscription)
  telemetrySubscription = supabase
    .channel('sru_status_live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sru_telemetry' }, payload => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        if (!semakAdakahTelemetriAktif(payload.new)) {
          telemetriRealtime.value = telemetriRealtime.value.filter(t => !(t.id === payload.new.id || (payload.new.boat_id && t.boat_id === payload.new.boat_id)))
        } else {
          const idx = telemetriRealtime.value.findIndex(t => (payload.new.id && t.id === payload.new.id) || (payload.new.boat_id && t.boat_id === payload.new.boat_id))
          if (idx !== -1) telemetriRealtime.value[idx] = payload.new
          else telemetriRealtime.value.push(payload.new)
        }
      } else if (payload.eventType === 'DELETE') {
        telemetriRealtime.value = telemetriRealtime.value.filter(t => t.id !== payload.old?.id && t.boat_id !== payload.old?.boat_id)
      }
      kemaskiniMarkerSRUAtasPeta()
    })
    .subscribe()
}

// ============================================================================
// 3. COMPUTED PENAPISAN KES & SRU
// ============================================================================
const senaraiKesAktifSahaja = computed(() => {
  if (!senaraiKes.value || !Array.isArray(senaraiKes.value)) return []
  if (activeStation.value === 'MRCC Putrajaya' || activeStation.value === 'Admin System' || !activeRegion.value || activeRegion.value === 'NASIONAL' || activeRegion.value === 'GLOBAL') {
    return senaraiKes.value.filter(k => (k.status || '').toLowerCase() === 'active')
  }
  const regUser = activeRegion.value.toUpperCase().trim()
  return senaraiKes.value.filter(k => {
    const s = (k.status || '').toLowerCase().trim()
    const r = (k.region || '').toUpperCase().trim()
    return s === 'active' && (r === regUser || r.includes(regUser) || regUser.includes(r))
  })
})

const paparanSRUKesAktif = computed(() => {
  if (!senaraiMasterSRU.value || senaraiMasterSRU.value.length === 0) return []
  const idKesAktifWilayah = senaraiKesAktifSahaja.value.map(k => String(k.id))
  const targetId = String(selectedCaseId.value || 'ALL')

  if (targetId === 'ALL') {
    return senaraiMasterSRU.value.filter(s => idKesAktifWilayah.includes(String(s.caseId)))
  }

  return senaraiMasterSRU.value.filter(s => String(s.caseId) === targetId)
})

const filteredMesejChat = computed(() => senaraiMesejChat.value)

// ============================================================================
// ============================================================================
const initMap = async () => {
  let mapEl = document.getElementById('map')
  let retries = 0
  while (!mapEl && retries < 30) {
    await new Promise(r => setTimeout(r, 50))
    mapEl = document.getElementById('map')
    retries++
  }
  if (!mapEl) return

  if (mapInstance) {
    try { mapInstance.remove() } catch (e) {}
    mapInstance = null
  }

  mapInstance = L.map('map', { zoomControl: false }).setView([4.2, 109.5], 5)

  baseLayers = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapInstance),
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 })
  }
  layerSeaMapInstance = L.tileLayer('https://tiles.openseamap.org/seamap/{z}/{x}/{y}.png', { maxZoom: 18 })

  const msrrBarat = L.polyline([[6.4333, 100.1333], [6.5, 99.0], [7.25, 98.0], [10.0, 96.5], [6.0, 97.5], [1.28, 103.6], [6.23, 102.11]], { color: 'blue', weight: 2, dashArray: '5, 5' })
  const msrrTimur = L.polyline([[2.0833, 109.6467], [6.28, 109.63], [10.0, 111.5], [7.68, 118.0], [4.16, 117.89]], { color: 'red', weight: 2, dashArray: '5, 5' })
  layerMSRRInstance = L.layerGroup([msrrBarat, msrrTimur])
  layerPelantarInstance = L.layerGroup([L.polyline([[6.3, 99.4], [1.14, 103.5], [6.45, 102.16]], { color: 'green', weight: 2 })])

  toolsLayer = L.featureGroup().addTo(mapInstance)
  tempDrawingLayer = L.layerGroup().addTo(mapInstance)
  sapLayerGroup = L.layerGroup().addTo(mapInstance)
  trackHistoryLayer = L.layerGroup().addTo(mapInstance)
  replayLayer = L.layerGroup().addTo(mapInstance)
  driftLayerGroup = L.layerGroup().addTo(mapInstance)

  mapInstance.on('mousemove', (e) => {
    if (e && e.latlng) {
      currentLat.value = toDDM(e.latlng.lat, false)
      currentLng.value = toDDM(e.latlng.lng, true)

      if (drawingStartPoint.value && activeTool.value) {
        tempDrawingLayer.clearLayers()
        if (activeTool.value === 'circle') {
          L.circle(drawingStartPoint.value, { radius: drawingStartPoint.value.distanceTo(e.latlng), color: '#38bdf8', weight: 2, fillOpacity: 0.2 }).addTo(tempDrawingLayer)
        } else if (activeTool.value === 'rect') {
          L.rectangle([drawingStartPoint.value, e.latlng], { color: '#fbbf24', weight: 2, fillOpacity: 0.2 }).addTo(tempDrawingLayer)
        } else if (activeTool.value === 'line') {
          L.polyline([drawingStartPoint.value, e.latlng], { color: '#ef4444', weight: 3 }).addTo(tempDrawingLayer)
        }
      }
    }
  })

  mapInstance.on('click', (e) => {
    if (isDeleteMode.value || !activeTool.value) return
    const latlng = e.latlng

    if (activeTool.value === 'marker') {
      const coordText = `${toDDM(latlng.lat, false)} | ${toDDM(latlng.lng, true)}`
      const m = L.marker(latlng).bindPopup(`📍 ${coordText}`).addTo(toolsLayer).openPopup()
      m.on('click', (ev) => { if (isDeleteMode.value) toolsLayer.removeLayer(m) })
      aktifkanTool(null)
      return
    }

    if (activeTool.value === 'text') {
      const txt = prompt("Catatan teks carta:")
      if (txt && txt.trim()) {
        const t = L.marker(latlng, {
          icon: L.divIcon({ html: `<div style="background:rgba(15,23,42,0.92); color:#fff; padding:3px 8px; border:1.5px dashed #38bdf8; border-radius:4px; font-size:11px; white-space:nowrap; box-shadow:0 3px 8px rgba(0,0,0,0.6);">📝 ${txt.trim()}</div>`, className: 'custom-label' })
        }).addTo(toolsLayer)
        t.on('click', () => { if (isDeleteMode.value) toolsLayer.removeLayer(t) })
      }
      aktifkanTool(null)
      return
    }

    if (!drawingStartPoint.value) {
      drawingStartPoint.value = latlng
      isDrawing.value = true
    } else {
      const startPt = drawingStartPoint.value
      const endPt = latlng
      let shape = null

      if (activeTool.value === 'circle') {
        const rad = startPt.distanceTo(endPt)
        shape = L.circle(startPt, { radius: rad, color: '#38bdf8', weight: 2, fillOpacity: 0.25 })
          .bindPopup(`⭕ Jejari: ${(rad/1852).toFixed(2)} NM (${(rad/1000).toFixed(2)} KM)`)
          .addTo(toolsLayer)
      } else if (activeTool.value === 'rect') {
        shape = L.rectangle([startPt, endPt], { color: '#fbbf24', weight: 2, fillOpacity: 0.25 }).addTo(toolsLayer)
      } else if (activeTool.value === 'line') {
        shape = L.polyline([startPt, endPt], { color: '#ef4444', weight: 3 })
          .bindPopup(`📏 Jarak: ${(startPt.distanceTo(endPt)/1852).toFixed(2)} NM`)
          .addTo(toolsLayer)
      }

      if (shape) {
        shape.on('click', () => { if (isDeleteMode.value) toolsLayer.removeLayer(shape) })
      }

      drawingStartPoint.value = null
      isDrawing.value = false
      tempDrawingLayer.clearLayers()
      aktifkanTool(null)
    }
  })

  mapInstance.invalidateSize()
}

const aktifkanTool = (tool) => {
  if (isDeleteMode.value) isDeleteMode.value = false
  activeTool.value = activeTool.value === tool ? null : tool
  drawingStartPoint.value = null
  isDrawing.value = false
  if (tempDrawingLayer) tempDrawingLayer.clearLayers()
}

const toggleDeleteMode = () => {
  isDeleteMode.value = !isDeleteMode.value
  if (isDeleteMode.value) activeTool.value = null
}

const bersihkanLukisan = () => {
  if (toolsLayer) toolsLayer.clearLayers()
  if (tempDrawingLayer) tempDrawingLayer.clearLayers()
  drawingStartPoint.value = null
  activeTool.value = null
  isDeleteMode.value = false
}

const tukarBaseLayer = (jenis) => {
  selectedBaseLayer.value = jenis
  Object.values(baseLayers).forEach(l => { if (mapInstance && mapInstance.hasLayer(l)) mapInstance.removeLayer(l) })
  if (mapInstance && baseLayers[jenis]) baseLayers[jenis].addTo(mapInstance).bringToBack()
}
const togolLayerMSRR = () => { if (mapInstance) showLayerMSRR.value ? mapInstance.addLayer(layerMSRRInstance) : mapInstance.removeLayer(layerMSRRInstance) }
const togolLayerPelantar = () => { if (mapInstance) showLayerPelantar.value ? mapInstance.addLayer(layerPelantarInstance) : mapInstance.removeLayer(layerPelantarInstance) }
const togolOpenSeaMap = () => { if (mapInstance) showOpenSeaMap.value ? mapInstance.addLayer(layerSeaMapInstance) : mapInstance.removeLayer(layerSeaMapInstance) }

const laksanakanCarianPeta = async () => {
  const val = teksCarianPeta.value.trim()
  if (!val || !mapInstance) return
  
  const match = val.match(/^([-+]?\d*\.?\d+)[,\s]+([-+]?\d*\.?\d+)$/)
  if (match) {
    const lat = parseFloat(match[1])
    const lon = parseFloat(match[2])
    if (!isNaN(lat) && !isNaN(lon)) {
      mapInstance.flyTo([lat, lon], 11)
      L.marker([lat, lon]).addTo(toolsLayer).bindPopup(`📍 Carian: ${val}`).openPopup()
      return
    }
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`)
    const data = await res.json()
    if (data && data.length > 0) {
      mapInstance.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 11)
      L.marker([parseFloat(data[0].lat), parseFloat(data[0].lon)]).addTo(toolsLayer).bindPopup(`📍 ${data[0].display_name}`).openPopup()
    }
  } catch (e) {}
}

// ============================================================================
// 5. PENJANAAN GRAFIK PELAN SAP KE ATAS PETA
// ============================================================================
const tukarKesTaktikal = () => {
  if (!mapInstance) return
  if (!sapLayerGroup) {
    sapLayerGroup = L.layerGroup().addTo(mapInstance)
  }
  sapLayerGroup.clearLayers()

  const boundsList = []
  const list = paparanSRUKesAktif.value || []

  list.forEach((sru, idx) => {
    const warnaTema = warnaSearchArea[idx % warnaSearchArea.length]

    if (sru.corner_points && Array.isArray(sru.corner_points) && sru.corner_points.length >= 4) {
      const pts = sru.corner_points.filter(p => p !== null && Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]))
      if (pts.length >= 4) {
        const poly = L.polygon(pts, { 
          color: warnaTema, 
          weight: 2.5, 
          fillOpacity: 0.15,
          fillColor: warnaTema 
        }).bindTooltip(`Zon ${sru.kawasanNama || ''} (${sru.nama || ''})`, { direction: 'top' })
        sapLayerGroup.addLayer(poly)
        boundsList.push(poly.getBounds())
      }
    }

    if (sru.sortie_waypoints && Array.isArray(sru.sortie_waypoints) && sru.sortie_waypoints.length > 0) {
      const waypoints = sru.sortie_waypoints.filter(p => p !== null && Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]))
      if (waypoints.length > 0) {
        const polyLine = L.polyline(waypoints, { 
          color: warnaTema, 
          weight: 2.5, 
          dashArray: '6, 6', 
          opacity: 0.95 
        })
        sapLayerGroup.addLayer(polyLine)
        boundsList.push(polyLine.getBounds())
      }
    }

    if (sru.csp_coord && Array.isArray(sru.csp_coord) && !isNaN(sru.csp_coord[0]) && !isNaN(sru.csp_coord[1])) {
      const dotCSP = L.circleMarker(sru.csp_coord, { 
        color: '#ffffff', 
        fillColor: '#ef4444', 
        fillOpacity: 1, 
        radius: 6, 
        weight: 2 
      }).bindTooltip(`📍 CSP ${sru.kawasanNama || ''} (${sru.nama || ''})`, { direction: 'right' })
      sapLayerGroup.addLayer(dotCSP)
      boundsList.push(L.latLngBounds(sru.csp_coord, sru.csp_coord))
    }
  })

  try {
    const validBounds = boundsList.filter(b => b && (typeof b.isValid === 'function' ? b.isValid() : true))
    if (validBounds.length > 0) {
      let combined = validBounds[0]
      for (let i = 1; i < validBounds.length; i++) combined.extend(validBounds[i])
      mapInstance.fitBounds(combined, { padding: [50, 50] })
    } else {
      if (activeStation.value === 'MRCC Putrajaya' || activeStation.value === 'Admin System') mapInstance.setView([4.5, 109.0], 5)
      else if (activeStation.value === 'MRSC Kota Kinabalu' || activeStation.value === 'MRSC Kuching') mapInstance.setView([4.0, 114.0], 7)
      else mapInstance.setView([3.85, 103.5], 7)
    }
  } catch (err) {
    console.warn("Ralat fitBounds:", err)
  }
}

// ============================================================================
// 6. ENJIN PEMBACA FAIL SAROPS (TXT, GPX, KML)
// ============================================================================
const ekstrakSatuKoordinat = (teks) => {
  if (!teks) return null
  const matchPC = teks.match(/(\d{1,2})-([\d\.]+)([NS])\s+(\d{1,3})-([\d\.]+)([EW])/)
  const matchWeb = teks.match(/(\d{1,2})-(\d{2})([NS])\s+(\d{1,3})-(\d{2})([EW])/)

  if (matchPC) {
    let lat = parseInt(matchPC[1]) + parseFloat(matchPC[2]) / 60
    if (matchPC[3] === 'S') lat = -lat
    let lon = parseInt(matchPC[4]) + parseFloat(matchPC[5]) / 60
    if (matchPC[6] === 'W') lon = -lon
    return [lat, lon]
  } else if (matchWeb) {
    let lat = parseInt(matchWeb[1]) + parseInt(matchWeb[2]) / 60
    if (matchWeb[3] === 'S') lat = -lat
    let lon = parseInt(matchWeb[4]) + parseInt(matchWeb[2]) / 60
    if (matchWeb[6] === 'W') lon = -lon
    return [lat, lon]
  }
  return null
}

const bacaFailSAROPS = async (event) => {
  if (!selectedCaseId.value || selectedCaseId.value === 'ALL') {
    alert("⚠️ Sila pilih satu kes spesifik terlebih dahulu sebelum memuat naik fail SAROPS!")
    event.target.value = ''
    return
  }

  const files = event.target.files
  if (!files || files.length === 0) return
  const currentActiveCaseId = Number(selectedCaseId.value)

  const promises = []

  for (let f = 0; f < files.length; f++) {
    const file = files[f]
    promises.push((async () => {
      const namaFail = file.name
      const extension = namaFail.split('.').pop().toLowerCase()
      const kandunganRAW = await file.text()

      let garisanLaluan = []
      let pt1 = null, pt2 = null, pt3 = null, pt4 = null
      let koordinatCenter = null, koordinatCSP = null
      let namaSru = 'BOT SAYA'
      let kawasanNama = 'SEARCH AREA'
      let corakPenuh = 'PARALLEL'

      const matchPattern = kandunganRAW.match(/(?:SEARCH PATTERN NAME|PATTERN)[^\:\n]*?\:\s*([^\n\r]+)/i)
      const matchSruId = kandunganRAW.match(/(?:SRU ID|SRU NAME|ASSET)[^\:\n]*?\:\s*([^\n\r]+)/i)
      const matchCaseName = kandunganRAW.match(/(?:CASE NAME|INCIDENT)[^\:\n]*?\:\s*([^\n\r]+)/i)
      const matchZone = kandunganRAW.match(/(?:ZONE|AREA)[^\:\n]*?\:\s*([^\n\r]+)/i)

      let patternField = matchPattern ? matchPattern[1].trim() : ''
      if (patternField.includes(':')) {
        const parts = patternField.split(':')
        kawasanNama = parts[0]?.trim() || 'SEARCH AREA'
        corakPenuh = parts[1]?.trim() || patternField
      } else if (patternField) {
        corakPenuh = patternField
      }

      if (matchSruId) namaSru = matchSruId[1].trim()
      if (matchZone) kawasanNama = matchZone[1].trim()
      if (matchCaseName && !kawasanNama) kawasanNama = matchCaseName[1].trim()

      if (extension === 'gpx') {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(kandunganRAW, "text/xml")
        const route = xmlDoc.getElementsByTagName('rte')[0] || xmlDoc.getElementsByTagName('trk')[0]
        const routeName = route ? route.getElementsByTagName('name')[0]?.textContent || '' : ''
        if (routeName) corakPenuh = routeName
        
        const points = xmlDoc.querySelectorAll('rtept, trkpt')
        for (let i = 0; i < points.length; i++) {
          const lat = parseFloat(points[i].getAttribute('lat'))
          const lon = parseFloat(points[i].getAttribute('lon'))
          if (!isNaN(lat) && !isNaN(lon)) {
            if (i === 0) koordinatCSP = [lat, lon]
            garisanLaluan.push([lat, lon])
          }
        }
      } else if (extension === 'kml') {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(kandunganRAW, "text/xml")
        const descriptions = xmlDoc.getElementsByTagName('description')
        let teksLaporan = ''
        for (let i = 0; i < descriptions.length; i++) {
          if (descriptions[i].textContent.includes('SEARCH PATTERN NAME') || descriptions[i].textContent.includes('SEARCH AREA LENGTH')) {
            teksLaporan = descriptions[i].textContent
            break
          }
        }

        if (teksLaporan) {
          koordinatCenter = ekstrakSatuKoordinat(teksLaporan.match(/CENTER\s*:\s*([^\n\r]+)/)?.[1])
          koordinatCSP = ekstrakSatuKoordinat(teksLaporan.match(/CSP\s*:\s*([^\n\r]+)/)?.[1])
          pt1 = ekstrakSatuKoordinat(teksLaporan.match(/CORNER PT\s*#1\s*:\s*([^\n\r]+)/)?.[1])
          pt2 = ekstrakSatuKoordinat(teksLaporan.match(/CORNER PT\s*#2\s*:\s*([^\n\r]+)/)?.[1])
          pt3 = ekstrakSatuKoordinat(teksLaporan.match(/CORNER PT\s*#3\s*:\s*([^\n\r]+)/)?.[1])
          pt4 = ekstrakSatuKoordinat(teksLaporan.match(/CORNER PT\s*#4\s*:\s*([^\n\r]+)/)?.[1])
        }

        const lineStrings = xmlDoc.getElementsByTagName('LineString')
        for (let j = 0; j < lineStrings.length; j++) {
          const coordsText = lineStrings[j].getElementsByTagName('coordinates')[0]?.textContent?.trim()
          if (!coordsText) continue
          const points = coordsText.split(/\s+/)
          const path = []
          points.forEach(pt => {
            const [lon, lat] = pt.split(',')
            if (lat && lon) path.push([parseFloat(lat), parseFloat(lon)])
          })
          if (path.length > garisanLaluan.length) garisanLaluan = path
        }
      } else if (extension === 'txt') {
        const baris = kandunganRAW.split('\n')
        let bacaWaypoints = false
        baris.forEach(line => {
          const cleanLine = line.trim().replace('\r', '')
          if (cleanLine.includes('CENTER')) koordinatCenter = ekstrakSatuKoordinat(cleanLine)
          else if (cleanLine.includes('CORNER PT #1')) pt1 = ekstrakSatuKoordinat(cleanLine)
          else if (cleanLine.includes('CORNER PT #2')) pt2 = ekstrakSatuKoordinat(cleanLine)
          else if (cleanLine.includes('CORNER PT #3')) pt3 = ekstrakSatuKoordinat(cleanLine)
          else if (cleanLine.includes('CORNER PT #4')) pt4 = ekstrakSatuKoordinat(cleanLine)
          else if (cleanLine.includes('CSP')) koordinatCSP = ekstrakSatuKoordinat(cleanLine)

          if (cleanLine.toUpperCase().includes('WAYPOINT LIST') || cleanLine.toUpperCase().includes('SORTIE DETAILS')) {
            bacaWaypoints = true
          }
          if (bacaWaypoints) {
            const matchWpBaris = cleanLine.match(/^\s*(\d+|WP\s*\d+)\s+/i)
            if (matchWpBaris) {
              const kl = ekstrakSatuKoordinat(cleanLine)
              if (kl) garisanLaluan.push(kl)
            }
          }
        })
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
        search_pattern: corakPenuh
      }])
    })())
  }

  try {
    await Promise.all(promises)
    await recallPlanDariSupabase()
    tukarKesTaktikal()
  } catch (err) {
    console.error("Ralat memproses fail SAROPS:", err)
  } finally {
    event.target.value = ''
  }
}

const bukaPopUpPadam = (sru) => {
  sruTargetToPadam.value = sru
  showDeleteModal.value = true
}

const sahkanPadamSRU = async () => {
  if (sruTargetToPadam.value) {
    await supabase.from('sar_plans').delete().eq('id', sruTargetToPadam.value.id)
    await recallPlanDariSupabase()
  }
  showDeleteModal.value = false
  sruTargetToPadam.value = null
}

// ============================================================================
// 7. SIMULATION (.NC NETCDF-4 / HDF5) & PEMAIN SIMULASI
// ============================================================================

// Helper IndexedDB untuk menyimpan fail simulasi .nc secara kekal dalam pelayar
const DB_NAME = 'SMC_SAR_NC_DB'
const DB_VERSION = 1
const STORE_SIM = 'simulations_data'

const bukaDBSimulasi = () => {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = (e) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains(STORE_SIM)) {
          db.createObjectStore(STORE_SIM, { keyPath: 'id' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
    } catch (e) {
      resolve(null)
    }
  })
}

const simpanSimulasiKeIndexedDB = async (simObj) => {
  try {
    const db = await bukaDBSimulasi()
    if (!db) return
    const tx = db.transaction(STORE_SIM, 'readwrite')
    const store = tx.objectStore(STORE_SIM)
    store.put(simObj)
  } catch (e) {
    console.warn("Ralat simpan simulasi ke IndexedDB:", e)
  }
}

const padamSimulasiDariIndexedDB = async (id) => {
  try {
    const db = await bukaDBSimulasi()
    if (!db) return
    const tx = db.transaction(STORE_SIM, 'readwrite')
    const store = tx.objectStore(STORE_SIM)
    store.delete(id)
  } catch (e) {
    console.warn("Ralat padam simulasi dari IndexedDB:", e)
  }
}

const muatSemuaSimulasiDariIndexedDB = async () => {
  try {
    const db = await bukaDBSimulasi()
    if (!db) return []
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_SIM, 'readonly')
      const store = tx.objectStore(STORE_SIM)
      const req = store.getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => resolve([])
    })
  } catch (e) {
    console.warn("Ralat muat fail simulasi:", e)
    return []
  }
}

// Fungsi menukar nilai masa dalam dataset fail .nc kepada bentuk waktu (pukul berapa cth: 14:30:00)
const kiraWaktuSebenarSimulasi = (simData, stepIndex) => {
  if (!simData) return ''
  const rawTimes = simData.rawTimes
  if (rawTimes && Array.isArray(rawTimes) && rawTimes.length > stepIndex) {
    const t = rawTimes[stepIndex]
    if (typeof t === 'number' && !isNaN(t)) {
      let dateObj = null
      if (t > 1e11) dateObj = new Date(t) // milliseconds
      else if (t > 1e8) dateObj = new Date(t * 1000) // seconds
      if (dateObj && !isNaN(dateObj.getTime())) {
        return dateObj.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      }
    } else if (typeof t === 'string' && t.trim()) {
      const d = new Date(t)
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      }
      return t
    }
  }

  // Fallback: jam berasaskan waktu permulaan 08:00:00 + langkah 20 minit
  const baseDate = new Date()
  baseDate.setHours(8, 0, 0, 0)
  baseDate.setMinutes(baseDate.getMinutes() + (stepIndex * 20))
  return baseDate.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

const bacaFailDriftNC = async (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return

  for (let f = 0; f < files.length; f++) {
    const file = files[f]
    try {
      const arrayBuffer = await file.arrayBuffer()
      const parsedData = await readFullSARSimulation(arrayBuffer)
      
      const newSim = {
        id: Date.now() + Math.floor(Math.random() * 1000) + f,
        caseId: selectedCaseId.value || 'ALL',
        fileName: file.name,
        simData: parsedData,
        uploadTime: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
        numParticles: parsedData.numParticles || 0,
        numTimeSteps: parsedData.numTimeSteps || 0
      }

      // Masukkan ke senarai reactive fail simulasi
      senaraiFailSimulasi.value.push(newSim)

      // Simpan ke IndexedDB secara kekal
      await simpanSimulasiKeIndexedDB(newSim)

      // Aktifkan fail yang baru dimuat naik
      pilihSimulasiUntukMain(newSim)
    } catch (err) {
      alert(`Ralat memuatkan fail ${file.name}: ${err.message || 'Format fail tidak sah'}`)
    }
  }

  event.target.value = ''
}

const pilihSimulasiUntukMain = (sim) => {
  if (!sim || !sim.simData) return
  if (driftPlayTimer) clearInterval(driftPlayTimer)
  
  simulasiAktifId.value = sim.id
  driftSimData.value = sim.simData
  driftFileName.value = sim.fileName
  currentDriftStep.value = 0
  isDriftPlaying.value = false
  
  kemaskiniPaparanDrift(0, true)
}

const padamFailSimulasi = async (sim) => {
  senaraiFailSimulasi.value = senaraiFailSimulasi.value.filter(s => s.id !== sim.id)
  await padamSimulasiDariIndexedDB(sim.id)
  if (simulasiAktifId.value === sim.id) {
    tutupDriftSimulasi()
  }
}

const kemaskiniPaparanDrift = (stepIndex, autoFit = false) => {
  if (!driftSimData.value || !mapInstance) return
  if (!driftLayerGroup) driftLayerGroup = L.layerGroup().addTo(mapInstance)

  const stepData = computeTimeStepPOC(driftSimData.value, stepIndex)
  currentDriftStep.value = stepIndex
  
  // Format masa dalam bentuk waktu (pukul berapa)
  driftSimTimeStr.value = kiraWaktuSebenarSimulasi(driftSimData.value, stepIndex)

  const imgUrl = renderPOCToCanvasDataURL(stepData.grid, stepData.maxDensity)
  const bounds = stepData.bounds

  if (driftImageOverlay) driftLayerGroup.removeLayer(driftImageOverlay)
  driftImageOverlay = L.imageOverlay(imgUrl, bounds, { opacity: 0.85, interactive: false }).addTo(driftLayerGroup)

  if (stepData.distressPos && !driftDistressMarker) {
    const dPos = [stepData.distressPos.lat, stepData.distressPos.lon]
    const lkpIcon = L.divIcon({
      html: `<div style="background:rgba(220,38,38,0.95); color:#fff; font-size:11px; font-weight:900; padding:2px 6px; border-radius:4px; border:1.5px solid #fff; white-space:nowrap; transform:translateY(-14px);">🚨 LKP / DATUM</div>`,
      className: 'custom-label',
      iconAnchor: [40, 0]
    })
    driftDistressMarker = L.marker(dPos, { icon: lkpIcon }).addTo(driftLayerGroup)
  }

  if (stepData.peakPOC) {
    const peakPos = [stepData.peakPOC.lat, stepData.peakPOC.lon]
    if (driftPeakMarker) {
      driftPeakMarker.setLatLng(peakPos)
    } else {
      const peakIcon = L.divIcon({
        html: `<div style="background:rgba(234,179,8,0.95); color:#000; font-size:10px; font-weight:900; padding:2px 6px; border-radius:4px; border:1.5px solid #fff; white-space:nowrap; transform:translateY(-14px);">⭐ PEAK POC</div>`,
        className: 'custom-label',
        iconAnchor: [35, 0]
      })
      driftPeakMarker = L.marker(peakPos, { icon: peakIcon }).addTo(driftLayerGroup)
    }
  }

  if (autoFit && bounds && mapInstance) mapInstance.fitBounds(bounds, { padding: [40, 40] })
}

const togglePlayDrift = () => {
  if (!driftSimData.value) return
  isDriftPlaying.value = !isDriftPlaying.value

  if (isDriftPlaying.value) {
    if (currentDriftStep.value >= driftSimData.value.numTimeSteps - 1) currentDriftStep.value = 0
    const intervalMs = Math.max(100, Math.floor(400 / driftPlaySpeed.value))
    driftPlayTimer = setInterval(() => {
      if (currentDriftStep.value < driftSimData.value.numTimeSteps - 1) {
        currentDriftStep.value++
        kemaskiniPaparanDrift(currentDriftStep.value)
      } else {
        isDriftPlaying.value = false
        clearInterval(driftPlayTimer)
      }
    }, intervalMs)
  } else {
    if (driftPlayTimer) clearInterval(driftPlayTimer)
  }
}

const tutupDriftSimulasi = () => {
  if (driftPlayTimer) clearInterval(driftPlayTimer)
  isDriftPlaying.value = false
  driftSimData.value = null
  driftFileName.value = ''
  simulasiAktifId.value = null
  currentDriftStep.value = 0
  if (driftLayerGroup) driftLayerGroup.clearLayers()
  driftImageOverlay = null
  driftDistressMarker = null
  driftPeakMarker = null
}

// ============================================================================
// 8. SEJARAH PERGERAKAN & REPLAY TIMELINE PLAYBACK (ASET TRANSMIT MOBILE)
// ============================================================================

// Kemaskini senarai aset yang pernah transmit location menggunakan apps mobile di bawah KES AKTIF
const kemaskiniSenaraiAsetKes = async () => {
  try {
    const asetUnik = new Set()

    // 1. Tentukan senarai ID kes aktif yang dibenarkan (bukan kes accomplished/lapuk)
    const idKesAktifList = senaraiKesAktifSahaja.value.map(k => Number(k.id)).filter(id => !isNaN(id) && id > 0)
    
    let idSasaranKes = []
    if (selectedCaseId.value === 'ALL' || !selectedCaseId.value) {
      idSasaranKes = idKesAktifList
    } else {
      idSasaranKes = [Number(selectedCaseId.value)]
    }

    if (idSasaranKes.length > 0) {
      // Dapatkan senarai bot_id unik dari rekod track history HANYA untuk kes aktif sasaran
      const { data, error } = await supabase
        .from('sru_track_history')
        .select('boat_id, case_id')
        .in('case_id', idSasaranKes)

      if (!error && data) {
        data.forEach(r => {
          if (r.boat_id && r.boat_id.trim()) {
            asetUnik.add(r.boat_id.trim().toUpperCase())
          }
        })
      }
    }

    // 2. Semak juga bot yang sedang transmit secara live dalam telemetri realtime di bawah kes aktif
    telemetriRealtime.value.forEach(t => {
      if (t.boat_id && t.boat_id.trim()) {
        const tCaseId = Number(t.case_id)
        if (idSasaranKes.includes(tCaseId) || (selectedCaseId.value === 'ALL' && (!t.case_id || idKesAktifList.includes(tCaseId)))) {
          asetUnik.add(t.boat_id.trim().toUpperCase())
        }
      }
    })

    // Simpan status sedia ada jika aset telah di-load sebelum ini
    const sediaAdaMap = {}
    senaraiSruSejarah.value.forEach(s => {
      sediaAdaMap[s.boat_id.toUpperCase()] = s
    })

    const senaraiBaru = Array.from(asetUnik).map(boat_id => {
      if (sediaAdaMap[boat_id]) {
        return sediaAdaMap[boat_id]
      }
      return {
        boat_id: boat_id,
        points_count: 0,
        coords: [],
        isChecked: true
      }
    })

    senaraiSruSejarah.value = senaraiBaru
    kemaskiniPaparanTrekPeta()
  } catch (err) {
    console.error("Ralat kemaskiniSenaraiAsetKes:", err)
  }
}

const resetFilterMasa = () => {
  filterMasaMula.value = ''
  filterMasaTamat.value = ''
}

// Fungsi memuat turun SEMUA titik track history tanpa had (Unlimited Pagination Loop)
const muatTurunSejarahSRU = async () => {
  if (senaraiSruSejarah.value.length === 0) {
    await kemaskiniSenaraiAsetKes()
  }

  const targetBoatIds = senaraiSruSejarah.value
    .filter(s => s.isChecked)
    .map(s => s.boat_id)

  if (targetBoatIds.length === 0) {
    alert("⚠️ Sila tandakan (tick) sekurang-kurangnya satu aset untuk dimuat turun.")
    return
  }

  isMengecasSejarah.value = true
  try {
    const idKesAktifList = senaraiKesAktifSahaja.value.map(k => Number(k.id)).filter(id => !isNaN(id) && id > 0)
    let idSasaranKes = []
    if (selectedCaseId.value === 'ALL' || !selectedCaseId.value) {
      idSasaranKes = idKesAktifList
    } else {
      idSasaranKes = [Number(selectedCaseId.value)]
    }

    const BATCH_SIZE = 1000
    let allPoints = []
    let from = 0
    let hasMore = true

    while (hasMore) {
      let query = supabase
        .from('sru_track_history')
        .select('*')
        .in('boat_id', targetBoatIds)

      if (idSasaranKes.length > 0) {
        query = query.in('case_id', idSasaranKes)
      }

      if (filterMasaMula.value) {
        query = query.gte('created_at', new Date(filterMasaMula.value).toISOString())
      }
      if (filterMasaTamat.value) {
        query = query.lte('created_at', new Date(filterMasaTamat.value).toISOString())
      }

      query = query.order('created_at', { ascending: true }).range(from, from + BATCH_SIZE - 1)

      const { data, error } = await query

      if (error) {
        console.error("Ralat muat turun batch:", error)
        alert("Ralat memuat turun sejarah pergerakan: " + error.message)
        break
      }

      if (data && data.length > 0) {
        allPoints = allPoints.concat(data)
        if (data.length < BATCH_SIZE) {
          hasMore = false
        } else {
          from += BATCH_SIZE
        }
      } else {
        hasMore = false
      }
    }

    // Agregat koordinat mengikut boat_id
    const ptsByBoat = {}
    targetBoatIds.forEach(id => { ptsByBoat[id.toUpperCase()] = [] })

    allPoints.forEach(r => {
      const bId = (r.boat_id || '').toUpperCase()
      if (ptsByBoat[bId]) {
        const lat = parseFloat(r.latitude)
        const lng = parseFloat(r.longitude)
        if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
          ptsByBoat[bId].push({
            lat,
            lng,
            time: r.created_at || r.timestamp || r.time,
            boat_id: r.boat_id
          })
        }
      }
    })

    // Kemaskini setiap aset yang ditandakan
    senaraiSruSejarah.value.forEach(s => {
      const bId = s.boat_id.toUpperCase()
      if (s.isChecked && ptsByBoat[bId]) {
        s.coords = ptsByBoat[bId]
        s.points_count = ptsByBoat[bId].length
      }
    })

    kemaskiniPaparanTrekPeta()
  } catch (err) {
    console.error("Ralat muatTurunSejarahSRU:", err)
  } finally {
    isMengecasSejarah.value = false
  }
}

const kemaskiniPaparanTrekPeta = () => {
  if (!trackHistoryLayer) return
  trackHistoryLayer.clearLayers()
  senaraiSruSejarah.value.forEach((sru, idx) => {
    if (sru.isChecked && sru.coords && sru.coords.length > 0) {
      const latLngs = sru.coords.map(c => [c.lat, c.lng])
      const color = warnaTrekSRU[idx % warnaTrekSRU.length]
      L.polyline(latLngs, { color: color, weight: 3, opacity: 0.85 }).addTo(trackHistoryLayer)
      
      const startPt = latLngs[0]
      const endPt = latLngs[latLngs.length - 1]
      L.circleMarker(startPt, { radius: 4, color: color, fillColor: '#ffffff', fillOpacity: 1 }).addTo(trackHistoryLayer)
      L.circleMarker(endPt, { radius: 6, color: color, fillColor: color, fillOpacity: 1 }).addTo(trackHistoryLayer)
    }
  })
}

const bukaTimelinePlayback = () => {
  const pts = []
  senaraiSruSejarah.value.forEach(sru => {
    if (sru.isChecked && sru.coords && sru.coords.length > 0) {
      pts.push(...sru.coords)
    }
  })

  if (pts.length === 0) {
    alert("⚠️ Tiada titik koordinat dimuat turun untuk dimainkan. Sila tekan '📥 Muat Turun Rekod (Load Track)' terlebih dahulu.")
    return
  }

  pts.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  timelinePoints.value = pts
  currentTimelineIndex.value = 0
  isTimelineOpen.value = true
  kemaskiniFrameReplay()
}

const togglePlayReplay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    if (currentTimelineIndex.value >= timelinePoints.value.length - 1) {
      currentTimelineIndex.value = 0
    }
    const intervalMs = Math.max(50, Math.floor(300 / playbackSpeed.value))
    replayTimer = setInterval(() => {
      if (currentTimelineIndex.value < timelinePoints.value.length - 1) {
        currentTimelineIndex.value++
      } else {
        isPlaying.value = false
        clearInterval(replayTimer)
      }
      kemaskiniFrameReplay()
    }, intervalMs)
  } else {
    if (replayTimer) clearInterval(replayTimer)
  }
}

const resetReplay = () => {
  if (replayTimer) clearInterval(replayTimer)
  isPlaying.value = false
  currentTimelineIndex.value = 0
  kemaskiniFrameReplay()
}

const kemaskiniFrameReplay = () => {
  if (!replayLayer || timelinePoints.value.length === 0) return
  const cur = timelinePoints.value[currentTimelineIndex.value]
  if (!cur) return

  currentTimelineTime.value = `${cur.boat_id} @ ${toDDM(cur.lat, false)} | ${toDDM(cur.lng, true)}`

  if (!replayMarkers[cur.boat_id]) {
    replayMarkers[cur.boat_id] = L.circleMarker([cur.lat, cur.lng], {
      radius: 7,
      color: '#f59e0b',
      fillColor: '#ffffff',
      fillOpacity: 1,
      weight: 3
    }).addTo(replayLayer)
    replayMarkers[cur.boat_id].bindTooltip(`🛥️ ${cur.boat_id}`, { permanent: false, direction: 'top' })
  } else {
    replayMarkers[cur.boat_id].setLatLng([cur.lat, cur.lng])
  }
}

// ============================================================================
// 9. INTEGRASI DATA KES & KOMUNIKASI
// ============================================================================
const tarikDataKes = async () => {
  try {
    if (activeStation.value && pemetaanStesenRegion[activeStation.value]) {
      activeRegion.value = pemetaanStesenRegion[activeStation.value]
    }
    const { data, error } = await supabase.from('sar_incidents').select('*').order('id', { ascending: false })
    if (!error && data) {
      senaraiKes.value = data
    }
  } catch (err) {
    console.error("Gagal menarik data kes:", err)
  }
}

const recallPlanDariSupabase = async () => {
  try {
    const { data, error } = await supabase.from('sar_plans').select('*')
    if (!error && data) {
      senaraiMasterSRU.value = data.map(r => ({
        id: r.id,
        caseId: Number(r.case_id || r.caseId || 0),
        nama: r.sru_name || r.nama || r.asset_name || 'SRU',
        corak: r.pattern_name || r.corak || r.search_pattern || 'PARALLEL',
        kawasanNama: r.zone_name || r.kawasanNama || r.area_name || 'SEARCH AREA',
        csp_coord: r.csp_coord || r.cspCoord || null,
        corner_points: r.corner_points || r.cornerPoints || null,
        sortie_waypoints: r.sortie_waypoints || r.sortieWaypoints || []
      }))
      tukarKesTaktikal()
      kemaskiniSenaraiAsetKes()
    }
  } catch (e) {
    console.error("Ralat recallPlanDariSupabase:", e)
  }
}

const langganPelanSarRealtime = () => {
  supabase
    .channel('sar_plans_live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sar_plans' }, () => {
      recallPlanDariSupabase()
    })
    .subscribe()
}

const bukaModalTambahKes = () => {
  formAddKes.value.case_no = 'CASE-' + new Date().getFullYear() + '-' + (activeRegion.value ? activeRegion.value.substring(0, 3).toUpperCase() : 'MMEA') + Math.floor(10 + Math.random() * 90)
  formAddKes.value.case_name = ''
  formAddKes.value.search_object = ''
  showAddCaseModal.value = true
}

const simpanKesBaruSupabase = async () => {
  if (!formAddKes.value.case_name.trim() || !formAddKes.value.case_no.trim()) {
    alert("Sila masukkan No Kes dan Nama Insiden!")
    return
  }
  try {
    const { data, error } = await supabase.from('sar_incidents').insert([{
      case_no: formAddKes.value.case_no.trim(),
      case_name: formAddKes.value.case_name.trim().toUpperCase(),
      search_object: formAddKes.value.search_object.trim(),
      status: 'active',
      region: activeRegion.value || 'TIMUR'
    }]).select()

    if (!error && data && data.length > 0) {
      await tarikDataKes()
      selectedCaseId.value = data[0].id
      tukarKesTaktikal()
      showAddCaseModal.value = false
    }
  } catch (err) {
    alert("Ralat mencipta kes: " + err.message)
  }
}

const bukaModalEditKes = async () => {
  if (confirm("Tukar status kes ini kepada SELESAI / ACCOMPLISHED?")) {
    await supabase.from('sar_incidents').update({ status: 'accomplished' }).eq('id', Number(selectedCaseId.value))
    await tarikDataKes()
    selectedCaseId.value = 'ALL'
    tukarKesTaktikal()
  }
}

const formatMasaChat = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const hantarMesejChatSupabase = async () => {
  if (!inputMesejBaru.value.trim()) return
  const msgText = inputMesejBaru.value.trim()
  inputMesejBaru.value = ''
  
  await supabase.from('sar_messages').insert([{
    sender: activeStation.value || 'SMC HQ',
    message: msgText,
    chat_type: 'global'
  }])
}

const langganMesejRealtimeSupabase = () => {
  supabase
    .channel('sar_messages_live')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sar_messages' }, payload => {
      if (payload.new) senaraiMesejChat.value.push(payload.new)
    })
    .subscribe()
}

// ============================================================================
// 10. LIFECYCLE & INITIALIZATION
// ============================================================================
const initializeDashboard = async () => {
  await nextTick()
  if (activeStation.value && pemetaanStesenRegion[activeStation.value]) {
    activeRegion.value = pemetaanStesenRegion[activeStation.value]
  }

  await initMap()
  await tarikDataKes()
  mulakanPresence()
  await recallPlanDariSupabase()
  langganPelanSarRealtime()
  
  // Muat semula fail simulasi (.nc) yang pernah dimuat naik dari IndexedDB
  const storedSims = await muatSemuaSimulasiDariIndexedDB()
  if (storedSims && storedSims.length > 0) {
    senaraiFailSimulasi.value = storedSims
  }

  await muatTurunTelemetri()
  langganTelemetriMMEA()
  kemaskiniSenaraiAsetKes()
  langganMesejRealtimeSupabase()
}

const prosesLoginMMEA = async () => {
  if (!loginForm.value.stationId) { loginError.value = 'Sila pilih Stesen Operator!'; return }
  if (loginForm.value.password !== 'mrsc@123') { loginError.value = 'Security Password tidak sah!'; return }

  activeStation.value = loginForm.value.stationId
  activeRegion.value = pemetaanStesenRegion[loginForm.value.stationId]
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('activeStation', activeStation.value)
  localStorage.setItem('activeRegion', activeRegion.value)

  loginError.value = ''
  isLoggedIn.value = true
  await initializeDashboard()
}

const prosesLogKeluar = () => {
  if (!confirm("Adakah anda pasti mahu log keluar dari sistem?")) return
  isLoggedIn.value = false
  localStorage.clear()
  if (mapInstance) { mapInstance.remove(); mapInstance = null }
  supabase.removeAllChannels()
}

onMounted(async () => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    activeStation.value = localStorage.getItem('activeStation') || ''
    activeRegion.value = pemetaanStesenRegion[activeStation.value] || localStorage.getItem('activeRegion') || 'NASIONAL'
    isLoggedIn.value = true
    await initializeDashboard()
  }
})

watch(selectedCaseId, () => {
  tukarKesTaktikal()
  kemaskiniSenaraiAsetKes()
})

watch(paparanSRUKesAktif, () => {
  tukarKesTaktikal()
  kemaskiniSenaraiAsetKes()
})
</script>

<style>
:global(body) { margin: 0 !important; padding: 0 !important; width: 100vw; height: 100vh; overflow: hidden; background-color: #020617; }
:global(#app) { width: 100%; height: 100%; display: flex; }
*, *::before, *::after { box-sizing: border-box; }

.tool-btn-icon {
  background: #1e293b; border: 1px solid #475569; color: #fff; width: 26px; height: 26px; cursor: pointer; border-radius: 4px; font-size: 13px; display: flex; align-items: center; justify-content: center;
}
.tool-btn-icon:hover { background: #334155; }
.tool-btn-icon.active { background: #2563eb; border-color: #38bdf8; }
.tool-btn-icon-danger {
  background: #451a1a; border: 1px solid #7f1d1d; color: #fca5a5; width: 26px; height: 26px; cursor: pointer; border-radius: 4px; font-size: 13px; display: flex; align-items: center; justify-content: center;
}
.tool-btn-icon-danger.active { background: #ef4444; color: #fff; }

.sidebar-tab-btn { border: none; padding: 8px 4px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; }
.custom-label { background: none !important; border: none !important; }
@keyframes popupAnim { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
