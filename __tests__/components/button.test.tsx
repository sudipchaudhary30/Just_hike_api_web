import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/_components/ui/Button';

describe('Button component', () => {
  test('renders button text', () => {
    render(<Button>Book Trek</Button>);
    expect(screen.getByRole('button', { name: 'Book Trek' })).toBeInTheDocument();
  });

  test('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button', { name: 'Secondary' })).toHaveClass('border-2');
  });

  test('uses button as default type', () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('type', 'button');
  });

  test('respects disabled prop', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  test('appends custom className', () => {
    render(<Button className="extra-class">Custom</Button>);
    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass('extra-class');
  });

  test('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Press</Button>);

    await user.click(screen.getByRole('button', { name: 'Press' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
