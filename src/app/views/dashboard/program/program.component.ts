import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { ProgramCardComponent } from '../../../components/program-card/program-card.component';
import { WorkoutService } from '../../../services/workout.service';
import { AuthService } from '../../../services/auth.service';
import { CategoryStyleService } from '../../../services/category-style.service';
import { filter } from 'rxjs/operators';
import { UserProfileService } from '../../../services/user-profile.service';
import { forkJoin, of, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { UserProfile } from '../../../_models/user-profile.model';

interface CategoryGroup {
  name: string;
  slug: string;
  workouts: any[];
  categoryStyle: any;
}

@Component({
  selector: 'app-program',
  standalone: true,
  imports: [CommonModule, RouterModule, ProgramCardComponent],
  providers: [WorkoutService, AuthService, CategoryStyleService, UserProfileService],
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {
  workouts: any[] = [];
  categoryGroups: CategoryGroup[] = [];
  createMode = false;
  loading = true;

  constructor(
    private router: Router, 
    private workoutService: WorkoutService,
    private authService: AuthService,
    private categoryStyleService: CategoryStyleService,
    private cdr: ChangeDetectorRef,
    private userProfileService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const userDataString = localStorage.getItem('user');
    let userProfile$: Observable<UserProfile | null> = of(null);
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const userId = userData.id;
        if (userId) {
          userProfile$ = this.userProfileService.getProfileByUserId(userId).pipe(startWith(null));
        }
      } catch (e) {
        console.error('Erreur lors du parsing du user dans localStorage', e);
      }
    }
    forkJoin([
      userProfile$,
      this.workoutService.getAllWorkouts()
    ]).subscribe({
      next: ([profile, workouts]: any[]) => {
        if (profile) {
          this.userProfileService.currentProfileSubject.next(profile);
        }
        this.workouts = workouts
          .filter((workout: any) => workout.published)
          .map((workout: any) => ({
            ...workout,
            name: workout.notes || `Workout ${workout.id}`,
            description: `Séance de ${workout.categorie || 'musculation'} - ${workout.duration} minutes`,
            level: this.categoryStyleService.getCategoryLevel(workout.categorie),
            duration: `${workout.duration} min`,
            slug: `workout-${workout.id}`,
            sessionDate: workout.sessionDate,
            categorie: workout.categorie,
            categoryStyle: this.categoryStyleService.getCategoryStyle(workout.categorie)
          }));
        console.log('workouts:', this.workouts);
        this.groupWorkoutsByCategory();
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err: any) => {        
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          console.log('Token expiré ou invalide, redirection vers login');
          this.authService.logout();
        }
      }
    });
  }

  groupWorkoutsByCategory(): void {
    const grouped: { [key: string]: any[] } = {};
    
    // Grouper les workouts par catégorie
    this.workouts.forEach(workout => {
      const category = workout.categorie?.toUpperCase() || 'AUTRE';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(workout);
    });

    // Créer les groupes de catégories
    this.categoryGroups = Object.keys(grouped).map(category => {
      const categoryStyle = this.categoryStyleService.getCategoryStyle(category);
      return {
        name: categoryStyle.name,
        slug: category.toLowerCase(),
        workouts: grouped[category].slice(0, 3), // Limiter à 3 workouts par catégorie
        categoryStyle: categoryStyle
      };
    });
  }

  showCreateForm() {
    this.createMode = true;
  }

  hideCreateForm() {
    this.createMode = false;
  }

  goToCategory(slug: string) {
    this.router.navigate(['/dashboard/program/category', slug]);
  }

  goToProgram(prog: any) {
    this.router.navigate(['/dashboard/program', prog.slug]);
  }

  handleAssignWorkout(workoutId: number) {
    const currentProfile = this.userProfileService.currentProfileSubject.value;
    if (!currentProfile || !currentProfile.id) {
      alert('Profil utilisateur non chargé.');
      return;
    }
    this.userProfileService.addWorkoutToUserProfile(currentProfile.id, workoutId).subscribe({
      next: () => {
        alert('Workout ajouté à votre profil !');
      },
      error: () => {
        alert('Erreur lors de l\'ajout du workout');
      }
    });
  }

  getAssignedWorkoutIds(): number[] {
    const currentProfile = this.userProfileService.currentProfileSubject.value;
    return currentProfile && currentProfile.workouts ? currentProfile.workouts.map(w => w.id).filter((id): id is number => id !== undefined) : [];
  }
} 