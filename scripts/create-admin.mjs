#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🔧 Admin User Creation Script\n');

  const email = await question('Enter admin email: ');
  const password = await question('Enter admin password: ');

  if (!email || !password) {
    console.error('❌ Email and password are required');
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: 'ADMIN',
      },
      create: {
        email,
        passwordHash,
        role: 'ADMIN',
      },
    });

    console.log(`✅ Admin user created/updated: ${admin.email}`);
    console.log(`🔑 Role: ${admin.role}`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});