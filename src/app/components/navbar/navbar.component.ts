import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DarkModeService } from '../../services/dark-mode.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  menuOpen = false;
  darkMode = false;
  dropdownOpen = false;
  userEmail: string | null = null;

  constructor(private router: Router, public auth: AuthService, private darkModeService: DarkModeService) {}
  
  ngOnInit() {
    this.darkModeService.darkMode$.subscribe(mode => {
      this.darkMode = mode;
      if (mode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
   // const user = JSON.parse(localStorage.getItem('user') || '{}');
   // this.userEmail = user?.email || null;

    this.auth.user$.subscribe(user => {
    this.userEmail = user?.email || null;
  });

  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
  closeMenu() {
    this.menuOpen = false;
  }
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  closeDropdown() {
  this.dropdownOpen = false;
  }

  logout() {
    this.auth.logout();
     this.closeDropdown(); 
    this.router.navigate(['/login']);
  }

    toggleDark() {
    this.darkModeService.toggleDarkMode();
  }

}


