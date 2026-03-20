import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { env } from '../config/env';

export async function generateEmbedding(text: string, recordId: string, table: string) {
  const token = await auth.currentUser?.getIdToken();
  
  const response = await fetch(`${env.apiUrl}/api/ai/neural`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      action: 'GENERATE_EMBEDDING',
      text,
      recordId,
      table
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to generate embedding');
  }

  // Update the record with the new embedding in Firestore
  const updateColumn = table === 'vacancies' ? 'job_embedding' : 'embedding';
  const docRef = doc(db, table, recordId);
  
  try {
    await updateDoc(docRef, { [updateColumn]: data.embedding });
  } catch (err) {
    console.error(`Error updating ${table} with embedding:`, err);
    throw err;
  }

  return data.embedding;
}

export async function getMatchScore(profileId: string, jobId: string) {
  const token = await auth.currentUser?.getIdToken();
  
  try {
    const response = await fetch(`${env.apiUrl}/api/neural/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ profileId, jobId }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Match calculation failed');
    return data.score;
  } catch (err) {
    console.error('Error fetching match score:', err);
    return 0;
  }
}
