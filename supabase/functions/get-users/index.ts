// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log("Get Users Function")

Deno.serve(async (req) => {
  try {
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

    // Get all auth users with admin privileges
    const { data: { users }, error: authError } = await supabaseClient.auth.admin.listUsers()
    
    if (authError) throw authError
    
    // Get order counts for each user
    const { data: orders, error: ordersError } = await supabaseClient
      .from('orders')
      .select('user_id')
    
    if (ordersError) throw ordersError
    
    // Count orders per user
    const orderCounts = new Map<string, number>()
    orders?.forEach((order: any) => {
      const userId = order.user_id
      if (userId) {
        orderCounts.set(userId, (orderCounts.get(userId) || 0) + 1)
      }
    })
    
    // Combine users with order counts
    const usersData = users.map(user => ({
      id: user.id,
      email: user.email || '',
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      disabled: user.banned_until !== null || user.user_metadata?.disabled === true,
      orderCount: orderCounts.get(user.id) || 0,
    }))

    return new Response(
      JSON.stringify({ users: usersData }),
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-users' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjM0YWU2MTRkLWI0OTctNGVkNC1hYmRhLTgxOTg5ZDU2ZWRkOCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODMxNDMxODl9.57mKLOtdPAtb9Bsr4RgvkrERE4FO7Aa-wzcvpw6cy_tjGc94bUkw9Rz5lZfBm8BI4qMAiCG5YurMUjjWAMXsGQ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
