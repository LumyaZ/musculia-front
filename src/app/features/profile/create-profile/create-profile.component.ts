import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService, UserProfile } from '../profile.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CreateProfileComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  profileForm!: FormGroup;
  loading = false;
  error = '';

  genderOptions = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'other', label: 'Autre' }
  ];

  goalOptions = [
    { value: 'muscle_gain', label: 'Prise de masse musculaire' },
    { value: 'weight_loss', label: 'Perte de poids' },
    { value: 'toning', label: 'Tonification' }
  ];

  trainingPreferenceOptions = [
    { value: 'strength', label: 'Force' },
    { value: 'hypertrophy', label: 'Hypertrophie' },
    { value: 'endurance', label: 'Endurance' }
  ];

  equipmentOptions = [
    { id: 'dumbbells', label: 'Haltères' },
    { id: 'barbell', label: 'Barre de musculation' },
    { id: 'bench', label: 'Banc de musculation' },
    { id: 'pullup_bar', label: 'Barre de traction' },
    { id: 'resistance_bands', label: 'Élastiques' },
    { id: 'gym_membership', label: 'Accès à une salle de sport' },
    { id: 'none', label: 'Aucun équipement' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      basicInfo: this.fb.group({
        gender: ['', Validators.required],
        weight: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
        height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
        bodyFat: ['', [Validators.min(3), Validators.max(50)]]
      }),
      trainingInfo: this.fb.group({
        experienceYears: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
        trainingFrequency: ['', [Validators.required, Validators.min(1), Validators.max(7)]],
        sessionDuration: ['', [Validators.required, Validators.min(15), Validators.max(180)]]
      }),
      equipment: this.fb.group({
        equipmentAvailable: [[], Validators.required]
      }),
      goals: this.fb.group({
        goal: ['', Validators.required],
        trainingPreference: ['', Validators.required]
      })
    });
  }

  onEquipmentChange(event: Event, equipmentId: string): void {
    const checkbox = event.target as HTMLInputElement;
    const equipmentControl = this.profileForm.get('equipment.equipmentAvailable');
    const currentEquipment = equipmentControl?.value || [];

    if (checkbox.checked) {
      equipmentControl?.setValue([...currentEquipment, equipmentId]);
    } else {
      equipmentControl?.setValue(currentEquipment.filter((id: string) => id !== equipmentId));
    }
  }

  get currentFormGroup(): FormGroup {
    switch (this.currentStep) {
      case 1:
        return this.profileForm.get('basicInfo') as FormGroup;
      case 2:
        return this.profileForm.get('trainingInfo') as FormGroup;
      case 3:
        return this.profileForm.get('equipment') as FormGroup;
      case 4:
        return this.profileForm.get('goals') as FormGroup;
      default:
        return this.profileForm.get('basicInfo') as FormGroup;
    }
  }

  nextStep(): void {
    if (this.currentFormGroup.valid && this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = this.profileForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.error = 'Vous devez être connecté pour créer un profil';
        this.loading = false;
        this.router.navigate(['/auth/login']);
        return;
      }

      const profileData: UserProfile = {
        authUser: currentUser,
        gender: formData.basicInfo.gender,
        weight: Number(formData.basicInfo.weight),
        height: Number(formData.basicInfo.height),
        bodyFat: formData.basicInfo.bodyFat ? Number(formData.basicInfo.bodyFat) : null,
        experienceYears: Number(formData.trainingInfo.experienceYears),
        trainingFrequency: Number(formData.trainingInfo.trainingFrequency),
        sessionDuration: Number(formData.trainingInfo.sessionDuration),
        equipmentAvailable: formData.equipment.equipmentAvailable.length > 0 
          ? formData.equipment.equipmentAvailable[0] 
          : 'none',
        goal: formData.goals.goal,
        trainingPreference: formData.goals.trainingPreference
      };

      console.log('Form data before submission:', formData);
      console.log('Formatted profile data:', profileData);

      this.profileService.createProfile(profileData).subscribe({
        next: (response) => {
          console.log('Profile created successfully:', response);
          this.loading = false;
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Error creating profile:', error);
          this.loading = false;
          this.error = error.message || 'Une erreur est survenue lors de la création du profil';
        }
      });
    } else {
      console.log('Form validation errors:', this.profileForm.errors);
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        if (control?.errors) {
          console.log(`Validation errors for ${key}:`, control.errors);
        }
      });
    }
  }

  getStepProgress(): number {
    switch (this.currentStep) {
      case 1:
        return 0;
      case 2:
        return 33;
      case 3:
        return 66;
      case 4:
        return 100;
      default:
        return 0;
    }
  }

  isStepValid(): boolean {
    return this.currentFormGroup.valid;
  }
} 