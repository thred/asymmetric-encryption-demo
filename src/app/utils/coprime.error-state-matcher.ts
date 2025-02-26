import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Utils } from "./utils";

export class CoprimeErrorStateMatcher implements ErrorStateMatcher {
    constructor(readonly other: number) {}

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return (
            control?.value === undefined ||
            control.value < 2 ||
            control.value >= this.other ||
            !Utils.isCoprime(control.value, this.other)
        );
    }
}
