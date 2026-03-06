"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (searchParams.get("mode") === "register") {
      setIsLogin(false);
    }
  }, [searchParams]);

  const handleSwitch = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Switch text halfway through the roll
    setTimeout(() => {
      setIsLogin((prev) => !prev);
    }, 450);

    setTimeout(() => {
      setIsAnimating(false);
    }, 900);
  };

  return (
    // Changed: Removed padding, added w-screen h-screen
    <div className="h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Main Container - Now Full Screen */}
      <div className="relative w-full h-full bg-white flex overflow-hidden">

        {/* THE STATIC FORM LAYER */}
        <div className="absolute inset-0 flex w-full h-full">
          {/* Left Side Slot */}
          <div className="w-1/2 h-full flex items-center justify-center p-12 bg-gray-50">
            {!isLogin && !isAnimating && (
              <div className="w-full max-w-md animate-form-entry">
                <RegisterForm onSwitch={handleSwitch} />
              </div>
            )}
          </div>

          {/* Right Side Slot */}
          <div className="w-1/2 h-full flex items-center justify-center p-12 bg-white">
            {isLogin && !isAnimating && (
              <div className="w-full max-w-md animate-form-entry">
                <LoginForm onSwitch={handleSwitch} />
              </div>
            )}
          </div>
        </div>

        {/* THE ROLLING WELCOME BOX */}
        <div
          className={`
            hidden lg:flex absolute top-0 bottom-0 w-1/2 z-20
            bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600
            items-center justify-center p-20 transition-all duration-900 ease-in-out
            ${isLogin ? 'translate-x-0' : 'translate-x-full'} 
            ${isAnimating ? 'rolling-animation' : ''}
          `}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Content inside the rolling box */}
          <div className={`text-white text-center max-w-lg transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <h1 className="text-6xl font-extrabold mb-6">
              {isLogin ? "Welcome Back!" : "Hello, Viber!"}
            </h1>
            <p className="text-xl mb-12 opacity-90 leading-relaxed">
              {isLogin
                ? "Login your account fast, and start vibing already"
                : "Enter your personal details and start vibing already"}
            </p>
            <button
              onClick={handleSwitch}
              className="px-16 py-4 border-2 border-white rounded-full text-lg font-bold hover:bg-white hover:text-emerald-600 transition-all transform hover:scale-105 active:scale-95"
            >
              {isLogin ? "SIGN UP" : "SIGN IN"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}