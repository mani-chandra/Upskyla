import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@studentecosystem.com" },
    update: { password: hashedPassword },
    create: {
      email: "admin@studentecosystem.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      profile: {
        create: {},
      },
    },
  });

  // Create Student User
  const student = await prisma.user.upsert({
    where: { email: "student@studentecosystem.com" },
    update: { password: hashedPassword },
    create: {
      email: "student@studentecosystem.com",
      name: "John Student",
      password: hashedPassword,
      role: "STUDENT",
      profile: {
        create: {},
      },
    },
  });

  // Create Feature Flags
  const flags = [
    { name: "consultancy", isEnabled: true, description: "Education Consultancy Module" },
    { name: "hostel", isEnabled: true, description: "Hostel Management Module" },
    { name: "courses", isEnabled: true, description: "Course LMS Module" },
    { name: "taxi", isEnabled: true, description: "Taxi & Vehicle Rental Module" },
    { name: "jobs", isEnabled: true, description: "Career / Job Portal Module" },
    { name: "gaming", isEnabled: true, description: "Gaming Booking Module" },
    { name: "theatre", isEnabled: true, description: "Theatre Booking Module" },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { name: flag.name },
      update: {},
      create: flag,
    });
  }

  // Create Sample Courses
  await prisma.course.createMany({
    data: [
      { title: "Full Stack Development", description: "Learn everything from HTML to Next.js", price: 4999 },
      { title: "Data Science with Python", description: "Master data analysis and ML", price: 3499 },
    ],
    skipDuplicates: true,
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
