import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { buildFlowReducer, initialBuildFlowState } from '../buildFlowReducer'
import { ShapeStep } from './ShapeStep'

function onShapeStep() {
  let state = initialBuildFlowState()
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // mixIns
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // topping
  state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // shape
  return state
}

describe('ShapeStep', () => {
  it('dispatches SELECT_SHAPE when a Shape option is clicked', () => {
    const dispatch = vi.fn()
    render(<ShapeStep state={onShapeStep()} dispatch={dispatch} />)

    fireEvent.click(screen.getByRole('button', { name: 'Heart' }))

    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_SHAPE', shapeId: 'heart' })
  })

  it('marks the currently selected Shape as pressed', () => {
    const dispatch = vi.fn()
    render(<ShapeStep state={onShapeStep()} dispatch={dispatch} />)

    expect(screen.getByRole('button', { name: 'Round' })).toHaveAttribute('aria-pressed', 'true')
  })
})
