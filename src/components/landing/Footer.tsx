import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 bg-gray-900 text-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-4 mb-16">
          <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold italic">U</div>
              <span className="text-2xl font-bold font-heading text-primary-400 tracking-tight">Upskyla</span>
            </Link>
            <p className="max-w-xs text-gray-400 leading-relaxed">
              Empowering students beyond education with a unified ecosystem for living, learning, and growing.
            </p>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div className="flex flex-wrap -mx-4">
              <div className="w-1/2 md:w-1/3 px-4 mb-8">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Platform</h4>
                <ul className="text-gray-400">
                  <li className="mb-4"><Link href="/about" className="hover:text-primary-400">About</Link></li>
                  <li className="mb-4"><Link href="/contact" className="hover:text-primary-400">Contact</Link></li>
                </ul>
              </div>
              <div className="w-1/2 md:w-1/3 px-4 mb-8">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Legal</h4>
                <ul className="text-gray-400">
                  <li className="mb-4"><Link href="/privacy" className="hover:text-primary-400">Privacy Policy</Link></li>
                  <li className="mb-4"><Link href="/terms" className="hover:text-primary-400">Terms</Link></li>
                </ul>
              </div>
              <div className="w-full md:w-1/3 px-4 mb-8">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Social</h4>
                <div className="flex gap-4">
                  <Link href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
                  </Link>
                  <Link href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"></path></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {currentYear} Upskyla Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
