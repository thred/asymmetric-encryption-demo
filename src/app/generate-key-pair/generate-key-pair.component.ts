import { Component, computed, ElementRef, model, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CoprimeErrorStateMatcher } from "../utils/coprime.error-state-matcher";
import { persistent } from "../utils/persistent.signal";
import { PrimeErrorStateMatcher } from "../utils/prime.error-state-matcher";
import { Utils } from "../utils/utils";

@Component({
    selector: "app-generate-key-pair",
    imports: [FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
    templateUrl: "./generate-key-pair.component.html",
    styleUrl: "./generate-key-pair.component.scss",
})
export class GenerateKeyPairComponent {
    private readonly form = viewChild.required<ElementRef<HTMLFormElement>>("form");

    readonly p = persistent<number>("asymmetric-encryption-demo.p", () => 7);

    readonly q = persistent<number>("asymmetric-encryption-demo.q", () => 13);

    readonly pErrorStateMatcher = new PrimeErrorStateMatcher(3);

    readonly qErrorStateMatcher = new PrimeErrorStateMatcher(3);

    readonly pValid = computed(() => this.p() >= 3 && Utils.isPrime(this.p()));

    readonly qValid = computed(() => this.q() >= 3 && Utils.isPrime(this.q()));

    readonly n = computed(() => {
        const p = this.p();
        const q = this.q();

        return p * q;
    });

    readonly phi = computed(() => {
        const p = this.p();
        const q = this.q();

        return (p - 1) * (q - 1);
    });

    readonly e = persistent<number>("asymmetric-encryption-demo.e", () => 23);

    readonly eErrorStateMatcher = computed(() => new CoprimeErrorStateMatcher(this.phi() ?? 0));

    readonly eValid = computed(() => this.e() >= 2 && Utils.isCoprime(this.e(), this.phi()));

    readonly d = computed(() => {
        const e = this.e();
        const phi = this.phi();

        return Utils.modInverse(e, phi);
    });

    readonly computedPublicKey = computed(() => {
        const n = this.n();
        const e = this.e();

        return !isNaN(n) && !isNaN(e) ? `${n}, ${e}` : undefined;
    });

    readonly computedPrivateKey = computed(() => {
        const n = this.n();
        const d = this.d();

        return !isNaN(n) && !isNaN(d) ? `${n}, ${d}` : undefined;
    });

    readonly publicKey = model<string>();

    readonly privateKey = model<string>();

    readonly canUpdate = computed(
        () =>
            this.pValid() &&
            this.qValid() &&
            this.eValid() &&
            this.computedPublicKey() !== undefined &&
            this.computedPrivateKey() !== undefined,
    );

    readonly shouldUpdate = computed(
        () =>
            this.canUpdate() &&
            (this.computedPublicKey() !== this.publicKey() || this.computedPrivateKey() !== this.privateKey()),
    );

    randomizeP(): void {
        this.p.set(Utils.randomPrime(5, 100));
    }

    randomizeQ(): void {
        this.q.set(Utils.randomPrime(7, 100));
    }

    randomizeE(): void {
        const phi = this.phi();

        this.e.set(Utils.randomCoprime(2, phi));
    }

    generateKeyPair(): void {
        const n = this.n();
        const e = this.e();
        const d = this.d();

        if (n !== undefined && e !== undefined && d !== undefined) {
            this.publicKey.set(`${n}, ${e}`);
            this.privateKey.set(`${n}, ${d}`);
        }
    }

    randomize(event: Event): void {
        event?.preventDefault();
        event?.stopPropagation();

        this.randomizeP();
        this.randomizeQ();
        this.randomizeE();

        this.generateKeyPair();
    }

    reset(event: Event): void {
        event?.preventDefault();
        event?.stopPropagation();

        this.p.reset();
        this.q.reset();
        this.e.reset();

        this.generateKeyPair();
    }
}
