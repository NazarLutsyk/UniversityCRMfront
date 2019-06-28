import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const principal = JSON.parse(window.localStorage.getItem('principal'));
    const expectedRoles = [...next.data.expectedRoles];
    return expectedRoles.indexOf(principal.role) > -1;
    // return expectedRoles.indexOf(!!this.authService.getLocalPrincipal().role) > -1;
  }
}
