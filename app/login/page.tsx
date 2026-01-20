"use client";

import LoginForm from "../../components/LoginForm";
import Head from "next/head";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - Vibement</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen w-full flex flex-col lg:flex-row">
        {/* Left Side - Welcome Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-lg text-white">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-8">
              <span className="text-white font-bold text-4xl">V</span>
            </div>

            {/* Welcome Text */}
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome Back to
              <span className="block mt-2 text-white/90">Vibement</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Continue your journey with us. Sign in to access your personalized experience and connect with what matters most.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg text-white/90">Secure and encrypted</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg text-white/90">Lightning fast access</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-lg text-white/90">Join our community</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="mt-12 flex items-center space-x-2 text-white/70">
              <div className="w-12 h-1 bg-white/30 rounded-full"></div>
              <span className="text-sm">Trusted by thousands</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 bg-gray-50 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
