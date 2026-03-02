import { render, screen } from '@testing-library/react';
import Card from '@/_components/ui/Card';

describe('Card component', () => {
  test('renders child content', () => {
    render(
      <Card>
        <p>Card Content</p>
      </Card>
    );

    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  test('merges custom className', () => {
    const { container } = render(<Card className="custom-card">Hello</Card>);
    expect(container.firstChild).toHaveClass('custom-card');
  });

  test('includes base card style classes', () => {
    const { container } = render(<Card>Base Classes</Card>);
    expect(container.firstChild).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'p-6');
  });

  test('renders nested elements correctly', () => {
    render(
      <Card>
        <h2>Title</h2>
        <span>Subtitle</span>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  test('renders empty card container safely', () => {
    const { container } = render(<Card>{null}</Card>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
