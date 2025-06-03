// components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header component', () => {
  it('renders a navigation role', () => {
    render(<Header />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
