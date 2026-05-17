import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(c => c.Login),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout')
        .then(c => c.MainLayout),

    children: [
      {
        path: '',
        redirectTo: 'entries',
        pathMatch: 'full',
      },

      {
        path: 'entries',
        loadComponent: () =>
          import('./features/entries/entries')
            .then(c => c.Entries),
      },

      {
        path: 'jump',
        loadComponent: () =>
          import('./features/jump/jump')
            .then(c => c.Jump),
      },

      {
        path: 'new',
        loadComponent: () =>
          import('./features/new-entry/new-entry')
            .then(c => c.NewEntry),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings')
            .then(c => c.Settings),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
