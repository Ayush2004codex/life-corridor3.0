import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testAIFeatures() {
  console.log('--- Starting AI Feature Test ---\n');
  let token = '';

  try {
    console.log('1. Registering/Logging in test driver...');
    const credentials = { email: 'testdriver@lifecorridor.io', password: 'password123' };
    
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        name: 'Test Driver',
        role: 'driver',
        ...credentials
      });
    } catch (e) {
      if (e.response?.status !== 409) throw e;
    }

    const loginRes = await axios.post(`${API_BASE}/auth/login`, credentials);
    token = loginRes.data.tokens.accessToken;
    console.log('✅ Logged in successfully. Token acquired.\n');

  } catch (err) {
    console.error('❌ Auth failed:', err.response?.data || err.message);
    return;
  }

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // Test 1: Triage
  console.log('2. Testing AI Triage Endpoint...');
  try {
    const triageRes = await axios.post(`${API_BASE}/emergencies/triage`, {
      symptoms: 'Patient is clutching chest, sweating heavily, and reports left arm numbness.'
    }, authHeaders);
    
    console.log('✅ Triage AI Response:');
    console.log(JSON.stringify(triageRes.data.data, null, 2), '\n');
  } catch (err) {
    console.error('❌ Triage failed:', err.response?.data || err.message);
  }

  // Test 2: Calculate Route
  console.log('3. Testing AI Predictive Routing Endpoint...');
  try {
    const routeRes = await axios.post(`${API_BASE}/routes/calculate`, {
      startLocation: { address: 'Salt Lake Sector 5, Kolkata' },
      endLocation: { address: 'Apollo Hospital, Bypass, Kolkata' }
    }, authHeaders);
    
    console.log('✅ Route AI Response:');
    console.log(`Optimal Route: ${routeRes.data.data.optimalRouteName}`);
    console.log(`Duration: ${routeRes.data.data.duration} mins`);
    console.log(`Traffic Level: ${routeRes.data.data.trafficLevel}`);
    console.log(`AI Reasoning: ${routeRes.data.data.aiReasoning}\n`);
  } catch (err) {
    console.error('❌ Route failed:', err.response?.data || err.message);
  }
}

testAIFeatures();
