import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  principal;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.principal = this.authService.getLocalPrincipal();
    }, 0);
  }

}
