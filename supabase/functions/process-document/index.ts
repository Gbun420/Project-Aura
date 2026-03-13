import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    const { id, file_path, profile_id } = record

    if (!file_path) {
      throw new Error('No file_path provided')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Download file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('compliance-vault')
      .download(file_path)

    if (downloadError) throw downloadError

    // 2. Call Hugging Face Donut Model
    const hfToken = Deno.env.get('HF_TOKEN')
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/naver-clova-ix/donut-base-sroie",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfToken}`,
          "Content-Type": "application/octet-stream"
        },
        body: fileData
      }
    )

    const ocrResult = await hfResponse.json()
    
    // 3. Process Result & Update DB
    // Simple logic for demo: if confidence is low, set to WARNING
    const extractionConfidence = ocrResult?.[0]?.score || 0.85
    const status = extractionConfidence > 0.9 ? 'VERIFIED' : 'WARNING'
    const manualReview = extractionConfidence < 0.85

    const { error: updateError } = await supabase
      .from('compliance_documents')
      .update({
        pulse_status: status,
        requires_manual_review: manualReview,
        ocr_metadata: ocrResult,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true, status, confidence: extractionConfidence }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
