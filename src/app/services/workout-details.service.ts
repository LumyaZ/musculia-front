import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkoutDetails } from '../_models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkoutDetailsService {
  private apiUrl = `${environment.apiUrl}/workout-details`;

  constructor(private http: HttpClient) {}

  getAllWorkoutDetails(): Observable<WorkoutDetails[]> {
    return this.http.get<WorkoutDetails[]>(this.apiUrl);
  }

  getWorkoutDetailsById(id: number): Observable<WorkoutDetails> {
    return this.http.get<WorkoutDetails>(`${this.apiUrl}/${id}`);
  }

  getWorkoutDetailsByWorkoutId(workoutId: number): Observable<WorkoutDetails[]> {
    return this.http.get<WorkoutDetails[]>(`${this.apiUrl}/workout/${workoutId}`);
  }

  createWorkoutDetails(workoutDetails: WorkoutDetails): Observable<WorkoutDetails> {
    return this.http.post<WorkoutDetails>(this.apiUrl, workoutDetails);
  }

  updateWorkoutDetails(id: number, workoutDetails: WorkoutDetails): Observable<WorkoutDetails> {
    return this.http.put<WorkoutDetails>(`${this.apiUrl}/${id}`, workoutDetails);
  }

  deleteWorkoutDetails(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 