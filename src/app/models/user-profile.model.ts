export type Gender = 'male' | 'female' | 'other';
export type Goal = 'muscle gain' | 'weight loss' | 'toning';
export type TrainingPreference = 'strength' | 'hypertrophy' | 'endurance';

export interface UserProfile {
  id?: number;
  user_id?: number;
  gender: Gender;
  weight: number;
  height: number;
  body_fat?: number;
  experience_years: number;
  training_frequency: number;
  session_duration: number;
  equipment_available: string[];
  goal: Goal;
  training_preference: TrainingPreference;
  created_at?: Date;
  last_updated?: Date;
}

export interface ProfileFormData {
  step: number;
  basicInfo: {
    gender: Gender;
    weight: number;
    height: number;
    body_fat?: number;
  };
  trainingInfo: {
    experience_years: number;
    training_frequency: number;
    session_duration: number;
  };
  equipment: {
    equipment_available: string[];
  };
  goals: {
    goal: Goal;
    training_preference: TrainingPreference;
  };
} 