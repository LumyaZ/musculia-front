import { UserProfile } from './user-profile.model';

export interface AuthUser {
    id?: number;
    email: string;
    password?: string; 
    registrationDate?: Date;
    createdAt?: Date;
    lastUpdated?: Date;
    userProfile?: UserProfile; 
    role?: string;
}
