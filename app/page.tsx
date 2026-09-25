import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl">

          {/* Logo / Title */}
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight">
              EduQuest
            </h1>

            <p className="mt-3 text-lg text-slate-400">
              Learn. Collaborate. Solve. Escape.
            </p>

            <p className="mt-8 text-2xl font-semibold">
              Who are you?
            </p>
          </div>

          {/* Role Selection */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {/* Student */}
            <Link
              href="/login?role=student"
              className="group rounded-3xl border border-slate-700 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-blue-500 hover:bg-slate-800"
            >
              <div className="text-6xl">👨‍🎓</div>

              <h2 className="mt-6 text-2xl font-bold">
                Student
              </h2>

              <p className="mt-3 text-slate-400">
                Join a team, solve academic challenges,
                collaborate with your teammates, and
                complete exciting escape-room missions.
              </p>

              <div className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold group-hover:bg-blue-500">
                Continue as Student →
              </div>
            </Link>

            {/* Teacher */}
            <Link
              href="/login?role=teacher"
              className="group rounded-3xl border border-slate-700 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-purple-500 hover:bg-slate-800"
            >
              <div className="text-6xl">👩‍🏫</div>

              <h2 className="mt-6 text-2xl font-bold">
                Teacher
              </h2>

              <p className="mt-3 text-slate-400">
                Create educational missions, design puzzles,
                manage students, and track learning
                performance.
              </p>

              <div className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 font-semibold group-hover:bg-purple-500">
                Continue as Teacher →
              </div>
            </Link>

          </div>

          {/* Footer */}
          <p className="mt-10 text-center text-sm text-slate-500">
            Collaborative Educational Escape Room
          </p>

        </div>
      </div>
    </main>
  )
}