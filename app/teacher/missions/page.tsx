"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type Mission = {
  id: string
  title: string
  grade: number
  subject: string
  topic: string
  difficulty: string
  duration_minutes: number
  description: string
  created_at: string
}

export default function MyMissionsPage() {
  const supabase = createClient()

  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadMissions()
  }, [])

  async function loadMissions() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/login?role=teacher"
        return
      }

      const { data, error: missionsError } = await supabase
        .from("missions")
        .select(
          "id, title, grade, subject, topic, difficulty, duration_minutes, description, created_at"
        )
        .eq("created_by", user.id)
        .order("created_at", { ascending: false })

      if (missionsError) {
        console.error(missionsError)
        setError(missionsError.message)
        return
      }

      setMissions(data || [])
    } catch (err) {
      console.error(err)
      setError("Unable to load missions.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">EduQuest</h1>
            <p className="text-sm text-slate-400">My Missions</p>
          </div>

          <Link
            href="/teacher"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">My Missions</h2>
            <p className="mt-2 text-slate-400">
              Create and manage your educational escape-room missions.
            </p>
          </div>

          <Link
            href="/teacher/missions/create"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-500"
          >
            + Create Mission
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Loading missions...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && missions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
            <div className="text-5xl">📚</div>

            <h3 className="mt-5 text-xl font-semibold">
              No missions yet
            </h3>

            <p className="mt-2 text-slate-400">
              Create your first educational escape-room mission.
            </p>

            <Link
              href="/teacher/missions/create"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
            >
              Create Your First Mission
            </Link>
          </div>
        )}

        {/* Mission Cards */}
        {!loading && !error && missions.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-600"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {mission.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      {mission.subject} • Grade {mission.grade}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    {mission.difficulty}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">Topic</p>
                    <p className="mt-1 text-sm font-medium">
                      {mission.topic}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="mt-1 text-sm font-medium">
                      {mission.duration_minutes} minutes
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-400">
                  {mission.description}
                </p>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/teacher/missions/${mission.id}`}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold hover:bg-blue-500"
                  >
                    Manage Mission
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}