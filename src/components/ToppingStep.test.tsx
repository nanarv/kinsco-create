import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { buildFlowReducer, initialBuildFlowState } from '../buildFlowReducer'
import { ToppingStep } from './ToppingStep'

function onToppingStep() {
  let state = initialBuildFlowState()
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // mixIns
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // topping
  return state
}

describe('ToppingStep', () => {
  it('dispatches SELECT_TOPPING_PRESET when a preset is clicked', () => {
    const dispatch = vi.fn()
    render(<ToppingStep state={onToppingStep()} dispatch={dispatch} />)

    fireEvent.click(screen.getByRole('button', { name: 'Drizzle' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_TOPPING_PRESET', iconId: 'drizzle' })
  })

  it('dispatches SET_TOPPING_CUSTOM_NAME when a custom name is typed', () => {
    const dispatch = vi.fn()
    render(<ToppingStep state={onToppingStep()} dispatch={dispatch} />)

    fireEvent.change(screen.getByLabelText('Custom topping name'), { target: { value: 'Maple Glaze' } })

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_TOPPING_CUSTOM_NAME', name: 'Maple Glaze' })
  })

  it('dispatches SET_TOPPING_COLOR when a swatch is clicked', () => {
    const dispatch = vi.fn()
    render(<ToppingStep state={onToppingStep()} dispatch={dispatch} />)

    fireEvent.click(screen.getByRole('button', { name: 'Color #5b3a29' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_TOPPING_COLOR', color: '#5b3a29' })
  })
})
