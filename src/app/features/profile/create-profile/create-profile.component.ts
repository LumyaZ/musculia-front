import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Gender, Goal, TrainingPreference, ProfileFormData } from '../../../models/user-profile.model';
import { ProfileService } from '../profile.service';

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

  genderOptions: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'other', label: 'Autre' }
  ];

  goalOptions: { value: Goal; label: string }[] = [
    { value: 'muscle gain', label: 'Prise de masse musculaire' },
    { value: 'weight loss', label: 'Perte de poids' },
    { value: 'toning', label: 'Tonification' }
  ];

  trainingPreferenceOptions: { value: TrainingPreference; label: string }[] = [
    { value: 'strength', label: 'Force' },
    { value: 'hypertrophy', label: 'Hypertrophie' },
    { value: 'endurance', label: 'Endurance' }
  ];

  equipmentOptions: { id: string; label: string }[] = [
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
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      // Step 1: Basic Info
      basicInfo: this.fb.group({
        gender: ['', Validators.required],
        weight: ['', [Validators.required, Validators.min(30), Validators.max(250)]],
        height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
        body_fat: ['']
      }),

      // Step 2: Training Info
      trainingInfo: this.fb.group({
        experience_years: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
        training_frequency: ['', [Validators.required, Validators.min(0), Validators.max(7)]],
        session_duration: ['', [Validators.required, Validators.min(15), Validators.max(240)]]
      }),

      // Step 3: Equipment
      equipment: this.fb.group({
        equipment_available: [[]]
      }),

      // Step 4: Goals
      goals: this.fb.group({
        goal: ['', Validators.required],
        training_preference: ['', Validators.required]
      })
    });
  }

  onEquipmentChange(event: Event, equipmentId: string): void {
    const checkbox = event.target as HTMLInputElement;
    const equipmentControl = this.profileForm.get('equipment.equipment_available');
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

      const formData: ProfileFormData = {
        ...this.profileForm.value
      };

      this.profileService.createProfile(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'Une erreur est survenue lors de la création du profil';
          console.error('Erreur lors de la création du profil:', error);
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