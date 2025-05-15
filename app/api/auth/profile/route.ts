import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.json({ user: payload })
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}
