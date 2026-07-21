// components/Header.test.tsx
import { render, screen, act } from '@testing-library/react';
import Header from './Header';

describe('Header component', () => {
  it('renders a navigation role', async () => {
    await act(async () => {
      render(<Header />);
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

