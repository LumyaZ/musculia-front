import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, map } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  registration_date?: string;
  created_at?: string;
  last_updated?: string;
  role?: string | null;
  userProfile?: any | null;
}

export interface AuthResponse {
  token?: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser && storedUser !== 'undefined') {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser) {
            this.currentUserSubject.next(parsedUser);
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem(this.USER_KEY);
        }
      }
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/login`,
      credentials,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => this.setAuthData(response)),
      catchError(this.handleError)
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    console.log('Registering user with data:', data);
    return this.http.post<AuthUser>(
      `${this.API_URL}/auth/register`, 
      data,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        console.log('Registration response:', response);
        // Créer un objet AuthResponse avec les données reçues
        const authResponse: AuthResponse = {
          user: response
        };
        this.setAuthData(authResponse);
      }),
      catchError(this.handleError),
      // Transformer la réponse en AuthResponse
      map(user => ({ user }))
    );
  }

  requestPasswordReset(data: PasswordResetRequest): Observable<any> {
    return this.http.post(
      `${this.API_URL}/auth/request-password-reset`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(data: PasswordResetConfirm): Observable<any> {
    return this.http.post(
      `${this.API_URL}/auth/reset-password`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }
    return user.id;
  }

  private setAuthData(response: AuthResponse): void {
    console.log('Setting auth data:', response);
    if (isPlatformBrowser(this.platformId)) {
      if (response.token) {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        console.log('Token saved to localStorage');
      }
      if (response.user) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          registration_date: response.user.registration_date,
          created_at: response.user.created_at,
          last_updated: response.user.last_updated,
          role: response.user.role,
          userProfile: response.user.userProfile
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        console.log('User data saved to localStorage:', userData);
      }
    }
    this.currentUserSubject.next(response.user);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
} 