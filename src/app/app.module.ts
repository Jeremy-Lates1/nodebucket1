/**
 * Title: app.module.ts
 * Author: Jeremy Lates
 * Date: 06-08-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */

// imports statements
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { BaseLayoutComponent } from "./layouts/base-layout/base-layout.component";
import { NavComponent } from "./layouts/nav/nav.component";
import { FooterComponent } from "./layouts/footer/footer.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatToolbarModule } from "@angular/material/toolbar";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

import { MatInputModule } from "@angular/material/input";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TasksComponent } from "./tasks/tasks.component";

import { HttpClientModule } from "@angular/common/http";
import { ContactUsComponent } from "./contact-us/contact-us.component";

import { MatIconModule } from "@angular/material/icon";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";
import { AboutComponent } from "./about/about.component";

import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  transferArrayItem,
} from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BaseLayoutComponent,
    NavComponent,
    FooterComponent,
    SignInComponent,
    TasksComponent,
    ContactUsComponent,
    PagenotfoundComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    //transferArrayItem,
    // CdkDragDrop,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
