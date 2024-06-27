/**
 * Title: sign-in.service.ts
 * Author: Jeremy Lates
 * Date: 06-08-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */

import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SignInService {
  employeeIds: Array<number>;

  constructor() {
    this.employeeIds = [1007, 1008, 1009, 1010, 1011, 1012];
  }
  validate(employeeId: number) {
    return this.employeeIds.some((id) => id === employeeId);
  }
}
