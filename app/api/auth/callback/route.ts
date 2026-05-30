import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in the parameters, redirect there; otherwise fallback to admin dashboard
  const next = searchParams.get('next') ?? '/admin/dashboard';

  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for an active session, which automatically 
    // sets the session cookies via our server-side cookies store.
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Redirect back to the requested page (e.g. /admin/dashboard)
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    console.error('exchangeCodeForSession error:', error.message);
  }

  // If something went wrong, redirect back to login page with an error hint
  return NextResponse.redirect(`${origin}/admin/login?error=Authentication%20failed`);
}
