import { UserProfile } from './user-profile.model';
import { Workout } from './workout.model';

export interface TrainingProgram {
    id?: number;
    userProfileId: number;
    programType?: string;
    duration?: number;
    daysPerWeek?: number;
    createdAt?: Date;
    lastUpdated?: Date;
    workouts?: any[];
} 