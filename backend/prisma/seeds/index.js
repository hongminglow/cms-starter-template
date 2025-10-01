// @ts-nocheck
/* eslint-env node */
/* eslint-disable no-undef */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash,
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('❌ Seeding failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
