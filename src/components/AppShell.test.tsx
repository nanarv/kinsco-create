import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Cookie } from '../types'
import { AppShell } from './AppShell'

describe('AppShell', () => {
  it('starts on the build flow', () => {
    render(<AppShell fetchCookies={vi.fn(() => new Promise<Cookie[]>(() => {}))} />)

    expect(screen.getByText('Choose your Base')).toBeInTheDocument()
  })

  it('switches to the Gallery when "View Gallery" is clicked', () => {
    render(<AppShell fetchCookies={vi.fn(() => new Promise<Cookie[]>(() => {}))} />)

    fireEvent.click(screen.getByRole('link', { name: 'View Gallery' }))

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('switches back to the build flow when "Back to building" is clicked', () => {
    render(<AppShell fetchCookies={vi.fn(() => new Promise<Cookie[]>(() => {}))} />)
    fireEvent.click(screen.getByRole('link', { name: 'View Gallery' }))

    fireEvent.click(screen.getByRole('link', { name: 'Back to building' }))

    expect(screen.getByText('Choose your Base')).toBeInTheDocument()
  })
})
