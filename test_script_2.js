
    // ==========================================
    // ICU MEDICAL MONITOR ENGINE
    // ==========================================
    const ecgCanvas = document.getElementById('ecgCanvas');
    if (ecgCanvas) {
      const ecgCtx = ecgCanvas.getContext('2d');
      let ecgX = 0;
      let ecgY = 75;
      let ecgFrame = 0;
      let currentBPM = 88;
      let currentBP_sys = 120;
      let currentBP_dia = 80;
      let currentResp = 18;
      let patientState = 'Stable';
      let eMode = false;

      // AI Vital Simulator
      setInterval(() => {
        try {
          eMode = (document.getElementById('activeStatus').style.display !== 'none' && document.getElementById('activeStatus').style.display !== '');
        } catch(e){}

        if (eMode) {
          // Condition worsens slightly if emergency active
          if (Math.random() > 0.6) currentBPM += Math.floor(Math.random() * 3);
          if (Math.random() > 0.8) currentBPM -= Math.floor(Math.random() * 2);
          
          // CAP BPM to realistic emergency levels (max 180)
          if (currentBPM > 180) currentBPM = 175 + Math.floor(Math.random() * 5);
          if (currentBPM < 40) currentBPM = 45 + Math.floor(Math.random() * 5);

          if (currentBPM > 140) {
            patientState = 'Critical';
            currentBP_sys = Math.floor(85 + Math.random() * 15);
            currentBP_dia = Math.floor(55 + Math.random() * 10);
            currentResp = Math.floor(24 + Math.random() * 6);
          } else if (currentBPM > 110) {
            patientState = 'High Risk';
            currentBP_sys = Math.floor(100 + Math.random() * 20);
            currentBP_dia = Math.floor(70 + Math.random() * 10);
            currentResp = Math.floor(20 + Math.random() * 4);
          } else {
            patientState = 'Stable';
            currentBP_sys = Math.floor(115 + Math.random() * 10);
            currentBP_dia = Math.floor(75 + Math.random() * 10);
            currentResp = Math.floor(16 + Math.random() * 4);
          }
        } else {
          // Stabilize towards normal levels
          if (currentBPM > 85) currentBPM -= 1;
          if (currentBPM < 75) currentBPM += 1;
          currentBP_sys = 120 + Math.floor(Math.random() * 5);
          currentBP_dia = 80 + Math.floor(Math.random() * 5);
          currentResp = 16 + Math.floor(Math.random() * 2);
          patientState = 'Stable';
        }

        document.getElementById('ecg-bpm').textContent = Math.floor(currentBPM);
        document.getElementById('ecg-bpm').style.color = currentBPM > 120 ? '#ff3366' : '#00ff66';

        const bpStr = currentBP_sys + '/' + currentBP_dia;
        document.getElementById('med-bp').textContent = bpStr;
        document.getElementById('med-bp').style.color = currentBP_sys < 95 ? '#ff3366' : '#ffaa00';

        document.getElementById('med-resp').textContent = currentResp;
        document.getElementById('med-temp').textContent = (36.8 + Math.random() * 0.8).toFixed(1) + '°C';

        // Simulate SpO2 dropping if critical
        if (patientState === 'Critical') {
          document.getElementById('med-spo2').textContent = Math.floor(88 + Math.random() * 4) + '%';
          document.getElementById('med-spo2').style.color = '#ff3366';
          document.getElementById('med-cons').textContent = 'Unconscious';
          document.getElementById('med-cons').style.color = '#ff3366';
        } else {
          document.getElementById('med-spo2').textContent = Math.floor(96 + Math.random() * 4) + '%';
          document.getElementById('med-spo2').style.color = '#00e5ff';
          document.getElementById('med-cons').textContent = 'Semi-Conscious';
          document.getElementById('med-cons').style.color = '#00ff66';
        }

        // Sync data to localStorage for Hospital View
        localStorage.setItem('medical_vitals', JSON.stringify({
          bpm: Math.floor(currentBPM),
          state: patientState,
          spo2: document.getElementById('med-spo2').textContent,
          bp: bpStr,
          resp: currentResp,
          temp: document.getElementById('med-temp').textContent,
          pulse: Math.floor(currentBPM),
          eta: document.getElementById('etaVal') ? document.getElementById('etaVal').textContent : '6 mins'
        }));

      }, 2000);

      // ECG Drawing Loop
      function drawECG() {
        ecgCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ecgCtx.fillRect(0, 0, ecgCanvas.width, ecgCanvas.height);
        
        ecgCtx.beginPath();
        ecgCtx.moveTo(ecgX, ecgY);
        
        ecgX += 2;
        if (ecgX >= ecgCanvas.width) {
          ecgX = 0;
        }
        
        // Calculate beat period based on BPM
        const framesPerBeat = (60 / currentBPM) * 60; // Approx 60fps
        ecgFrame++;

        // Draw PQRST wave
        let targetY = 75;
        const beatMod = ecgFrame % Math.floor(framesPerBeat);
        
        if (beatMod === 0) targetY = 75; // Baseline
        else if (beatMod === 5) targetY = 65; // P wave
        else if (beatMod === 10) targetY = 75;
        else if (beatMod === 15) targetY = 85; // Q wave
        else if (beatMod === 17) targetY = 20; // R wave (spike up)
        else if (beatMod === 19) targetY = 120; // S wave (spike down)
        else if (beatMod === 22) targetY = 75;
        else if (beatMod === 30) targetY = 60; // T wave
        else if (beatMod === 35) targetY = 75;

        // Add baseline noise
        if (targetY === 75) targetY += (Math.random() - 0.5) * 5;

        // Smooth interpolation for lines
        ecgY += (targetY - ecgY) * 0.8;
        
        ecgCtx.lineTo(ecgX, ecgY);
        ecgCtx.strokeStyle = currentBPM > 120 ? '#ff3366' : '#00ff66';
        ecgCtx.lineWidth = 2;
        ecgCtx.stroke();
        
        // Draw eraser line ahead
        ecgCtx.fillStyle = '#000';
        ecgCtx.fillRect(ecgX + 2, 0, 10, 150);

        requestAnimationFrame(drawECG);
      }
      
      drawECG();
    }

    // --- Confirm Arrival SMS Trigger ---
    function confirmArrival() {
      const btn = document.getElementById('btnConfirmArrival');
      btn.innerHTML = 'Sending SMS...';
      
      let destName = "Sagar Dutta Medical College";
      const dispDest = document.getElementById('disp-dest');
      if (dispDest && dispDest.textContent.trim() !== '--' && dispDest.textContent.trim() !== '') {
        destName = dispDest.textContent.trim();
      } else {
        const destSelect = document.getElementById('destSelect');
        if (destSelect) {
          destName = destSelect.options[destSelect.selectedIndex].text;
        }
      }

      const payload = JSON.stringify({
        hospital: destName,
        status: 'arrived'
      });

      if (!navigator.onLine) {
         localStorage.setItem('queued_arrival', payload);
         btn.innerHTML = '⚠️ Offline - Will Sync Later';
         btn.style.background = '#ffaa00';
         btn.style.color = '#000';
         alert('You are offline. The arrival confirmation will be sent automatically when you regain connection.');
      } else {
         sendArrivalPayload(payload, btn);
      }
    }

    function sendArrivalPayload(payload, btn) {
      fetch('http://localhost:5000/api/emergencies/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      }).then(() => {
        if(btn) {
          btn.innerHTML = '✅ SMS Sent Successfully';
          btn.style.background = '#00c853';
          btn.style.color = '#fff';
        }
        alert('Arrival confirmed! The family has been notified via SMS/WhatsApp.');
      }).catch(err => {
        console.error('Failed to send arrival SMS', err);
        if(btn) btn.innerHTML = '❌ SMS Failed';
      });
    }

    window.addEventListener('online', () => {
      const queued = localStorage.getItem('queued_arrival');
      if (queued) {
        console.log("Network restored, syncing queued arrival...");
        const btn = document.getElementById('btnConfirmArrival');
        sendArrivalPayload(queued, btn);
        localStorage.removeItem('queued_arrival');
      }
    });

    // --- AI Triage ---
    function runAITriage() {
      const symptoms = document.getElementById('patientSymptoms').value;
      let vitals = "";
      if(document.getElementById('vitalsHR').value) vitals += `HR:${document.getElementById('vitalsHR').value} `;
      if(document.getElementById('vitalsBP').value) vitals += `BP:${document.getElementById('vitalsBP').value} `;
      if(document.getElementById('vitalsSpO2').value) vitals += `SpO2:${document.getElementById('vitalsSpO2').value} `;
      
      const btn = document.getElementById('btnTriage');
      btn.innerHTML = 'Running Triage...';
      
      fetch('http://localhost:5000/api/emergencies/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symptoms, vitals })
      }).then(r=>r.json()).then(resp => {
        const data = resp.data || resp;
        btn.innerHTML = 'Triage Complete';
        document.getElementById('triageResultBox').style.display = 'block';
        document.getElementById('triageSeverity').textContent = data.severity;
        if(data.severity && data.severity.includes('Red')) document.getElementById('triageSeverity').style.color = '#ff4444';
        if(data.severity && data.severity.includes('Yellow')) document.getElementById('triageSeverity').style.color = '#ffaa00';
        document.getElementById('triageEquip').textContent = data.requiredEquipment ? data.requiredEquipment.join(', ') : 'Standard Life Support';
        
        if(data.hospitalPrep) {
          document.getElementById('triagePrepBox').style.display = 'block';
          document.getElementById('triagePrep').textContent = data.hospitalPrep;
        }
      }).catch(e => {
        btn.innerHTML = 'Triage Failed';
        console.error(e);
      });
    }

    // --- Simulate Bottleneck / Reroute ---
    function simulateBottleneck() {
      const btn = document.getElementById('btnReroute');
      btn.innerHTML = 'Calculating Reroute...';
      
      let destName = document.getElementById('disp-dest').textContent.trim();
      if (destName === '--') destName = "Sagar Dutta Medical College";
      let destCoord = hospitals[destName] || hospitals["Sagar Dutta Medical College"];
      
      fetch('http://localhost:5000/api/routes/recalculate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer test'},
        body: JSON.stringify({
          currentLocation: typeof currentPos !== 'undefined' ? currentPos : [22.7303, 88.3703],
          destination: destCoord,
          bottleneck: typeof currentPos !== 'undefined' ? currentPos : [22.7303, 88.3703]
        })
      }).then(r=>r.json()).then(data => {
        btn.innerHTML = 'Route Adjusted ✅';
        document.getElementById('activeStatus').querySelector('.status-desc').innerHTML = `<strong>⚠️ Route Recalculated:</strong> ${data.reason}`;
        
        // Render the new route line
        if(routeLine) lmap.removeLayer(routeLine);
        const newCoords = data.newRoute.map(c => [c[1], c[0]]);
        routeLine = L.polyline(newCoords, {color: '#ffaa00', weight: 6, opacity: 0.8, dashArray: '10, 10'}).addTo(lmap);
        
        setTimeout(() => { btn.innerHTML = '⚠️ SIMULATE BOTTLENECK (AI REROUTE)'; }, 3000);
      }).catch(e => {
        btn.innerHTML = 'Reroute Failed';
        console.error(e);
      });
    }
