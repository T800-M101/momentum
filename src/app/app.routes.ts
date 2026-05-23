import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth-guard';
import { pendingChangesGuard } from './core/guards/pending-changes/pending-changes-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((c) => c.Login),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout').then((c) => c.MainLayout),

    children: [
      {
        path: '',
        redirectTo: 'entries',
        pathMatch: 'full',
      },

      {
        path: 'entries',
        loadComponent: () => import('./features/entry-list/entry-list').then((c) => c.EntryList),
      },
      {
        path: 'entry/:id',
        loadComponent: () => import('./shared/journal/entry/entry').then((c) => c.Entry),
      },

      {
        path: 'jump',
        loadComponent: () => import('./features/jump/jump').then((c) => c.Jump),
      },

      {
        path: 'new',
        loadComponent: () => import('./features/new-entry/new-entry').then((c) => c.NewEntry),
        canDeactivate: [pendingChangesGuard],
      },

      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then((c) => c.Settings),
      }
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
