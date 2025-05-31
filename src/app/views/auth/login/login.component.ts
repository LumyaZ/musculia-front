import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onSubmit() {
    // La logique de connexion sera implémentée plus tard
    console.log('Login attempt with:', { email: this.email, password: this.password });
  }
} 