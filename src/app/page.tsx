import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upskyla | Empowering Students Beyond Education",
  description: "A unified ecosystem for admissions, student living, mobility, career growth, and skill development — all in one platform.",
  openGraph: {
    title: "Upskyla | Empowering Students Beyond Education",
    description: "A unified ecosystem for admissions, student living, mobility, career growth, and skill development.",
    type: "website",
    url: "https://upskyla.com",
    siteName: "Upskyla",
  },
};

export default async function LandingPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation - Simple Sticky Header */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold italic">U</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Upskyla</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2">
            Login
          </Link>
          <Link href="/register" className="text-sm font-bold text-white bg-primary-600 px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200">
            Register Now
          </Link>
        </div>
      </nav>

      <main className="flex-grow">
        <Hero />
        <Features />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

// Minimal Link component for landing page
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
