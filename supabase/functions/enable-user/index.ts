// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log("Enable User Function")

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

    // Enable user by removing ban
    const { data, error } = await supabaseClient.auth.admin.updateUserById(
      userId,
      { ban_duration: 'none' }
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/enable-user' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImU2OTViZTJjLWU3ZGMtNGZhZS04ODRlLWMyNTVjNDE5YTg0YyIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODMxNDM1MDR9.j82uiXkVYq0lg4Gvpsil5VlVpYWBLiqNTQX_v42uE1lRRtL6uMQI1lg5gw33yFPznqneCFfnkE5PKEFnQyBAig' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
