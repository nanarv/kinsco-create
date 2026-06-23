import { findIcon, iconCatalog } from './iconCatalog'
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
  | { type: 'SELECT_TOPPING_PRESET'; iconId: string }
  | { type: 'SELECT_SHAPE'; shapeId: string }
  | { type: 'SET_BASE_CUSTOM_NAME'; name: string }
  | { type: 'SET_TOPPING_CUSTOM_NAME'; name: string }
  | { type: 'SET_BASE_COLOR'; color: string }
  | { type: 'SET_TOPPING_COLOR'; color: string }
  | { type: 'SET_MIX_IN_PATTERN'; index: number; pattern: 'flecks' | 'swirl' }
  | { type: 'ADD_MIX_IN_PRESET'; iconId: string }
  | { type: 'ADD_MIX_IN_CUSTOM_NAME'; name: string }
  | { type: 'REMOVE_MIX_IN'; index: number }
  | { type: 'SET_MIX_IN_COLOR'; index: number; color: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_EMAIL'; email: string }
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
    case 'SELECT_TOPPING_PRESET':
      return { ...state, topping: { iconId: action.iconId, customName: null, color: state.topping.color } }
    case 'SELECT_SHAPE':
      return { ...state, shape: action.shapeId }
    case 'SET_BASE_CUSTOM_NAME':
      return { ...state, base: { iconId: null, customName: action.name, color: state.base.color } }
    case 'SET_TOPPING_CUSTOM_NAME':
      return { ...state, topping: { iconId: null, customName: action.name, color: state.topping.color } }
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
    case 'ADD_MIX_IN_CUSTOM_NAME': {
      if (state.mixIns.length >= 4) {
        return state
      }
      const fallback = findIcon('mixIn', null)
      return {
        ...state,
        mixIns: [
          ...state.mixIns,
          { iconId: null, customName: action.name, color: fallback.defaultColor, pattern: 'flecks' },
        ],
      }
    }
    case 'SET_BASE_COLOR':
      return { ...state, base: { ...state.base, color: action.color } }
    case 'SET_TOPPING_COLOR':
      return { ...state, topping: { ...state.topping, color: action.color } }
    case 'SET_MIX_IN_COLOR':
      return {
        ...state,
        mixIns: state.mixIns.map((mixIn, index) =>
          index === action.index ? { ...mixIn, color: action.color } : mixIn,
        ),
      }
    case 'SET_MIX_IN_PATTERN':
      return {
        ...state,
        mixIns: state.mixIns.map((mixIn, index) =>
          index === action.index ? { ...mixIn, pattern: action.pattern } : mixIn,
        ),
      }
    case 'REMOVE_MIX_IN':
      return {
        ...state,
        mixIns: state.mixIns.filter((_, index) => index !== action.index),
      }
    case 'SET_NAME':
      return { ...state, name: action.name.slice(0, 50) }
    case 'SET_EMAIL':
      return { ...state, email: action.email }
    case 'RESTART':
      return initialBuildFlowState()
    default:
      return state
  }
}
