import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface UserProfile {
  gender: string;
  weight: number;
  height: number;
  bodyFat: number | null;
  experienceYears: number;
  trainingFrequency: number;
  sessionDuration: number;
  goal: string;
  trainingPreference: string;
  equipmentAvailable: string[];
}

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
  userProfile: UserProfile = {
    gender: '',
    weight: 0,
    height: 0,
    bodyFat: null,
    experienceYears: 0,
    trainingFrequency: 0,
    sessionDuration: 0,
    goal: '',
    trainingPreference: '',
    equipmentAvailable: ['none']
  };

  genders = ['male', 'female', 'other'];
  goals = ['muscle_gain', 'weight_loss', 'toning'];
  trainingPreferences = ['strength', 'hypertrophy', 'endurance'];
  equipmentList = [
    'Accès à une salle de sport',
    'Haltères',
    'Barres',
    'Banc de musculation',
    'Élastiques',
    'Tapis de yoga'
  ];

  // Constantes de validation
  readonly MIN_WEIGHT = 30;
  readonly MAX_WEIGHT = 250;
  readonly MIN_HEIGHT = 100;
  readonly MAX_HEIGHT = 250;
  readonly MIN_BODY_FAT = 3;
  readonly MAX_BODY_FAT = 50;
  readonly MIN_EXPERIENCE = 0;
  readonly MAX_EXPERIENCE = 50;
  readonly MIN_FREQUENCY = 1;
  readonly MAX_FREQUENCY = 7;
  readonly MIN_DURATION = 15;
  readonly MAX_DURATION = 240;

  constructor(private router: Router) {}

  getStepTitle(): string {
    switch (this.currentStep) {
      case 1:
        return 'Informations Complémentaires';
      case 2:
        return 'Expérience d\'Entraînement';
      case 3:
        return 'Objectifs et Préférences';
      case 4:
        return 'Équipement';
      default:
        return '';
    }
  }

  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.userProfile.gender !== '' && 
               this.isValidWeight(this.userProfile.weight) && 
               this.isValidHeight(this.userProfile.height) && 
               (this.userProfile.bodyFat === null || this.isValidBodyFat(this.userProfile.bodyFat));
      case 2:
        return this.isValidExperience(this.userProfile.experienceYears) && 
               this.isValidFrequency(this.userProfile.trainingFrequency) && 
               this.isValidDuration(this.userProfile.sessionDuration);
      case 3:
        return this.userProfile.goal !== '' && 
               this.userProfile.trainingPreference !== '';
      case 4:
        return this.userProfile.equipmentAvailable.includes('none') || (this.userProfile.equipmentAvailable.length > 0 && !this.userProfile.equipmentAvailable.includes('none'));
      default:
        return false;
    }
  }

  // Méthodes de validation
  isValidWeight(weight: number): boolean {
    return weight >= this.MIN_WEIGHT && weight <= this.MAX_WEIGHT;
  }

  isValidHeight(height: number): boolean {
    return height >= this.MIN_HEIGHT && height <= this.MAX_HEIGHT;
  }

  isValidBodyFat(bodyFat: number): boolean {
    return bodyFat >= this.MIN_BODY_FAT && bodyFat <= this.MAX_BODY_FAT;
  }

  isValidExperience(years: number): boolean {
    return years >= this.MIN_EXPERIENCE && years <= this.MAX_EXPERIENCE;
  }

  isValidFrequency(frequency: number): boolean {
    return frequency >= this.MIN_FREQUENCY && frequency <= this.MAX_FREQUENCY;
  }

  isValidDuration(duration: number): boolean {
    return duration >= this.MIN_DURATION && duration <= this.MAX_DURATION;
  }

  nextStep() {
    if (this.currentStep < this.totalSteps && this.isStepValid()) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isFirstStep(): boolean {
    return this.currentStep === 1;
  }

  isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  toggleNoEquipment() {
    console.log('toggleNoEquipment');
    console.log(this.userProfile.equipmentAvailable);
    if (this.userProfile.equipmentAvailable.includes('none')) {
      this.userProfile.equipmentAvailable = [];
    } else {
      this.userProfile.equipmentAvailable = ['none'];
    }
    console.log('toggleNoEquipment');
    console.log(this.userProfile.equipmentAvailable);
  }

  toggleEquipment(equipment: string) {
    console.log('toggleEquipment');
    console.log(this.userProfile.equipmentAvailable);
    if (this.userProfile.equipmentAvailable.includes('none')) {
      this.userProfile.equipmentAvailable = [];
    }

    const index = this.userProfile.equipmentAvailable.indexOf(equipment);
    if (index === -1) {
      this.userProfile.equipmentAvailable.push(equipment);
    } else {
      this.userProfile.equipmentAvailable.splice(index, 1);
    }

    if (this.userProfile.equipmentAvailable.length === 0) {
      this.userProfile.equipmentAvailable = ['none'];
    }
    console.log('toggleEquipment');
    console.log(this.userProfile.equipmentAvailable);
  }

  isEquipmentSelected(equipment: string): boolean {
    return this.userProfile.equipmentAvailable.includes(equipment);
  }

  saveProfile() {
    if (this.isStepValid()) {
      console.log('Profil utilisateur :', {
        ...this.userProfile,
        gender: this.userProfile.gender === 'male' ? 'Homme' : 
                this.userProfile.gender === 'female' ? 'Femme' : 'Autre',
        goal: this.userProfile.goal === 'muscle_gain' ? 'Prise de muscle' :
              this.userProfile.goal === 'weight_loss' ? 'Perte de poids' : 'Tonification',
        trainingPreference: this.userProfile.trainingPreference === 'strength' ? 'Force' :
                          this.userProfile.trainingPreference === 'hypertrophy' ? 'Hypertrophie' : 'Endurance'
      });
    }
  }
} 