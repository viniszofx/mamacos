import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    console.log('Login attempt for:', email)

    // Find user with organization details
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        organization: true,
        ownedOrganization: true
      }
    })

    // Validate credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid credentials for:', email)
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    console.log('User authenticated:', { id: user.id, role: user.role })

    // Create token with essential user data
    const token = jwt.sign(
      { 
        userId: user.id,
        role: user.role,
        orgId: user.orgId,
        email: user.email
      }, 
      process.env.JWT_SECRET!,
      { 
        expiresIn: '24h' 
      }
    )

    // Set cookie with token
    const cookieStore = cookies()
    ;(await cookieStore).set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    // Return success with user info (excluding sensitive data)
    return NextResponse.json({ 
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization?.name,
        ownedOrganization: user.ownedOrganization?.name
      },
      redirect: '/dashboard'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Erro ao realizar login' 
    }, { status: 500 })
  }
}
