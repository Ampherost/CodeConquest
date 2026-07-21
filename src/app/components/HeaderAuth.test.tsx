import { render, screen, act } from '@testing-library/react';
import Header from './Header';

describe('Header auth roles and extension slots', () => {
  it('renders guest navigation by default', async () => {
    await act(async () => {
      render(<Header />);
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Modules')).toBeInTheDocument();
  });

  it('renders candidate navigation when initialRole is candidate', async () => {
    await act(async () => {
      render(<Header initialRole="candidate" />);
    });
    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('renders business navigation when initialRole is business', async () => {
    await act(async () => {
      render(<Header initialRole="business" />);
    });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('renders customNav, leftNode, and rightActions slots when provided', async () => {
    await act(async () => {
      render(
        <Header
          leftNode={<span>Welcome Business</span>}
          customNav={<span>Custom Tab Bar</span>}
          rightActions={<button>Custom Action</button>}
        />
      );
    });
    expect(screen.getByText('Welcome Business')).toBeInTheDocument();
    expect(screen.getByText('Custom Tab Bar')).toBeInTheDocument();
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });
});


