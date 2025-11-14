"use client"
import SignupForm from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
   
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-bold mb-4 padding-top ">CLIXMART MALL DELIVERY</h1>
          </div>
        </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
