# Authentication Project

A Next.js project with authentication features using Prisma, PostgreSQL, and Tailwind CSS.

## Features

- 🔐 User authentication (Login/Register)
- 📦 PostgreSQL database with Prisma ORM
- 🎨 Styled with Tailwind CSS
- 🔒 Secure password handling
- ⚡ Fast page transitions
- 📱 Responsive design

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database running
- pnpm package manager (recommended)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
# Create a .env file and add:
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

4. Initialize the database:

```bash
pnpm prisma generate
pnpm prisma db push
```

5. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   └── page.tsx
├── components/
│   └── auth/
├── prisma/
│   └── schema.prisma
└── public/
```

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Development

To run tests:

```bash
pnpm test
```

To format code:

```bash
pnpm format
```

## License

MIT License - feel free to use this project as a template for your own applications.
