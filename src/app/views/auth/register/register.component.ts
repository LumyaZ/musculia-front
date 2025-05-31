import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  private _isLoading = signal(false);
  private _showError = signal(false);
  private _errorMessage = signal('');
  private _showPassword = signal(false);

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

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this._errorMessage.set('Les mots de passe ne correspondent pas');
      this._showError.set(true);
      return;
    }

    this._isLoading.set(true);
    this._showError.set(false);

    try {
      await this.authService.register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      });
      
      // Redirection vers la page de connexion après inscription réussie
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this._errorMessage.set(error.message || 'Une erreur est survenue lors de l\'inscription');
      this._showError.set(true);
    } finally {
      this._isLoading.set(false);
    }
  }
} 