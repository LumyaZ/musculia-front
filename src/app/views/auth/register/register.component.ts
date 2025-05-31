import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  
  private _isLoading = signal(false);
  private _showError = signal(false);
  private _errorMessage = signal('');
  private _showPassword = signal(false);

  // Expressions régulières pour la validation du mot de passe
  private readonly PASSWORD_PATTERNS = {
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoading() {
    return this._isLoading();
  }

  showError() {
    return this._showError();
  }

  errorMessage() {
    return this._errorMessage();
  }

  showPassword() {
    return this._showPassword();
  }

  togglePasswordVisibility() {
    this._showPassword.update(value => !value);
  }

  hasUpperCase(): boolean {
    return this.password ? this.PASSWORD_PATTERNS.hasUpperCase.test(this.password) : false;
  }

  hasLowerCase(): boolean {
    return this.password ? this.PASSWORD_PATTERNS.hasLowerCase.test(this.password) : false;
  }

  hasNumber(): boolean {
    return this.password ? this.PASSWORD_PATTERNS.hasNumber.test(this.password) : false;
  }

  hasSpecialChar(): boolean {
    return this.password ? this.PASSWORD_PATTERNS.hasSpecialChar.test(this.password) : false;
  }

  hasMinLength(): boolean {
    return this.password ? this.password.length >= 8 : false;
  }

  validatePassword(password: string): string[] {
    const errors: string[] = [];
    
    if (!this.PASSWORD_PATTERNS.hasUpperCase.test(password)) {
      errors.push('Une majuscule');
    }
    if (!this.PASSWORD_PATTERNS.hasLowerCase.test(password)) {
      errors.push('Une minuscule');
    }
    if (!this.PASSWORD_PATTERNS.hasNumber.test(password)) {
      errors.push('Un chiffre');
    }
    if (!this.PASSWORD_PATTERNS.hasSpecialChar.test(password)) {
      errors.push('Un caractère spécial');
    }
    if (password.length < 8) {
      errors.push('8 caractères minimum');
    }

    return errors;
  }

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this._errorMessage.set('Les mots de passe ne correspondent pas');
      this._showError.set(true);
      return;
    }

    const passwordErrors = this.validatePassword(this.password);
    if (passwordErrors.length > 0) {
      this._errorMessage.set(`Le mot de passe doit contenir : ${passwordErrors.join(', ')}`);
      this._showError.set(true);
      return;
    }

    this._isLoading.set(true);
    this._showError.set(false);

    try {
      const response = await firstValueFrom(this.authService.register({
        email: this.email,
        password: this.password
      }));

      // Stocker les informations de l'utilisateur et le token
      localStorage.setItem('user', JSON.stringify(response));


      // Redirection vers le dashboard après inscription réussie
      this.router.navigate(['/profile']);
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      this._errorMessage.set(
        error.error?.message || 
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
      this._showError.set(true);
    } finally {
      this._isLoading.set(false);
    }
  }
} 