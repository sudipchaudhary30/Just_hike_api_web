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

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  image?: string | null;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  image?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  image?: string;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Guide related types
export interface Guide {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number; // years of experience
  expertise: string[]; // specializations
  bio: string;
  image?: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuideData {
  name: string;
  email: string;
  phone: string;
  experience: number;
  expertise: string[];
  bio: string;
  image?: string;
}

// Trek Package related types
export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging' | 'Difficult' | 'Expert';

export interface TrekPackage {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  difficulty: DifficultyLevel;
  price: number;
  maxGroupSize: number;
  location: string;
  altitude: number; // in meters
  bestSeason: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: string;
  image?: string | null;
  guideId?: string | null;
  guide?: Guide;
  availableSlots: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrekPackageData {
  name: string;
  description: string;
  duration: number;
  difficulty: DifficultyLevel;
  price: number;
  maxGroupSize: number;
  location: string;
  altitude: number;
  bestSeason: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: string;
  image?: string;
  guideId?: string;
  availableSlots: number;
}

// Booking related types
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  user?: User;
  trekPackageId: string;
  trekPackage?: TrekPackage;
  numberOfPeople: number;
  totalPrice: number;
  startDate: string;
  status: BookingStatus;
  specialRequests?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  trekPackageId: string;
  numberOfPeople: number;
  startDate: string;
  specialRequests?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Blog related types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  image?: string | null;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
}

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}