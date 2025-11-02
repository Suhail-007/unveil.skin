# Prisma Database Setup

This project uses Prisma ORM with PostgreSQL to store waitlist signups.

## Database Schema

The `users` table stores waitlist signups with the following structure:
- `id` (String, CUID) - Unique identifier
- `email` (String, Unique) - User's email address
- `createdAt` (DateTime) - When the user signed up
- `updatedAt` (DateTime) - Last update timestamp

## Setup Instructions

### 1. Database Connection

Make sure you have `DATABASE_URL` set in your Vercel environment variables:
```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```

### 2. Run Migrations

After connecting your database in Vercel, run migrations to create the tables:

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# For production (on Vercel)
npx prisma migrate deploy
```

### 3. Vercel Deployment

The build script automatically runs `prisma generate` before building. Make sure:
- `DATABASE_URL` is set in Vercel environment variables
- Run `prisma migrate deploy` in your Vercel build command or set it up as a separate step

### 4. Verify Setup

Once deployed, test the waitlist form at `/api/waitlist` endpoint. It will:
- Accept POST requests with `{ email: "user@example.com" }`
- Create a new user or update existing one if email already exists
- Return success response with user data

## Local Development

For local development, you can use:
- Vercel Postgres (via Vercel CLI)
- Local PostgreSQL instance
- Docker PostgreSQL container

Make sure to set `DATABASE_URL` in a `.env` file (not committed to git).

