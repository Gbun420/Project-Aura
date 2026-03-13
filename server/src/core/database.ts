import { PrismaClient } from '@prisma/client';

// AURA_OS: CLOUD-READY SOVEREIGN LEDGER (Supabase/Postgres)
// Switched from SQLite to Prisma Client v1.0

const prisma = new PrismaClient();

export { prisma as db };
