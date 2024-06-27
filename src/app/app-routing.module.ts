/**
 * Title: app-routing.module.ts
 * Author: Jeremy Lates
 * Date: 06-08-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */

// imports statements
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseLayoutComponent } from "./layouts/base-layout/base-layout.component";
import { HomeComponent } from "./home/home.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { TasksComponent } from "./tasks/tasks.component";
import { SignInGuard } from "./sign-in.guard";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";
import { AboutComponent } from "./about/about.component";

// routes array with a path, component for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivate: [SignInGuard],
    children: [
      {
        path: "tasks",
        component: TasksComponent,
        // canActivate: [SignInGuard],
      },

      {
        path: "contact",
        component: ContactUsComponent,
      },

      {
        path: "about",
        component: AboutComponent,
      },
    ],
  },
  {
    path: "signin",
    component: SignInComponent,
  },
  { path: "**", component: PagenotfoundComponent },
];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
