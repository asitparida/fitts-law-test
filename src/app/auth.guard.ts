import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AppService } from './app.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private appService: AppService, private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.appService.info) {
            return true;
        } else {
            this.router.navigate(['/home']);
        }
    }
}
