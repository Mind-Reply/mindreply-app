#!/usr/bin/env node
/**
 * Payment Integration Test
 * Quick verification that Stripe endpoints are working
 */

const http = require('http');

async function testEndpoint(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: JSON.parse(data || '{}'),
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 MindReply Payment Integration Tests\n');

  try {
    // Test 1: Health check
    console.log('1️⃣  Testing /api/health...');
    const health = await testEndpoint('GET', '/api/health');
    if (health.status === 200) {
      console.log('   ✓ Health check passed\n');
    } else {
      console.log(`   ✗ Health check failed (${health.status})\n`);
    }

    // Test 2: Payment challenge request
    console.log('2️⃣  Testing payment challenge creation...');
    const paymentReq = {
      agent_id: 'test-agent-001',
      service_type: 'rwa_bridge',
      amount_cents: 50,
      currency: 'usd',
      payment_method: 'spt',
    };

    console.log(`   Request: POST /api/payments with ${JSON.stringify(paymentReq, null, 2)}`);

    const challengeRes = await testEndpoint('POST', '/api/payments', paymentReq);
    if (challengeRes.status === 200 && challengeRes.body.payment_id) {
      console.log('   ✓ Payment challenge created');
      console.log(`   Payment ID: ${challengeRes.body.payment_id}`);
      console.log(`   Expires at: ${new Date(challengeRes.body.expires_at).toISOString()}\n`);

      // Test 3: Check payment status
      const paymentId = challengeRes.body.payment_id;
      console.log('3️⃣  Testing payment status check...');
      const statusRes = await testEndpoint('GET', `/api/payments/${paymentId}`);
      if (statusRes.status === 200) {
        console.log(`   ✓ Payment status retrieved`);
        console.log(`   Status: ${statusRes.body.status}`);
        console.log(`   Agent: ${statusRes.body.agent_id}\n`);
      } else {
        console.log(`   ✗ Payment status check failed (${statusRes.status})\n`);
      }
    } else {
      console.log(`   ✗ Payment challenge creation failed (${challengeRes.status})\n`);
      console.log(`   Response: ${JSON.stringify(challengeRes.body, null, 2)}\n`);
    }

    // Test 4: Check minimum amount validation
    console.log('4️⃣  Testing amount validation (< $0.50 should fail)...');
    const invalidReq = {
      agent_id: 'test-agent-002',
      service_type: 'test',
      amount_cents: 25, // Below $0.50 minimum
      currency: 'usd',
      payment_method: 'spt',
    };

    const invalidRes = await testEndpoint('POST', '/api/payments', invalidReq);
    if (invalidRes.status === 400) {
      console.log('   ✓ Minimum amount validation working\n');
    } else {
      console.log(`   ✗ Validation failed (expected 400, got ${invalidRes.status})\n`);
    }

    console.log('✅ All tests completed!');
    console.log('\nNext: Configure Stripe API keys in .env.local');
    console.log('Then: docker compose up --pull always');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nEnsure services are running: docker compose up');
    process.exit(1);
  }
}

runTests();
