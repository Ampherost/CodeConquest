// components/Footer.test.tsx
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer component', () => {
  it('renders a footer element with the correct role', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders the correct text pieces', () => {
    render(<Footer />)

    // Match the beginning fragment
    expect(
      screen.getByText(/Front-end crafted with perfection using/i)
    ).toBeInTheDocument()

    // Match the highlighted spans
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()

    // Match the trailing fragment
    expect(screen.getByText(/by Russell Ly/i)).toBeInTheDocument()
  })
})
