import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../../../services/workout.service';
import { WorkoutDetailsService } from '../../../../services/workout-details.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-program-detail',
  standalone: true,
  imports: [CommonModule],
  providers: [WorkoutService, WorkoutDetailsService, AuthService],
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.scss']
})
export class ProgramDetailComponent implements OnInit {
  slug: string = '';
  workout: any = null;
  workoutDetails: any[] = [];
  loading = true;
  fromYouProgress = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private workoutService: WorkoutService,
    private workoutDetailsService: WorkoutDetailsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      console.log('Utilisateur non connecté, redirection vers login');
      this.router.navigate(['/auth/login']);
      return;
    }
    // Détecter si on vient de you/progress
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.previousNavigation && nav.previousNavigation.finalUrl && nav.previousNavigation.finalUrl.toString().includes('/dashboard/you/progress')) {
      this.fromYouProgress = true;
    } else if (window.history.state && window.history.state.fromYouProgress) {
      this.fromYouProgress = true;
    }
    // Écouter les paramètres de route
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadWorkoutData();
      }
    });
  }

  loadWorkoutData(): void {
    this.loading = true;
    
    // Extraire l'ID du workout depuis le slug (ex: "workout-1" -> 1)
    const workoutId = this.slug.replace('workout-', '');
    
    console.log('Chargement des données pour workout ID:', workoutId);

    // Récupérer le workout
    this.workoutService.getWorkoutById(parseInt(workoutId)).subscribe({
      next: (workout: any) => {
        this.workout = workout;
        console.log('Workout récupéré:', workout);
        
        // Forcer la détection de changements
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        
        // Récupérer les détails du workout
        this.loadWorkoutDetails(parseInt(workoutId));
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération du workout:', err);
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  loadWorkoutDetails(workoutId: number): void {
    this.workoutDetailsService.getWorkoutDetailsByWorkoutId(workoutId).subscribe({
      next: (details: any[]) => {
        this.workoutDetails = details;
        console.log('Workout details récupérés:', details);
        this.loading = false;
        
        // Forcer la détection de changements
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des workout details:', err);
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    if (this.fromYouProgress) {
      this.router.navigate(['/dashboard/you']);
    } else {
      this.router.navigate(['/dashboard/program']);
    }
  }
} 