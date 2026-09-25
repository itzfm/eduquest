"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Mission = {
  id: string
  title: string
  grade: number
  subject: string
  topic: string | null
  difficulty: string | null
  duration_minutes: number | null
  description: string | null
}

export default function ManageMissionPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  const missionId = params.id as string

  const [mission, setMission] = useState<Mission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadMission()
  }, [])

  async function loadMission() {
    setLoading(true)
    setError("")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login?role=teacher")
      return
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "teacher") {
      router.push("/teacher")
      return
    }

    const { data, error } = await supabase
      .from("missions")
      .select(
        "id, title, grade, subject, topic, difficulty, duration_minutes, description"
      )
      .eq("id", missionId)
      .eq("created_by", user.id)
      .single()

    if (error) {
      console.error(error)
      setError("Mission not found.")
      setLoading(false)
      return
    }

    setMission(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p>Loading mission...</p>
      </main>
    )
  }

  if (error || !mission) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold">Mission Not Found</h1>

        <p className="mt-2 text-gray-600">
          The mission may not exist or you may not have permission to access it.
        </p>

        <button
          onClick={() => router.push("/teacher/missions")}
          className="mt-6 rounded-lg bg-black px-5 py-3 text-white"
        >
          Back to My Missions
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push("/teacher/missions")}
          className="mb-6 text-sm text-gray-600 hover:text-black"
        >
          ← Back to My Missions
        </button>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <p className="text-sm text-gray-500">Manage Mission</p>

              <h1 className="mt-1 text-3xl font-bold">
                {mission.title}
              </h1>

              <p className="mt-2 text-gray-600">
                {mission.description || "No description provided."}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Grade</p>
              <p className="text-xl font-bold">{mission.grade}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">Subject</p>
              <p className="mt-1 font-semibold">{mission.subject}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">Topic</p>
              <p className="mt-1 font-semibold">
                {mission.topic || "-"}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">Difficulty</p>
              <p className="mt-1 font-semibold">
                {mission.difficulty || "-"}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="mt-1 font-semibold">
                {mission.duration_minutes
                  ? `${mission.duration_minutes} min`
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Levels</h2>
              <p className="mt-1 text-sm text-gray-500">
                Create levels for this mission.
              </p>
            </div>

            <button
              className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
            >
              + Add Level
            </button>
          </div>

          <div className="mt-8 rounded-lg border border-dashed p-8 text-center">
            <p className="font-medium">No levels yet</p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first level to start building the escape room.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}