import admin from 'firebase-admin';

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  const db = admin.firestore();
  const email = 'debug_1774044753887@nova.mt';
  
  console.log(`>>> PROMOTING ${email} TO EMPLOYER...`);
  
  const snap = await db.collection('profiles').where('email', '==', email).get();
  
  if (snap.empty) {
    console.log('User not found in profiles.');
    return;
  }

  const doc = snap.docs[0];
  await doc.ref.update({
    role: 'employer',
    company_name: 'Verified Audit Corp'
  });

  console.log('✅ PROMOTION SUCCESSFUL.');
}

main().catch(console.error);
