"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function CreateMissionPage() {
  const router = useRouter()
  const supabase = createClient()

  const [missionName, setMissionName] = useState("")
  const [grade, setGrade] = useState("")
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Medium")
  const [duration, setDuration] = useState("30")
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleCreateMission(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profileError || profile?.role !== "teacher") {
        setError("Only teachers can create missions.")
        return
      }

      const { error: insertError } = await supabase
        .from("missions")
        .insert({
          title: missionName.trim(),
          grade,
          subject,
          topic,
          difficulty,
          duration_minutes: Number(duration),
          description: description.trim(),
          created_by: user.id,
        })

      if (insertError) {
        console.error(insertError)
        setError(insertError.message)
        return
      }

      router.push("/teacher/missions")
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">EduQuest</h1>
            <p className="text-sm text-slate-400">Create Mission</p>
          </div>

          <button
            onClick={() => router.push("/teacher")}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* Form */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Create a New Mission</h2>
          <p className="mt-2 text-slate-400">
            Create a curriculum-based escape-room mission for your students.
          </p>
        </div>

        <form
          onSubmit={handleCreateMission}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          {/* Mission Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Mission Name
            </label>

            <input
              type="text"
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              placeholder="Save the School Energy System"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Grade + Subject */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Grade
              </label>

              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Select Grade</option>
<option value="6">Grade 6</option>
<option value="7">Grade 7</option>
<option value="8">Grade 8</option>
<option value="9">Grade 9</option>
<option value="10">Grade 10</option>
<option value="11">Grade 11</option>
<option value="12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Environmental Science">
                  Environmental Science
                </option>
              </select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Topic
            </label>

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Electricity"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Difficulty + Duration */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Duration (minutes)
              </label>

              <input
                type="number"
                min="5"
                max="180"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Mission Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Students must solve a series of challenges to restore the school's electricity system."
              rows={5}
              required
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Mission..." : "Create Mission"}
          </button>
        </form>
      </section>
    </main>
  )
}