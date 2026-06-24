import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { buildFlowReducer, initialBuildFlowState } from '../buildFlowReducer'
import { MixInsStep } from './MixInsStep'

function onMixInsStep() {
  let state = initialBuildFlowState()
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // mixIns
  return state
}

describe('MixInsStep', () => {
  it('dispatches ADD_MIX_IN_PRESET when a preset is clicked', () => {
    const dispatch = vi.fn()
    render(<MixInsStep state={onMixInsStep()} dispatch={dispatch} />)

    fireEvent.click(screen.getByRole('button', { name: 'Chocolate Chips' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
  })

  it('shows the up-to-4 limit copy', () => {
    render(<MixInsStep state={onMixInsStep()} dispatch={vi.fn()} />)

    expect(screen.getByText('Select up to 4 ingredients')).toBeInTheDocument()
  })

  it('disables preset buttons once 4 Mix-in slots are filled', () => {
    let state = onMixInsStep()
    for (let i = 0; i < 4; i++) {
      state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    }

    render(<MixInsStep state={state} dispatch={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Chocolate Chips' })).toBeDisabled()
  })

  it('lists each filled slot with a remove ("x") control that dispatches REMOVE_MIX_IN by index', () => {
    let state = onMixInsStep()
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    const dispatch = vi.fn()

    render(<MixInsStep state={state} dispatch={dispatch} />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove Chocolate Chips' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'REMOVE_MIX_IN', index: 0 })
  })

  it('does not show the custom mix-in name field until Custom is clicked', () => {
    render(<MixInsStep state={onMixInsStep()} dispatch={vi.fn()} />)

    expect(screen.queryByLabelText('Custom mix-in name')).not.toBeInTheDocument()
  })

  it('shows the custom mix-in name field after Custom is clicked', () => {
    render(<MixInsStep state={onMixInsStep()} dispatch={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Custom' }))

    expect(screen.getByLabelText('Custom mix-in name')).toBeInTheDocument()
  })

  it('dispatches ADD_MIX_IN_CUSTOM_NAME when a custom Mix-in name is typed', () => {
    const dispatch = vi.fn()
    render(<MixInsStep state={onMixInsStep()} dispatch={dispatch} />)

    fireEvent.click(screen.getByRole('button', { name: 'Custom' }))
    fireEvent.change(screen.getByLabelText('Custom mix-in name'), { target: { value: 'Mango' } })

    expect(dispatch).toHaveBeenCalledWith({ type: 'ADD_MIX_IN_CUSTOM_NAME', name: 'Mango' })
  })

  it('dispatches SET_MIX_IN_COLOR with the slot index when a swatch is clicked on a filled slot', () => {
    let state = onMixInsStep()
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    const dispatch = vi.fn()

    render(<MixInsStep state={state} dispatch={dispatch} />)
    fireEvent.click(screen.getByRole('button', { name: 'Color #5b3a29' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_MIX_IN_COLOR', index: 0, color: '#5b3a29' })
  })

  it('dispatches SET_MIX_IN_PATTERN with the slot index when swirl is chosen on a filled slot', () => {
    let state = onMixInsStep()
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    const dispatch = vi.fn()

    render(<MixInsStep state={state} dispatch={dispatch} />)
    fireEvent.click(screen.getByRole('button', { name: 'Swirl' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_MIX_IN_PATTERN', index: 0, pattern: 'swirl' })
  })
})
