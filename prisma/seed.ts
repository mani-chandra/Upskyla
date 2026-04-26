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

  // Create Moderator User
  const moderator = await prisma.user.upsert({
    where: { email: "mod@upskyla.com" },
    update: { password: hashedPassword },
    create: {
      email: "mod@upskyla.com",
      name: "Moderator One",
      password: hashedPassword,
      role: "MODERATOR" as any,
      referralCode: "MOD100",
      profile: {
        create: {},
      },
    },
  });

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
  const courses = [
    { id: "aiml", title: "AI / ML & Data Science", description: "Master AI, Machine Learning, and Data Science with our early bird offer.", price: 14500 },
    { id: "cyber", title: "Cyber Security", description: "Become a cyber security expert with our early bird offer.", price: 14500 },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: course,
      create: course,
    });
  }

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
