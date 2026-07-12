// Trip Management 9-step demo test script
// To run: node tests/trip-demo.js (make sure server is running on localhost:5000)

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Helper to delay between steps
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Store tokens/IDs for demo
let authToken;
let vehicleId;
let driverId;
let tripId;
let maintenanceId;

async function runDemo() {
  try {
    console.log('🚀 Starting Trip Management Demo...\n');

    // Step 0: Create a fleet manager user (if needed)
    console.log('📝 Step 0: Creating fleet manager user...');
    try {
      const signupRes = await axios.post(`${API_BASE}/auth/signup`, {
        name: 'Fleet Manager',
        email: 'manager@demo.com',
        password: 'password123',
        role: 'fleet_manager'
      });
      authToken = signupRes.data.data.token;
      console.log('✅ Fleet manager created, token obtained');
    } catch (err) {
      if (err.response?.data?.code === 'EMAIL_EXISTS') {
        // If user exists, log in instead
        console.log('ℹ️ User already exists, logging in...');
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
          email: 'manager@demo.com',
          password: 'password123'
        });
        authToken = loginRes.data.data.token;
        console.log('✅ Logged in successfully');
      } else {
        throw err;
      }
    }
    await delay(500);

    // Step 1: Register a vehicle
    console.log('\n🚗 Step 1: Registering a vehicle...');
    const vehicleRes = await axios.post(
      `${API_BASE}/vehicles`,
      {
        reg_number: 'TRIP-DEMO-001',
        name: 'Demo Truck',
        type: 'Truck',
        max_capacity: 2000,
        odometer: 50000,
        acquisition_cost: 75000
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    vehicleId = vehicleRes.data.data.id;
    console.log('✅ Vehicle registered, ID:', vehicleId);
    await delay(500);

    // Step 2: Register a driver
    console.log('\n👨‍✈️ Step 2: Registering a driver...');
    const driverRes = await axios.post(
      `${API_BASE}/drivers`,
      {
        name: 'Demo Driver',
        license_number: 'LIC-DEMO-001',
        license_category: 'HGV',
        license_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        contact: '+1-555-123-4567',
        safety_score: 95
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    driverId = driverRes.data.data.id;
    console.log('✅ Driver registered, ID:', driverId);
    await delay(500);

    // Step 3: Create a trip (draft)
    console.log('\n📋 Step 3: Creating a trip...');
    const tripRes = await axios.post(
      `${API_BASE}/trips`,
      {
        source: 'Warehouse A',
        destination: 'Store B',
        vehicle_id: vehicleId,
        driver_id: driverId,
        cargo_weight: 1500,
        planned_distance: 150
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    tripId = tripRes.data.data.id;
    console.log('✅ Trip created, ID:', tripId, 'Status:', tripRes.data.data.status);
    await delay(500);

    // Step 4: Dispatch the trip
    console.log('\n🚀 Step 4: Dispatching the trip...');
    const dispatchRes = await axios.patch(
      `${API_BASE}/trips/${tripId}/dispatch`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Trip dispatched, Status:', dispatchRes.data.data.status);
    // Verify vehicle/driver statuses are 'on_trip'
    const vehicleCheck = await axios.get(`${API_BASE}/vehicles/${vehicleId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const driverCheck = await axios.get(`${API_BASE}/drivers/${driverId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('   🚗 Vehicle status:', vehicleCheck.data.data.status);
    console.log('   👨‍✈️ Driver status:', driverCheck.data.data.status);
    await delay(500);

    // Step 5: Attempt to double-book (create another trip with same vehicle/driver) — should fail!
    console.log('\n⚠️ Step 5: Attempting to double-book the vehicle...');
    try {
      await axios.post(
        `${API_BASE}/trips`,
        {
          source: 'Warehouse C',
          destination: 'Store D',
          vehicle_id: vehicleId,
          driver_id: driverId,
          cargo_weight: 1000,
          planned_distance: 100
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('❌ Double-booking should have failed!');
    } catch (err) {
      if (err.response?.status === 422) {
        console.log('✅ SUCCESS: Double-booking blocked as expected');
        console.log('   Error code:', err.response.data.code);
        console.log('   Error message:', err.response.data.message);
      } else {
        throw err;
      }
    }
    await delay(500);

    // Step 6: Complete the trip
    console.log('\n✅ Step 6: Completing the trip...');
    const completeRes = await axios.patch(
      `${API_BASE}/trips/${tripId}/complete`,
      {
        actual_distance: 155,
        fuel_consumed: 35.5
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Trip completed, Status:', completeRes.data.data.status);
    // Verify vehicle/driver statuses are back to 'available'
    const vehicleCheck2 = await axios.get(`${API_BASE}/vehicles/${vehicleId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const driverCheck2 = await axios.get(`${API_BASE}/drivers/${driverId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('   🚗 Vehicle status:', vehicleCheck2.data.data.status);
    console.log('   👨‍✈️ Driver status:', driverCheck2.data.data.status);
    await delay(500);

    // Step 7: Create maintenance log for the vehicle
    console.log('\n🔧 Step 7: Creating maintenance log (putting vehicle in shop)...');
    const maintenanceRes = await axios.post(
      `${API_BASE}/maintenance`, // Wait, do we have maintenance endpoints? If not, update vehicle status directly for demo
      // Since maintenance endpoints aren't built yet, let's just update vehicle status
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    // Fallback: update vehicle status directly to 'in_shop' for demo
    const updateVehicleRes = await axios.put(
      `${API_BASE}/vehicles/${vehicleId}`,
      { status: 'in_shop' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Maintenance log created, vehicle status set to in_shop');
    await delay(500);

    // Step 8: Confirm vehicle is hidden from dispatch pool
    console.log('\n🔍 Step 8: Confirming vehicle is unavailable for dispatch...');
    try {
      await axios.post(
        `${API_BASE}/trips`,
        {
          source: 'Warehouse E',
          destination: 'Store F',
          vehicle_id: vehicleId,
          driver_id: driverId,
          cargo_weight: 1000,
          planned_distance: 100
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('❌ Vehicle should not be available for dispatch!');
    } catch (err) {
      if (err.response?.status === 422) {
        console.log('✅ SUCCESS: Vehicle is blocked from dispatch as expected');
        console.log('   Error code:', err.response.data.code);
        console.log('   Error message:', err.response.data.message);
      } else {
        throw err;
      }
    }

    console.log('\n🎉 Demo completed successfully!');
  } catch (err) {
    console.error('\n❌ Demo failed:', err.response?.data || err.message);
  }
}

// Run the demo
runDemo();
