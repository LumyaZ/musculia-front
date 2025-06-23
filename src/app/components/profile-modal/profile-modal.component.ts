import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile, Gender, Goal, TrainingPreference } from '../../_models/user-profile.model';
import { UserProfileService } from '../../services/user-profile.service';
import { TranslationService } from '../../services/translation.service';

export type ModalType = 'basic' | 'experience' | 'goals' | 'equipment';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent {
  @Input() modalType: ModalType = 'basic';
  editedProfile: Partial<UserProfile> = {};
  isVisible = false;
  genders = Object.values(Gender);
  goals = Object.values(Goal);
  trainingPreferences = Object.values(TrainingPreference);
  selectedEquipment: string[] = [];
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
    private userProfileService: UserProfileService,
    public translationService: TranslationService
  ) {}

  getModalTitle(): string {
    switch (this.modalType) {
      case 'basic':
        return 'Informations Complémentaires';
      case 'experience':
        return 'Expérience d\'Entraînement';
      case 'goals':
        return 'Objectifs et Préférences';
      case 'equipment':
        return 'Équipement Disponible';
      default:
        return '';
    }
  }

  show(profile: UserProfile) {
    this.editedProfile = { id: profile.id };
    switch (this.modalType) {
      case 'basic':
        this.editedProfile = {
          ...this.editedProfile,
          gender: profile.gender,
          weight: profile.weight,
          height: profile.height,
          bodyFat: profile.bodyFat
        };
        break;
      case 'experience':
        this.editedProfile = {
          ...this.editedProfile,
          experienceYears: profile.experienceYears,
          trainingFrequency: profile.trainingFrequency,
          sessionDuration: profile.sessionDuration
        };
        break;
      case 'goals':
        this.editedProfile = {
          ...this.editedProfile,
          goal: profile.goal,
          trainingPreference: profile.trainingPreference
        };
        break;
      case 'equipment':
        this.selectedEquipment = profile.equipmentAvailable?.split(',') || ['none'];
        break;
    }
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
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

  onSubmit() {
    // Validation avant soumission
    if (this.modalType === 'basic') {
      if (
        this.editedProfile.weight === undefined ||
        !this.isValidWeight(this.editedProfile.weight) ||
        this.editedProfile.height === undefined ||
        !this.isValidHeight(this.editedProfile.height) ||
        (this.editedProfile.bodyFat !== undefined && !this.isValidBodyFat(this.editedProfile.bodyFat))
      ) {
        return;
      }
    }
    if (this.modalType === 'experience') {
      if (
        this.editedProfile.experienceYears === undefined ||
        !this.isValidExperience(this.editedProfile.experienceYears) ||
        this.editedProfile.trainingFrequency === undefined ||
        !this.isValidFrequency(this.editedProfile.trainingFrequency) ||
        this.editedProfile.sessionDuration === undefined ||
        !this.isValidDuration(this.editedProfile.sessionDuration)
      ) {
        return;
      }
    }
    if (this.editedProfile.id) {
      let updatedProfile: Partial<UserProfile> = { id: this.editedProfile.id };
      switch (this.modalType) {
        case 'basic':
          updatedProfile = {
            ...updatedProfile,
            gender: this.editedProfile.gender,
            weight: this.editedProfile.weight,
            height: this.editedProfile.height,
            bodyFat: this.editedProfile.bodyFat
          };
          break;
        case 'experience':
          updatedProfile = {
            ...updatedProfile,
            experienceYears: this.editedProfile.experienceYears,
            trainingFrequency: this.editedProfile.trainingFrequency,
            sessionDuration: this.editedProfile.sessionDuration
          };
          break;
        case 'goals':
          updatedProfile = {
            ...updatedProfile,
            goal: this.editedProfile.goal,
            trainingPreference: this.editedProfile.trainingPreference
          };
          break;
        case 'equipment':
          updatedProfile = {
            ...updatedProfile,
            equipmentAvailable: this.selectedEquipment.join(',')
          };
          break;
      }

      this.userProfileService.updateProfile(updatedProfile).subscribe({
        next: () => {
          this.isVisible = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          // Gérer l'erreur ici (afficher un message à l'utilisateur par exemple)
        }
      });
    }
  }
} 