import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Delete the authentication token
  (await
    // Delete the authentication token
    cookies()).delete('token');

  // Return response with redirect
  return NextResponse.json(
    { message: "Logout realizado" }, 
    {
      status: 200,
      headers: {
        'Location': '/'
      }
    }
  );
}
