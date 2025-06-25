import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-program',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent {
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

  constructor(private router: Router) {}

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