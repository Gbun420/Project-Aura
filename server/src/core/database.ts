import { PrismaClient } from '@prisma/client';

// AURA_OS: CLOUD-READY SOVEREIGN LEDGER (Supabase/Postgres)
const prisma = new PrismaClient();

export { prisma as db };
