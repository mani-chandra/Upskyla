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
    if (query.includes("course") || query.includes("study") || query.includes("learn") || query.includes("ai/ml")) {
      response = `We currently offer two specialized courses: 
        1. ${UPSKYLA_KNOWLEDGE.courses[0].name} for ${UPSKYLA_KNOWLEDGE.courses[0].price} (${UPSKYLA_KNOWLEDGE.courses[0].offer})
        2. ${UPSKYLA_KNOWLEDGE.courses[1].name} for ${UPSKYLA_KNOWLEDGE.courses[1].price} (${UPSKYLA_KNOWLEDGE.courses[1].offer})
        
        Both are 4-month intensive programs with live weekend classes and industry certification. Would you like to see the syllabus for any of these?`;
    } else if (query.includes("price") || query.includes("cost") || query.includes("fee")) {
      response = `Our current courses are available at a special early bird price of ₹14,500 each! 

        This includes:
        ✅ 96+ Hours of Learning
        ✅ Live Industry Projects
        ✅ Guaranteed Placement Support
        ✅ Lifetime Access to Community`;
    } else if (query.includes("hostel") || query.includes("room") || query.includes("stay") || query.includes("book")) {
      response = "Our Premium Student Living module offers automated booking, unified ledgers for rent, and 24/7 digital concierge. You can explore interactive floor plans and book your spot directly from the 'Hostel' section in your dashboard!";
    } else if (query.includes("taxi") || query.includes("cab") || query.includes("car") || query.includes("transport")) {
      response = "Upskyla Mobility provides airport pickups, daily commutes with verified drivers, and even adventure rentals for your weekend trips. All at student-friendly rates! Check the 'Transport' tab to book.";
    } else if (query.includes("job") || query.includes("career") || query.includes("placement") || query.includes("opening")) {
      response = "We bridge the gap between education and your first paycheck! Our Career portal features internal hiring within the Upskyla ecosystem and a network of 500+ partner startups. Top learners even get direct interview invites!";
    } else if (query.includes("support") || query.includes("help") || query.includes("contact")) {
      response = "I'm here to help! You can also reach our human support team via the 'Help' section in your settings, or email us at support@upskyla.com. Our typical response time is under 2 hours. 🚀";
    } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
      response = "Hello! 👋 I'm your Upskyla AI assistant, here to help you navigate your student life. How can I assist you today?";
    } else if (query.includes("who are you") || query.includes("what is upskyla") || query.includes("purpose")) {
      response = `Upskyla is a unified student ecosystem. We believe in "${UPSKYLA_KNOWLEDGE.tagline}". 
        
        We help you manage:
        🏠 Living (Hostels)
        📚 Learning (LMS)
        💼 Careers (Job Portal)
        🚗 Mobility (Transport)
        
        All through one single, powerful dashboard!`;
    } else if (query.includes("thank")) {
      response = "You're very welcome! It's my pleasure to help. Is there anything else you'd like to know about Upskyla? 😊";
    }

    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ response: "I'm sorry, I encountered an error. Please try again." }, { status: 500 });
  }
}
