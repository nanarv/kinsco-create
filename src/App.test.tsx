import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { fetchCookies, submitCookie } from './lib/cookieRepository'
import App from './App'

vi.mock('./lib/cookieRepository', () => ({ submitCookie: vi.fn(), fetchCookies: vi.fn() }))
vi.mock('./lib/emailSignupRepository', () => ({ submitEmailSignup: vi.fn() }))

describe('App', () => {
  it('starts on the build flow', () => {
    render(<App />)

    expect(screen.getByText('Choose your Base')).toBeInTheDocument()
  })

  it('switches to the Gallery once a Cookie is submitted', async () => {
    vi.mocked(submitCookie).mockResolvedValue(undefined)
    vi.mocked(fetchCookies).mockResolvedValue([])
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' })) // mixIns
    fireEvent.click(screen.getByRole('button', { name: 'Next' })) // topping
    fireEvent.click(screen.getByRole('button', { name: 'Next' })) // shape
    fireEvent.click(screen.getByRole('button', { name: 'Next' })) // name
    fireEvent.change(screen.getByLabelText('Cookie name'), { target: { value: 'Sprinkle Dream' } })

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByText(/no cookies/i)).toBeInTheDocument()
  })
})
