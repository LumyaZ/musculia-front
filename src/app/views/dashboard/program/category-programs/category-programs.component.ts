import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramCardComponent } from '../../../../components/program-card/program-card.component';
import { WorkoutService } from '../../../../services/workout.service';
import { AuthService } from '../../../../services/auth.service';
import { CategoryStyleService } from '../../../../services/category-style.service';

@Component({
  selector: 'app-category-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgramCardComponent],
  providers: [WorkoutService, AuthService, CategoryStyleService],
  templateUrl: './category-programs.component.html',
  styleUrls: ['./category-programs.component.scss']
})
export class CategoryProgramsComponent implements OnInit {
  slug: string = '';
  categoryName: string = '';
  searchTerm: string = '';
  workouts: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private workoutService: WorkoutService,
    private authService: AuthService,
    private categoryStyleService: CategoryStyleService,
    private cdr: ChangeDetectorRef
  ) {
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadWorkoutsByCategory();
      }
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      console.log('Utilisateur non connecté, redirection vers login');
      this.router.navigate(['/auth/login']);
      return;
    }
  }

  loadWorkoutsByCategory(): void {
    this.loading = true;
    
    this.workoutService.getAllWorkouts().subscribe({
      next: (workouts: any[]) => {
        // Filtrer les workouts par catégorie
        const categoryWorkouts = workouts.filter(workout => 
          workout.categorie?.toLowerCase() === this.slug.toLowerCase()
        );

        // Transformer les workouts comme dans program.component
        this.workouts = categoryWorkouts.map((workout: any) => ({
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

        // Obtenir le nom de la catégorie
        this.categoryName = this.categoryStyleService.getCategoryName(this.slug);
        
        console.log('Workouts de la catégorie:', this.workouts);
        console.log('Nom de la catégorie:', this.categoryName);
        
        this.loading = false;
        
        // Forcer la détection de changements
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des workouts:', err);
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/program']);
  }

  filteredPrograms() {
    if (!this.workouts) return [];
    if (!this.searchTerm) return this.workouts;
    const term = this.searchTerm.toLowerCase();
    return this.workouts.filter((workout: any) =>
      workout.name.toLowerCase().includes(term) ||
      workout.description.toLowerCase().includes(term) ||
      workout.level.toLowerCase().includes(term) ||
      workout.categorie.toLowerCase().includes(term)
    );
  }

  goToProgram(workout: any) {
    this.router.navigate(['/dashboard/program', workout.slug]);
  }
} 