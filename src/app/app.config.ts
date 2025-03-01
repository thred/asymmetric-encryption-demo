import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
    providers: [provideExperimentalZonelessChangeDetection(), provideRouter(routes), provideAnimationsAsync()],
};
