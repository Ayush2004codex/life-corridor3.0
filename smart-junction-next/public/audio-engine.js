// Life-Corridor Premium UI Audio Engine (Web Audio API)

let audioCtx;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Bind initialization to first click anywhere on document
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

window.playClickSound = function() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = 'sine';
  // Fast pop frequency drop
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
  
  // Fast volume envelope
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

window.playPingSound = function() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // High pitch radar ping
  
  // Fade out
  gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 1.2);
};

window.playSuccessSound = function() {
  if (!audioCtx) return;
  
  const playTone = (freq, startTime, duration) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };
  
  playTone(800, audioCtx.currentTime, 0.3);
  playTone(1200, audioCtx.currentTime + 0.15, 0.5);
};

// Auto-bind click sounds to all buttons globally
const setupUI = () => {
  // Use event delegation to catch all current and future buttons
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) {
      if (window.playClickSound) window.playClickSound();
      
      // Add visual feedback class temporarily
      btn.classList.add('btn-press');
      setTimeout(() => btn.classList.remove('btn-press'), 150);
    }
  });
  
  // Inject the global micro-animation styles dynamically so we don't have to edit all CSS files
  const style = document.createElement('style');
  style.textContent = `
    button {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    button:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    .btn-press {
      transform: scale(0.95) !important;
      filter: brightness(0.9);
    }
    
    /* Extreme Glassmorphism Utility Classes */
    .premium-glass {
      background: rgba(10, 15, 26, 0.75) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1) !important;
    }
    
    /* Premium Slide-Up Animation */
    @keyframes slideUpPremium {
      0% { opacity: 0; transform: translateY(30px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-slide-up {
      animation: slideUpPremium 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `;
  document.head.appendChild(style);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupUI);
} else {
  setupUI();
}
