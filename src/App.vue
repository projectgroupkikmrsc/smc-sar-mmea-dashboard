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
                  <select v-model="selectedCaseId" @change="tukarKesTaktikal" style="width: 100%; padding: 7px; border: 1px solid #475569; border-radius: 4px; font-size: 12px; font-weight: bold; background-color: #0f172a; color: #f8fafc; height: 34px;">
                    <option value="ALL">🌍 [SEMUA KES AKTIF {{ activeStation === 'MRCC Putrajaya' ? 'NASIONAL' : activeRegion }}]</option>
                    <option v-for="kes in senaraiKesAktifSahaja" :key="kes.id" :value="kes.id">
                      #{{ kes.id }} - {{ kes.case_name }} ({{ kes.region }})
                    </option>
                  </select>
                </div>
              </div>

              <!-- SAP vs SIMULATION TAB SWITCHER -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; background: #0f172a; border-radius: 6px; padding: 3px; gap: 4px; border: 1px solid #334155; flex-shrink: 0;">
                <button @click="activeLeftPanelTab = 'sap'" :style="{ background: activeLeftPanelTab === 'sap' ? '#0284c7' : 'transparent', color: activeLeftPanelTab === 'sap' ? '#fff' : '#94a3b8' }" style="border:none; padding:8px 4px; border-radius:4px; font-size:11px; font-weight:800; cursor:pointer;">
                  📋 SAP
                </button>
                <button @click="activeLeftPanelTab = 'simulation'" :style="{ background: activeLeftPanelTab === 'simulation' ? '#f59e0b' : 'transparent', color: activeLeftPanelTab === 'simulation' ? '#000' : '#94a3b8' }" style="border:none; padding:8px 4px; border-radius:4px; font-size:11px; font-weight:800; cursor:pointer;">
                  🌀 Drift (.nc)
                </button>
              </div>

              <!-- TAB 1: SAP -->
              <template v-if="activeLeftPanelTab === 'sap'">
                <div v-if="activeStation !== 'MRCC Putrajaya'" style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #0284c7; padding: 12px; flex-shrink: 0;">
                  <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #38bdf8; text-transform: uppercase;">📤 UPLOAD SAROPS</h4>
                  <label style="border: 2px dashed #475569; border-radius: 6px; padding: 12px; text-align: center; color: #94a3b8; font-size: 11px; background-color: #0f172a; display: block; cursor: pointer;">
                    📄 Klik Muat Naik (.txt, .gpx, .kml)
                    <input type="file" multiple accept=".txt,.gpx,.kml" @change="bacaFailSAROPS" style="display: none;" />
                  </label>
                </div>

                <div style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #10b981; padding: 12px; flex: 1; display: flex; flex-direction: column;">
                  <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #34d399; text-transform: uppercase;">⚓ SRU ASSIGNMENT</h4>
                  <div style="display: flex; flex-direction: column; gap: 6px; overflow-y: auto;">
                    <div v-for="sru in paparanSRUKesAktif" :key="sru.id" style="padding: 6px; background:#0f172a; border-radius:4px; border-left: 3px solid #10b981; border: 1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
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

              <!-- TAB 2: DRIFT SIMULATION -->
              <template v-else>
                <div style="background: #1e293b; border-radius: 6px; border: 1px solid #334155; border-top: 3px solid #f59e0b; padding: 12px; flex: 1; display: flex; flex-direction: column; gap: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 style="margin: 0; font-size: 12px; color: #fbbf24; text-transform: uppercase;">🌀 DRIFT NETCDF</h4>
                    <button v-if="driftSimData" @click="tutupDriftSimulasi" style="background: #4c1d15; color: #f87171; border: 1px solid #7f1d1d; border-radius: 4px; padding: 2px 6px; font-size: 9px; font-weight: bold; cursor: pointer;">✕ Buang</button>
                  </div>
                  <label style="border: 2px dashed #f59e0b; border-radius: 6px; padding: 16px 10px; text-align: center; color: #94a3b8; font-size: 11px; background-color: #0f172a; display: block; cursor: pointer;">
                    🌊 {{ driftFileName || 'Muat Naik particles.nc' }}
                    <input type="file" accept=".nc,.hdf5,.h5" @change="bacaFailDriftNC" style="display: none;" />
                  </label>
                </div>
              </template>

            </div>
            <div @click="isLeftPanelVisible = !isLeftPanelVisible" style="position: absolute; right: -20px; top: 50%; transform: translateY(-50%); width: 20px; height: 60px; background: #0f172a; border: 1px solid #334155; border-left: none; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 0 6px 6px 0;">
              <span style="color: #94a3b8; font-size: 12px;">{{ isLeftPanelVisible ? '◀' : '▶' }}</span>
            </div>
          </div>

          <!-- UNIFIED TACTICAL MAP TOOLBAR (TOP RIGHT) -->
          <div style="position: absolute; top: 10px; right: 10px; z-index: 1000; display: flex; align-items: center; gap: 4px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(8px); border: 1px solid #475569; border-radius: 6px; padding: 3px 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            <button @click="aktifkanTool('circle')" :class="{ active: activeTool === 'circle' }" class="tool-btn-icon" title="Bulatan">⭕</button>
            <button @click="aktifkanTool('rect')" :class="{ active: activeTool === 'rect' }" class="tool-btn-icon" title="Segi Empat">⬛</button>
            <button @click="aktifkanTool('line')" :class="{ active: activeTool === 'line' }" class="tool-btn-icon" title="Ukur Jarak">📏</button>
            <button @click="aktifkanTool('marker')" :class="{ active: activeTool === 'marker' }" class="tool-btn-icon" title="Marker">📍</button>
            <button @click="aktifkanTool('text')" :class="{ active: activeTool === 'text' }" class="tool-btn-icon" title="Teks">📝</button>
            <button @click="toggleDeleteMode" :class="{ active: isDeleteMode }" class="tool-btn-icon-danger" title="Padam Individu">🗑️</button>

            <div style="width: 1px; height: 18px; background: #475569; margin: 0 3px;"></div>

            <!-- SEARCH / GO-TO -->
            <input type="text" v-model="teksCarianPeta" @keydown.enter="laksanakanCarianPeta" placeholder="🔍 Lokasi / Lat, Lon..." style="width: 180px; height: 26px; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 0 6px; border-radius: 4px; font-size: 11px;" />

            <div style="width: 1px; height: 18px; background: #475569; margin: 0 3px;"></div>

            <!-- LAYERS DROPDOWN -->
            <div style="position: relative;">
              <button @click="isLayerMenuOpen = !isLayerMenuOpen" class="tool-btn-icon" title="Lapisan Peta">🥞</button>
              <div v-if="isLayerMenuOpen" style="position: absolute; top: 32px; right: 0; z-index: 1015; background: rgba(15, 23, 42, 0.98); border: 1.5px solid #38bdf8; border-radius: 6px; padding: 8px; min-width: 200px; display: flex; flex-direction: column; gap: 6px; animation: popupAnim 0.15s ease-out;">
                <div style="font-size: 9px; font-weight: 800; color: #38bdf8;">TEMA ASAS</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3px;">
                  <button @click="tukarBaseLayer('dark')" style="background:#1e293b; color:#fff; border:1px solid #334155; font-size:9px; padding:3px; border-radius:3px; cursor:pointer;">Dark</button>
                  <button @click="tukarBaseLayer('satellite')" style="background:#1e293b; color:#fff; border:1px solid #334155; font-size:9px; padding:3px; border-radius:3px; cursor:pointer;">Satelit</button>
                  <button @click="tukarBaseLayer('osm')" style="background:#1e293b; color:#fff; border:1px solid #334155; font-size:9px; padding:3px; border-radius:3px; cursor:pointer;">OSM</button>
                </div>
                <div style="font-size: 9px; font-weight: 800; color: #38bdf8; margin-top: 4px;">SEMPADAN MARITIM</div>
                <label style="display:flex; align-items:center; gap:6px; font-size:10px;"><input type="checkbox" v-model="showLayerMSRR" @change="togolLayerMSRR" /> Sempadan MSRR</label>
                <label style="display:flex; align-items:center; gap:6px; font-size:10px;"><input type="checkbox" v-model="showLayerPelantar" @change="togolLayerPelantar" /> Pelantar Benua 1979</label>
                <label style="display:flex; align-items:center; gap:6px; font-size:10px;"><input type="checkbox" v-model="showOpenSeaMap" @change="togolOpenSeaMap" /> OpenSeaMap</label>
              </div>
            </div>
          </div>

          <!-- REPLAY TIMELINE PLAYBACK -->
          <div v-if="isTimelineOpen" style="position: absolute; bottom: 34px; right: 6px; z-index: 1000; width: 440px; background: rgba(15, 23, 42, 0.95); border: 1px solid #38bdf8; border-radius: 8px; padding: 8px 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; font-weight: bold; color: #38bdf8;">⏱️ REPLAY: {{ currentTimelineTime }}</span>
              <button @click="isTimelineOpen = false" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 12px;">✕</button>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button @click="togglePlayReplay" style="background: #10b981; color: white; border: none; padding: 2px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">{{ isPlaying ? '⏸' : '▶' }}</button>
              <input type="range" :min="0" :max="Math.max(0, timelinePoints.length - 1)" v-model.number="currentTimelineIndex" @input="kemaskiniFrameReplay" style="flex: 1;" />
              <button v-for="spd in [1, 2, 5]" :key="spd" @click="playbackSpeed = spd" :style="{ background: playbackSpeed === spd ? '#2563eb' : '#1e293b' }" style="color:white; border:none; padding:2px 4px; font-size:9px; border-radius:2px; cursor:pointer;">{{ spd }}x</button>
            </div>
          </div>

          <!-- BOTTOM-RIGHT LIVE COORDINATES -->
          <div style="position: absolute; bottom: 8px; right: 8px; z-index: 1000; background: rgba(15, 23, 42, 0.95); border: 1.5px solid #38bdf8; color: #38bdf8; font-family: monospace; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; pointer-events: none; white-space: nowrap;">
            🌐 {{ currentLat }} | {{ currentLng }}
          </div>
        </div>

        <!-- RIGHT SIDEBAR (3-TAB SYSTEM) -->
        <div style="display: flex; flex-direction: column; height: 100%; min-height: 0; z-index: 20; background: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; overflow: hidden;">
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); background: #0f172a; padding: 4px; gap: 4px; flex-shrink: 0;">
            <button @click="activeRightSidebarTab = 'active'" :style="{ background: activeRightSidebarTab === 'active' ? '#2563eb' : 'transparent', color: activeRightSidebarTab === 'active' ? '#fff' : '#94a3b8' }" class="sidebar-tab-btn">
              Active ({{ telemetriRealtime.length }})
            </button>
            <button @click="activeRightSidebarTab = 'history'; muatTurunSejarahSRU()" :style="{ background: activeRightSidebarTab === 'history' ? '#2563eb' : 'transparent', color: activeRightSidebarTab === 'history' ? '#fff' : '#94a3b8' }" class="sidebar-tab-btn">
              History
            </button>
            <button @click="activeRightSidebarTab = 'communication'" :style="{ background: activeRightSidebarTab === 'communication' ? '#2563eb' : 'transparent', color: activeRightSidebarTab === 'communication' ? '#fff' : '#94a3b8' }" class="sidebar-tab-btn">
              Comm
            </button>
          </div>

          <!-- TAB 1: ACTIVE -->
          <div v-show="activeRightSidebarTab === 'active'" style="flex: 1; padding: 12px; overflow-y: auto; color: #1e293b;">
            <h4 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold;">📡 LIVE SRU STATUS</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
              <thead>
                <tr style="border-bottom: 1px solid #cbd5e1; color: #64748b;">
                  <th style="padding: 4px 0; text-align: left;">BOAT ID</th>
                  <th style="padding: 4px 0; text-align: left;">KTS</th>
                  <th style="padding: 4px 0; text-align: left;">CRS</th>
                  <th style="padding: 4px 0; text-align: right;">CSP (NM)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tele in telemetriRealtime" :key="tele.boat_id" style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">{{ tele.boat_id }}</td>
                  <td style="padding: 8px 0;">{{ tele.speed || '0.0' }}</td>
                  <td style="padding: 8px 0;">{{ tele.course ? tele.course + '°' : '---' }}</td>
                  <td style="padding: 8px 0; text-align: right; color: #2563eb; font-weight: bold;">{{ tele.csp || '0.0' }}</td>
                </tr>
                <tr v-if="telemetriRealtime.length === 0">
                  <td colspan="4" style="padding: 30px 0; text-align: center; color: #94a3b8;">Tiada isyarat GPS bot aktif</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 2: HISTORY -->
          <div v-show="activeRightSidebarTab === 'history'" style="flex: 1; display:flex; flex-direction:column; padding: 12px; overflow-y: auto; color: #1e293b;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h4 style="margin: 0; font-size: 12px; font-weight: bold;">⏳ SEJARAH PERGERAKAN</h4>
              <button @click="bukaTimelinePlayback" style="background: #0284c7; color: white; border: none; padding: 2px 6px; font-size: 10px; border-radius: 3px; cursor: pointer;">⏱️ Replay</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; overflow-y: auto;">
              <div v-for="sru in senaraiSruSejarah" :key="sru.boat_id" style="display:flex; justify-content:space-between; align-items:center; padding:6px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; font-size:11px;">
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" v-model="sru.isChecked" @change="kemaskiniPaparanTrekPeta" />
                  <strong>{{ sru.boat_id }}</strong>
                </label>
                <span style="font-size:9px; color:#64748b;">{{ sru.points_count }} pts</span>
              </div>
            </div>
          </div>

          <!-- TAB 3: COMM -->
          <div v-show="activeRightSidebarTab === 'communication'" style="flex: 1; display: flex; flex-direction: column; padding: 12px; min-height: 0;">
            <div class="chat-messages-container" style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
              <div v-for="msg in filteredMesejChat" :key="msg.id" style="font-size: 11px; color: #1e293b;">
                <strong>{{ msg.sender }}:</strong> {{ msg.message }}
              </div>
            </div>
            <input type="text" v-model="inputMesejBaru" @keyup.enter="hantarMesejChatSupabase" placeholder="Taip mesej..." style="margin-top: 8px; width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px;" />
          </div>

        </div>

      </div>

      <!-- LOAD CASE MODAL -->
      <div v-if="showLoadCaseModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: white; width: 450px; border-radius: 8px; padding: 16px; color: #1e293b;">
          <h3 style="margin-top: 0; font-size: 14px;">📂 Arkib Insiden</h3>
          <div style="max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px;">
            <div v-for="oldKes in senaraiKes" :key="oldKes.id" @click="selectedCaseId = oldKes.id; tukarKesTaktikal(); showLoadCaseModal = false" style="padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; cursor: pointer;">
              #{{ oldKes.id }} - {{ oldKes.case_name }} ({{ oldKes.region }})
            </div>
          </div>
          <button @click="showLoadCaseModal = false" style="margin-top: 10px; width: 100%; padding: 8px; background: #334155; color: white; border: none; border-radius: 4px; cursor: pointer;">Tutup</button>
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

// STATE PENGGUNA
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

// FORMAT PENUKARAN KOORDINAT DDM
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

// LEAFLET & LAYER MANAGEMENT
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

// MAP TOOLS & LAYERS CONTROLS
const teksCarianPeta = ref('')
const isLayerMenuOpen = ref(false)
const showLayerMSRR = ref(false)
const showLayerPelantar = ref(false)
const showOpenSeaMap = ref(false)

// TIMELINE & DRIFT
const isTimelineOpen = ref(false)
const isPlaying = ref(false)
const playbackSpeed = ref(1)
const timelinePoints = ref([])
const currentTimelineIndex = ref(0)
const currentTimelineTime = ref('')
let replayTimer = null

const driftSimData = ref(null)
const driftFileName = ref('')
let driftImageOverlay = null

// COMPUTED INCIDENTS
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
  if (selectedCaseId.value === 'ALL') {
    const idKesAktif = senaraiKesAktifSahaja.value.map(k => Number(k.id))
    return senaraiMasterSRU.value.filter(s => idKesAktif.includes(Number(s.caseId)))
  }
  return senaraiMasterSRU.value.filter(s => Number(s.caseId) === Number(selectedCaseId.value))
})

const filteredMesejChat = computed(() => senaraiMesejChat.value)

// INIT MAP LEAFLET
const initMap = async () => {
  let mapEl = document.getElementById('map')
  let retries = 0
  while (!mapEl && retries < 20) {
    await new Promise(r => setTimeout(r, 50))
    mapEl = document.getElementById('map')
    retries++
  }
  if (!mapEl) return

  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }

  mapInstance = L.map('map', { zoomControl: false }).setView([4.2, 109.5], 5)

  baseLayers = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapInstance),
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 })
  }
  layerSeaMapInstance = L.tileLayer('https://tiles.openseamap.org/seamap/{z}/{x}/{y}.png', { maxZoom: 18 })

  // MSRR & Pelantar Benua Layers
  const msrrBarat = L.polyline([[6.4333, 100.1333], [6.5, 99.0], [7.25, 98.0], [10.0, 96.5], [6.0, 97.5], [1.28, 103.6], [6.23, 102.11]], { color: 'blue', weight: 2, dashArray: '5, 5' })
  const msrrTimur = L.polyline([[2.0833, 109.6467], [6.28, 109.63], [10.0, 111.5], [7.68, 118.0], [4.16, 117.89]], { color: 'red', weight: 2, dashArray: '5, 5' })
  layerMSRRInstance = L.layerGroup([msrrBarat, msrrTimur])
  layerPelantarInstance = L.layerGroup([L.polyline([[6.3, 99.4], [1.14, 103.5], [6.45, 102.16]], { color: 'green', weight: 2 })])

  // Operational Layers
  toolsLayer = L.featureGroup().addTo(mapInstance)
  tempDrawingLayer = L.layerGroup().addTo(mapInstance)
  sapLayerGroup = L.layerGroup().addTo(mapInstance)
  trackHistoryLayer = L.layerGroup().addTo(mapInstance)
  replayLayer = L.layerGroup().addTo(mapInstance)
  driftLayerGroup = L.layerGroup().addTo(mapInstance)

  // Koordinat Kursor Tetikus & Live Drawing Preview
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

  // Pengendali Klik Melukis
  mapInstance.on('click', (e) => {
    if (isDeleteMode.value || !activeTool.value) return
    const latlng = e.latlng

    if (activeTool.value === 'marker') {
      const m = L.marker(latlng).bindPopup(`📍 ${toDDM(latlng.lat, false)} | ${toDDM(latlng.lng, true)}`).addTo(toolsLayer).openPopup()
      m.on('click', (ev) => { if (isDeleteMode.value) toolsLayer.removeLayer(m) })
      aktifkanTool(null)
      return
    }

    if (activeTool.value === 'text') {
      const txt = prompt("Catatan teks:")
      if (txt) {
        const t = L.marker(latlng, {
          icon: L.divIcon({ html: `<div style="background:rgba(15,23,42,0.9); color:#fff; padding:2px 6px; border:1px solid #38bdf8; border-radius:4px; font-size:11px; white-space:nowrap;">📝 ${txt}</div>`, className: 'custom-label' })
        }).addTo(toolsLayer)
        t.on('click', () => { if (isDeleteMode.value) toolsLayer.removeLayer(t) })
      }
      aktifkanTool(null)
      return
    }

    if (!drawingStartPoint.value) {
      drawingStartPoint.value = latlng
    } else {
      const startPt = drawingStartPoint.value
      const endPt = latlng
      let shape = null

      if (activeTool.value === 'circle') {
        const rad = startPt.distanceTo(endPt)
        shape = L.circle(startPt, { radius: rad, color: '#38bdf8', weight: 2, fillOpacity: 0.3 })
          .bindPopup(`⭕ Jejari: ${(rad/1852).toFixed(2)} NM`)
          .addTo(toolsLayer)
      } else if (activeTool.value === 'rect') {
        shape = L.rectangle([startPt, endPt], { color: '#fbbf24', weight: 2, fillOpacity: 0.3 }).addTo(toolsLayer)
      } else if (activeTool.value === 'line') {
        shape = L.polyline([startPt, endPt], { color: '#ef4444', weight: 3 })
          .bindPopup(`📏 ${(startPt.distanceTo(endPt)/1852).toFixed(2)} NM`)
          .addTo(toolsLayer)
      }

      if (shape) {
        shape.on('click', () => { if (isDeleteMode.value) toolsLayer.removeLayer(shape) })
      }

      drawingStartPoint.value = null
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

// LAYER HELPERS
const tukarBaseLayer = (jenis) => {
  Object.values(baseLayers).forEach(l => { if (mapInstance.hasLayer(l)) mapInstance.removeLayer(l) })
  if (baseLayers[jenis]) baseLayers[jenis].addTo(mapInstance).bringToBack()
}
const togolLayerMSRR = () => { showLayerMSRR.value ? mapInstance.addLayer(layerMSRRInstance) : mapInstance.removeLayer(layerMSRRInstance) }
const togolLayerPelantar = () => { showLayerPelantar.value ? mapInstance.addLayer(layerPelantarInstance) : mapInstance.removeLayer(layerPelantarInstance) }
const togolOpenSeaMap = () => { showOpenSeaMap.value ? mapInstance.addLayer(layerSeaMapInstance) : mapInstance.removeLayer(layerSeaMapInstance) }

// CARIAN KOORDINAT/LOKASI
const laksanakanCarianPeta = async () => {
  const val = teksCarianPeta.value.trim()
  if (!val || !mapInstance) return
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`)
    const data = await res.json()
    if (data && data.length > 0) {
      mapInstance.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 11)
    }
  } catch (e) {}
}

// PLOT PELAN SAROPS
const tukarKesTaktikal = () => {
  if (!mapInstance || !sapLayerGroup) return
  sapLayerGroup.clearLayers()

  const boundsList = []
  const list = paparanSRUKesAktif.value

  list.forEach(sru => {
    if (sru.corner_points && Array.isArray(sru.corner_points) && sru.corner_points.length >= 4) {
      const pts = sru.corner_points.filter(p => p !== null && Array.isArray(p))
      if (pts.length >= 4) {
        const poly = L.polygon(pts, { color: '#38bdf8', weight: 2, fillOpacity: 0.15 }).bindTooltip(`Zon: ${sru.kawasanNama} (${sru.nama})`)
        sapLayerGroup.addLayer(poly)
        boundsList.push(poly.getBounds())
      }
    }
    if (sru.sortie_waypoints && Array.isArray(sru.sortie_waypoints) && sru.sortie_waypoints.length > 0) {
      const polyLine = L.polyline(sru.sortie_waypoints, { color: '#f59e0b', weight: 2, dashArray: '5, 5' })
      sapLayerGroup.addLayer(polyLine)
      boundsList.push(polyLine.getBounds())
    }
  })

  if (boundsList.length > 0) {
    let combined = boundsList[0]
    for (let i = 1; i < boundsList.length; i++) combined.extend(boundsList[i])
    mapInstance.fitBounds(combined, { padding: [40, 40] })
  }
}

// DRIFT SIMULATION
const bacaFailDriftNC = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const ab = await file.arrayBuffer()
    driftSimData.value = await readFullSARSimulation(ab)
    driftFileName.value = file.name
    const stepData = computeTimeStepPOC(driftSimData.value, 0)
    const imgUrl = renderPOCToCanvasDataURL(stepData.grid, stepData.maxDensity)
    if (driftImageOverlay) driftLayerGroup.removeLayer(driftImageOverlay)
    driftImageOverlay = L.imageOverlay(imgUrl, stepData.bounds, { opacity: 0.8 }).addTo(driftLayerGroup)
    mapInstance.fitBounds(stepData.bounds)
  } catch (err) {
    alert("Ralat fail .nc: " + err.message)
  }
}
const tutupDriftSimulasi = () => {
  driftSimData.value = null
  driftFileName.value = ''
  if (driftLayerGroup) driftLayerGroup.clearLayers()
}

// SEJARAH & REPLAY
const muatTurunSejarahSRU = async () => {
  const { data } = await supabase.from('sru_track_history').select('*').order('created_at', { ascending: true })
  if (data) {
    const sruMap = {}
    data.forEach(r => {
      if (!sruMap[r.boat_id]) sruMap[r.boat_id] = { boat_id: r.boat_id, points_count: 0, coords: [], isChecked: true }
      sruMap[r.boat_id].points_count++
      sruMap[r.boat_id].coords.push([r.latitude, r.longitude])
    })
    senaraiSruSejarah.value = Object.values(sruMap)
    kemaskiniPaparanTrekPeta()
  }
}

const kemaskiniPaparanTrekPeta = () => {
  if (!trackHistoryLayer) return
  trackHistoryLayer.clearLayers()
  senaraiSruSejarah.value.forEach(sru => {
    if (sru.isChecked && sru.coords.length > 0) {
      L.polyline(sru.coords, { color: '#06b6d4', weight: 2, dashArray: '4, 4' }).addTo(trackHistoryLayer)
    }
  })
}

const bukaTimelinePlayback = () => {
  isTimelineOpen.value = true
  const pts = []
  senaraiSruSejarah.value.filter(s => s.isChecked).forEach(s => {
    s.coords.forEach(c => pts.push({ lat: c[0], lng: c[1], boat_id: s.boat_id }))
  })
  timelinePoints.value = pts
  currentTimelineIndex.value = 0
}

const togglePlayReplay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    replayTimer = setInterval(() => {
      if (currentTimelineIndex.value < timelinePoints.value.length - 1) {
        currentTimelineIndex.value++
        kemaskiniFrameReplay()
      } else {
        isPlaying.value = false
        clearInterval(replayTimer)
      }
    }, 400 / playbackSpeed.value)
  } else clearInterval(replayTimer)
}

const kemaskiniFrameReplay = () => {
  if (!replayLayer || timelinePoints.value.length === 0) return
  const cur = timelinePoints.value[currentTimelineIndex.value]
  if (!cur) return
  currentTimelineTime.value = `${cur.boat_id} @ ${toDDM(cur.lat, false)}`
  if (!replayMarkers[cur.boat_id]) {
    replayMarkers[cur.boat_id] = L.circleMarker([cur.lat, cur.lng], { radius: 6, color: '#f59e0b', fillOpacity: 1 }).addTo(replayLayer)
  } else {
    replayMarkers[cur.boat_id].setLatLng([cur.lat, cur.lng])
  }
}

// INTEGRASI DATA KES & SUPABASE
const tarikDataKes = async () => {
  try {
    const { data, error } = await supabase.from('sar_incidents').select('*').order('id', { ascending: false })
    if (!error && data) {
      senaraiKes.value = data
      if (senaraiKesAktifSahaja.value.length > 0 && selectedCaseId.value === 'ALL') {
        selectedCaseId.value = senaraiKesAktifSahaja.value[0].id
      }
    }
  } catch (err) {}
}

const recallPlanDariSupabase = async () => {
  try {
    const { data, error } = await supabase.from('sar_plans').select('*')
    if (!error && data) {
      senaraiMasterSRU.value = data.map(r => ({
        id: r.id,
        caseId: Number(r.case_id),
        nama: r.sru_name,
        corak: r.pattern_name || 'PARALLEL',
        kawasanNama: r.zone_name,
        corner_points: r.corner_points,
        sortie_waypoints: r.sortie_waypoints
      }))
      tukarKesTaktikal()
    }
  } catch (e) {}
}

const muatTurunTelemetri = async () => {
  try {
    const { data, error } = await supabase.from('sru_telemetry').select('*')
    if (!error && data) telemetriRealtime.value = data
  } catch (e) {}
}

const hantarMesejChatSupabase = async () => {
  if (!inputMesejBaru.value.trim()) return
  senaraiMesejChat.value.push({ id: Date.now(), sender: activeStation.value, message: inputMesejBaru.value.trim() })
  inputMesejBaru.value = ''
}

const initializeDashboard = async () => {
  await nextTick()
  if (activeStation.value && pemetaanStesenRegion[activeStation.value]) {
    activeRegion.value = pemetaanStesenRegion[activeStation.value]
  }
  await initMap()
  await tarikDataKes()
  await recallPlanDariSupabase()
  await muatTurunTelemetri()
  await muatTurunSejarahSRU()
}

const prosesLoginMMEA = async () => {
  if (!loginForm.value.stationId) { loginError.value = 'Pilih stesen!'; return }
  if (loginForm.value.password !== 'mrsc@123') { loginError.value = 'Kata laluan salah!'; return }
  activeStation.value = loginForm.value.stationId
  activeRegion.value = pemetaanStesenRegion[loginForm.value.stationId]
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('activeStation', activeStation.value)
  isLoggedIn.value = true
  loginError.value = ''
  await initializeDashboard()
}

const prosesLogKeluar = () => {
  if (!confirm("Log keluar dari sistem?")) return
  isLoggedIn.value = false
  localStorage.clear()
  if (mapInstance) { mapInstance.remove(); mapInstance = null }
}

onMounted(async () => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    activeStation.value = localStorage.getItem('activeStation') || ''
    activeRegion.value = pemetaanStesenRegion[activeStation.value] || 'NASIONAL'
    isLoggedIn.value = true
    await initializeDashboard()
  }
})

watch(selectedCaseId, () => { tukarKesTaktikal() })
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
