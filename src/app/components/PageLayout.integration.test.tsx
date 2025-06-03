// src/app/components/PageLayout.integration.test.tsx
import { render, screen } from '@testing-library/react'
import Header from './Header'
import Container from './Container'
import Footer from './Footer'

describe('Page layout integration', () => {
  it('renders Header, Container content, and Footer together', () => {
    render(
      <>
        <Header />
        <Container title="Layout Integration Test">
          <p>Sample child content</p>
        </Container>
        <Footer />
      </>
    )

    // 1) Header’s <nav> should appear
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()

    // 2) Container’s <h2> title and child text should appear
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Layout Integration Test',
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Sample child content')).toBeInTheDocument()

    // 3) Footer’s <footer> (contentinfo) and text fragments should appear
    const footerEl = screen.getByRole('contentinfo')
    expect(footerEl).toBeInTheDocument()
    expect(
      screen.getByText(/Front-end crafted with perfection using/i)
    ).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
    expect(screen.getByText(/by Russell Ly/i)).toBeInTheDocument()
  })
})
