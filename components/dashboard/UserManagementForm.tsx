"use client";

import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Company {
  id: string;
  name: string;
}

interface UserFormData {
  email: string;
  name: string;
  role: Role;
  selectedCampuses: string[];
}

interface Props {
  organizationId: string;
  companies: Company[];
  currentUserRole: Role;
}

export function UserManagementForm({
  organizationId,
  companies,
  currentUserRole,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    name: "",
    role: "OPERATOR",
    selectedCampuses: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    console.log("Form data:", formData);
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          organizationId,
          selectedCampuses: formData.selectedCampuses,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          console.log("Session expired, redirecting to login...");
          router.push("/auth/login");
          return;
        }
        throw new Error(data.error || "Failed to create user");
      }

      setSuccess(
        `User created successfully! Temporary password: ${data.tempPassword}`
      );
      setFormData({
        email: "",
        name: "",
        role: "OPERATOR",
        selectedCampuses: [],
      });
    } catch (error) {
      console.error("Create user error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Create New User</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full p-2 border rounded"
          />
        </div>

        {currentUserRole === "ADMIN" && (
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as Role,
                }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="OPERATOR">Operator</option>
              <option value="PRESIDENT">President</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Associated Campuses
          </label>
          <div className="space-y-2">
            {companies.map((company) => (
              <label key={company.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.selectedCampuses.includes(company.id)}
                  onChange={(e) => {
                    const newSelection = e.target.checked
                      ? [...formData.selectedCampuses, company.id]
                      : formData.selectedCampuses.filter(
                          (id) => id !== company.id
                        );
                    setFormData((prev) => ({
                      ...prev,
                      selectedCampuses: newSelection,
                    }));
                  }}
                  className="mr-2"
                />
                {company.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
