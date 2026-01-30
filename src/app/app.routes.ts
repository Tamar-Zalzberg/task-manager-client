import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; // 1. מוודאים שהגארד מיובא

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // שימוש ב-Lazy Loading (loadComponent) במקום component רגיל
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent) 
  },
  
  // --- מכאן והלאה הכל מוגן ע"י Guard ---
  { 
    path: 'teams', 
    loadComponent: () => import('./components/teams/teams').then(m => m.TeamsComponent),
    canActivate: [authGuard] // 2. חובה: מפעילים את ההגנה
  },

  { 
    path: 'teams/:teamId/projects', 
    loadComponent: () => import('./components/project-list/project-list').then(m => m.ProjectListComponent),
    canActivate: [authGuard] // חובה
  },

  { 
    path: 'projects/:projectId/tasks', 
    loadComponent: () => import('./components/tasks/tasks').then(m => m.TasksComponent),
    canActivate: [authGuard] // חובה
  },
  
  { path: '**', redirectTo: 'login' }
];