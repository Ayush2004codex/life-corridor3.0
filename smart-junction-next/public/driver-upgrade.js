/* ============================================
   LIFE CORRIDOR — AI CHATBOT & SOS SYSTEM
   ============================================ */

// Chatbot State
let chatOpen = false;
function toggleChat() {
  chatOpen = !chatOpen;
  const widget = document.getElementById('chatWidget');
  if (widget) widget.style.display = chatOpen ? 'flex' : 'none';
}

function addChatMsg(text, sender) {
  const body = document.getElementById('chatBody');
  if (!body) return;
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + (sender === 'ai' ? 'ai-msg' : 'user-msg');
  msg.textContent = text;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
  if (!chatOpen) toggleChat(); // Auto open if new msg arrives
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if(!text) return;
  input.value = '';
  
  addChatMsg(text, 'user');
  await processAICommand(text, false); // false = don't speak unless requested
}

// SOS Logic
let sosActive = false;
const emergencySound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-ambulance-siren-us-1642.mp3');
emergencySound.loop = true;

function toggleSOS() {
  sosActive = !sosActive;
  const btn = document.getElementById('sosBtn');
  const flash = document.getElementById('sosFlash');
  
  if (sosActive) {
    if(btn) {
      btn.classList.add('active');
      btn.style.background = '#ff4444';
      btn.style.color = '#fff';
      btn.innerHTML = '🚨 GLOBAL SOS ACTIVE';
    }
    if (flash) flash.classList.add('active');
    speak("SOS Emergency broadcasted to nearby hospitals.");
    emergencySound.play().catch(e => console.log('Audio play failed:', e));
    
    // Auto-activate corridor
    if(window.activateCorridor) window.activateCorridor();
  } else {
    if(btn) {
      btn.classList.remove('active');
      btn.style.background = 'transparent';
      btn.style.color = '#ff4444';
      btn.innerHTML = '🚨 ACTIVATE GLOBAL SOS';
    }
    if (flash) flash.classList.remove('active');
    emergencySound.pause();
    emergencySound.currentTime = 0;
  }
}

// Voice Assistant (GROQ AI)
let voiceListening = false;
function toggleVoice() {
  const btn = document.getElementById('chatMicBtn');
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    speak('Voice not supported'); return;
  }
  
  if (voiceListening) { 
    voiceListening = false; 
    if(btn) btn.classList.remove('listening'); 
    return; 
  }
  
  voiceListening = true;
  if(btn) btn.classList.add('listening');
  speak("Listening");
  
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.onresult = (e) => {
    const cmd = e.results[0][0].transcript;
    addChatMsg(cmd, 'user');
    processAICommand(cmd, true);
  };
  rec.onerror = () => { voiceListening = false; if(btn) btn.classList.remove('listening'); };
  rec.onend = () => { voiceListening = false; if(btn) btn.classList.remove('listening'); };
  rec.start();
}

async function processAICommand(cmd, useVoice = true) {
  let actionTaken = false;
  let actionText = "";
  const lowerCmd = cmd.toLowerCase();
  
  if (lowerCmd.includes('emergency') || lowerCmd.includes('corridor')) {
    if(window.activateCorridor) window.activateCorridor();
    actionTaken = true;
    actionText = "Emergency corridor activated.";
  } else if (lowerCmd.includes('sos')) {
    toggleSOS();
    actionTaken = true;
    actionText = "SOS activated.";
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: cmd })
    });
    const data = await response.json();
    let reply = actionTaken ? actionText : "I didn't quite catch that.";
    if(data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
      if(actionTaken) reply = actionText + " " + reply;
    }
    
    addChatMsg(reply, 'ai');
    if(useVoice) speak(reply);
    
  } catch (err) {
    const fallback = actionTaken ? actionText : "AI unavailable right now.";
    addChatMsg(fallback, 'ai');
    if(useVoice) speak(fallback);
  }
}

function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.1;
    window.speechSynthesis.speak(u);
  }
}
