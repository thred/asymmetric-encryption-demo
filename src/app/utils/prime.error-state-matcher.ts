import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Utils } from "./utils";

export class PrimeErrorStateMatcher implements ErrorStateMatcher {
    constructor(readonly min: number) {}

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control?.value === undefined || control.value < this.min || !Utils.isPrime(control.value);
    }
}
