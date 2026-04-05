import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'events', loadComponent: () => import('./pages/events/events').then(m => m.Events) },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog').then(m => m.Blog) },
  { path: 'team', loadComponent: () => import('./pages/team/team').then(m => m.Team) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'events/:id/register', loadComponent: () => import('./pages/events/event-register/event-register').then(m => m.EventRegister) },
  { path: 'my-registrations', loadComponent: () => import('./pages/my-registrations/my-registrations').then(m => m.MyRegistrations) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'admin/add-event', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/add-event/add-event').then(m => m.AddEvent) },
  { path: 'admin/add-blog', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/add-blog/add-blog').then(m => m.AddBlog) },
  { path: 'admin/registrations', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/registrations/registrations').then(m => m.Registrations) },
  { path: 'admin/manage-events', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/manage-events/manage-events').then(m => m.ManageEvents) },
  { path: 'admin/manage-users', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/manage-users/manage-users').then(m => m.ManageUsers) },
  { path: 'admin/edit-event/:id', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/edit-event/edit-event').then(m => m.EditEvent) },

  { path: '**', redirectTo: 'home' }
];
