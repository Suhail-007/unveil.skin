// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log("Disable User Function")

Deno.serve(async (req) => {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { 
          headers: { "Content-Type": "application/json" },
          status: 400
        }
      )
    }

    // Create a Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Disable user by banning for a very long time (100 years)
    const { data, error } = await supabaseClient.auth.admin.updateUserById(
      userId,
      { ban_duration: '876000h' }
    )
    
    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, user: data.user }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 400
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/disable-user' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjM3MTBiNmNiLTdmN2MtNDYxNy05MWVlLWNiY2JiNThjMDJkMyIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODMxNDM0Nzl9.Ua49AUsoVCkkRr7dMJpzfdoxCKQq5C6SNt_Y63HLPngEs8qPhNllURDdgCaOLysAesqxmbfsOrilYLYFhzI1AQ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
