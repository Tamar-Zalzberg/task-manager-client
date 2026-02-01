import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; // וודאי שזה קיים אצלך, אם לא - תמחקי את השורות עם canActivate

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/landing-page/landing-page').then(m => m.LandingPageComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about').then(m => m.AboutComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'teams',
    loadComponent: () => import('./components/teams/teams').then(m => m.TeamsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'teams/:teamId/projects',
    loadComponent: () => import('./components/project-list/project-list').then(m => m.ProjectListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/tasks',
    loadComponent: () => import('./components/tasks/tasks').then(m => m.TasksComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  },
  {
    path: 'pricing',
    loadComponent: () => import('./components/pricing/pricing').then(m => m.PricingComponent)
  },
];