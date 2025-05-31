import { WorkoutDetails } from "./workout-details.model";

export enum Category {
    CHEST = 'CHEST',
    BACK = 'BACK',
    LEGS = 'LEGS',
    SHOULDERS = 'SHOULDERS',
    ARMS = 'ARMS',
    ABS = 'ABS',
    CARDIO = 'CARDIO'
}

export interface Exercise {
    id?: number;
    name: string;
    category: Category;
    description?: string;
    videoUrl?: string;
    createdAt?: Date;
    lastUpdated?: Date;
    workoutDetails?: WorkoutDetails[];
} 