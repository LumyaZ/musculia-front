import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../_models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:8081/api/profiles';

  constructor(private http: HttpClient) { }

  saveProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, profile);
  }

  getProfileByUserId(userId: number): Observable<UserProfile> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<UserProfile>(url);
  }
} 