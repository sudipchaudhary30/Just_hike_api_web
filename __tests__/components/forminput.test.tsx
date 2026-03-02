import { render, screen } from '@testing-library/react';
import FormInput from '@/_components/forms/FormInput';

describe('FormInput component', () => {
  test('renders label and input', () => {
    const register = () => ({ onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() });

    render(<FormInput label="Email" name="email" register={register} />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('shows error message when provided', () => {
    const register = () => ({ onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() });

    render(
      <FormInput
        label="Email"
        name="email"
        register={register}
        error={{ message: 'Email is required' }}
      />
    );

    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  test('calls register with field name', () => {
    const register = jest.fn(() => ({ onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() }));

    render(<FormInput label="Name" name="name" register={register} />);

    expect(register).toHaveBeenCalledWith('name');
  });

  test('uses text as default input type', () => {
    const register = () => ({ onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() });

    render(<FormInput label="Full Name" name="fullName" register={register} />);

    expect(screen.getByLabelText('Full Name')).toHaveAttribute('type', 'text');
  });

  test('applies error styling when error exists', () => {
    const register = () => ({ onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() });

    render(
      <FormInput
        label="Email"
        name="email"
        register={register}
        error={{ message: 'Invalid email' }}
      />
    );

    expect(screen.getByLabelText('Email')).toHaveClass('border-red-300');
  });

  test('applies normal styling without error', () => {
    const register = () => ({ onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() });

    render(<FormInput label="Email" name="email" register={register} />);

    expect(screen.getByLabelText('Email')).toHaveClass('border-gray-300');
  });
});
