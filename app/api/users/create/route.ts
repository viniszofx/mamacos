import { verifyAuth } from "@/lib/auth";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

function generateTempPassword() {
  return Math.random().toString(36).slice(-8);
}

export async function POST(request: Request) {
  const token = (await cookies()).get('token')?.value
  console.log('Token:', token)
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get("token");

    if (!token?.value) {
      console.error("No token found");
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    try {
      // Verify token and get admin user
      const decoded = await verifyAuth(token.value);
      
      const admin = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          ownedOrganization: true,
        },
      });

      if (!admin || admin.role !== "ADMIN") {
        console.error("User not authorized:", admin?.role);
        return NextResponse.json({ error: "Unauthorized - Insufficient permissions" }, { status: 401 });
      }

      // Get request data
      const { email, name, role, organizationId, selectedCampuses } = await request.json();

      // Check if user exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        console.error("User already exists:", email);
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }

      // Generate temporary password
      const tempPassword = generateTempPassword();
      console.log("Temporary password:", tempPassword);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Create user with all associations
      const user = await prisma.$transaction(async (tx) => {
        // Create user
        const newUser = await tx.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            role: role as Role,
            organization: {
              connect: { id: organizationId }
            }
          },
        });

        // Connect to selected campuses
        if (selectedCampuses?.length > 0) {
          await tx.company.createMany({
            data: selectedCampuses.map((campusId: string) => ({
              userId: newUser.id,
              campusId: campusId
            })),
            skipDuplicates: true
          });
        }

        return newUser;
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        tempPassword // Send temporary password in response
      });

    } catch (authError) {
      console.error("Token verification failed:", authError);
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }

  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}