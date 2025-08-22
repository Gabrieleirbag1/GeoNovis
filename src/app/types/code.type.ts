import worldCodes from '../../assets/data/world-codes.json';

export type CountryCode = keyof typeof worldCodes | '';
