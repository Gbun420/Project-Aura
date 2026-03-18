import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
// AURA_OS: CLOUD-READY SOVEREIGN LEDGER (Supabase/Postgres)
const prisma = new PrismaClient({
    adapter,
});
export { prisma as db };
//# sourceMappingURL=database.js.map