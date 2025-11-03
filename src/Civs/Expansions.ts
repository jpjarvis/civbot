import { CivGame } from "./CivGames";

export const Expansions = [
    "civ5-vanilla",
    "lekmod",
    "civ6-vanilla",
    "civ6-rnf",
    "civ6-gs",
    "civ6-frontier",
    "civ6-leaderpass",
    "civ6-extra",
    "civ6-personas",
    "civ6-bbg"
] as const;

export type Expansion = (typeof Expansions)[number];

const ExpansionMetadata: { [a in Expansion]: { displayName: string; game: CivGame} } = {
    "civ5-vanilla": { displayName: "Base game + DLC", game: "Civ 5" },
    lekmod: { displayName: "LEKMOD", game: "Civ 5" },

    "civ6-vanilla": { displayName: "Base game", game: "Civ 6" },
    "civ6-rnf": { displayName: "Rise & Fall", game: "Civ 6" },
    "civ6-gs": { displayName: "Gathering Storm", game: "Civ 6" },
    "civ6-frontier": { displayName: "New Frontier Pass", game: "Civ 6" },
    "civ6-leaderpass": { displayName: "Leader Pass", game: "Civ 6" },
    "civ6-extra": { displayName: "Standalone DLC Civs", game: "Civ 6" },
    "civ6-personas": { displayName: "Persona packs", game: "Civ 6" },
    "civ6-bbg": { displayName: "BBG Expanded", game: "Civ 6" }
};

export function expansionsInGame(game: CivGame) {
    return Expansions.filter((x) => ExpansionMetadata[x].game === game);
}

export function gameOfExpansion(expansion: Expansion) {
    return ExpansionMetadata[expansion].game;
}

export function displayName(expansion: Expansion) {
    return ExpansionMetadata[expansion].displayName;
}

export function stringToExpansion(string: string): Expansion | undefined {
    return Expansions.find((ex) => ex === string);
}
