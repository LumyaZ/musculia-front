import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { ProgramCardComponent } from '../../../components/program-card/program-card.component';
import { WorkoutService } from '../../../services/workout.service';
import { AuthService } from '../../../services/auth.service';
import { CategoryStyleService } from '../../../services/category-style.service';
import { filter } from 'rxjs/operators';

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
  providers: [WorkoutService, AuthService, CategoryStyleService],
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {
  workouts: any[] = [];
  categoryGroups: CategoryGroup[] = [];
  createMode = false;

  constructor(
    private router: Router, 
    private workoutService: WorkoutService,
    private authService: AuthService,
    private categoryStyleService: CategoryStyleService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.workoutService.getAllWorkouts().subscribe({
      next: (workouts: any[]) => {
        this.workouts = workouts.map((workout: any) => ({
          id: workout.id,
          name: workout.notes || `Workout ${workout.id}`,
          description: `Séance de ${workout.categorie || 'musculation'} - ${workout.duration} minutes`,
          level: this.categoryStyleService.getCategoryLevel(workout.categorie),
          duration: `${workout.duration} min`,
          slug: `workout-${workout.id}`,
          sessionDate: workout.sessionDate,
          categorie: workout.categorie,
          categoryStyle: this.categoryStyleService.getCategoryStyle(workout.categorie)
        }));
        
        // Grouper les workouts par catégorie
        this.groupWorkoutsByCategory();
        
        console.log('Workouts récupérés:', this.workouts);
        console.log('Workouts récupérés:', this.workouts.length);
        console.log('Workouts transformés:', this.workouts);
        console.log('Catégories groupées:', this.categoryGroups);
        
        // Forcer la détection de changements
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err: any) => {        
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
    // Redirection fictive, à adapter selon la future page de détail
    this.router.navigate(['/dashboard/program', prog.slug]);
  }
} 