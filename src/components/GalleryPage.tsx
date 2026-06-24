import { useEffect, useState } from 'react'
import { fetchCookies as defaultFetchCookies } from '../lib/cookieRepository'
import { sortCookiesByMostRecent } from '../sortCookiesByMostRecent'
import type { Cookie } from '../types'
import { CookieRenderer } from './CookieRenderer'

type FetchState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; cookies: Cookie[] }

export function GalleryPage({
  fetchCookies = defaultFetchCookies,
}: {
  fetchCookies?: () => Promise<Cookie[]>
}) {
  const [state, setState] = useState<FetchState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    fetchCookies()
      .then((cookies) => setState({ status: 'success', cookies }))
      .catch(() => setState({ status: 'error' }))
  }, [fetchCookies, attempt])

  if (state.status === 'loading') {
    return <p>Loading Gallery...</p>
  }

  if (state.status === 'error') {
    return (
      <div>
        <p>Something went wrong loading the Gallery.</p>
        <button
          type="button"
          onClick={() => {
            setState({ status: 'loading' })
            setAttempt((current) => current + 1)
          }}
        >
          Try again
        </button>
      </div>
    )
  }

  const sorted = sortCookiesByMostRecent(state.cookies)

  if (sorted.length === 0) {
    return <p>No Cookies yet — be the first to build one!</p>
  }

  return (
    <div>
      {sorted.map((cookieEntry) => (
        <div key={cookieEntry.id}>
          <p>{cookieEntry.name}</p>
          <CookieRenderer cookie={cookieEntry} />
        </div>
      ))}
    </div>
  )
}
