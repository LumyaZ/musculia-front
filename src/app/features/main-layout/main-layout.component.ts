import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmModalComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isLogoutModalOpen = false;

  constructor(private router: Router) {}

  showLogoutConfirmation() {
    this.isLogoutModalOpen = true;
  }

  confirmLogout() {
    this.isLogoutModalOpen = false;
    // TODO: Ajouter la logique de déconnexion (clear token, etc.)
    this.router.navigate(['/auth/login']);
  }

  cancelLogout() {
    this.isLogoutModalOpen = false;
  }
} 