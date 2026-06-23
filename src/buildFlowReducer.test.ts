import { describe, expect, it } from 'vitest'
import { buildFlowReducer, initialBuildFlowState } from './buildFlowReducer'

describe('buildFlowReducer', () => {
  it('moves to the next step on NEXT_STEP, starting from base', () => {
    const state = initialBuildFlowState()

    const next = buildFlowReducer(state, { type: 'NEXT_STEP' })

    expect(next.step).toBe('mixIns')
  })

  it('moves back to the previous step on BACK_STEP', () => {
    const state = initialBuildFlowState()
    const onMixIns = buildFlowReducer(state, { type: 'NEXT_STEP' })

    const back = buildFlowReducer(onMixIns, { type: 'BACK_STEP' })

    expect(back.step).toBe('base')
  })

  it('defaults the Base to the first catalog preset right from the initial state', () => {
    const state = initialBuildFlowState()

    expect(state.base.iconId).toBe('vanilla-dough')
  })

  it('defaults the Topping to the first catalog preset on entering that step', () => {
    const state = initialBuildFlowState()
    const onMixIns = buildFlowReducer(state, { type: 'NEXT_STEP' })
    const onTopping = buildFlowReducer(onMixIns, { type: 'NEXT_STEP' })

    expect(onTopping.topping.iconId).toBe('drizzle')
  })

  it('defaults the Shape to the first placeholder option on entering that step', () => {
    let state = initialBuildFlowState()
    state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // mixIns
    state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // topping
    state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // shape

    expect(state.shape).toBe('round')
  })

  it('lets a player override the Base default by picking a different preset', () => {
    const state = initialBuildFlowState()

    const updated = buildFlowReducer(state, { type: 'SELECT_BASE_PRESET', iconId: 'other-base-preset' })

    expect(updated.base.iconId).toBe('other-base-preset')
  })

  it('lets a player override the Topping default by picking a different preset', () => {
    const state = initialBuildFlowState()

    const updated = buildFlowReducer(state, { type: 'SELECT_TOPPING_PRESET', iconId: 'other-topping-preset' })

    expect(updated.topping.iconId).toBe('other-topping-preset')
  })

  it('lets a player override the Shape default by picking a different option', () => {
    let state = initialBuildFlowState()
    state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // mixIns
    state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // topping
    state = buildFlowReducer(state, { type: 'NEXT_STEP' }) // shape

    const updated = buildFlowReducer(state, { type: 'SELECT_SHAPE', shapeId: 'heart' })

    expect(updated.shape).toBe('heart')
  })

  it('lets a player type a custom Base name, clearing any preset selection', () => {
    const state = initialBuildFlowState()

    const updated = buildFlowReducer(state, { type: 'SET_BASE_CUSTOM_NAME', name: 'Matcha Dream' })

    expect(updated.base.customName).toBe('Matcha Dream')
    expect(updated.base.iconId).toBeNull()
  })

  it('lets a player type a custom Topping name, clearing any preset selection', () => {
    const state = initialBuildFlowState()

    const updated = buildFlowReducer(state, { type: 'SET_TOPPING_CUSTOM_NAME', name: 'Maple Glaze' })

    expect(updated.topping.customName).toBe('Maple Glaze')
    expect(updated.topping.iconId).toBeNull()
  })

  it('fills Mix-in slots in the order they are added', () => {
    let state = initialBuildFlowState()
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })

    expect(state.mixIns).toHaveLength(2)
    expect(state.mixIns[0].iconId).toBe('chocolate-chips')
    expect(state.mixIns[1].iconId).toBe('chocolate-chips')
  })

  it('fills the next Mix-in slot with a custom name, same as a preset click', () => {
    let state = initialBuildFlowState()
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })

    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_CUSTOM_NAME', name: 'Mango' })

    expect(state.mixIns).toHaveLength(2)
    expect(state.mixIns[1]).toMatchObject({ iconId: null, customName: 'Mango', pattern: 'flecks' })
  })

  it('treats adding a custom Mix-in as a no-op once 4 slots are filled', () => {
    let state = initialBuildFlowState()
    for (let i = 0; i < 4; i++) {
      state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    }

    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_CUSTOM_NAME', name: 'Mango' })

    expect(state.mixIns).toHaveLength(4)
  })

  it('treats adding a 5th Mix-in as a no-op once 4 slots are filled', () => {
    let state = initialBuildFlowState()
    for (let i = 0; i < 5; i++) {
      state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    }

    expect(state.mixIns).toHaveLength(4)
  })

  it('sets the Base color without touching its iconId/customName', () => {
    const state = initialBuildFlowState()

    const updated = buildFlowReducer(state, { type: 'SET_BASE_COLOR', color: '#abcabc' })

    expect(updated.base).toEqual({ ...state.base, color: '#abcabc' })
  })

  it('sets the Topping color without touching its iconId/customName', () => {
    const state = initialBuildFlowState()

    const updated = buildFlowReducer(state, { type: 'SET_TOPPING_COLOR', color: '#abcabc' })

    expect(updated.topping).toEqual({ ...state.topping, color: '#abcabc' })
  })

  it('sets a Mix-in slot\'s render Pattern', () => {
    let state = initialBuildFlowState()
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })

    state = buildFlowReducer(state, { type: 'SET_MIX_IN_PATTERN', index: 0, pattern: 'swirl' })

    expect(state.mixIns[0].pattern).toBe('swirl')
  })

  it('removes a Mix-in slot and shifts the remaining ones down', () => {
    let state = initialBuildFlowState()
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    state = buildFlowReducer(state, { type: 'SET_MIX_IN_COLOR', index: 0, color: '#first' })
    state = buildFlowReducer(state, { type: 'SET_MIX_IN_COLOR', index: 1, color: '#second' })

    state = buildFlowReducer(state, { type: 'REMOVE_MIX_IN', index: 0 })

    expect(state.mixIns).toHaveLength(1)
    expect(state.mixIns[0].color).toBe('#second')
  })

  it('sets the optional email', () => {
    const state = initialBuildFlowState()

    const updated = buildFlowReducer(state, { type: 'SET_EMAIL', email: 'player@example.com' })

    expect(updated.email).toBe('player@example.com')
  })

  it('truncates the name to 50 characters', () => {
    const state = initialBuildFlowState()
    const longName = 'a'.repeat(60)

    const updated = buildFlowReducer(state, { type: 'SET_NAME', name: longName })

    expect(updated.name).toHaveLength(50)
  })

  it('clears everything back to the initial state on RESTART', () => {
    let state = initialBuildFlowState()
    state = buildFlowReducer(state, { type: 'ADD_MIX_IN_PRESET', iconId: 'chocolate-chips' })
    state = buildFlowReducer(state, { type: 'NEXT_STEP' })
    state = buildFlowReducer(state, { type: 'SET_NAME', name: 'Sprinkle Dream' })

    const restarted = buildFlowReducer(state, { type: 'RESTART' })

    expect(restarted).toEqual(initialBuildFlowState())
  })
})
