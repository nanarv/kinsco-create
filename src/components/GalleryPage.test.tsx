import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Cookie } from '../types'
import { GalleryPage } from './GalleryPage'

function cookie(id: string, createdAt: string): Cookie {
  return {
    id,
    name: id,
    shape: 'round',
    base: { iconId: 'vanilla-dough', customName: null, color: '#f5e1a4' },
    mixIns: [],
    topping: { iconId: 'drizzle', customName: null, color: '#ffffff' },
    createdAt,
  }
}

describe('GalleryPage', () => {
  it('shows a loading indicator while fetching', () => {
    const fetchCookies = vi.fn(() => new Promise<Cookie[]>(() => {}))

    render(<GalleryPage fetchCookies={fetchCookies} />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows an error message with a retry action when fetching fails', async () => {
    const fetchCookies = vi.fn().mockRejectedValue(new Error('network error'))

    render(<GalleryPage fetchCookies={fetchCookies} />)

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('retries the fetch when "try again" is clicked', async () => {
    const fetchCookies = vi.fn().mockRejectedValueOnce(new Error('network error')).mockResolvedValueOnce([])

    render(<GalleryPage fetchCookies={fetchCookies} />)
    await screen.findByText(/something went wrong/i)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    await waitFor(() => expect(fetchCookies).toHaveBeenCalledTimes(2))
  })

  it('shows an empty-state message when there are no Cookies', async () => {
    const fetchCookies = vi.fn().mockResolvedValue([])

    render(<GalleryPage fetchCookies={fetchCookies} />)

    expect(await screen.findByText(/no cookies/i)).toBeInTheDocument()
  })

  it('renders every Cookie as a CookieRenderer, newest first', async () => {
    const oldest = cookie('oldest', '2026-01-01T00:00:00Z')
    const newest = cookie('newest', '2026-01-02T00:00:00Z')
    const fetchCookies = vi.fn().mockResolvedValue([oldest, newest])

    render(<GalleryPage fetchCookies={fetchCookies} />)

    await screen.findByText('newest')
    const names = screen.getAllByText(/^(oldest|newest)$/).map((el) => el.textContent)
    expect(names).toEqual(['newest', 'oldest'])
  })
})
