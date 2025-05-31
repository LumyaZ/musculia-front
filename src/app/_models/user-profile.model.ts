import { AuthUser } from './auth-user.model';
import { TrainingProgram } from './training-program.model';
import { Workout } from './workout.model';


export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

export enum Goal {
    MUSCLE_GAIN = 'muscle_gain',
    WEIGHT_LOSS = 'weight_loss',
    TONING = 'toning'
}

export enum TrainingPreference {
    STRENGTH = 'strength',
    HYPERTROPHY = 'hypertrophy',
    ENDURANCE = 'endurance'
}

export interface UserProfile {
    id?: number;
    authUser?: AuthUser;
    gender?: Gender;
    weight?: number;
    height?: number;
    bodyFat?: number;
    experienceYears?: number;
    trainingFrequency?: number;
    sessionDuration?: number;
    equipmentAvailable?: string;
    goal?: Goal;
    trainingPreference?: TrainingPreference;
    createdAt?: Date;
    lastUpdated?: Date;
    trainingPrograms?: TrainingProgram[];
    workouts?: Workout[];
} 