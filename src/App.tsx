import { useQuery } from '@tanstack/react-query'
import { getHealth } from '@/api/health'

export default function App() {
  const { data, error, isPending } = useQuery({ queryKey: ['health'], queryFn: getHealth })

  return (
    <main className="card">
      <h1>Brightcone People</h1>
      {isPending && <p>Checking the server…</p>}
      {error && (
        <p className="bad" role="alert">
          Server unreachable: {error.message}
        </p>
      )}
      {data && (
        <p className="ok" data-testid="health">
          Server: {data.status} · Database: {data.database}
        </p>
      )}
    </main>
  )
}
