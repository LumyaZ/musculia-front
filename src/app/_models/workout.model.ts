import { UserProfile } from './user-profile.model';
import { TrainingProgram } from './training-program.model';
import { WorkoutDetails } from './workout-details.model';

export interface Workout {
    id?: number;
    userProfileId?: number;
    programId?: number;
    sessionDate?: Date;
    duration?: number; // en minutes
    notes?: string;
    createdAt?: Date;
    lastUpdated?: Date;
    workoutDetails?: any[];
} 