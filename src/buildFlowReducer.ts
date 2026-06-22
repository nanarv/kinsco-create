import { iconCatalog } from './iconCatalog'
import { shapeOptions } from './shapeOptions'
import type { ComponentChoice, MixInChoice } from './types'

export type BuildStep = 'base' | 'mixIns' | 'topping' | 'shape' | 'name'

export interface BuildFlowState {
  step: BuildStep
  base: ComponentChoice
  mixIns: MixInChoice[]
  topping: ComponentChoice
  shape: string
  name: string
  email: string
}

export type BuildFlowAction =
  | { type: 'SELECT_BASE_PRESET'; iconId: string }
  | { type: 'ADD_MIX_IN_PRESET'; iconId: string }
  | { type: 'REMOVE_MIX_IN'; index: number }
  | { type: 'SET_MIX_IN_COLOR'; index: number; color: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'NEXT_STEP' }
  | { type: 'BACK_STEP' }
  | { type: 'RESTART' }

const STEPS: BuildStep[] = ['base', 'mixIns', 'topping', 'shape', 'name']

function firstIconId(category: 'base' | 'topping'): string {
  const entry = iconCatalog.find((candidate) => candidate.category === category)
  if (!entry) {
    throw new Error(`No catalog entries for category: ${category}`)
  }
  return entry.id
}

function applyStepDefault(state: BuildFlowState, step: BuildStep): BuildFlowState {
  if (step === 'base' && state.base.iconId === null && state.base.customName === null) {
    return { ...state, base: { ...state.base, iconId: firstIconId('base') } }
  }
  if (step === 'topping' && state.topping.iconId === null && state.topping.customName === null) {
    return { ...state, topping: { ...state.topping, iconId: firstIconId('topping') } }
  }
  if (step === 'shape' && state.shape === '') {
    return { ...state, shape: shapeOptions[0].id }
  }
  return state
}

export function initialBuildFlowState(): BuildFlowState {
  const state: BuildFlowState = {
    step: 'base',
    base: { iconId: null, customName: null, color: '' },
    mixIns: [],
    topping: { iconId: null, customName: null, color: '' },
    shape: '',
    name: '',
    email: '',
  }
  return applyStepDefault(state, 'base')
}

export function buildFlowReducer(state: BuildFlowState, action: BuildFlowAction): BuildFlowState {
  switch (action.type) {
    case 'NEXT_STEP': {
      const currentIndex = STEPS.indexOf(state.step)
      const nextStep = STEPS[currentIndex + 1] ?? state.step
      return applyStepDefault({ ...state, step: nextStep }, nextStep)
    }
    case 'BACK_STEP': {
      const currentIndex = STEPS.indexOf(state.step)
      const previousStep = STEPS[currentIndex - 1] ?? state.step
      return applyStepDefault({ ...state, step: previousStep }, previousStep)
    }
    case 'SELECT_BASE_PRESET':
      return { ...state, base: { iconId: action.iconId, customName: null, color: state.base.color } }
    case 'ADD_MIX_IN_PRESET': {
      if (state.mixIns.length >= 4) {
        return state
      }
      const entry = iconCatalog.find(
        (candidate) => candidate.category === 'mixIn' && candidate.id === action.iconId,
      )
      return {
        ...state,
        mixIns: [
          ...state.mixIns,
          { iconId: action.iconId, customName: null, color: entry?.defaultColor ?? '', pattern: 'flecks' },
        ],
      }
    }
    case 'SET_MIX_IN_COLOR':
      return {
        ...state,
        mixIns: state.mixIns.map((mixIn, index) =>
          index === action.index ? { ...mixIn, color: action.color } : mixIn,
        ),
      }
    case 'REMOVE_MIX_IN':
      return {
        ...state,
        mixIns: state.mixIns.filter((_, index) => index !== action.index),
      }
    case 'SET_NAME':
      return { ...state, name: action.name.slice(0, 50) }
    case 'RESTART':
      return initialBuildFlowState()
    default:
      return state
  }
}
