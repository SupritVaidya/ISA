import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../services/user-service';

@Component({
  selector: 'app-manage-users',
  imports: [RouterLink, CommonModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.scss',
})
export class ManageUsers implements OnInit {
  private userService = inject(UserService);

  users: User[] = [];
  loading = true;
  deletingId: number | null = null;

  get currentUserId() {
    return this.userService.currentUser()?.id;
  }

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.sort((a, b) => a.firstName.localeCompare(b.firstName));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  deleteUser(id: number, name: string) {
    if (!confirm(`Remove "${name}"? This cannot be undone.`)) return;

    this.deletingId = id;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.deletingId = null;
      },
      error: () => {
        alert('Failed to remove user.');
        this.deletingId = null;
      }
    });
  }
}
