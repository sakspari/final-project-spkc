"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PasswordDialogProps {
  isOpen: boolean
  onClose: () => void
  onPasswordSubmit: (password: string) => void
  isError: boolean
}

export default function PasswordDialog({ isOpen, onClose, onPasswordSubmit, isError }: PasswordDialogProps) {
  const [password, setPassword] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input when the dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Reset password state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setPassword("")
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPasswordSubmit(password)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Protection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Enter password to export data</Label>
              <Input
                id="password"
                type="password"
                ref={inputRef}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="col-span-3"
                autoComplete="off"
              />
            </div>
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Incorrect password. Please try again.</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Verify & Export</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
