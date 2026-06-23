import type { BuildFlowAction, BuildFlowState } from '../buildFlowReducer'
import { shapeOptions } from '../shapeOptions'

export function ShapeStep({
  state,
  dispatch,
}: {
  state: BuildFlowState
  dispatch: (action: BuildFlowAction) => void
}) {
  return (
    <div>
      <h2>Choose your Shape</h2>
      {shapeOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={state.shape === option.id}
          onClick={() => dispatch({ type: 'SELECT_SHAPE', shapeId: option.id })}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
