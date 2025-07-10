import { Injectable } from '@angular/core';

export interface CategoryStyle {
  name: string;
  color: string;
  backgroundColor: string;
  icon: string;
  level: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryStyleService {

  private categoryStyles: { [key: string]: CategoryStyle } = {
    'FORCE': {
      name: 'Force',
      color: '#FFFFFF',
      backgroundColor: '#DC2626', // Rouge principal
      icon: 'fa-dumbbell',
      level: 'Avancé'
    },
    'CARDIO': {
      name: 'Cardio',
      color: '#FFFFFF',
      backgroundColor: '#059669', // Vert
      icon: 'fa-heartbeat',
      level: 'Tous niveaux'
    },
    'MUSCULATION': {
      name: 'Musculation',
      color: '#FFFFFF',
      backgroundColor: '#7C3AED', // Violet
      icon: 'fa-weight-hanging',
      level: 'Intermédiaire'
    },
    'YOGA': {
      name: 'Yoga',
      color: '#FFFFFF',
      backgroundColor: '#0891B2', // Bleu
      icon: 'fa-pray',
      level: 'Débutant'
    },
    'PILATES': {
      name: 'Pilates',
      color: '#FFFFFF',
      backgroundColor: '#D97706', // Orange
      icon: 'fa-spa',
      level: 'Débutant'
    },
    'CROSSFIT': {
      name: 'CrossFit',
      color: '#FFFFFF',
      backgroundColor: '#DC2626', // Rouge
      icon: 'fa-fire',
      level: 'Avancé'
    },
    'FONCTIONNEL': {
      name: 'Fonctionnel',
      color: '#FFFFFF',
      backgroundColor: '#059669', // Vert
      icon: 'fa-running',
      level: 'Intermédiaire'
    },
    'STRETCHING': {
      name: 'Stretching',
      color: '#FFFFFF',
      backgroundColor: '#7C3AED', // Violet
      icon: 'fa-child',
      level: 'Tous niveaux'
    }
  };

  getCategoryStyle(category: string): CategoryStyle {
    const upperCategory = category?.toUpperCase();
    return this.categoryStyles[upperCategory] || this.getDefaultStyle();
  }

  getCategoryName(category: string): string {
    return this.getCategoryStyle(category).name;
  }

  getCategoryColor(category: string): string {
    return this.getCategoryStyle(category).color;
  }

  getCategoryBackgroundColor(category: string): string {
    return this.getCategoryStyle(category).backgroundColor;
  }

  getCategoryIcon(category: string): string {
    return this.getCategoryStyle(category).icon;
  }

  getCategoryLevel(category: string): string {
    return this.getCategoryStyle(category).level;
  }

  getAllCategories(): string[] {
    return Object.keys(this.categoryStyles);
  }

  private getDefaultStyle(): CategoryStyle {
    return {
      name: 'Autre',
      color: '#FFFFFF',
      backgroundColor: '#6B7280', // Gris
      icon: 'fa-question-circle',
      level: 'Tous niveaux'
    };
  }
} 