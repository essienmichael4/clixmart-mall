"use client"

import OtpForm from "@/components/otp-form"

export default function OtpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-[calc(100vh-64px)]">
        <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-bold mb-4">Verify your account</h1>
            <p className="text-xl text-gray-300 max-w-md">
              Enter the verification code sent to your email or phone number
            </p>
          </div>

          <svg
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-64 h-64 opacity-80"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="40" r="12" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="160" cy="150" r="15" fill="none" stroke="white" strokeWidth="2" />
            <line x1="100" y1="40" x2="50" y2="120" stroke="white" strokeWidth="2" />
            <line x1="100" y1="40" x2="150" y2="120" stroke="white" strokeWidth="2" />
            <line x1="50" y1="120" x2="100" y2="160" stroke="white" strokeWidth="2" />
            <line x1="150" y1="120" x2="100" y2="160" stroke="white" strokeWidth="2" />
            <line x1="50" y1="120" x2="150" y2="120" stroke="white" strokeWidth="2" />
            <line x1="80" y1="100" x2="120" y2="100" stroke="white" strokeWidth="2" />
            <line x1="100" y1="80" x2="100" y2="140" stroke="white" strokeWidth="2" />
            <circle cx="100" cy="120" r="2" fill="white" />
            <circle cx="85" cy="130" r="2" fill="white" />
            <circle cx="115" cy="130" r="2" fill="white" />
            <circle cx="70" cy="145" r="2" fill="white" />
            <rect x="50" y="170" width="8" height="8" fill="white" />
            <rect x="65" y="170" width="8" height="8" fill="white" />
            <rect x="80" y="170" width="8" height="8" fill="white" />
            <rect x="95" y="170" width="8" height="8" fill="white" />
          </svg>
        </div>

<div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <OtpForm />
        </div>
      </div>
    </div>
  )
}
