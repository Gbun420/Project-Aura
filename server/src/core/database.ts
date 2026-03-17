import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// AURA_OS: CLOUD-READY SOVEREIGN LEDGER (Supabase/Postgres)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export { prisma as db };
