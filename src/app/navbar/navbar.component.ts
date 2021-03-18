import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed: boolean = true;

  private roles: string[];
  isLoggedIn = false;

  constructor(public authService: AuthService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    console.log('loggedIn: ' + this.isLoggedIn);
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;


    }
  }

}
