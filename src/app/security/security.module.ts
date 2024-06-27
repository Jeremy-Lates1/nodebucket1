/**
 * Title: security.module.ts
 * Author: Jeremy Lates
 * Date: 06-08-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */

// imports statements
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SecurityRoutingModule } from "./security-routing.module";
import { SecurityComponent } from "./security.component";

@NgModule({
  declarations: [SecurityComponent],
  imports: [CommonModule, SecurityRoutingModule],
})
export class SecurityModule {}
