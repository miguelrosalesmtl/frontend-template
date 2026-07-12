import { ErrorState } from '@/components/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { UserList } from '@/features/users/components/UserList'
import { useDeleteUser, useUsers } from '@/features/users/hooks/useUsers'

/**
 * Container.
 *
 * This is the seam. It is the only file in the feature allowed to touch hooks,
 * and it does the loading/error branching so that everything below it receives
 * nothing but resolved domain data.
 *
 * Copy this folder to start a new feature.
 */
export function UsersPage() {
  const { data: users, isPending, isError, error, refetch } = useUsers()
  const deleteUser = useDeleteUser()

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground text-sm">
          Served by MSW. Point <code>apiUrl</code> in <code>public/config.json</code> at a real
          backend and set <code>enableMocking</code> to <code>false</code>.
        </p>
      </header>

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : isError ? (
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      ) : (
        <UserList
          users={users}
          onDelete={(id) => deleteUser.mutate(id)}
          deletingId={deleteUser.isPending ? deleteUser.variables : null}
        />
      )}
    </section>
  )
}
