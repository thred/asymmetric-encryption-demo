import { Component, computed, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRipple, MatRippleModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { Subject } from "rxjs";
import { CopyDirective } from "../directives/copy.directive";
import { EncryptNumberComponent } from "../encrypt-number/encrypt-number.component";
import { EncryptTextComponent } from "../encrypt-text/encrypt-text.component";
import { GenerateKeyPairComponent } from "../generate-key-pair/generate-key-pair.component";
import { KeyErrorStateMatcher } from "../utils/key.error-state-matcher";
import { persistent } from "../utils/persistent.signal";
import { Utils } from "../utils/utils";

type Section = "none" | "generate-key-pair" | "encrypt-number" | "encrypt-text";

@Component({
    selector: "app-rsa",
    templateUrl: "./rsa-page.component.html",
    styleUrl: "./rsa-page.component.scss",
    imports: [
        CopyDirective,
        EncryptNumberComponent,
        EncryptTextComponent,
        FormsModule,
        GenerateKeyPairComponent,
        MatButtonModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatRippleModule,
    ],
})
export class RsaPageComponent {
    readonly publicKeyRipple = viewChild("publicKeyRipple", { read: MatRipple });
    readonly privateKeyRipple = viewChild("privateKeyRipple", { read: MatRipple });

    readonly encryptNumberComponent = viewChild(EncryptNumberComponent);
    readonly encryptTextComponent = viewChild(EncryptTextComponent);

    readonly section = persistent<Section>("asymmetric-encryption-demo.rsa.section", () => "generate-key-pair");

    readonly publicKeyString = persistent<string>("asymmetric-encryption-demo.rsa.public-key", () => "91, 23");

    readonly privateKeyString = persistent<string>("asymmetric-encryption-demo.rsa.private-key", () => "91, 47");

    readonly publicKey = computed(() => Utils.parsePublicKey(this.publicKeyString()));

    readonly privateKey = computed(() => Utils.parsePrivateKey(this.privateKeyString()));

    readonly publicKeyErrorStateMatcher = new KeyErrorStateMatcher();

    readonly privateKeyErrorStateMatcher = new KeyErrorStateMatcher();

    readonly highlightPublicKey = new Subject<void>();

    readonly highlightPrivateKey = new Subject<void>();

    generateKeyPair() {
        this.section.set("generate-key-pair");
    }

    highlightPublicKeyField() {
        this.publicKeyRipple()?.launch({});
    }

    highlightPrivateKeyField() {
        this.privateKeyRipple()?.launch({});
    }
}
