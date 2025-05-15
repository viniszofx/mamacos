// filepath: app/components/auth/LoginForm.tsx
import React from 'react';

interface LoginFormProps {
  credentials: {
    email: string;
    password: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ credentials, onInputChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={onInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={onInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <button 
        type="submit" 
        className="mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;