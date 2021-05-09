import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
  })
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var auth : boolean = await this.auth.isAuthenticatedAsync();
    console.log(auth)
    if (!auth && state.url != "/auth") {
      return this.router.parseUrl('/auth');
    } else if(auth && state.url == "/auth"){
      this.router.navigate(['/']);
      return this.router.parseUrl('/');
    }
    return true;
  }

}
