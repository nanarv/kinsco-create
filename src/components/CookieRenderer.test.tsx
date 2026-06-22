import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Cookie } from '../types'
import { CookieRenderer } from './CookieRenderer'

const baseCookie: Cookie = {
  id: 'c1',
  name: 'Sprinkle Dream',
  shape: 'round',
  base: { iconId: 'vanilla-dough', customName: null, color: '#f5e1a4' },
  mixIns: [
    { iconId: 'chocolate-chips', customName: null, color: '#5b3a29', pattern: 'flecks' },
  ],
  topping: { iconId: 'drizzle', customName: null, color: '#ffffff' },
  createdAt: '2026-01-01T00:00:00Z',
}

describe('CookieRenderer', () => {
  it('renders the Base, each Mix-in, and the Topping as Icons', () => {
    render(<CookieRenderer cookie={baseCookie} />)

    expect(screen.getByRole('img', { name: 'Vanilla Dough' })).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: 'Chocolate Chips' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('img', { name: 'Drizzle' })).toBeInTheDocument()
  })

  it('renders Base and Topping when there are zero Mix-ins', () => {
    const cookieWithNoMixIns: Cookie = { ...baseCookie, mixIns: [] }

    render(<CookieRenderer cookie={cookieWithNoMixIns} />)

    expect(screen.getByRole('img', { name: 'Vanilla Dough' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Drizzle' })).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Chocolate Chips' })).not.toBeInTheDocument()
  })
})
