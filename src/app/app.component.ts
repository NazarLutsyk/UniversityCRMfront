import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(
    private router: Router,
    public authService: AuthService,
  ) {
  }

  logout() {
    this.authService.logout().subscribe(_ => this.router.navigate(['/']));
  }
}
