import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { buildFlowReducer, initialBuildFlowState } from '../buildFlowReducer'
import { submitCookie } from '../lib/cookieRepository'
import { submitEmailSignup } from '../lib/emailSignupRepository'
import { NameStep } from './NameStep'

vi.mock('../lib/cookieRepository', () => ({ submitCookie: vi.fn() }))
vi.mock('../lib/emailSignupRepository', () => ({ submitEmailSignup: vi.fn() }))

function onNameStep() {
  let state = initialBuildFlowState()
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // mixIns
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // topping
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // shape
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // name
  return state
}

describe('NameStep', () => {
  it('dispatches SET_NAME when the name field changes', () => {
    const dispatch = vi.fn()
    render(<NameStep state={onNameStep()} dispatch={dispatch} onSubmitted={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Cookie name'), { target: { value: 'Sprinkle Dream' } })

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_NAME', name: 'Sprinkle Dream' })
  })

  it('dispatches SET_EMAIL when the email field changes', () => {
    const dispatch = vi.fn()
    render(<NameStep state={onNameStep()} dispatch={dispatch} onSubmitted={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Email (optional)'), {
      target: { value: 'player@example.com' },
    })

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_EMAIL', email: 'player@example.com' })
  })

  it('disables Submit while the name is empty', () => {
    render(<NameStep state={onNameStep()} dispatch={vi.fn()} onSubmitted={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
  })

  it('enables Submit once a name is entered', () => {
    const state = { ...onNameStep(), name: 'Sprinkle Dream' }

    render(<NameStep state={state} dispatch={vi.fn()} onSubmitted={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
  })

  it('calls submitCookie with the assembled Cookie and switches to the Gallery on success', async () => {
    vi.mocked(submitCookie).mockResolvedValue(undefined)
    const onSubmitted = vi.fn()
    const state = { ...onNameStep(), name: 'Sprinkle Dream' }

    render(<NameStep state={state} dispatch={vi.fn()} onSubmitted={onSubmitted} />)
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(onSubmitted).toHaveBeenCalled())
    expect(submitCookie).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Sprinkle Dream', shape: state.shape, base: state.base, mixIns: state.mixIns, topping: state.topping }),
    )
    expect(submitEmailSignup).not.toHaveBeenCalled()
  })

  it('also calls submitEmailSignup when an email was entered, and still switches to the Gallery', async () => {
    vi.mocked(submitCookie).mockResolvedValue(undefined)
    vi.mocked(submitEmailSignup).mockResolvedValue(undefined)
    const onSubmitted = vi.fn()
    const state = { ...onNameStep(), name: 'Sprinkle Dream', email: 'player@example.com' }

    render(<NameStep state={state} dispatch={vi.fn()} onSubmitted={onSubmitted} />)
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(onSubmitted).toHaveBeenCalled())
    expect(submitEmailSignup).toHaveBeenCalledWith('player@example.com')
  })

  it('shows a retryable error and preserves state when submitCookie fails', async () => {
    vi.mocked(submitCookie).mockRejectedValueOnce(new Error('network error'))
    const onSubmitted = vi.fn()
    const state = { ...onNameStep(), name: 'Sprinkle Dream' }

    render(<NameStep state={state} dispatch={vi.fn()} onSubmitted={onSubmitted} />)
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument())
    expect(onSubmitted).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
  })

  it('switches to the Gallery even when submitEmailSignup fails, without an extra error message', async () => {
    vi.mocked(submitCookie).mockResolvedValue(undefined)
    vi.mocked(submitEmailSignup).mockRejectedValueOnce(new Error('email service down'))
    const onSubmitted = vi.fn()
    const state = { ...onNameStep(), name: 'Sprinkle Dream', email: 'player@example.com' }

    render(<NameStep state={state} dispatch={vi.fn()} onSubmitted={onSubmitted} />)
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(onSubmitted).toHaveBeenCalled())
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
  })
})
