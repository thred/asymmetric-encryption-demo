import { Clipboard } from "@angular/cdk/clipboard";
import { Directive, HostListener, inject, input } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Directive({
    selector: "[appCopy]",
})
export class CopyDirective {
    private readonly clipboard = inject(Clipboard);
    private readonly snackBar = inject(MatSnackBar);

    readonly appCopy = input.required<string>();

    @HostListener("click")
    onClick() {
        this.clipboard.copy(this.appCopy());

        this.snackBar.open("Wert wurde in Zwischenablage kopiert.", undefined, {
            duration: 1000,
        });
    }
}
