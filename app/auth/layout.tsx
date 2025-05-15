// filepath: c:\Users\Admin\dev\lab\paulo-corno\app\auth\layout.tsx
"use client";
import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="auth-layout">
      <header></header>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
};

export default AuthLayout;
