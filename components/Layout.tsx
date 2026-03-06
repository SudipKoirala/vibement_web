'use client';

import { ReactNode, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function Layout({ children, title }: LayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('role');
    window.location.href = '/login';
  };

  const navLinks = [
    { href: '/auth/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/user/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({
      href: '/admin/users',
      label: 'Admin',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    });
  }

  return (
    <>
      <Head>
        <title>{title || "Vibement"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/auth/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Vibement
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                      </svg>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {/* User Menu */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  {user && (
                    <div className="flex items-center space-x-2">
                      {user.image ? (
                        <img
                          src={`http://localhost:5000${user.image}`}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-semibold text-xs">
                            {user.username?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700 hidden lg:block">{user.username}</span>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-green-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-100">
                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-green-50'
                          }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                        </svg>
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/60 backdrop-blur-sm border-t border-green-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">V</span>
                </div>
                <span className="text-sm text-gray-600">
                  © {new Date().getFullYear()} Vibement. All rights reserved.
                </span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-green-600 transition-colors text-sm">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-green-600 transition-colors text-sm">Terms</a>
                <a href="#" className="text-gray-500 hover:text-green-600 transition-colors text-sm">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}