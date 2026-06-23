import type { BuildFlowAction, BuildFlowState } from '../buildFlowReducer'
import { colorSwatches } from '../colorSwatches'
import { iconCatalog } from '../iconCatalog'

export function BaseStep({
  state,
  dispatch,
}: {
  state: BuildFlowState
  dispatch: (action: BuildFlowAction) => void
}) {
  const presets = iconCatalog.filter((entry) => entry.category === 'base')

  return (
    <div>
      <h2>Choose your Base</h2>
      {presets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          aria-pressed={state.base.iconId === preset.id}
          onClick={() => dispatch({ type: 'SELECT_BASE_PRESET', iconId: preset.id })}
        >
          {preset.label}
        </button>
      ))}
      <label htmlFor="custom-base-name">Custom base name</label>
      <input
        id="custom-base-name"
        value={state.base.customName ?? ''}
        onChange={(event) => dispatch({ type: 'SET_BASE_CUSTOM_NAME', name: event.target.value })}
      />
      <div>
        {colorSwatches.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Color ${color}`}
            aria-pressed={state.base.color === color}
            style={{ backgroundColor: color }}
            onClick={() => dispatch({ type: 'SET_BASE_COLOR', color })}
          />
        ))}
      </div>
    </div>
  )
}
