import { NextResponse } from "next/server";

const UPSKYLA_KNOWLEDGE = {
  courses: [
    { name: "AI / ML & Data Science", price: "₹14,500", offer: "Early Bird Offer", duration: "4 Months" },
    { name: "Cyber Security", price: "₹14,500", offer: "Early Bird Offer", duration: "4 Months" }
  ],
  services: ["Hostel Management", "Education Consultancy", "Taxi & Rental", "Job Portal"],
  company: "Upskyla",
  tagline: "Empowering Students Beyond Education"
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = message.toLowerCase();

    let response = "I'm not sure about that. Could you please rephrase your question? I can help with information about our courses, hostel bookings, or other services!";

    // Simple rule-based AI logic
    if (query.includes("course") || query.includes("study") || query.includes("learn")) {
      response = `We currently offer two specialized courses: 
        1. ${UPSKYLA_KNOWLEDGE.courses[0].name} for ${UPSKYLA_KNOWLEDGE.courses[0].price} (${UPSKYLA_KNOWLEDGE.courses[0].offer})
        2. ${UPSKYLA_KNOWLEDGE.courses[1].name} for ${UPSKYLA_KNOWLEDGE.courses[1].price} (${UPSKYLA_KNOWLEDGE.courses[1].offer})
        Both are 4-month intensive programs with live weekend classes.`;
    } else if (query.includes("price") || query.includes("cost") || query.includes("fee")) {
      response = `Our current courses (AI/ML and Cyber Security) are available at a special early bird price of ₹14,500 each! This is a limited time offer.`;
    } else if (query.includes("hostel") || query.includes("room") || query.includes("stay")) {
      response = "Our Hostel Management module allows you to book rooms, pay fees, and manage maintenance requests easily through your student dashboard.";
    } else if (query.includes("taxi") || query.includes("cab") || query.includes("car")) {
      response = "Need a ride? Our Taxi & Rental service provides airport pickups and vehicle rentals specifically for students.";
    } else if (query.includes("job") || query.includes("career") || query.includes("placement")) {
      response = "Upskyla provides a dedicated Job Portal where you can find openings and track applications. We also offer 100% placement assistance for our course students!";
    } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
      response = "Hello! 👋 I'm your Upskyla AI assistant. How can I help you today?";
    } else if (query.includes("who are you") || query.includes("what is upskyla")) {
      response = `Upskyla is a comprehensive student ecosystem platform. Our mission is "${UPSKYLA_KNOWLEDGE.tagline}". We provide everything from education and skills to living and transport.`;
    } else if (query.includes("thank")) {
      response = "You're very welcome! Let me know if you need anything else. 😊";
    }

    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ response: "I'm sorry, I encountered an error. Please try again." }, { status: 500 });
  }
}
