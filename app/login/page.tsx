"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const selectedRole = searchParams.get("role") || "student"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (loginError) {
        setError(loginError.message)
        return
      }

      if (!data.user) {
        setError("Login failed. Please try again.")
        return
      }

      // Get the actual role from the users table
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile) {
        setError("User profile not found.")
        return
      }

      // Prevent logging in through the wrong role
      if (profile.role !== selectedRole) {
        await supabase.auth.signOut()

        setError(
          `This account is registered as ${profile.role}. Please select the correct role.`
        )

        return
      }

      // Correct dashboard
      if (profile.role === "teacher") {
        router.push("/teacher")
      } else {
        router.push("/student")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isTeacher = selectedRole === "teacher"

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
              {isTeacher ? "Teacher Login" : "Student Login"}
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6 rounded-lg bg-slate-950 p-4 text-center">
              <p className="text-sm text-slate-400">
                Logging in as
              </p>

              <p className="mt-1 text-lg font-semibold">
                {isTeacher ? "👩‍🏫 Teacher" : "👨‍🎓 Student"}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Register */}
            <div className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                href={`/register?role=${selectedRole}`}
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Register
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