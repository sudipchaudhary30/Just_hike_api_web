export interface NavItem {
  name: string;
  href: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  register: any;
  error?: { message?: string };
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}