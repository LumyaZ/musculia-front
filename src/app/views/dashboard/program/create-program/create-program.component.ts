import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkoutService } from '../../../../services/workout.service';
import { UserProfileService } from '../../../../services/user-profile.service';

@Component({
  selector: 'app-create-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss']
})
export class CreateProgramComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  private fb = inject(FormBuilder);
  private workoutService = inject(WorkoutService);
  private userProfileService = inject(UserProfileService);
  public router = inject(Router);

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      categorie: ['', Validators.required]
    });
    this.form.valueChanges.subscribe(() => {});
  }

  ngOnInit() {
    if (!this.userProfileService.currentProfileSubject.value) {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const userId = userData.id;
          if (userId) {
            this.userProfileService.getProfileByUserId(userId).subscribe(profile => {
              this.userProfileService.currentProfileSubject.next(profile);
            });
          }
        } catch (e) {}
      }
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.error = null;
    const userProfile = this.userProfileService.currentProfileSubject.value;
    if (!userProfile || !userProfile.id) {
      this.error = 'Profil utilisateur non chargé.';
      this.loading = false;
      return;
    }
    const workout = {
      notes: this.form.value.name,
      description: this.form.value.description,
      duration: this.form.value.duration,
      categorie: this.form.value.categorie,
      published: false,
      publishedBy: { id: userProfile.id }
    };
    const profileId = Number(userProfile.id);
    this.workoutService.createWorkout(workout).subscribe({
      next: (created) => {
        this.loading = false;
        const workoutId = Number(created.id);
        if (!profileId || !workoutId) {
          this.router.navigate(['/dashboard/you']);
          return;
        }
        this.userProfileService.addWorkoutToUserProfile(profileId, workoutId).subscribe({
          next: () => {
            this.router.navigate(['/dashboard/you']);
          },
          error: () => {
            this.router.navigate(['/dashboard/you']);
          }
        });
      },
      error: () => {
        this.error = 'Erreur lors de la création du programme.';
        this.loading = false;
      }
    });
  }
} 