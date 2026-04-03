import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'events', loadComponent: () => import('./pages/events/events').then(m => m.Events) },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog').then(m => m.Blog) },
{ path: 'team', loadComponent: () => import('./pages/team/team').then(m => m.Team) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
  { path: '**', redirectTo: 'home' }
];
