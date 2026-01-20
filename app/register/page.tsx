"use client";

import RegisterForm from "../../components/RegisterForm";
import Head from "next/head";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Sign Up - Vibement</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen w-full flex flex-col lg:flex-row">
        {/* Left Side - Register Form */}
        <div className="lg:w-1/2 bg-gray-50 flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>

        {/* Right Side - Welcome Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex items-center justify-center p-8 lg:p-16 order-1 lg:order-2">
          <div className="max-w-lg text-white">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-8">
              <span className="text-white font-bold text-4xl">V</span>
            </div>

            {/* Welcome Text */}
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Start Your Journey with
              <span className="block mt-2 text-white/90">Vibement</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join our vibrant community today. Create your account and unlock a world of possibilities tailored just for you.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-lg text-white/90">100% secure signup</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <span className="text-lg text-white/90">Instant access to features</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <span className="text-lg text-white/90">No credit card required</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="mt-12 flex items-center space-x-2 text-white/70">
              <div className="w-12 h-1 bg-white/30 rounded-full"></div>
              <span className="text-sm">Free forever plan available</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
