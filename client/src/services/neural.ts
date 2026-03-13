import { supabase } from '../lib/supabase';

export async function generateEmbedding(text: string, recordId: string, table: string) {
  const { data, error } = await supabase.functions.invoke('generate-embedding', {
    body: { text, recordId, table },
  });

  if (error) {
    console.error('Error calling generate-embedding:', error);
    throw error;
  }

  // Update the record with the new embedding
  const updateColumn = table === 'vacancies' ? 'job_embedding' : 'embedding';
  const { error: updateError } = await supabase
    .from(table)
    .update({ [updateColumn]: data.embedding })
    .eq('id', recordId);

  if (updateError) {
    console.error(`Error updating ${table} with embedding:`, updateError);
    throw updateError;
  }

  return data.embedding;
}

export async function getMatchScore(profileId: string, jobId: string) {
  const { data, error } = await supabase.rpc('calculate_match', { 
    profile_id: profileId, 
    vacancy_id: jobId 
  });

  if (error) {
    console.error('Error fetching match score:', error);
    return 0;
  }

  return data;
}
