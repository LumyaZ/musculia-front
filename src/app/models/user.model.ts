export interface User {
  id: number;
  email: string;
  registration_date?: string;
  created_at?: string;
  last_updated?: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  body_fat?: number;
  experience_years: number;
  training_frequency: number;
  session_duration: number;
  equipment_available: string;
  goal: 'muscle gain' | 'weight loss' | 'toning';
  training_preference: 'strength' | 'hypertrophy' | 'endurance';
  created_at?: string;
  last_updated?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  profile?: UserProfile;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface ApiError {
  message: string;
  status: number;
} 