import Link from "next/link"

export default function TeacherDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">EduQuest</h1>
            <p className="text-sm text-slate-400">Teacher Dashboard</p>
          </div>

          <Link
            href="/login"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
          >
            Logout
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Welcome, Teacher 👋</h2>
          <p className="mt-2 text-slate-400">
            Create collaborative learning missions and track student progress.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-5 md:grid-cols-3">
          <Link
            href="/teacher/missions/create"
            className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 transition hover:border-blue-400 hover:bg-blue-500/20"
          >
            <div className="mb-4 text-3xl">➕</div>
            <h3 className="text-xl font-semibold">Create Mission</h3>
            <p className="mt-2 text-sm text-slate-400">
              Create a new educational escape-room mission.
            </p>
          </Link>

          <Link
            href="/teacher/missions"
            className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition hover:border-slate-500 hover:bg-slate-800"
          >
            <div className="mb-4 text-3xl">📚</div>
            <h3 className="text-xl font-semibold">My Missions</h3>
            <p className="mt-2 text-sm text-slate-400">
              View and manage your created missions.
            </p>
          </Link>

          <Link
            href="/teacher/analytics"
            className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition hover:border-slate-500 hover:bg-slate-800"
          >
            <div className="mb-4 text-3xl">📊</div>
            <h3 className="text-xl font-semibold">Analytics</h3>
            <p className="mt-2 text-sm text-slate-400">
              View student performance and learning results.
            </p>
          </Link>
        </div>

        {/* Platform Overview */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">EduQuest Overview</h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Missions</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>

            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Active Teams</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>

            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Students</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>

            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Completed Games</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
          </div>
        </div>

        {/* Coming Next */}
        <div className="mt-8 rounded-2xl border border-dashed border-slate-700 p-6">
          <h3 className="font-semibold">🚀 Coming Next</h3>

          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>• Create curriculum-based missions</li>
            <li>• Add levels and puzzles</li>
            <li>• Add clues and hints</li>
            <li>• AI-powered puzzle generation</li>
            <li>• Student learning analytics</li>
          </ul>
        </div>
      </section>
    </main>
  )
}