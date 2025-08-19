import { CountryCode } from "./code.type";

export interface CountryInfo {
  flag: CountryCode;
  country: {
    en: string;
    fr: string;
  };
  capital: {
    en: string[];
    fr: string[];
  };
  continent: {
    en: string;
    fr: string;
  };
  map_coordinates?: null[];
  immatriculate_plate?: null;
}