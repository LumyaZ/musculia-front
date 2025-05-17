import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileFormData } from '../../models/user-profile.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  createProfile(profileData: ProfileFormData): Observable<any> {
    return this.http.post(
      `${this.API_URL}/profile`,
      profileData,
      { headers: this.getHeaders() }
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(
      `${this.API_URL}/profile`,
      { headers: this.getHeaders() }
    );
  }

  updateProfile(profileData: ProfileFormData): Observable<any> {
    return this.http.put(
      `${this.API_URL}/profile`,
      profileData,
      { headers: this.getHeaders() }
    );
  }
} 