import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {EapplicationService} from './services/eapplication.service';
import {MatMenu, MatMenuTrigger} from '@angular/material';


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
@ViewChild('levelOneTrigger')clientsMenu: MatMenuTrigger;
  hideNotifications = true;
  highlightNotificationButton = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private eapplicationService: EapplicationService
  ) {
  }

  ngOnInit() {
    this.authService.getPrincipal().subscribe();
    this.eapplicationService.checkEapps();
  }

  // logout() {
  //   this.authService.logout().subscribe(_ => {
  //     this.router.navigate(['/']);
  //   });
  // }

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
