export interface GameSave {
    roundState: {
        current: number;
        total: number;
        endRound: boolean;
        endGame: boolean;
        countryCode: string | null;
        correctCountryCode: string | null;
    };
    timeLimit: {
        value: number;
        datetime: string | null;
    };
    gamemode: {
        current: string | null;
        available: string[];
    };
    subgamemode: {
        current: string | null;
        available: string[];
    };
    regions: string[];
}
