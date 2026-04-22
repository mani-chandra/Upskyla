"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-24 bg-[#0B0F19] text-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold italic shadow-lg shadow-primary-900/20">U</div>
              <span className="text-2xl font-bold font-heading text-white tracking-tight">Upskyla</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-xs">
              Building the future of student living and learning. A unified ecosystem for the modern student journey.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map((social) => (
                <Link key={social} href="#" className="w-10 h-10 flex items-center justify-center bg-gray-800/50 rounded-xl hover:bg-primary-600 hover:text-white transition-all text-gray-400">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current rounded-sm opacity-20" />
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="mb-8 text-sm font-bold uppercase tracking-widest text-white">Platform</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/hostel" className="hover:text-primary-400 transition-colors">Hostel Living</Link></li>
              <li><Link href="/courses" className="hover:text-primary-400 transition-colors">Upskilling Courses</Link></li>
              <li><Link href="/consultancy" className="hover:text-primary-400 transition-colors">Career Consultancy</Link></li>
              <li><Link href="/taxi" className="hover:text-primary-400 transition-colors">Mobility Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-8 text-sm font-bold uppercase tracking-widest text-white">Company</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="#" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Partner With Us</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-8 text-sm font-bold uppercase tracking-widest text-white">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-6">Get the latest updates on student opportunities and platform news.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <button className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-lg transition-colors">
                <div className="w-5 h-5 bg-white rounded-full opacity-20" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>&copy; {currentYear} Upskyla Platform. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
