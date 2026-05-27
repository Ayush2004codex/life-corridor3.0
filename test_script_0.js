
// RBAC Protection
(function checkAuth(){
  const session = JSON.parse(localStorage.getItem('lc_session') || 'null');
  if(!session || !session.loggedIn) {
    window.location.href = 'login.html';
    return;
  }
  if(session.role !== 'driver') {
    // Redirect admin users to their dashboard
    if(session.role === 'admin') {
      window.location.href = 'admin.html';
      return;
    }
    // Redirect others to login
    window.location.href = 'login.html';
    return;
  }
  // Display user name
  if(document.getElementById('userName')) {
    document.getElementById('userName').textContent = session.name || 'Driver';
  }
})();

function logout() {
  if(confirm('Are you sure you want to log out?')) {
    localStorage.removeItem('lc_session');
    window.location.href = 'login.html';
  }
}

let trackingInterval;
let lmap;
let ambMarker;
let routeLine;
let mapSignals = [];

const hospitals = {
  "Sagar Dutta Medical College": [22.6896, 88.3712],
  "Barrackpore Sub-Divisional": [22.7578, 88.3688],
  "SSKM Hospital, Kolkata": [22.5398, 88.3444],
  "Apollo Gleneagles": [22.5714, 88.4023],
  "Fortis Hospital": [22.5186, 88.4037]
};

const pickupCoord = [22.7303, 88.3703]; // Narula / Agarpara

document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('lmap')) {
    lmap = L.map('lmap', {zoomControl: false}).setView(pickupCoord, 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(lmap);
    
    // Add hospital markers
    Object.keys(hospitals).forEach(name => {
      L.circleMarker(hospitals[name], {color: '#ff3366', radius: 8, fillOpacity: 0.5}).addTo(lmap).bindPopup(name);
    });
  }
});

function activateCorridor() {
  document.getElementById('activeStatus').style.display = 'block';
  document.getElementById('etaVal').textContent = 'Calc...';
  document.getElementById('sigVal').textContent = '0/6';
  document.getElementById('speedVal').textContent = '65';
  document.getElementById('distVal').textContent = 'Calc...';
  
  // Update Signal Control View
  document.getElementById('totalSignals').textContent = '0/6';
  document.getElementById('corridorStatus').textContent = 'ACTIVE';
  document.getElementById('corridorStatus').style.color = 'var(--g1)';
  document.getElementById('greenStatus').textContent = '🟢';
  
  // Update map values
  document.getElementById('mapSpeed').textContent = '65 km/h';
  document.getElementById('mapSignals').textContent = '0/6';
  document.getElementById('mapEta').textContent = '⏱ ETA: Calc...';
  document.getElementById('mapStatus').textContent = '🟢 Active';
  
  // Keep all signals RED initially
  for(let i=1; i<=6; i++) {
    const sigControl = document.getElementById('sig'+i);
    if(sigControl) {
      sigControl.style.background = '#ff4444';
      sigControl.style.boxShadow = '0 0 10px #ff4444';
    }
  }
  
  const statusTexts = document.querySelectorAll('[id^="sig"][style*="font-weight"]');
  statusTexts.forEach((el) => {
    const parent = el.parentElement;
    const statusDiv = parent.querySelector('div:nth-child(3)');
    if(statusDiv) {
      statusDiv.textContent = 'RED';
      statusDiv.style.color = '#ff4444';
    }
  });
  document.getElementById('btnReroute').style.display = 'block';
  animateAmbulance();
}

function animateAmbulance() {
  let destName = document.getElementById('disp-dest').textContent.trim();
  let destCoord = hospitals[destName] || hospitals["Sagar Dutta Medical College"];
  
  if(routeLine) lmap.removeLayer(routeLine);
  if(ambMarker) lmap.removeLayer(ambMarker);
  mapSignals.forEach(m => lmap.removeLayer(m.marker));
  mapSignals = [];
  
  // Phase 1: Hospital -> Civilian
  document.getElementById('mapStatus').textContent = '🔵 Approaching Civilian';
  document.getElementById('vitalsOverlay').style.display = 'flex';
  
  fetch(`https://router.project-osrm.org/route/v1/driving/${destCoord[1]},${destCoord[0]};${pickupCoord[1]},${pickupCoord[0]}?overview=full&geometries=geojson`)
    .then(r => r.json())
    .then(data => {
      let coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      
      const smoothCoords = [coords[0]];
      for(let i=0; i<coords.length-1; i++) {
        const p1 = coords[i];
        const p2 = coords[i+1];
        const dist = lmap.distance(p1, p2);
        if(dist > 30) {
          const segments = Math.ceil(dist / 30);
          for(let j=1; j<=segments; j++) {
            smoothCoords.push([
              p1[0] + (p2[0] - p1[0]) * (j/segments),
              p1[1] + (p2[1] - p1[1]) * (j/segments)
            ]);
          }
        } else {
          smoothCoords.push(p2);
        }
      }
      coords = smoothCoords;
      
      const durationMin = Math.ceil(data.routes[0].duration / 60);
      document.getElementById('etaVal').textContent = durationMin + 'm';
      document.getElementById('mapEta').textContent = '⏱ ETA: ' + durationMin + 'm';
      
      routeLine = L.polyline(coords, {color: '#00e5ff', weight: 6, opacity: 0.6, dashArray: '10, 10'}).addTo(lmap);
      lmap.fitBounds(routeLine.getBounds(), {padding: [50, 50]});
      
      const ambIcon = L.divIcon({className: 'custom-amb', html: '<div style="font-size:24px; filter: drop-shadow(0 0 10px #00e5ff);">🚑</div>', iconSize: [30, 30]});
      ambMarker = L.marker(coords[0], {icon: ambIcon, zIndexOffset: 1000}).addTo(lmap);
      
      let progress = 0;
      if (trackingInterval) clearInterval(trackingInterval);
      
      trackingInterval = setInterval(() => {
        if(progress >= coords.length - 1) {
          clearInterval(trackingInterval);
          
          // Phase 1 Complete
          document.getElementById('mapStatus').textContent = '🧍 Patient Boarding...';
          document.getElementById('mapSpeed').textContent = '0 km/h';
          
          setTimeout(() => {
            // Patient boarded! Hide overlay, start Phase 2
            document.getElementById('vitalsOverlay').style.display = 'none';
            document.getElementById('mapStatus').textContent = '🟢 Green Corridor Active';
            
            // Notify Admin Dashboard
            localStorage.setItem('patient_boarded_alert', JSON.stringify({
              timestamp: Date.now(),
              hospital: destName,
              patientData: {
                condition: 'Level 2 Trauma (Severe)',
                vitals: { spo2: '98%', bp: '120/80', resp: 18, hr: 88 },
                history: 'No known allergies. Previous hypertension.'
              }
            }));

            startPhase2(destCoord);
          }, 3000);
          
          return;
        }
        
        progress += 0.5; if(progress >= coords.length) progress = coords.length - 1; 
        ambMarker.setLatLng(coords[Math.floor(progress)]);
        document.getElementById('mapSpeed').textContent = Math.floor(65 + Math.random() * 5) + ' km/h';
      }, 30);
    })
    .catch(err => console.error("OSRM Error Phase 1:", err));
}

function startPhase2(destCoord) {
  if(routeLine) lmap.removeLayer(routeLine);
  
  // Fetch real OSRM Route: Civilian -> Hospital
  fetch(`https://router.project-osrm.org/route/v1/driving/${pickupCoord[1]},${pickupCoord[0]};${destCoord[1]},${destCoord[0]}?overview=full&geometries=geojson`)
    .then(r => r.json())
    .then(data => {
      let coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      
      const smoothCoords = [coords[0]];
      for(let i=0; i<coords.length-1; i++) {
        const p1 = coords[i];
        const p2 = coords[i+1];
        const dist = lmap.distance(p1, p2);
        if(dist > 30) {
          const segments = Math.ceil(dist / 30);
          for(let j=1; j<=segments; j++) {
            smoothCoords.push([
              p1[0] + (p2[0] - p1[0]) * (j/segments),
              p1[1] + (p2[1] - p1[1]) * (j/segments)
            ]);
          }
        } else {
          smoothCoords.push(p2);
        }
      }
      coords = smoothCoords;
      
      const distKm = (data.routes[0].distance / 1000).toFixed(1);
      const durationMin = Math.ceil(data.routes[0].duration / 60);
      
      document.getElementById('etaVal').textContent = durationMin + 'm';
      document.getElementById('mapEta').textContent = '⏱ ETA: ' + durationMin + 'm';
      document.getElementById('distVal').textContent = distKm + ' km';
      
      routeLine = L.polyline(coords, {color: '#00ff66', weight: 6, opacity: 0.8}).addTo(lmap);
      lmap.fitBounds(routeLine.getBounds(), {padding: [50, 50]});
      
      const stepSize = Math.floor(coords.length / 7);
      for(let i=1; i<=6; i++) {
        let sc = coords[i * stepSize];
        if(sc) {
          let sm = L.circleMarker(sc, {color: '#ff4444', radius: 6, fillOpacity: 1, zIndexOffset: 500}).addTo(lmap);
          mapSignals.push({marker: sm, id: i, passed: false, coord: sc});
        }
      }
      
      const ambIcon = L.divIcon({className: 'custom-amb', html: '<div style="font-size:24px; filter: drop-shadow(0 0 10px #00c853);">🚑</div>', iconSize: [30, 30]});
      ambMarker.setIcon(ambIcon);
      
      let progress = 0;
      if (trackingInterval) clearInterval(trackingInterval);
      
      trackingInterval = setInterval(() => {
        if(progress >= coords.length - 1) {
          clearInterval(trackingInterval);
          document.getElementById('etaVal').textContent = 'Arrived';
          document.getElementById('speedVal').textContent = '0';
          document.getElementById('mapSpeed').textContent = '0 km/h';
          document.getElementById('mapEta').textContent = '⏱ ETA: Arrived';
          document.getElementById('distVal').textContent = '0 km';
          document.getElementById('mapStatus').textContent = '✅ Completed';
          return;
        }
        
        progress += 0.5; if(progress >= coords.length) progress = coords.length - 1; let currentPos = coords[Math.floor(progress)];
        ambMarker.setLatLng(currentPos);
        document.getElementById('speedVal').textContent = Math.floor(65 + Math.random() * 10);
        document.getElementById('mapSpeed').textContent = document.getElementById('speedVal').textContent + ' km/h';
        
        let signalsCleared = 0;
        mapSignals.forEach(sig => {
          const distance = lmap.distance(currentPos, sig.coord);
          if (distance < 800) {
            // Ambulance is NEAR this signal — turn GREEN
            sig.marker.setStyle({color: '#00c853'});
            sig.isGreen = true;
            if(!sig.passed) sig.passed = true;
            const controlSignal = document.getElementById('sig' + sig.id);
            const statusText = document.querySelector(`#sig${sig.id}`)?.parentElement?.querySelector('div:nth-child(3)');
            if(controlSignal) { controlSignal.style.background = '#00c853'; controlSignal.style.boxShadow = '0 0 10px #00c853'; }
            if(statusText) { statusText.textContent = 'GREEN'; statusText.style.color = 'var(--g1)'; }
          } else if (sig.isGreen) {
            // Ambulance has LEFT this signal — turn back to RED
            sig.marker.setStyle({color: '#ff4444'});
            sig.isGreen = false;
            const controlSignal = document.getElementById('sig' + sig.id);
            const statusText = document.querySelector(`#sig${sig.id}`)?.parentElement?.querySelector('div:nth-child(3)');
            if(controlSignal) { controlSignal.style.background = '#ff4444'; controlSignal.style.boxShadow = '0 0 10px #ff4444'; }
            if(statusText) { statusText.textContent = 'RED'; statusText.style.color = '#ff4444'; }
          }
          if(sig.passed) signalsCleared++;
        });
        const clearedText = `${signalsCleared}/${mapSignals.length}`;
        document.getElementById('sigVal').textContent = clearedText;
        document.getElementById('totalSignals').textContent = clearedText;
        document.getElementById('mapSignals').textContent = `${signalsCleared}/6`;
      }, 30);
    })
    .catch(err => console.error("OSRM Error Phase 2:", err));
}

// ===== LISTEN FOR SIGNAL OVERRIDE FROM ADMIN =====
window.addEventListener('storage', function(e) {
  if(e.key === 'lc_signal_override') {
    const override = JSON.parse(e.newValue);
    if(override && override.active) {
      overrideAllSignalsGreen();
    }
  }
});

function overrideAllSignalsGreen() {
  mapSignals.forEach(sig => {
    sig.marker.setStyle({color: '#00c853'});
    const controlSignal = document.getElementById('sig' + sig.id);
    const statusText = document.querySelector(`#sig${sig.id}`)?.parentElement?.querySelector('div:nth-child(3)');
    
    if(controlSignal) {
      controlSignal.style.background = '#00c853';
      controlSignal.style.boxShadow = '0 0 10px #00c853';
    }
    if(statusText) {
      statusText.textContent = 'GREEN';
      statusText.style.color = 'var(--g1)';
    }
    sig.passed = true;
  });
  
  document.getElementById('corridorStatus').textContent = 'OVERRIDE ACTIVE';
  document.getElementById('corridorStatus').style.color = 'var(--g1)';
  document.getElementById('greenStatus').textContent = '🟢';
}

(function() {
  const override = JSON.parse(localStorage.getItem('lc_signal_override') || 'null');
  if(override && override.active) {
    if(Date.now() - override.timestamp < 60000) {
      setTimeout(overrideAllSignalsGreen, 1000);
    }
  }
})();