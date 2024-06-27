import { CookieService } from "ngx-cookie-service";
/**
 * Title: base-layout.component.ts
 * Original Author: Professor Krasso
 * Updates by Jeremy Lates
 * Date: 06/19/24
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */

// imports statements
import { Component } from "@angular/core";
//import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-base-layout",
  templateUrl: "./base-layout.component.html",
  styleUrls: ["./base-layout.component.css"],
})
export class BaseLayoutComponent {
  constructor(private cookieService: CookieService) {}

  signout() {
    this.cookieService.deleteAll();
    window.location.href = "/#/signin";
  }
}
