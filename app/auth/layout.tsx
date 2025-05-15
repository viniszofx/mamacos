// filepath: c:\Users\Admin\dev\lab\paulo-corno\app\auth\layout.tsx
"use client";
import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="auth-layout">
      <header>
        <h1>Authentication</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2023 Your Company</p>
      </footer>
    </div>
  );
};

export default AuthLayout;