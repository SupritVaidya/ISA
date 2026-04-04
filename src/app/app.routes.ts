import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'events', loadComponent: () => import('./pages/events/events').then(m => m.Events) },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog').then(m => m.Blog) },
{ path: 'team', loadComponent: () => import('./pages/team/team').then(m => m.Team) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'admin/add-event', loadComponent: () => import('./pages/admin/add-event/add-event').then(m => m.AddEvent) },
  { path: 'admin/add-blog', loadComponent: () => import('./pages/admin/add-blog/add-blog').then(m => m.AddBlog) },

  { path: '**', redirectTo: 'home' }
];
