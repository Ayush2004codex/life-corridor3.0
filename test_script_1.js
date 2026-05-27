
    // ==========================================
    // DISPATCH SYSTEM RECEIVER
    // ==========================================
    setInterval(() => {
      const reqStr = localStorage.getItem('dispatch_request');
      const accStr = localStorage.getItem('dispatch_accepted');
      if (reqStr && accStr === 'false') {
        const req = JSON.parse(reqStr);
        document.getElementById('disp-id').textContent = req.id;
        document.getElementById('disp-pickup').textContent = req.pickup;
        document.getElementById('disp-dest').textContent = req.destination;
        document.getElementById('disp-type').textContent = req.type;
        document.getElementById('disp-sev').textContent = req.severity;
        
        // New Dual Flow Fields
        document.getElementById('disp-hosptype').textContent = req.hospitalType || 'Unknown';
        if (req.bedAvailability && req.bedAvailability !== 'Pending/Unknown') {
          document.getElementById('disp-beds-container').style.display = 'block';
          document.getElementById('disp-beds').textContent = req.bedAvailability;
        } else {
          document.getElementById('disp-beds-container').style.display = 'none';
        }

        document.getElementById('dispatchOverlay').style.display = 'flex';
      } else {
        document.getElementById('dispatchOverlay').style.display = 'none';
      }
    }, 1000);

    function acceptDispatch() {
      localStorage.setItem('dispatch_accepted', 'true');
      document.getElementById('dispatchOverlay').style.display = 'none';
      
      // Auto-fill and activate
      document.getElementById('pickup').value = document.getElementById('disp-pickup').textContent;
      // Trigger native activate
      activateCorridor();
    }

    function rejectDispatch() {
      localStorage.setItem('dispatch_request', ''); // Clear it
      document.getElementById('dispatchOverlay').style.display = 'none';
    }
