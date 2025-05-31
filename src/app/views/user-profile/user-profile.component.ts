import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile, Gender, Goal, TrainingPreference } from '../../_models/user-profile.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  currentStep = 1;
  totalSteps = 4;

  // Données statiques pour l'exemple
  userProfile: UserProfile = {
    gender: Gender.MALE,
    weight: 75,
    height: 180,
    bodyFat: 15,
    experienceYears: 2,
    trainingFrequency: 4,
    sessionDuration: 60,
    equipmentAvailable: 'Dumbbells, Bench, Pull-up bar',
    goal: Goal.MUSCLE_GAIN,
    trainingPreference: TrainingPreference.HYPERTROPHY
  };

  // Pour les sélecteurs
  genders = Object.values(Gender);
  goals = Object.values(Goal);
  trainingPreferences = Object.values(TrainingPreference);

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  isFirstStep(): boolean {
    return this.currentStep === 1;
  }

  getStepTitle(): string {
    switch (this.currentStep) {
      case 1:
        return 'Informations Complémentaires';
      case 2:
        return 'Expérience d\'Entraînement';
      case 3:
        return 'Objectifs et Préférences';
      case 4:
        return 'Équipement Disponible';
      default:
        return '';
    }
  }
} 