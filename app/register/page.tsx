"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const selectedRole = searchParams.get("role") || "student"
  const isTeacher = selectedRole === "teacher"

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.")
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              role: selectedRole,
            },
          },
        })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (!data.user) {
        setError("Registration failed. Please try again.")
        return
      }

      /*
       * Email confirmation is ON.
       * The user must verify their email before logging in.
       */
      setSuccess(
        "Registration successful! Please check your email and confirm your account before logging in."
      )
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold">
              EduQuest
            </h1>

            <p className="mt-2 text-slate-400">
              {isTeacher
                ? "Teacher Registration"
                : "Student Registration"}
            </p>
          </div>

          {/* Registration Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            {/* Selected Role */}
            <div className="mb-6 rounded-lg bg-slate-950 p-4 text-center">
              <p className="text-sm text-slate-400">
                Creating account as
              </p>

              <p className="mt-1 text-lg font-semibold">
                {isTeacher ? "👩‍🏫 Teacher" : "👨‍🎓 Student"}
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="space-y-5"
            >

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Re-enter your password"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                  {success}
                </div>
              )}

              {/* Register */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating Account..."
                  : `Register as ${isTeacher ? "Teacher" : "Student"}`}
              </button>
            </form>

            {/* Login */}
            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href={`/login?role=${selectedRole}`}
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Login
              </Link>
            </div>

            {/* Back */}
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-slate-500 hover:text-slate-300"
              >
                ← Choose another role
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}