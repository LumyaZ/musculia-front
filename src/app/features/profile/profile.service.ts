import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService, AuthUser } from '../auth/auth.service';

export interface UserProfile {
  id?: number;
  authUser?: AuthUser;
  gender: string;
  weight: number;
  height: number;
  bodyFat?: number | null;
  experienceYears: number;
  trainingFrequency: number;
  sessionDuration: number;
  equipmentAvailable: string;
  goal: string;
  trainingPreference: string;
  createdAt?: Date;
  lastUpdated?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = environment.apiUrl;
  private readonly PROFILE_KEY = 'userProfile';
  authUser: AuthUser | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authUser = this.authService.getCurrentUser();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  createProfile(profile: UserProfile): Observable<UserProfile> {
    // Récupérer l'utilisateur actuel
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }

    // Ajouter l'utilisateur au profil
    const profileWithUser = {
      ...profile,
      authUser: currentUser
    };

    console.log('Sending request to:', this.API_URL);
    console.log('With data:', JSON.stringify(profileWithUser, null, 2));
    
    return this.http.post<UserProfile>(this.API_URL + '/profiles', profileWithUser, {
      headers: this.getHeaders()
    }).pipe(
      tap(savedProfile => {
        // Sauvegarder le profil dans le localStorage
        localStorage.setItem(this.PROFILE_KEY, JSON.stringify(savedProfile));
      }),
      catchError(this.handleError)
    );
  }

  getCurrentProfile(): UserProfile | null {
    const profileStr = localStorage.getItem(this.PROFILE_KEY);
    return profileStr ? JSON.parse(profileStr) : null;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Full error response:', error);
    let errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      console.error('Server error details:', error.error);
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  getProfileById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.API_URL}/profiles/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getProfileByUserId(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.API_URL}/profiles/user/${userId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(id: number, profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      `${this.API_URL}/profiles/${id}`,
      profile,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteProfile(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/profiles/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
} 