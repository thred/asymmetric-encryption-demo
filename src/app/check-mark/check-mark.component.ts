import { Component, input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: "app-check-mark",
    imports: [MatIcon],
    templateUrl: "./check-mark.component.html",
    styleUrl: "./check-mark.component.scss",
})
export class CheckMarkComponent {
    readonly checked = input<boolean | undefined>(undefined);
}
