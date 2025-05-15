import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

export async function GET() {
  const token = (await cookies()).get('token')?.value
  console.log('Token:', token)

  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    console.log('Decoded token:', decoded)
    
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId // Changed from id to userId to match the token payload
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
    
    console.log('User:', user)
    if (!user) {
      console.log('User not found')
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}
