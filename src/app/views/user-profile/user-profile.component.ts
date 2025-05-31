import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
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
  userProfile: Partial<UserProfile> = {
    gender: undefined,
    weight: 0,
    height: 0,
    bodyFat: undefined,
    experienceYears: 0,
    trainingFrequency: 0,
    sessionDuration: 0,
    goal: undefined,
    trainingPreference: undefined,
    equipmentAvailable: 'none'
  };

  selectedEquipment: string[] = ['none'];

  genders = Object.values(Gender);
  goals = Object.values(Goal);
  trainingPreferences = Object.values(TrainingPreference);
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

  constructor(
    private router: Router,
    private userProfileService: UserProfileService
  ) {}

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
        return this.userProfile.gender !== undefined && 
               this.userProfile.weight !== undefined && 
               this.isValidWeight(this.userProfile.weight) && 
               this.userProfile.height !== undefined && 
               this.isValidHeight(this.userProfile.height) && 
               (this.userProfile.bodyFat === undefined || (this.userProfile.bodyFat !== undefined && this.isValidBodyFat(this.userProfile.bodyFat)));
      case 2:
        return this.userProfile.experienceYears !== undefined && 
               this.isValidExperience(this.userProfile.experienceYears) && 
               this.userProfile.trainingFrequency !== undefined && 
               this.isValidFrequency(this.userProfile.trainingFrequency) && 
               this.userProfile.sessionDuration !== undefined && 
               this.isValidDuration(this.userProfile.sessionDuration);
      case 3:
        return this.userProfile.goal !== undefined && 
               this.userProfile.trainingPreference !== undefined;
      case 4:
        return this.selectedEquipment.length > 0;
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
    if (this.selectedEquipment.includes('none')) {
      this.selectedEquipment = [];
    } else {
      this.selectedEquipment = ['none'];
    }
  }

  toggleEquipment(equipment: string) {
    if (this.selectedEquipment.includes('none')) {
      this.selectedEquipment = [];
    }

    const index = this.selectedEquipment.indexOf(equipment);
    if (index === -1) {
      this.selectedEquipment.push(equipment);
    } else {
      this.selectedEquipment.splice(index, 1);
    }

    if (this.selectedEquipment.length === 0) {
      this.selectedEquipment = ['none'];
    }
  }

  isEquipmentSelected(equipment: string): boolean {
    return this.selectedEquipment.includes(equipment);
  }

  saveProfile() {
    if (this.isStepValid()) {
      const profileToSave: UserProfile = {
        ...this.userProfile,
        gender: this.userProfile.gender!,
        goal: this.userProfile.goal!,
        trainingPreference: this.userProfile.trainingPreference!,
        weight: this.userProfile.weight!,
        height: this.userProfile.height!,
        experienceYears: this.userProfile.experienceYears!,
        trainingFrequency: this.userProfile.trainingFrequency!,
        sessionDuration: this.userProfile.sessionDuration!,
        equipmentAvailable: this.selectedEquipment.join(',')
      };

      this.userProfileService.saveProfile(profileToSave).subscribe({
        next: (response) => {
          console.log('Profil sauvegardé avec succès:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde du profil:', error);
        }
      });
    }
  }
} 