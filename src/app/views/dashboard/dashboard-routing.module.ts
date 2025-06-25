import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ActivityComponent } from './activity/activity.component';
import { YouComponent } from './you/you.component';
import { ProgramComponent } from './program/program.component';
import { CategoryProgramsComponent } from './program/category-programs/category-programs.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'activity',
    component: ActivityComponent
  },
  {
    path: 'you',
    component: YouComponent
  },
  {
    path: 'program',
    component: ProgramComponent  },
  {
    path: 'program/category/:slug',
    component: CategoryProgramsComponent
  },
  {
    path: 'program/:slug',
    loadComponent: () => import('./program/program-detail/program-detail.component').then(m => m.ProgramDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 