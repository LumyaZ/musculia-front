import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class HeaderComponent implements OnInit {
  pageTitle: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.updatePageTitle();
    this.router.events.subscribe(() => {
      this.updatePageTitle();
    });
  }

  private updatePageTitle() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('/dashboard/home')) {
      this.pageTitle = 'Accueil';
    } else if (currentRoute.includes('/dashboard/activity')) {
      this.pageTitle = 'Activité';
    } else if (currentRoute.includes('/dashboard/you')) {
      this.pageTitle = 'Vous';
    } else {
      this.pageTitle = 'Dashboard';
    }
  }

  logout() {
    this.authService.logout();
  }
} 