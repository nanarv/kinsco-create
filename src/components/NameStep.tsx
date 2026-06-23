import { useState } from 'react'
import type { BuildFlowAction, BuildFlowState } from '../buildFlowReducer'
import { submitCookie } from '../lib/cookieRepository'
import { submitEmailSignup } from '../lib/emailSignupRepository'
import type { Cookie } from '../types'

function toCookie(state: BuildFlowState): Cookie {
  return {
    id: crypto.randomUUID(),
    name: state.name,
    shape: state.shape,
    base: state.base,
    mixIns: state.mixIns,
    topping: state.topping,
    createdAt: new Date().toISOString(),
  }
}

export function NameStep({
  state,
  dispatch,
  onSubmitted,
}: {
  state: BuildFlowState
  dispatch: (action: BuildFlowAction) => void
  onSubmitted: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setIsSubmitting(true)
    setError(null)
    try {
      await submitCookie(toCookie(state))
      if (state.email.trim() !== '') {
        try {
          await submitEmailSignup(state.email)
        } catch {
          // Email Signup failures are silent (PRD: optional side-feature shouldn't spoil submission)
        }
      }
      onSubmitted()
    } catch {
      setError('Something went wrong saving your cookie. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Name your Cookie</h2>
      <label htmlFor="cookie-name">Cookie name</label>
      <input
        id="cookie-name"
        value={state.name}
        onChange={(event) => dispatch({ type: 'SET_NAME', name: event.target.value })}
      />
      <label htmlFor="cookie-email">Email (optional)</label>
      <input
        id="cookie-email"
        value={state.email}
        onChange={(event) => dispatch({ type: 'SET_EMAIL', email: event.target.value })}
      />
      {error && <p>{error}</p>}
      <button type="button" disabled={state.name.trim() === '' || isSubmitting} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  )
}
