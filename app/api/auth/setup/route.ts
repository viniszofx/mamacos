import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, type, name, campusName } = await request.json();

    // Validate required fields
    if (!userId || !type || !name || (type === 'organization' && !campusName)) {
      console.error('Missing fields:', { userId, type, name, campusName });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user exists and is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      if (type === 'organization') {
        // Create organization
        const org = await tx.organization.create({
          data: {
            name,
            owner: { connect: { id: userId } },
            users: { connect: { id: userId } }
          }
        });

        // Create main campus for the organization
        const campus = await tx.company.create({
          data: {
            name: campusName,
            owner: { connect: { id: userId } },
            organization: { connect: { id: org.id } }
          }
        });

        return { org, campus };
      } else {
        // Create standalone campus
        const campus = await tx.company.create({
          data: {
            name,
            owner: { connect: { id: userId } }
          }
        });

        return { campus };
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Set authentication cookie
    (await cookies()).set({
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
      data: result
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to complete setup' },
      { status: 500 }
    );
  }
}