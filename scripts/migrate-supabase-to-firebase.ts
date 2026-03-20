import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// 1. Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Use service role for migration
);

// 2. Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function migrateTable(supabaseTable: string, firestoreCollection: string) {
  console.log(`>>> Migrating ${supabaseTable} to ${firestoreCollection}...`);
  
  const { data, error } = await supabase.from(supabaseTable).select('*');
  
  if (error) {
    console.error(`Error fetching from ${supabaseTable}:`, error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log(`No data found in ${supabaseTable}.`);
    return;
  }
  
  const batch = db.batch();
  data.forEach((item) => {
    const docRef = db.collection(firestoreCollection).doc(item.id.toString());
    batch.set(docRef, item);
  });
  
  await batch.commit();
  console.log(`<<< Successfully migrated ${data.length} records to ${firestoreCollection}.`);
}

async function runMigration() {
  try {
    // Migrate Vacancies
    await migrateTable('vacancies', 'vacancies');
    
    // Migrate Compliance Documents
    await migrateTable('compliance_documents', 'compliance_documents');
    
    // Migrate Profiles (if they exist in Supabase auth.users or a custom table)
    // Note: Migrating Users from Supabase Auth to Firebase Auth is more complex 
    // and usually requires exporting/importing via CLI.
    
    console.log('--- ALL MIGRATIONS COMPLETE ---');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

runMigration();
