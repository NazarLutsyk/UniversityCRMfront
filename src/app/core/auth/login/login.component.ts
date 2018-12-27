import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginwrapper') loginWrapper: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  login(form: NgForm) {
    const credentials = form.value;
    this.authService.login(credentials)
      .subscribe(
        (principal) => {
          if (principal) {
            this.router.navigate(['/']);
          }
        },
        (err) => {
          if (!this.loginWrapper.nativeElement.classList.contains('error-form')) {
            this.loginWrapper.nativeElement.classList.add('error-form');
          }
        }
      );
  }
}
