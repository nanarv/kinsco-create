import type { BuildFlowAction, BuildFlowState } from '../buildFlowReducer'
import { colorSwatches } from '../colorSwatches'
import { findIcon, iconCatalog } from '../iconCatalog'

const MAX_MIX_INS = 4

export function MixInsStep({
  state,
  dispatch,
}: {
  state: BuildFlowState
  dispatch: (action: BuildFlowAction) => void
}) {
  const presets = iconCatalog.filter((entry) => entry.category === 'mixIn')
  const isFull = state.mixIns.length >= MAX_MIX_INS

  return (
    <div>
      <h2>Choose your Mix-ins</h2>
      <p>Select up to 4 ingredients</p>
      {presets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          disabled={isFull}
          onClick={() => dispatch({ type: 'ADD_MIX_IN_PRESET', iconId: preset.id })}
        >
          {preset.label}
        </button>
      ))}
      <label htmlFor="custom-mix-in-name">Custom mix-in name</label>
      <input
        id="custom-mix-in-name"
        disabled={isFull}
        onChange={(event) => dispatch({ type: 'ADD_MIX_IN_CUSTOM_NAME', name: event.target.value })}
      />
      <ul>
        {state.mixIns.map((mixIn, index) => {
          const entry = findIcon('mixIn', mixIn.iconId)
          const label = mixIn.customName ?? entry.label
          return (
            <li key={index}>
              {label}
              <button type="button" onClick={() => dispatch({ type: 'REMOVE_MIX_IN', index })}>
                {`Remove ${label}`}
              </button>
              <div>
                {colorSwatches.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Color ${color}`}
                    aria-pressed={mixIn.color === color}
                    style={{ backgroundColor: color }}
                    onClick={() => dispatch({ type: 'SET_MIX_IN_COLOR', index, color })}
                  />
                ))}
              </div>
              <div>
                <button
                  type="button"
                  aria-pressed={mixIn.pattern === 'flecks'}
                  onClick={() => dispatch({ type: 'SET_MIX_IN_PATTERN', index, pattern: 'flecks' })}
                >
                  Flecks
                </button>
                <button
                  type="button"
                  aria-pressed={mixIn.pattern === 'swirl'}
                  onClick={() => dispatch({ type: 'SET_MIX_IN_PATTERN', index, pattern: 'swirl' })}
                >
                  Swirl
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
