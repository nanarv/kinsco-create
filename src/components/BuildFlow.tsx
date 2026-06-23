import { useReducer, useState } from 'react'
import { buildFlowReducer, initialBuildFlowState } from '../buildFlowReducer'
import { BaseStep } from './BaseStep'
import { CookieRenderer } from './CookieRenderer'
import { MixInsStep } from './MixInsStep'
import { NameStep } from './NameStep'
import { ShapeStep } from './ShapeStep'
import { ToppingStep } from './ToppingStep'

export function BuildFlow({ onSubmitted }: { onSubmitted: () => void }) {
  const [state, dispatch] = useReducer(buildFlowReducer, undefined, initialBuildFlowState)
  const [confirmingRestart, setConfirmingRestart] = useState(false)

  return (
    <div>
      <CookieRenderer
        cookie={{ id: '', name: state.name, createdAt: '', shape: state.shape, base: state.base, mixIns: state.mixIns, topping: state.topping }}
      />

      {state.step === 'base' && <BaseStep state={state} dispatch={dispatch} />}
      {state.step === 'mixIns' && <MixInsStep state={state} dispatch={dispatch} />}
      {state.step === 'topping' && <ToppingStep state={state} dispatch={dispatch} />}
      {state.step === 'shape' && <ShapeStep state={state} dispatch={dispatch} />}
      {state.step === 'name' && <NameStep state={state} dispatch={dispatch} onSubmitted={onSubmitted} />}

      <button type="button" onClick={() => dispatch({ type: 'BACK_STEP' })}>
        Back
      </button>
      <button type="button" onClick={() => dispatch({ type: 'NEXT_STEP' })}>
        Next
      </button>

      <button type="button" onClick={() => setConfirmingRestart(true)}>
        Restart Cookie
      </button>
      {confirmingRestart && (
        <div>
          <p>Restart your cookie? This clears everything you've picked so far.</p>
          <button type="button" onClick={() => setConfirmingRestart(false)}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'RESTART' })
              setConfirmingRestart(false)
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  )
}
