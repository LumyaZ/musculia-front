import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  passwordConditions = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  };
  showPasswordFields = {
    password: false,
    confirm: false
  };
  passwordMismatch = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });

    // Écouter les changements du mot de passe pour mettre à jour les conditions
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.checkPasswordConditions(password);
      this.checkPasswordMatch();
    });

    // Écouter les changements de la confirmation du mot de passe
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }

  ngOnInit(): void {
    // Observer les changements du mot de passe
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.checkPasswordConditions(password || '');
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    this.showPasswordFields[field] = !this.showPasswordFields[field];
  }

  checkPasswordConditions(password: string) {
    this.passwordConditions = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password)
    };
  }

  checkPasswordMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    this.passwordMismatch = password !== confirmPassword && confirmPassword !== '';
  }

  allPasswordConditionsMet(): boolean {
    return Object.values(this.passwordConditions).every(condition => condition);
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid || !this.allPasswordConditionsMet()) {
      return;
    }

    this.loading = true;
    const { confirmPassword, ...registerData } = this.registerForm.value;
    
    this.authService.register(registerData)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/profile/create']);
        },
        error: (error: { error?: { message: string } }) => {
          console.error('Registration error:', error);
          this.error = error.error?.message || 'Une erreur est survenue';
          this.loading = false;
        }
      });
  }
} 