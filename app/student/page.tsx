import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function StudentDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div>
          <p className="text-sm text-gray-500">
            EduQuest Student Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Welcome to EduQuest 🎓
          </h1>

          <p className="mt-2 text-gray-600">
            Your collaborative learning adventure starts here.
          </p>
        </div>

        {/* Main Options */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">

          {/* Team */}
          <Link
            href="/student/team"
            className="rounded-xl border p-6 transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">
              👥 My Team
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              View your team, members and team code.
            </p>
          </Link>

          {/* Create Team */}
          <Link
            href="/student/team/create"
            className="rounded-xl border p-6 transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">
              ➕ Create Team
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create a new team and invite classmates.
            </p>
          </Link>

          {/* Join Team */}
          <Link
            href="/student/team/join"
            className="rounded-xl border p-6 transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">
              🔑 Join Team
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Join an existing team using its code.
            </p>
          </Link>

        </div>

        {/* Missions */}
        <div className="mt-8 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            🎯 Missions
          </h2>

          <p className="mt-2 text-gray-500">
            Educational escape-room missions will appear here.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-4 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            📊 My Progress
          </h2>

          <p className="mt-2 text-gray-500">
            Your learning progress and results will appear here.
          </p>
        </div>

        {/* Account */}
        <div className="mt-4 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Account
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Logged in as:
          </p>

          <p className="mt-1 font-medium">
            {user.email}
          </p>
        </div>

      </div>
    </main>
  )
}