/**
 * Title: sign-in.guard.ts
 * Author: Jeremy Lates
 * Date: 06-08-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */
import { CanActivateFn, CanActivate, Router } from "@angular/router";
import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SignInGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const sessionUser = this.cookieService.get("session_user");

    if (sessionUser) {
      console.log("Session User True: " + sessionUser);

      return true;
    } else {
      console.log("Session User false: " + sessionUser);
      //this.router.navigate(["/session/sign-in"]);
      this.router.navigate(["signin"]);
      return false;
    }
  }
}
