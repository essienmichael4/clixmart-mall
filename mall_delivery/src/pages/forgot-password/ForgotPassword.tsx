"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset logic here
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-200 mx-auto mt-20">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-xs sm:text-sm text-gray-700 mb-2">Email address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
            placeholder="Enter your email"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2.5 sm:py-3 rounded-full font-medium transition text-sm sm:text-base"
        >
          Send Reset Link
        </Button>

        <div className="text-center mt-4">
          <Link to="/login" className="text-gray-900 hover:underline text-sm sm:text-base">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}