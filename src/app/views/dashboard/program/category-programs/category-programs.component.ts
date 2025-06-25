import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramCardComponent } from '../../../../components/program-card/program-card.component';

@Component({
  selector: 'app-category-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgramCardComponent],
  templateUrl: './category-programs.component.html',
  styleUrls: ['./category-programs.component.scss']
})
export class CategoryProgramsComponent {
  slug: string = '';
  category: any = null;
  searchTerm: string = '';
  allCategories = [
    {
      name: 'Populaires',
      slug: 'populaires',
      programs: [
        { name: 'Full Body Débutant', description: 'Un programme complet pour débuter en musculation.', level: 'Débutant', duration: '4 semaines', slug: 'full-body-debutant' },
        { name: 'Push Pull Legs', description: 'Programme classique pour progresser sur tout le corps.', level: 'Intermédiaire', duration: '6 semaines', slug: 'push-pull-legs' },
        { name: 'Cardio & HIIT', description: "Pour améliorer l'endurance et brûler des calories.", level: 'Tous niveaux', duration: '4 semaines', slug: 'cardio-hiit' }
      ]
    },
    {
      name: 'Prise de masse',
      slug: 'prise-de-masse',
      programs: [
        { name: 'Mass Gainer', description: 'Programme intensif pour la prise de masse.', level: 'Intermédiaire', duration: '8 semaines', slug: 'mass-gainer' },
        { name: 'Hypertrophie', description: 'Axé sur le volume musculaire.', level: 'Avancé', duration: '6 semaines', slug: 'hypertrophie' }
      ]
    },
    {
      name: 'Perte de poids',
      slug: 'perte-de-poids',
      programs: [
        { name: 'HIIT Brûle-Graisse', description: 'Entraînements courts et intenses.', level: 'Tous niveaux', duration: '4 semaines', slug: 'hiit-brule-graisse' },
        { name: 'Cardio Express', description: 'Cardio quotidien pour sécher.', level: 'Débutant', duration: '3 semaines', slug: 'cardio-express' }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      this.category = this.allCategories.find(cat => cat.slug === this.slug);
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/program']);
  }

  filteredPrograms() {
    if (!this.category?.programs) return [];
    if (!this.searchTerm) return this.category.programs;
    const term = this.searchTerm.toLowerCase();
    return this.category.programs.filter((prog: any) =>
      prog.name.toLowerCase().includes(term) ||
      prog.description.toLowerCase().includes(term) ||
      prog.level.toLowerCase().includes(term)
    );
  }

  goToProgram(prog: any) {
    // Redirection fictive, à adapter selon la future page de détail
    this.router.navigate(['/dashboard/program', prog.slug]);
  }
} 