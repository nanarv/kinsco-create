import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { initialBuildFlowState } from '../buildFlowReducer'
import { BaseStep } from './BaseStep'

describe('BaseStep', () => {
  it('dispatches SELECT_BASE_PRESET when a preset is clicked', () => {
    const dispatch = vi.fn()
    render(<BaseStep state={initialBuildFlowState()} dispatch={dispatch} />)

    fireEvent.click(screen.getByRole('button', { name: 'Vanilla Dough' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_BASE_PRESET', iconId: 'vanilla-dough' })
  })

  it('dispatches SET_BASE_CUSTOM_NAME when a custom name is typed', () => {
    const dispatch = vi.fn()
    render(<BaseStep state={initialBuildFlowState()} dispatch={dispatch} />)

    fireEvent.change(screen.getByLabelText('Custom base name'), { target: { value: 'Matcha' } })

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_BASE_CUSTOM_NAME', name: 'Matcha' })
  })

  it('dispatches SET_BASE_COLOR when a swatch is clicked', () => {
    const dispatch = vi.fn()
    render(<BaseStep state={initialBuildFlowState()} dispatch={dispatch} />)

    fireEvent.click(screen.getByRole('button', { name: 'Color #5b3a29' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_BASE_COLOR', color: '#5b3a29' })
  })
})
