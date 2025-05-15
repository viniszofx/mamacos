import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/auth/login"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto min-w-[120px]"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full border border-solid border-blue-500 transition-colors flex items-center justify-center hover:bg-blue-50 text-blue-500 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto min-w-[120px]"
          >
            Register
          </Link>
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-gray-600 max-w-md">
            Join our community to access exclusive features and content. Get
            started by logging in or creating a new account.
          </p>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <p>© 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
