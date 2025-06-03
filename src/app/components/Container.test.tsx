// src/app/components/Container.test.tsx
import { render, screen } from '@testing-library/react'
import Container from './Container'

describe('Container component', () => {
  it('renders the title in an <h2> element', () => {
    const testTitle = 'Test Container Title'
    render(<Container title={testTitle}> {/* no children needed for this test */} </Container>)

    // The <h2> should render with the correct text and role=heading level=2
    const heading = screen.getByRole('heading', {
      level: 2,
      name: testTitle,
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders its children inside the container', () => {
    const testTitle = 'Another Title'
    const childText = 'This is a child element'
    render(
      <Container title={testTitle}>
        <div>{childText}</div>
      </Container>
    )

    // Verify the title is still rendered
    expect(
      screen.getByRole('heading', { level: 2, name: testTitle })
    ).toBeInTheDocument()

    // Verify the child content appears
    expect(screen.getByText(childText)).toBeInTheDocument()
  })
})
