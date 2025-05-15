// filepath: app/auth/login/page.tsx
"use client";
import LoginForm from "@/components/auth/LoginForm";
import React, { useState } from "react";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call the login function from lib/auth.ts here
    await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
      credentials: "include", // IMPORTANTE!
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm
        credentials={credentials}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Login;
