import { Exercise } from './exercise.model';
import { Workout } from './workout.model';

export enum Difficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard'
}

export interface WorkoutDetails {
    id?: number;
    workout: Workout;
    exercise: Exercise;
    repetitions?: number;
    sets?: number;
    weight?: number;
    difficulty?: Difficulty;
    createdAt?: Date;
    lastUpdated?: Date;
} 