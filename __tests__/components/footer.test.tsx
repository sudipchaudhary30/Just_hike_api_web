import { render, screen } from '@testing-library/react';
import Footer from '@/_components/Footer';

describe('Footer component', () => {
  test('renders brand and tagline', () => {
    render(<Footer />);

    expect(screen.getByText('Just Hike')).toBeInTheDocument();
    expect(screen.getByText('Your perfect hiking companion')).toBeInTheDocument();
  });

  test('renders copyright with current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Just Hike`, 'i'))).toBeInTheDocument();
  });

  test('renders footer semantic element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  test('renders closing message', () => {
    render(<Footer />);
    expect(screen.getByText('Built with passion for hikers worldwide')).toBeInTheDocument();
  });

  test('renders rights reserved text', () => {
    render(<Footer />);
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });
});
