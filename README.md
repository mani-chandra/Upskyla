# Upskyla Platform

A comprehensive, modular student ecosystem platform designed to manage hostel living, academic consultancy, courses, mobility, and career growth.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Prisma ORM with Neon.tech (PostgreSQL)
- **Auth**: Manual JWT with `jose` and `bcryptjs`
- **Styling**: Tailwind CSS & Framer Motion
- **Payments**: Razorpay Integration

## Core Modules
- **Hostel**: Premium student accommodation management.
- **Consultancy**: Academic and admission guidance.
- **LMS**: Course management and enrollment.
- **Mobility**: Taxi and vehicle rental services.
- **Career**: Job portal and application tracking.
- **Wallet**: Integrated referral and rewards system.

## Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`.
4. Push schema: `npx prisma db push`
5. Seed data: `npx prisma db seed`
6. Run development server: `npm run dev`

### Default Accounts (After Seeding)

- **Admin**: `admin@studentecosystem.com` / `admin123`
- **Student**: `student@studentecosystem.com` / `admin123`

## 📂 Folder Structure

- `src/app`: App Router pages and API routes
- `src/components`: UI components, layouts, and modular pieces
- `src/lib`: Utility functions, Prisma client, and auth helpers
- `prisma`: Database schema and seed scripts
- `public`: Static assets

## 🔒 Security

- Hashed passwords with bcrypt
- JWT-based session management
- Server-side role-based middleware
- Protected API routes and page layouts
