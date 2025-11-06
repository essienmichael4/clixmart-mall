"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    agreeToTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign up now</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">First name</label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder=""
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Last name</label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder=""
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-2 block">Email address</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder=""
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-2 block">Phone number</label>
          <div className="flex gap-2">
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder=""
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-2 block">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder=""
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Use 8 or more characters with a mix of letters, numbers & symbols
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked }))}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              By creating an account, I agree to our{" "}
<Link to="/terms" className="underline hover:text-gray-900">
                Terms of use
              </Link>{" "}
              and{" "}
<Link to="/privacy" className="underline hover:text-gray-900">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-400 hover:bg-gray-500 text-white rounded-full py-3 text-lg font-semibold"
        >
          Sign up
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-700">Already have an account? </span>
<Link to="/login" className="text-gray-700 hover:text-gray-900 underline font-medium">
            Log in
          </Link>
        </div>
      </form>
    </div>
  )
}
