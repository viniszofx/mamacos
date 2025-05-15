import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json()
    console.log(" (API) Registering user:", { email, password, username })

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 })
    }

    // Check if this is the first user
    const usersCount = await prisma.user.count()
    const isFirstUser = usersCount === 0

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: username,
        role: isFirstUser ? 'ADMIN' : 'OPERATOR'
      }
    })

    // If first user, generate token and set cookie
    if (isFirstUser) {
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      ;(await cookies()).set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return NextResponse.json({
        id: user.id,
        email: user.email,
        role: user.role,
        token
      })
    }

    // For non-first users, just return success
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error creating account' },
      { status: 500 }
    )
  }
}
