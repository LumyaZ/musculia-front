import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgramCardComponent } from '../../../components/program-card/program-card.component';
import { WorkoutService } from '../../../services/workout.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-program',
  standalone: true,
  imports: [CommonModule, ProgramCardComponent],
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {
  categories = [
    {
      name: 'Populaires',
      slug: 'populaires',
      programs: [
        {
          name: 'Full Body Débutant',
          description: 'Un programme complet pour débuter en musculation.',
          level: 'Débutant',
          duration: '4 semaines',
          slug: 'full-body-debutant'
        },
        {
          name: 'Push Pull Legs',
          description: 'Programme classique pour progresser sur tout le corps.',
          level: 'Intermédiaire',
          duration: '6 semaines',
          slug: 'push-pull-legs'
        },
        {
          name: 'Cardio & HIIT',
          description: 'Pour améliorer l\'endurance et brûler des calories.',
          level: 'Tous niveaux',
          duration: '4 semaines',
          slug: 'cardio-hiit'
        }
      ]
    },
    {
      name: 'Prise de masse',
      slug: 'prise-de-masse',
      programs: [
        {
          name: 'Mass Gainer',
          description: 'Programme intensif pour la prise de masse.',
          level: 'Intermédiaire',
          duration: '8 semaines',
          slug: 'mass-gainer'
        },
        {
          name: 'Hypertrophie',
          description: 'Axé sur le volume musculaire.',
          level: 'Avancé',
          duration: '6 semaines',
          slug: 'hypertrophie'
        }
      ]
    },
    {
      name: 'Perte de poids',
      slug: 'perte-de-poids',
      programs: [
        {
          name: 'HIIT Brûle-Graisse',
          description: 'Entraînements courts et intenses.',
          level: 'Tous niveaux',
          duration: '4 semaines',
          slug: 'hiit-brule-graisse'
        },
        {
          name: 'Cardio Express',
          description: 'Cardio quotidien pour sécher.',
          level: 'Débutant',
          duration: '3 semaines',
          slug: 'cardio-express'
        }
      ]
    }
  ];

  createMode = false;

  constructor(
    private router: Router, 
    private workoutService: WorkoutService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      console.log('Utilisateur non connecté, redirection vers login');
      this.router.navigate(['/auth/login']);
      return;
    }

    // Afficher le token pour debug
    const token = this.authService.getToken();
    console.log('Token JWT:', token);

    // Appeler l'API avec authentification
    this.workoutService.getAllWorkouts().subscribe({
      next: (workouts) => {
        console.log('All workouts:', workouts);
        console.log('Nombre de workouts récupérés:', workouts.length);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des workouts', err);
        console.error('Status:', err.status);
        console.error('StatusText:', err.statusText);
        console.error('URL:', err.url);
        console.error('Headers:', err.headers);
        console.error('Error body:', err.error);
        console.error('Message:', err.message);
        
        if (err.status === 401 || err.status === 403) {
          console.log('Token expiré ou invalide, redirection vers login');
          this.authService.logout();
        }
      }
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