'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function JoinTeamPage() {
  const router = useRouter()
  const supabase = createClient()

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleJoinTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    const teamCode = code.trim().toUpperCase()

    if (!teamCode) {
      setMessage('Please enter a team code.')
      setLoading(false)
      return
    }

    if (teamCode.length !== 6) {
      setMessage('Team code must be 6 characters.')
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

    // Find the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name, code')
      .eq('code', teamCode)
      .maybeSingle()

    if (teamError) {
      setMessage(teamError.message)
      setLoading(false)
      return
    }

    if (!team) {
      setMessage('Team not found. Please check the code.')
      setLoading(false)
      return
    }

    // Check whether the user is already a member
    const { data: existingMember, error: existingError } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', team.id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingError) {
      setMessage(existingError.message)
      setLoading(false)
      return
    }

    if (existingMember) {
      setMessage('You are already a member of this team.')
      setLoading(false)
      return
    }

    // Check current team size
    const { count, error: countError } = await supabase
      .from('team_members')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', team.id)

    if (countError) {
      setMessage(countError.message)
      setLoading(false)
      return
    }

    if ((count ?? 0) >= 4) {
      setMessage('This team is full. Maximum 4 members allowed.')
      setLoading(false)
      return
    }

    // Add student to team
    const { error: joinError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
      })

    if (joinError) {
      setMessage(joinError.message)
      setLoading(false)
      return
    }

    setMessage(`Successfully joined ${team.name}!`)

    setTimeout(() => {
      router.push('/student')
    }, 1000)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Join a Team
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter the 6-character team code shared by your teammate.
        </p>

        <form onSubmit={handleJoinTeam} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Team Code
            </label>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Example: X7K2P9"
              maxLength={6}
              className="w-full rounded-md border px-3 py-2 uppercase outline-none focus:ring-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Joining Team...' : 'Join Team'}
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