import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { UserProfile } from '../_models/user-profile.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:8081/api/profiles';
  public currentProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  currentProfile$ = this.currentProfileSubject.asObservable();
  private refreshNeeded = new Subject<void>();
  refreshNeeded$ = this.refreshNeeded.asObservable();

  constructor(private http: HttpClient) { }

  refreshProfile() {
    this.refreshNeeded.next();
  }

  saveProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, profile).pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
        this.refreshNeeded.next();
      })
    );
  }

  getProfileByUserId(userId: number): Observable<UserProfile> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<UserProfile>(url).pipe(
      tap(profile => this.currentProfileSubject.next(profile))
    );
  }

  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    const currentProfile = this.currentProfileSubject.value;
    if (!currentProfile || !profile.id) {
      throw new Error('No current profile or profile ID');
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...profile
    };

    const url = `${this.apiUrl}/${profile.id}`;
    return this.http.put<UserProfile>(url, updatedProfile).pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
        this.refreshNeeded.next();
      })
    );
  }

  addWorkoutToUserProfile(profileId: number, workoutId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${profileId}/workouts/${workoutId}`, {});
  }
} 