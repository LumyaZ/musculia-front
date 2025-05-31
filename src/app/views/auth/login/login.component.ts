import { Component, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  showError = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  onSubmit() {
    this.errorMessage.set('');
    this.showError.set(false);
    this.isLoading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.isLoading.set(false);
        
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 400:
              this.errorMessage.set('Email ou mot de passe incorrect');
              break;
            case 401:
              this.errorMessage.set('Non autorisé');
              break;
            case 404:
              this.errorMessage.set('Utilisateur non trouvé');
              break;
            default:
              this.errorMessage.set('Une erreur est survenue lors de la connexion');
          }
        } else {
          this.errorMessage.set('Une erreur inattendue est survenue');
        }
        
        this.showError.set(true);
        this.cdr.detectChanges();
      }
    });
  }
} 