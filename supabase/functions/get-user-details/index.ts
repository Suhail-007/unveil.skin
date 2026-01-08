// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log("Get User Details Function")

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

    // Create a Supabase client with the Auth context of the logged in user
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

    // Get user details
    const { data: { user }, error: authError } = await supabaseClient.auth.admin.getUserById(userId)
    
    if (authError) throw authError
    
    // Get user's orders
    const { data: orders, error: ordersError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (ordersError) throw ordersError

    const userData = {
      id: user.id,
      email: user.email || '',
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      disabled: user.banned_until !== null || user.user_metadata?.disabled === true,
      orderCount: orders?.length || 0,
      orders: orders || []
    }

    return new Response(
      JSON.stringify({ user: userData }),
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-user-details' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjUyZGExOTM3LWIwNmQtNDlmYi1iMDcwLWMwMDJhYmRiMDZlOCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODMxNDMyODN9.AMR9rfWgUnZjVJcVHClVtmTir68M35d5gbtJ4WwWUXnGOu_MHudE8GLgF_VfwTFnhHi6BTXEbb29QofAUmHdNg' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
