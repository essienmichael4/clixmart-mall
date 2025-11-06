"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password")
      return
    }

    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPasswordSuccess("Password changed successfully!")
      setTimeout(() => {
        setShowPasswordModal(false)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setPasswordSuccess("")
      }, 1500)
    } catch (error) {
      setPasswordError("Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Account Settings</h2>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
            <input
              type="tel"
              defaultValue="+1 (555) 000-0000"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive push notifications</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">SMS Alerts</p>
              <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
            </div>
            <input type="checkbox" className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-sidebar-accent text-foreground hover:bg-sidebar-accent/80"
          >
            Change Password
          </Button>
          <Button className="w-full bg-sidebar-accent text-foreground hover:bg-sidebar-accent/80">
            Enable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-destructive/10 border border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Change Password</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {passwordError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{passwordError}</div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm">{passwordSuccess}</div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                disabled={isLoading}
                className="flex-1 border-border text-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
