import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function TeamLobbyPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Get the user's team membership
  const { data: membership, error: membershipError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle()

  // TEMPORARY DEBUG
  if (membershipError) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">
          Team Membership Error
        </h1>

        <pre className="mt-4 rounded-lg border p-4 text-sm">
          {JSON.stringify(membershipError, null, 2)}
        </pre>
      </main>
    )
  }

  if (!membership) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">
          No Team Membership Found
        </h1>

        <p className="mt-4">
          Logged-in user:
        </p>

        <pre className="mt-2 rounded-lg border p-4 text-sm">
          {user.id}
        </pre>

        <p className="mt-4">
          The account is logged in, but Supabase returned no team membership.
        </p>
      </main>
    )
  }

  // Get team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('id, name, code')
    .eq('id', membership.team_id)
    .single()

  if (teamError || !team) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">
          Team Loading Error
        </h1>

        <pre className="mt-4 rounded-lg border p-4 text-sm">
          {JSON.stringify(teamError, null, 2)}
        </pre>

        <p className="mt-4">
          Team ID:
        </p>

        <pre className="mt-2 rounded-lg border p-4 text-sm">
          {membership.team_id}
        </pre>
      </main>
    )
  }

  // Get team members
  const { data: teamMembers, error: membersError } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', team.id)

  if (membersError) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">
          Team Members Error
        </h1>

        <pre className="mt-4 rounded-lg border p-4 text-sm">
          {JSON.stringify(membersError, null, 2)}
        </pre>
      </main>
    )
  }

  const memberIds = teamMembers?.map((member) => member.user_id) ?? []

  // Get profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('users')
    .select('id, full_name, role')
    .in('id', memberIds)

  if (profilesError) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">
          Profile Loading Error
        </h1>

        <pre className="mt-4 rounded-lg border p-4 text-sm">
          {JSON.stringify(profilesError, null, 2)}
        </pre>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl">

        <p className="text-sm text-gray-500">
          EduQuest Team Lobby
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          {team.name}
        </h1>

        <p className="mt-2 text-gray-600">
          Your team is ready for the adventure!
        </p>

        <div className="mt-8 rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            Team Code
          </p>

          <p className="mt-2 text-3xl font-bold tracking-widest">
            {team.code}
          </p>
        </div>

        <div className="mt-6 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Team Members
            </h2>

            <span className="rounded-full border px-3 py-1 text-sm">
              {memberIds.length} / 4
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {memberIds.map((memberId) => {
              const profile = profiles?.find(
                (item) => item.id === memberId
              )

              return (
                <div
                  key={memberId}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">
                      {profile?.full_name || 'Student'}
                    </p>

                    <p className="text-sm text-gray-500">
                      {profile?.role || 'student'}
                    </p>
                  </div>

                  {memberId === user.id && (
                    <span className="text-sm font-medium">
                      You
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-6 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Mission Status
          </h2>

          <p className="mt-2 text-gray-500">
            Waiting for your team to get ready.
          </p>

          <button
            disabled
            className="mt-4 w-full rounded-md bg-black px-4 py-2 text-white opacity-50"
          >
            Start Mission
          </button>
        </div>

      </div>
    </main>
  )
}