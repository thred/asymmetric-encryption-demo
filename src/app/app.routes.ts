import { Routes } from "@angular/router";
import { RsaPageComponent } from "./rsa-page/rsa-page.component";

export const routes: Routes = [
    { path: "rsa", component: RsaPageComponent },

    { path: "", redirectTo: "rsa", pathMatch: "full" },
];
