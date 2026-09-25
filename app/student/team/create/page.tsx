'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CreateTeamPage() {
  const router = useRouter()
  const supabase = createClient()

  const [teamName, setTeamName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

 async function handleCreateTeam(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  setLoading(true)
  setMessage('')

  if (!teamName.trim()) {
    setMessage('Please enter a team name.')
    setLoading(false)
    return
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    setMessage('Please login first.')
    setLoading(false)
    return
  }

  // Generate a 6-character team code
  const code = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      name: teamName.trim(),
      code: code,
      created_by: user.id,
    })
    .select()
    .single()

  if (teamError) {
    setMessage(teamError.message)
    setLoading(false)
    return
  }

  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: team.id,
      user_id: user.id,
    })

  if (memberError) {
    setMessage(memberError.message)
    setLoading(false)
    return
  }

  setMessage(`Team created successfully! Your team code is ${team.code}`)

  setTimeout(() => {
    router.push('/student')
  }, 1500)
}
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Create Your Team
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create a team and invite your classmates.
        </p>

        <form onSubmit={handleCreateTeam} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Team Name
            </label>

            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Example: Brain Masters"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Creating Team...' : 'Create Team'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm">
            {message}
          </p>
        )}
      </div>
    </main>
  )
}