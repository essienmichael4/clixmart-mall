"use client"
import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom" // Changed import
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 text-balance">
          Log in to your account
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-xs sm:text-sm text-gray-700 mb-2">Email address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
            placeholder=""
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm text-gray-700">Your password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{showPassword ? "Show" : "Hide"}</span>
            </button>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              placeholder=""
            />
          </div>
        </div>

        <div className="text-right">
          <Link to="/forgot-password" className="text-xs sm:text-sm text-gray-900 hover:underline font-medium">
            Forget your password
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="w-5 h-5 border-2 border-gray-900"
          />
          <label htmlFor="remember" className="text-xs sm:text-sm text-gray-700 cursor-pointer">
            Keep me signed in until I sign out
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2.5 sm:py-3 rounded-full font-medium transition text-sm sm:text-base"
        >
          Log in
        </Button>
      </form>

      <div className="my-6 border-t border-gray-300"></div>

      <div className="text-center">
        <p className="text-gray-700 mb-4 text-sm sm:text-base">Don't have an account?</p>
        <Link to="/signup">
          <Button className="w-full bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 py-2.5 sm:py-3 rounded-full font-medium transition text-sm sm:text-base">
            Sign up
          </Button>
        </Link>
      </div>
    </div>
  )
}
