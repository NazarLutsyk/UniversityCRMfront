import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  hideNotifications = true;

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.authService.getPrincipal().subscribe();
  }

  logout() {
    this.authService.logout().subscribe(_ => {
      this.router.navigate(['/']);
    });
  }

  toggleNotifications() {
    this.hideNotifications = !this.hideNotifications;
  }
}
