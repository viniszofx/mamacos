import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const usersCount = await prisma.user.count()

    console.log('Users count:', usersCount)
    
    return NextResponse.json({
      isFirstUser: usersCount === 0,
      setupRequired: usersCount === 0
    })
  } catch (error) {
    console.error('Error checking registration status:', error)
    return NextResponse.json(
      { error: 'Failed to check registration status' },
      { status: 500 }
    )
  }
}