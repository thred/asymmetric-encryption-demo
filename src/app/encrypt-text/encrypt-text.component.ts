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
    selector: "app-encrypt-text",
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
    templateUrl: "./encrypt-text.component.html",
    styleUrls: ["./encrypt-text.component.scss"],
    host: { class: "two-columns with-divider" },
})
export class EncryptTextComponent {
    private static readonly QUOTES: string[] = [
        "Das Pferd frisst keinen Gurkensalat.",
        "Houston, wir haben ein Problem.",
        "Veni, vidi, vici.",
        "Ich denke, also bin ich.",
        "Der Mensch ist dem Menschen ein Wolf.",
        "Es ist vollbracht.",
        "Macht kaputt, was euch kaputt macht.",
        "A small step for a man, a giant leap for mankind.",
        "Die Gedanken sind frei.",
        "Der Weg ist das Ziel.",
        "Der Apfel fällt nicht weit vom Stamm.",
        "Der Fisch stinkt vom Kopf her.",
        "Der Klügere gibt nach.",
        "Der Teufel steckt im Detail.",
        "Der frühe Vogel fängt den Wurm.",
        "Der Glaube versetzt Berge.",
        "Der Ton macht die Musik.",
        "Der Zweck heiligt die Mittel.",
        "You shall not pass!",
        "Speak friend and enter.",
        "May the Force be with you.",
        "I find your lack of faith disturbing.",
        "It's a trap!",
        "I am your father.",
        "The Force will be with you, always.",
        "I've got a bad feeling about this.",
        "In my experience, there is no such thing as luck.",
        "The ability to speak does not make you intelligent.",
        "Live long and prosper.",
        "Resistance is futile.",
        "Beam me up, Scotty.",
        "Set phasers to stun.",
        "You know what they call a Quarter Pounder with Cheese in Paris?",
        "Zed's dead, baby. Zed's dead.",
    ];

    readonly successRipple = viewChild("successRipple", { read: MatRipple });

    readonly publicKey = input.required<PublicKey>();

    readonly privateKey = input.required<PrivateKey>();

    readonly linked = persistent<boolean>("asymmetric-encryption-demo.encrypt-number.linked", () => true);

    readonly sourceText = persistent<string>(
        "asymmetric-encryption-demo.encrypt-number.source-text",
        () => EncryptTextComponent.QUOTES[Math.floor(Math.random() * EncryptTextComponent.QUOTES.length)],
    );

    readonly sourceBytes = computed(() => Utils.stringToBytes(this.sourceText()));

    readonly sourceBits = computed(() => Utils.bytesToBits(this.sourceBytes()));

    readonly sourceNumbers = computed(() =>
        Utils.bitsToNumbers(this.sourceBits(), Utils.bitLength(this.publicKey().n) - 1),
    );

    readonly encodedSourceNumbers = computed(() =>
        Utils.encodeNumbers(this.sourceNumbers(), this.publicKey().e, this.publicKey().n),
    );

    readonly encodedSourceBits = computed(() =>
        Utils.numbersToBits(this.encodedSourceNumbers(), Utils.bitLength(this.publicKey().n)),
    );

    readonly encodedSourceBytes = computed(() => Utils.bitsToBytes(this.encodedSourceBits()));

    readonly encodedSourceText = computed(() => Utils.bytesToBase64(this.encodedSourceBytes()));

    readonly targetText = persistent<string>("asymmetric-encryption-demo.encrypt-number.target-text", () => "");

    readonly targetBytes = computed(() => Utils.base64ToBytes(this.targetText()));

    readonly targetBits = computed(() => Utils.bytesToBits(this.targetBytes()));

    readonly targetNumbers = computed(() =>
        Utils.bitsToNumbers(this.targetBits(), Utils.bitLength(this.privateKey().n)),
    );

    readonly decodedTargetNumbers = computed(() =>
        Utils.decodeNumbers(this.targetNumbers(), this.privateKey().d, this.privateKey().n),
    );

    readonly decodedTargetBits = computed(() =>
        Utils.numbersToBits(this.decodedTargetNumbers(), Utils.bitLength(this.privateKey().n) - 1),
    );

    readonly decodedTargetBytes = computed(() => Utils.bitsToBytes(this.decodedTargetBits()));

    readonly decodedTargetText = computed(() => Utils.bytesToString(this.decodedTargetBytes()));

    constructor() {
        effect(() => {
            if (this.linked()) {
                this.targetText.set(this.encodedSourceText());

                this.successRipple()?.launch({
                    centered: true,
                });
            }
        });
    }

    reset(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.linked.reset();
        this.targetText.reset();
        this.sourceText.reset();
    }

    toggleLinked(): void {
        this.linked.update((l) => !l);
    }
}
