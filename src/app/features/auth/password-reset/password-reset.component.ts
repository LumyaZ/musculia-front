import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class PasswordResetComponent implements OnInit {
  resetForm!: FormGroup;
  requestForm!: FormGroup;
  loading = false;
  error = '';
  success = '';
  isRequestMode = true;
  token: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.isRequestMode = !this.token;

    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.isRequestMode) {
      this.onRequestReset();
    } else {
      this.onResetPassword();
    }
  }

  onRequestReset(): void {
    if (this.requestForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      this.authService.requestPasswordReset({ email: this.requestForm.value.email }).subscribe({
        next: () => {
          this.success = 'Un email de réinitialisation a été envoyé à votre adresse email.';
          this.loading = false;
          this.requestForm.reset();
        },
        error: (error: Error) => {
          this.error = error.message || 'Une erreur est survenue lors de la demande de réinitialisation';
          this.loading = false;
        }
      });
    }
  }

  onResetPassword(): void {
    if (this.resetForm.valid && this.token) {
      this.loading = true;
      this.error = '';
      this.success = '';

      this.authService.resetPassword({
        token: this.token,
        password: this.resetForm.value.password
      }).subscribe({
        next: () => {
          this.success = 'Votre mot de passe a été réinitialisé avec succès.';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error: Error) => {
          this.error = error.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe';
          this.loading = false;
        }
      });
    }
  }
} 