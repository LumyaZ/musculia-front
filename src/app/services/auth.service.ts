import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response) {
          localStorage.setItem('user', JSON.stringify(response));
        }
      }),
      catchError(error => {
        console.log('AuthService - Erreur de connexion:', error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      if (error.status === 400) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.status === 401) {
        errorMessage = 'Non autorisé';
      } else if (error.status === 404) {
        errorMessage = 'Utilisateur non trouvé';
      }
    }
    
    return throwError(() => ({ message: errorMessage }));
  }

  logout() {
    // Suppression de toutes les données d'authentification
    localStorage.removeItem('user');
    // Vous pouvez ajouter d'autres nettoyages ici si nécessaire
    // Par exemple, supprimer d'autres éléments du localStorage liés à l'authentification
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
} 