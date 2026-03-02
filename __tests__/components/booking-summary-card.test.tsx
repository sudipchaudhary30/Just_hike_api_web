import { render, screen } from '@testing-library/react';
import BookingSummaryCard from '@/_components/bookings/BookingSummaryCard';

describe('BookingSummaryCard component', () => {
  const trek = {
    title: 'Annapurna Base Camp',
    durationDays: 7,
    difficulty: 'moderate',
    location: 'Nepal',
    price: 15000,
    imageUrl: '/uploads/abc.jpg',
  };

  test('renders booking summary details', () => {
    render(<BookingSummaryCard trek={trek} participants={2} totalPrice={30000} />);

    expect(screen.getByText('Booking Summary')).toBeInTheDocument();
    expect(screen.getByText('Annapurna Base Camp')).toBeInTheDocument();
    expect(screen.getByText('Rs 30000')).toBeInTheDocument();
  });

  test('renders trek image when image is available', () => {
    render(<BookingSummaryCard trek={trek} participants={1} totalPrice={15000} />);

    expect(screen.getByRole('img', { name: 'Annapurna Base Camp' })).toBeInTheDocument();
  });

  test('shows duration, difficulty, and location fields', () => {
    render(<BookingSummaryCard trek={trek} participants={2} totalPrice={30000} />);

    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('moderate')).toBeInTheDocument();
    expect(screen.getByText('Nepal')).toBeInTheDocument();
  });

  test('renders participants and price per person info', () => {
    render(<BookingSummaryCard trek={trek} participants={3} totalPrice={45000} />);

    expect(screen.getByText('Rs 15000')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('renders fallback block when no image is available', () => {
    render(
      <BookingSummaryCard
        trek={{ ...trek, imageUrl: undefined, thumbnailUrl: undefined }}
        participants={1}
        totalPrice={15000}
      />
    );

    expect(screen.queryByRole('img', { name: 'Annapurna Base Camp' })).not.toBeInTheDocument();
  });

  test('shows cancellation policy text', () => {
    render(<BookingSummaryCard trek={trek} participants={1} totalPrice={15000} />);

    expect(screen.getByText(/Cancellation Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Free cancellation up to 7 days/i)).toBeInTheDocument();
  });
});
