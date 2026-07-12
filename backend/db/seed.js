const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const connectionString = "postgresql://postgres:Pk11@2007@localhost:5432/transitops?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Wipe existing data (idempotent — safe to re-run before every demo rehearsal)
  // Since we use auto-increment ints, deleting the records is enough, or we can just use deleteMany
  await prisma.activityLogs?.deleteMany({}); // if exists
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  const pwHash = await bcrypt.hash('password123', 10);

  console.log('Seeding users...');
  await prisma.user.createMany({
    data: [
      { name: 'Asha Rao', email: 'fleet@demo.com', password_hash: pwHash, role: 'fleet_manager' },
      { name: 'Vikram Shah', email: 'safety@demo.com', password_hash: pwHash, role: 'safety_officer' },
      { name: 'Meera Nair', email: 'finance@demo.com', password_hash: pwHash, role: 'financial_analyst' },
    ],
  });

  console.log('Seeding vehicles...');
  await prisma.vehicle.createMany({
    data: [
      { reg_number: 'KA-05-AB-1234', name: 'Van-05', type: 'van', max_capacity: 500, odometer: 12000, acquisition_cost: 850000, status: 'available' },
      { reg_number: 'KA-05-AB-5678', name: 'Truck-12', type: 'truck', max_capacity: 2000, odometer: 45000, acquisition_cost: 2100000, status: 'available' },
      { reg_number: 'KA-05-AB-9012', name: 'Van-08', type: 'van', max_capacity: 450, odometer: 8000, acquisition_cost: 780000, status: 'available' },
    ],
  });

  console.log('Seeding drivers...');
  await prisma.driver.createMany({
    data: [
      { name: 'Alex Menon', license_number: 'DL-99881', license_category: 'LMV', license_expiry: new Date('2027-01-01'), contact: '9900011122', safety_score: 92, status: 'available' },
      { name: 'Priya Suresh', license_number: 'DL-99882', license_category: 'HMV', license_expiry: new Date('2026-08-01'), contact: '9900011123', safety_score: 88, status: 'available' },
      { name: 'Ravi Kumar', license_number: 'DL-99883', license_category: 'LMV', license_expiry: new Date('2025-01-01'), contact: '9900011124', safety_score: 70, status: 'available' },
    ],
  });

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
