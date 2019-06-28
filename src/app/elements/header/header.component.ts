import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
    addEventListener('click', (e: any) => {
      if (e.target.classList.contains('can-be-active')) {
        const elems = document.getElementsByClassName('can-be-active');
        for (let i = 0; i < elems.length; i++) {

        }
        e.target.classList.remove('can-be-active');
      }
    });
  }
  logout() {
    this.authService.logout().subscribe(_ => {
      this.router.navigate(['/']);
    });
  }
}
