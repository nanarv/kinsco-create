import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BuildFlow } from './BuildFlow'

describe('BuildFlow', () => {
  it('starts on the Base step', () => {
    render(<BuildFlow onSubmitted={vi.fn()} />)

    expect(screen.getByText('Choose your Base')).toBeInTheDocument()
  })

  it('advances to the Mix-ins step on Next', () => {
    render(<BuildFlow onSubmitted={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Choose your Mix-ins')).toBeInTheDocument()
  })

  it('goes back to the Base step from Mix-ins on Back', () => {
    render(<BuildFlow onSubmitted={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByText('Choose your Base')).toBeInTheDocument()
  })

  it('shows a live preview of the in-progress Cookie via CookieRenderer', () => {
    render(<BuildFlow onSubmitted={vi.fn()} />)

    expect(screen.getByRole('img', { name: 'Vanilla Dough' })).toBeInTheDocument()
  })

  it('asks for confirmation before Restart Cookie clears the build', () => {
    render(<BuildFlow onSubmitted={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' })) // now on Mix-ins

    fireEvent.click(screen.getByRole('button', { name: 'Restart Cookie' }))

    expect(screen.getByText(/clears everything/i)).toBeInTheDocument()
    expect(screen.getByText('Choose your Mix-ins')).toBeInTheDocument()
  })

  it('clears the build back to the Base step once Restart is confirmed', () => {
    render(<BuildFlow onSubmitted={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' })) // now on Mix-ins
    fireEvent.click(screen.getByRole('button', { name: 'Restart Cookie' }))

    fireEvent.click(screen.getByRole('button', { name: 'Restart' }))

    expect(screen.getByText('Choose your Base')).toBeInTheDocument()
  })

  it('keeps the in-progress build when Restart is cancelled', () => {
    render(<BuildFlow onSubmitted={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' })) // now on Mix-ins
    fireEvent.click(screen.getByRole('button', { name: 'Restart Cookie' }))

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getByText('Choose your Mix-ins')).toBeInTheDocument()
  })
})
