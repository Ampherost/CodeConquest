// src/app/components/ContainerFooter.integration.test.tsx
import { render, screen } from '@testing-library/react'
import Container from './Container'
import Footer from './Footer'

describe('Container + Footer integration', () => {
  it('renders the Container title, its children, and the Footer text together', () => {
    render(
      <Container title="Integration Test Title">
        {/* Render Footer inside Container */}
        <Footer />
      </Container>
    )

    // 1) The Container’s <h2> title should appear
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Integration Test Title',
    })
    expect(heading).toBeInTheDocument()

    // 2) The Footer’s contentinfo (footer element) should be in the document
    const footerEl = screen.getByRole('contentinfo')
    expect(footerEl).toBeInTheDocument()

    // 3) Ensure some expected Footer text is present
    expect(
      screen.getByText(/Front-end crafted with perfection using/i)
    ).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
    expect(screen.getByText(/by Russell Ly/i)).toBeInTheDocument()
  })
})
