import {Civs} from "./Civs";
import {CivGame} from "./CivGames";

export type Expansion = keyof typeof Civs | "custom";
export const Expansions = Object.keys(Civs).concat("custom") as Expansion[];

const ExpansionMetadata: { [a in Expansion]: { displayName: string; game: CivGame | "All" } } = {
    "civ5-vanilla": {displayName: "Base game + DLC", game: "Civ 5"},
    "lekmod": {displayName: "LEKMOD", game: "Civ 5"},

    "civ6-vanilla": {displayName: "Base game", game: "Civ 6"},
    "civ6-rnf": {displayName: "Rise & Fall", game: "Civ 6"},
    "civ6-gs": {displayName: "Gathering Storm", game: "Civ 6"},
    "civ6-frontier": {displayName: "New Frontier Pass", game: "Civ 6"},
    "civ6-leaderpass": {displayName: "Leader Pass", game: "Civ 6"},
    "civ6-extra": {displayName: "Standalone DLC Civs", game: "Civ 6"},
    "civ6-personas": {displayName: "Persona packs", game: "Civ 6"},

    "custom": {displayName: "Custom civs", game: "All"},
}

export function expansionsInGame(game: CivGame) {
    return Expansions.filter(x => ExpansionMetadata[x].game === game || ExpansionMetadata[x].game === "All")
}

export function displayName(expansion: Expansion) {
    return ExpansionMetadata[expansion].displayName;
}

export function stringToExpansion(string: string): Expansion | undefined {
    return Expansions.find((ex) => ex === string);
}
