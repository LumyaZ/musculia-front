import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { HomeComponent } from './views/dashboard/home/home.component';
import { ActivityComponent } from './views/dashboard/activity/activity.component';
import { YouComponent } from './views/dashboard/you/you.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { provideHttpClient } from '@angular/common/http';
import { ProgramComponent } from './views/dashboard/program/program.component';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/auth/login');
};

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'activity', component: ActivityComponent },
      { path: 'program', component: ProgramComponent },
      { path: 'you', component: YouComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard/program/category/:slug',
    loadComponent: () => import('./views/dashboard/program/category-programs/category-programs.component').then(m => m.CategoryProgramsComponent)
  },
  {
    path: 'dashboard/program/:slug',
    loadComponent: () => import('./views/dashboard/program/program-detail/program-detail.component').then(m => m.ProgramDetailComponent)
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [authGuard],
    providers: [provideHttpClient()]
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];
