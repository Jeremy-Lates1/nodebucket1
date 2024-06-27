/**
 * Title: app.component.ts
 * Author: Jeremy Lates
 * Date: 06-08-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */

// imports statements
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <!-- This router-outlet displays the content of the BaseLayout or AuthLayout components -->
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {}
