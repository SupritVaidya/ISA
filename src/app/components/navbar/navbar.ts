import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgbCollapse, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbDropdownItem],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  isMenuCollapsed = true;
  userService = inject(UserService);
  currentUser = this.userService.currentUser;

  logout() {
    this.userService.currentUser.set(null);
    localStorage.removeItem('currentUser');
    alert('You have been logged out.');
  }
}
