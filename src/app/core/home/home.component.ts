import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  principal: { role: string };
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    const p: { role: string } = JSON.parse(window.localStorage.getItem('principal'));
      this.principal = p;
      this.authService.logoutLoginSubject.subscribe((res: string) => {
        if (res) {
          this.principal.role = res;
        } else {
          this.principal.role = res;
        }
      });
  }

}
