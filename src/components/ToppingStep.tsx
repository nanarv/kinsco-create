import { useState } from 'react'
import type { BuildFlowAction, BuildFlowState } from '../buildFlowReducer'
import { colorSwatches } from '../colorSwatches'
import { iconCatalog } from '../iconCatalog'

export function ToppingStep({
  state,
  dispatch,
}: {
  state: BuildFlowState
  dispatch: (action: BuildFlowAction) => void
}) {
  const presets = iconCatalog.filter((entry) => entry.category === 'topping')
  const [showCustom, setShowCustom] = useState(state.topping.customName !== null)

  return (
    <div>
      <h2>Choose your Topping</h2>
      {presets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          aria-pressed={state.topping.iconId === preset.id}
          onClick={() => dispatch({ type: 'SELECT_TOPPING_PRESET', iconId: preset.id })}
        >
          {preset.label}
        </button>
      ))}
      <button type="button" aria-pressed={showCustom} onClick={() => setShowCustom(true)}>
        Custom
      </button>
      {showCustom && (
        <>
          <label htmlFor="custom-topping-name">Custom topping name</label>
          <input
            id="custom-topping-name"
            value={state.topping.customName ?? ''}
            onChange={(event) => dispatch({ type: 'SET_TOPPING_CUSTOM_NAME', name: event.target.value })}
          />
        </>
      )}
      <div>
        {colorSwatches.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Color ${color}`}
            aria-pressed={state.topping.color === color}
            style={{ backgroundColor: color }}
            onClick={() => dispatch({ type: 'SET_TOPPING_COLOR', color })}
          />
        ))}
      </div>
    </div>
  )
}
