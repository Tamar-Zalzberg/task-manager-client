import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // --- השינוי כאן: במקום רידיירקט, טוענים את דף הנחיתה ---
  {
    path: '',
    loadComponent: () => import('./components/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  // -------------------------------------------------------

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

  // אם מישהו כותב כתובת לא נכונה, נשלח אותו לדף הבית (הנחיתה)
  { path: '**', redirectTo: '' }
];