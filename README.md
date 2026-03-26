# Student Ecosystem Platform

A comprehensive, modular, role-based SaaS-style web platform for students, supporting education consultancy, hostel management, course LMS, taxi booking, and career portals.

## 🚀 Features

- **Education Consultancy**: Book consultations, take mock exams (IELTS, GRE), and track application status.
- **Hostel Management**: View room details, pay fees, and raise maintenance tickets.
- **Course LMS**: Purchase and watch video lessons, track progress, and earn certificates.
- **Taxi & Vehicle Rental**: Book airport pickups, hourly rentals, or daily vehicle services.
- **Career / Job Portal**: Browse job openings, upload resumes, and track applications.
- **Central Admin Panel**: Manage users, feature flags, payments, and global settings.
- **Feature Flag System**: Enable/disable modules dynamically for all students.
- **Razorpay Integration**: Integrated payment gateway (test mode enabled).
- **JWT Authentication**: Secure login with Role-Based Access Control (RBAC).

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide React
- **Backend**: Next.js API Routes, JWT, Bcrypt
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Razorpay Node SDK

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd student-ecosystem-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```

4. Database Setup (Prisma):
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Seed initial data:
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

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
