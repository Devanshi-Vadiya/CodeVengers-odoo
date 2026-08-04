const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const connectionString = "postgresql://neondb_owner:npg_w8n5RrvXDmaG@ep-dawn-tooth-ao906iqj.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=60";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Clean old data
  await prisma.expense.deleteMany({});
  await prisma.fuelLog.deleteMany({});
  await prisma.maintenanceLog.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.user.deleteMany({});

  const pwHash = await bcrypt.hash('password123', 10);

  console.log('Seeding users...');
  const users = [];
  const roles = ['fleet_manager', 'driver', 'safety_officer', 'financial_analyst'];
  const emails = ['fleet@demo.com', 'driver@demo.com', 'safety@demo.com', 'finance@demo.com'];
  const names = ['Asha Rao', 'Alex Menon', 'Vikram Shah', 'Meera Nair'];

  for (let i = 0; i < roles.length; i++) {
    const u = await prisma.user.create({
      data: {
        name: names[i],
        email: emails[i],
        password_hash: pwHash,
        role: roles[i],
      }
    });
    users.push(u);
  }

  console.log('Seeding vehicles...');
  const v1 = await prisma.vehicle.create({ data: { reg_number: 'KA-05-AB-1234', name: 'Van-05', type: 'van', max_capacity: 500, odometer: 12400, acquisition_cost: 850000, status: 'available' } });
  const v2 = await prisma.vehicle.create({ data: { reg_number: 'KA-05-AB-5678', name: 'Truck-12', type: 'truck', max_capacity: 2000, odometer: 45200, acquisition_cost: 2100000, status: 'on_trip' } });
  const v3 = await prisma.vehicle.create({ data: { reg_number: 'KA-05-AB-9012', name: 'Van-08', type: 'van', max_capacity: 600, odometer: 8900, acquisition_cost: 780000, status: 'in_shop' } });
  const v4 = await prisma.vehicle.create({ data: { reg_number: 'KA-05-AB-3456', name: 'Truck-03', type: 'truck', max_capacity: 3000, odometer: 98700, acquisition_cost: 2500000, status: 'available' } });
  const v5 = await prisma.vehicle.create({ data: { reg_number: 'KA-05-AB-7890', name: 'SUV-21', type: 'suv', max_capacity: 400, odometer: 23100, acquisition_cost: 1200000, status: 'available' } });
  const v6 = await prisma.vehicle.create({ data: { reg_number: 'KA-05-AB-2468', name: 'Bus-02', type: 'bus', max_capacity: 5000, odometer: 142000, acquisition_cost: 3200000, status: 'retired' } });

  console.log('Seeding drivers...');
  // Link driver user (users[1] is Alex Menon) to a Driver profile
  const d1 = await prisma.driver.create({ data: { name: 'Alex Menon', license_number: 'DL-99881', license_category: 'LMV', license_expiry: new Date('2027-01-01'), contact: '9900011122', safety_score: 92, status: 'available', userId: users[1].id } });
  const d2 = await prisma.driver.create({ data: { name: 'Priya Suresh', license_number: 'DL-99882', license_category: 'HMV', license_expiry: new Date('2026-08-01'), contact: '9900011123', safety_score: 88, status: 'on_trip' } });
  const d3 = await prisma.driver.create({ data: { name: 'Ravi Kumar', license_number: 'DL-99883', license_category: 'LMV', license_expiry: new Date('2026-07-20'), contact: '9900011124', safety_score: 70, status: 'available' } });
  const d4 = await prisma.driver.create({ data: { name: 'Sanjay Dutt', license_number: 'DL-99884', license_category: 'HMV', license_expiry: new Date('2028-11-15'), contact: '9900011125', safety_score: 95, status: 'available' } });
  const d5 = await prisma.driver.create({ data: { name: 'Karan Johar', license_number: 'DL-99885', license_category: 'LMV', license_expiry: new Date('2026-06-01'), contact: '9900011126', safety_score: 55, status: 'suspended' } });

  console.log('Seeding trips...');
  // Completed trips (needed for reports and revenue)
  await prisma.trip.create({
    data: {
      source: 'Chennai Port', destination: 'Bangalore Hub', vehicle_id: v1.id, driver_id: d1.id, cargo_weight: 450, planned_distance: 350, actual_distance: 360, fuel_consumed: 30, status: 'completed',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), dispatched_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  });
  await prisma.trip.create({
    data: {
      source: 'Mumbai Port', destination: 'Pune Warehouse', vehicle_id: v2.id, driver_id: d2.id, cargo_weight: 1800, planned_distance: 150, actual_distance: 155, fuel_consumed: 45, status: 'completed',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), dispatched_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  });
  await prisma.trip.create({
    data: {
      source: 'Delhi GFD', destination: 'Noida Depot', vehicle_id: v4.id, driver_id: d4.id, cargo_weight: 2500, planned_distance: 60, actual_distance: 65, fuel_consumed: 18, status: 'completed',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed_at: new Date(Date.now() - 12 * 60 * 60 * 1000), dispatched_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  });

  // Active / Dispatched trip
  await prisma.trip.create({
    data: {
      source: 'Kolkata Dock', destination: 'Howrah Terminal', vehicle_id: v2.id, driver_id: d2.id, cargo_weight: 1200, planned_distance: 40, status: 'dispatched',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000), dispatched_at: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  });

  // Draft trip
  await prisma.trip.create({
    data: {
      source: 'Hyderabad Plant', destination: 'Secunderabad Office', vehicle_id: v1.id, driver_id: d3.id, cargo_weight: 200, planned_distance: 30, status: 'draft',
      created_at: new Date()
    }
  });

  // Cancelled trip
  await prisma.trip.create({
    data: {
      source: 'Ahmedabad GIDC', destination: 'Baroda GIDC', vehicle_id: v5.id, driver_id: d3.id, cargo_weight: 100, planned_distance: 120, status: 'cancelled',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('Seeding fuel logs...');
  await prisma.fuelLog.create({ data: { vehicle_id: v1.id, liters: 50, cost: 5000, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) } });
  await prisma.fuelLog.create({ data: { vehicle_id: v1.id, liters: 40, cost: 4100, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) } });
  await prisma.fuelLog.create({ data: { vehicle_id: v2.id, liters: 120, cost: 12000, date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) } });
  await prisma.fuelLog.create({ data: { vehicle_id: v2.id, liters: 100, cost: 10500, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } });
  await prisma.fuelLog.create({ data: { vehicle_id: v4.id, liters: 180, cost: 18500, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) } });

  console.log('Seeding maintenance logs...');
  // Open Maintenance
  await prisma.maintenanceLog.create({
    data: { vehicle_id: v3.id, description: 'Engine warning light ON. Suspected sensor issue.', cost: 3500, priority: 'High', status: 'open', opened_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) }
  });
  await prisma.maintenanceLog.create({
    data: { vehicle_id: v1.id, description: 'AC unit blowing warm air. Recharge coolant.', cost: 1500, priority: 'Medium', status: 'open', opened_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
  });

  // Closed Maintenance
  await prisma.maintenanceLog.create({
    data: {
      vehicle_id: v2.id, description: 'Regular 45k service, brake pad replacement, and alignment.', cost: 8500, priority: 'Low', status: 'closed',
      opened_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), closed_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000), closing_notes: 'Brake pads replaced and tire rotation completed.'
    }
  });

  console.log('Seeding expenses...');
  await prisma.expense.create({ data: { vehicle_id: v1.id, type: 'insurance', amount: 15000, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) } });
  await prisma.expense.create({ data: { vehicle_id: v2.id, type: 'permit', amount: 8000, date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) } });
  await prisma.expense.create({ data: { vehicle_id: v4.id, type: 'tolls', amount: 4500, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) } });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
