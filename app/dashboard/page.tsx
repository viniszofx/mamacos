import { LogoutButton } from "@/components/LogoutButton";
import { UserManagementForm } from "@/components/dashboard/UserManagementForm";
import { verifyAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

async function getUserData(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      ownedOrganization: {
        include: {
          companies: true, // Include companies (campus) of organization
        },
      },
      ownedCompanies: true,
      organization: true,
    },
  });
}

export default async function DashboardPage() {
  console.log("DashboardPage");
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const decoded = await verifyAuth(token!.value);
  const userData = await getUserData(decoded.userId);

  if (!userData) {
    return <div>Error loading user data</div>;
  }

  const workspace = userData.ownedOrganization || userData.ownedCompanies[0];
  const campuses =
    userData.ownedOrganization?.companies ||
    [userData.ownedCompanies[0]].filter(Boolean);

  const companies = userData.ownedOrganization?.companies || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">
                Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{userData.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {userData.role === "ADMIN" && (
          <div className="mb-8">
            <UserManagementForm
              organizationId={userData.ownedOrganization?.id || userData.orgId!}
              companies={companies}
              currentUserRole={userData.role}
            />
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                User Information
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.email}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.role}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {workspace
                      ? userData.ownedOrganization
                        ? "Organization"
                        : "Campus"
                      : "Workspace"}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {workspace?.name || "No workspace assigned"}
                  </dd>
                </div>
              </dl>
            </div>

            {workspace && (
              <>
                <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Campus Information
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    {campuses.map((campus) => (
                      <div
                        key={campus.id}
                        className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                      >
                        <dt className="text-sm font-medium text-gray-500">
                          Campus Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {campus.name}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
