import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TintedIcon } from './TintedIcon'

describe('TintedIcon', () => {
  it('renders the grayscale asset for a known icon', () => {
    render(<TintedIcon category="base" iconId="vanilla-dough" color="#ff0000" />)

    expect(screen.getByRole('img', { name: 'Vanilla Dough' })).toHaveAttribute(
      'src',
      '/icons/base/vanilla-dough.svg',
    )
  })

  it('applies the chosen color as a multiply-blended overlay so shading shows through', () => {
    render(<TintedIcon category="base" iconId="vanilla-dough" color="#ff0000" />)

    expect(screen.getByTestId('tint-overlay')).toHaveStyle({
      backgroundColor: '#ff0000',
      mixBlendMode: 'multiply',
    })
  })

  it('falls back to the category placeholder when iconId is null (custom-named entries)', () => {
    render(<TintedIcon category="base" iconId={null} color="#00ff00" />)

    expect(screen.getByRole('img', { name: 'Custom Base' })).toBeInTheDocument()
    expect(screen.getByTestId('tint-overlay')).toHaveStyle({ backgroundColor: '#00ff00' })
  })

  it('falls back to the category placeholder when iconId references an unknown icon', () => {
    render(<TintedIcon category="base" iconId="long-removed-icon" color="#00ff00" />)

    expect(screen.getByRole('img', { name: 'Custom Base' })).toBeInTheDocument()
  })

  it('renders a flecks pattern as multiple scattered copies of the icon', () => {
    const { container } = render(
      <TintedIcon category="mixIn" iconId="chocolate-chips" color="#5b3a29" pattern="flecks" />,
    )

    const copies = within(container).getAllByRole('img', { name: 'Chocolate Chips' })
    expect(copies.length).toBeGreaterThan(1)
  })

  it('renders a swirl pattern as a single elongated copy, distinct from flecks', () => {
    const { container } = render(
      <TintedIcon category="mixIn" iconId="chocolate-chips" color="#5b3a29" pattern="swirl" />,
    )

    const copies = within(container).getAllByRole('img', { name: 'Chocolate Chips' })
    expect(copies).toHaveLength(1)
    expect(screen.getByTestId('icon-wrapper')).toHaveAttribute('data-pattern', 'swirl')
  })
})
