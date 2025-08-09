import gamecodes from '../../assets/data/game-codes.json';

export type CountryCode = keyof typeof gamecodes | '';
