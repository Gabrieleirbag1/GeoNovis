import { CountryCode } from "./code.type";

export interface Country {
    code: CountryCode;
    name: string;
    capital: string;
    continent: string;
}