import { Component, computed, effect, input, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRipple, MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CheckMarkComponent } from "../check-mark/check-mark.component";
import { CopyDirective } from "../directives/copy.directive";
import { persistent } from "../utils/persistent.signal";
import { PrivateKey, PublicKey, Utils } from "../utils/utils";

@Component({
    selector: "app-encrypt-number",
    imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRippleModule,
        CheckMarkComponent,
        CopyDirective,
    ],
    templateUrl: "./encrypt-number.component.html",
    styleUrls: ["./encrypt-number.component.scss"],
    host: { class: "two-columns with-divider" },
})
export class EncryptNumberComponent {
    readonly successRipple = viewChild("successRipple", { read: MatRipple });

    readonly publicKey = input.required<PublicKey>();

    readonly privateKey = input.required<PrivateKey>();

    readonly linked = persistent<boolean>("asymmetric-encryption-demo.encrypt-number.linked", () => true);

    readonly decodedNumber = persistent<number>("asymmetric-encryption-demo.encrypt-number.decoded-number", () => 1);

    readonly decodedNumberEncoded = computed(() =>
        Utils.encodeNumber(this.decodedNumber(), this.publicKey().e, this.publicKey().n),
    );

    readonly encodedNumber = persistent<number>("asymmetric-encryption-demo.encrypt-number.encoded-number", () => 1);

    readonly encodedNumberDecoded = computed(() =>
        Utils.decodeNumber(this.encodedNumber(), this.privateKey().d, this.privateKey().n),
    );

    constructor() {
        effect(() => {
            if (this.linked()) {
                this.encodedNumber.set(this.decodedNumberEncoded());

                this.successRipple()?.launch({
                    centered: true,
                });
            }
        });
    }

    randomize(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.decodedNumber.set(Utils.randomInt(0, this.publicKey().n));
    }

    reset(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.linked.reset();
        this.decodedNumber.reset();
    }

    toggleLinked(): void {
        this.linked.update((l) => !l);
    }
}
