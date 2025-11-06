"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function OtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    setOtp(newOtp)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join("")
    console.log("OTP submitted:", otpCode)
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify your account</h2>
      <p className="text-gray-600 mb-8">We've sent a verification code to your email and phone number</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm text-gray-600 mb-4 block">Enter verification code</label>
          <div className="flex gap-3 justify-center mb-4">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg font-semibold"
                inputMode="numeric"
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive a code?{" "}
            <button type="button" className="text-gray-900 hover:text-gray-700 underline font-medium">
              Resend
            </button>
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-400 hover:bg-gray-500 text-white rounded-full py-3 text-lg font-semibold"
        >
          Verify
        </Button>

        <div className="text-center text-sm">
          <p className="text-gray-700">
            Want to verify using a different method?{" "}
<Link to="/signup" className="text-gray-700 hover:text-gray-900 underline font-medium">
              Go back
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
