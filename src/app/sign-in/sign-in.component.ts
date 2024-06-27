/**
 * Title: sign-in.component.ts
 * Author: Jeremy Lates
 * Date: 06-08-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */

import { Component, OnInit } from "@angular/core";
import { SignInService } from "../sign-in.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  signinForm: FormGroup;
  errorMessage: string;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private signinService: SignInService
  ) {
    this.errorMessage = "";
    this.signinForm = this.fb.group({ employeeId: "" });

    //This is for test only
    this.cookieService.delete("session_user");

    console.log("Session Id: " + this.cookieService.get("session_user"));
  }

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      employeeId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
    });
  }

  get form() {
    return this.signinForm.controls;
  }

  onSubmit() {
    const formValues = this.signinForm.value;
    const employeeId = parseInt(formValues.employeeId);

    console.log("Entered onSubmit function....");

    if (this.signinService.validate(employeeId)) {
      console.log("Singin Serivce validation call on employee id passed....");
      this.cookieService.set("session_user", employeeId.toString(), 1);

      this.router.navigate(["tasks"]);
    } else {
      this.errorMessage = `The employee ID you entered is invalid, please try again.`;
    }
  }
}
