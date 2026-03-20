import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      } as admin.ServiceAccount),
    });
    console.log("FIREBASE_ADMIN_INITIALIZED");
  } catch (error) {
    console.error("FIREBASE_ADMIN_INIT_ERROR:", error);
  }
}

export const adminAuth: admin.auth.Auth = admin.auth();
export const adminDb: admin.firestore.Firestore = admin.firestore();
export { admin };
