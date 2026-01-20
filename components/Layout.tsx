import { ReactNode } from "react";
import Head from "next/head";

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title || "Vibement"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Vibement
                </span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium">
                  Features
                </a>
                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium">
                  About
                </a>
                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium">
                  Contact
                </a>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all">
                  Get Started
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/60 backdrop-blur-sm border-t border-green-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                    <span className="text-white font-bold text-sm">V</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Vibement</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Creating exceptional digital experiences for modern users.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors text-sm">Home</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors text-sm">About Us</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors text-sm">Services</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors text-sm">Twitter</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors text-sm">LinkedIn</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors text-sm">GitHub</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-green-200 mt-8 pt-8 text-center">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Vibement. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}