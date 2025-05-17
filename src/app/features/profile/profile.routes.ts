import { Routes } from '@angular/router';
import { CreateProfileComponent } from './create-profile/create-profile.component';

export const profileRoutes: Routes = [
  {
    path: 'create',
    component: CreateProfileComponent,
    title: 'Création du profil - Musculia'
  },
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full'
  }
]; 