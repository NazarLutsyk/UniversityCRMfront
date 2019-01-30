import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router, RouterOutlet} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({opacity: 0}),
        animate('.3s', style({opacity: 1}))
      ]),
    ])]
})
export class AppComponent implements OnInit {

  hideNotifications = true;
  highlightNotificationButton = false;

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
    if (!this.hideNotifications) {
      this.highlightNotificationButton = false;
    }
  }

  highlightToggleNotifications() {
    if (this.hideNotifications) {
      this.highlightNotificationButton = true;
    }
  }
}
