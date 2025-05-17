import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'activities',
        loadComponent: () => import('./features/activities/activities.component').then(m => m.ActivitiesComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'profile/create',
    loadComponent: () => import('./features/profile/create-profile/create-profile.component').then(m => m.CreateProfileComponent)
  }
];
