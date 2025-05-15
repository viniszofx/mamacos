import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, type, name } = await request.json();

    // Verify user exists and is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (type === 'organization') {
      // Create organization
      const org = await prisma.organization.create({
        data: {
          name,
          owner: { connect: { id: userId } },
          users: { connect: { id: userId } }
        }
      });
    } else {
      // Create company
      const company = await prisma.company.create({
        data: {
          name,
          owner: { connect: { id: userId } }
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Set cookie
    (await
      // Set cookie
      cookies()).set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({
      success: true,
      message: `${type} created successfully`
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed' },
      { status: 500 }
    );
  }
}