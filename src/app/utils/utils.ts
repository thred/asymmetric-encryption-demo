export type PublicKey = {
    n: number;
    e: number;
};

export type PrivateKey = {
    n: number;
    d: number;
};

export class Utils {
    static readonly KEY_FORMAT = /^\d+,\s*\d+$/;

    private static readonly ENCODER = new TextEncoder();
    private static readonly DECODER = new TextDecoder();

    static isValidKey(key: string): boolean {
        return this.KEY_FORMAT.test(key);
    }

    static parsePublicKey(key: string): PublicKey | undefined {
        const isValidFormat = this.isValidKey(key);

        if (!isValidFormat) {
            return undefined;
        }

        const [n, e] = key.split(",").map(Number);

        return { n, e };
    }

    static parsePrivateKey(key: string): PrivateKey | undefined {
        const isValidFormat = this.isValidKey(key);

        if (!isValidFormat) {
            return undefined;
        }

        const [n, d] = key.split(",").map(Number);

        return { n, d };
    }

    static stringToBytes(str: string): Uint8Array {
        return this.ENCODER.encode(str);
    }

    static bytesToString(numbers: Uint8Array): string {
        // trim trailing 0 bytes (did occur due to different bit length when converting)
        while (numbers[numbers.length - 1] === 0) {
            numbers = numbers.slice(0, -1);
        }

        return this.DECODER.decode(numbers);
    }

    static bytesToBase64(bytes: Uint8Array): string {
        let binary = "";
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    static base64ToBytes(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    static bytesToBits(bytes: Uint8Array): string {
        return this.numbersToBits(Array.from(bytes), 8);
    }

    static bitsToBytes(bits: string): Uint8Array {
        return new Uint8Array(this.bitsToNumbers(bits, 8));
    }

    static numbersToBits(numbers: number[], bitLength: number): string {
        let bits = "";

        for (const number of numbers) {
            if (number >= 2 ** bitLength) {
                console.error(`NumbersToBits: Number ${number} is too large for ${bitLength} bits`);
            }

            bits += number.toString(2).padStart(bitLength, "0");
        }

        return bits;
    }

    static bitsToNumbers(bits: string, bitLength: number): number[] {
        const numbers: number[] = [];

        bits = bits.padEnd(Math.ceil(bits.length / bitLength) * bitLength, "0");

        for (let i = 0; i < bits.length; i += bitLength) {
            const number = parseInt(bits.slice(i, i + bitLength), 2);

            numbers.push(number);
        }

        return numbers;
    }

    static bitLength(maxNumber: number): number {
        return Math.ceil(Math.log2(maxNumber));
    }

    static encodeNumber(number: number, e: number, n: number): number {
        return this.modPow(number, e, n);
    }

    static decodeNumber(number: number, d: number, n: number): number {
        return this.modPow(number, d, n);
    }

    static encodeNumbers(numbers: number[], e: number, n: number): number[] {
        return numbers.map((number) => this.encodeNumber(number, e, n));
    }

    static decodeNumbers(numbers: number[], d: number, n: number): number[] {
        return numbers.map((number) => this.decodeNumber(number, d, n));
    }

    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static randomPrime(min: number, max: number): number {
        let prime = 0;
        let attempts = 0;

        while (!this.isPrime(prime)) {
            prime = Math.floor(Math.random() * (max - min)) + min;

            attempts++;

            if (attempts > 100) {
                console.error(`Failed to find a prime number between ${min} and ${max}`);

                return NaN;
            }
        }

        return prime;
    }

    static isPrime(num: number): boolean {
        if (num <= 1) return false;

        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }

        return true;
    }

    static randomCoprime(min: number, max: number): number {
        let coprime = 0;
        let attempts = 0;

        while (!this.isCoprime(coprime, max)) {
            coprime = Math.floor(Math.random() * (max - min)) + min;

            attempts++;

            if (attempts > 100) {
                console.error(`Failed to find a coprime number between ${min} and ${max}`);

                return NaN;
            }
        }

        return coprime;
    }

    static isCoprime(a: number, b: number): boolean {
        return a < b && this.gcd(a, b) === 1;
    }

    static gcd(a: number, b: number): number {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }

        return a;
    }

    static modInverse(a: number, m: number): number {
        a = a % m;

        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) {
                return x;
            }
        }

        return NaN; // No modular inverse exists
    }

    static modPow(base: number, exponent: number, modulus: number): number {
        let result = 1;

        base = base % modulus;

        while (exponent > 0) {
            if ((exponent & 1) === 1) {
                result = (result * base) % modulus;
            }
            exponent = exponent >> 1;
            base = (base * base) % modulus;
        }

        return result;
    }
}
