import {Civs} from "./Civs";
import {CivGame} from "./CivGames";

export type CivGroup = keyof typeof Civs | "custom";
export const CivGroups = Object.keys(Civs).concat("custom") as CivGroup[];

const CivGroupMetadata: { [a in CivGroup]: { displayName: string; game: CivGame | "All" } } = {
    "civ6-extra": {displayName: "Standalone DLC Civs", game: "Civ 6"},
    "civ6-frontier": {displayName: "New Frontier Pass", game: "Civ 6"},
    "civ6-gs": {displayName: "Gathering Storm", game: "Civ 6"},
    "civ6-leaderpass": {displayName: "Leader Pass", game: "Civ 6"},
    "civ6-personas": {displayName: "Persona packs", game: "Civ 6"},
    "civ6-rnf": {displayName: "Rise & Fall", game: "Civ 6"},
    custom: {displayName: "Custom civs", game: "All"},
    lekmod: {displayName: "LEKMOD", game: "Civ 5"},
    "civ5-vanilla": {
        displayName: "Base game + DLC",
        game: "Civ 5"
    },
    "civ6-vanilla": {
        displayName: "Base game",
        game: "Civ 6"
    }
}

export function civGroupsInGame(game: CivGame) {
    return CivGroups.filter(x => CivGroupMetadata[x].game === game || CivGroupMetadata[x].game === "All")
}

export function displayName(civGroup: CivGroup) {
    return CivGroupMetadata[civGroup].displayName;
}

export function stringToCivGroup(string: string): CivGroup | undefined {
    return CivGroups.find((cg) => cg === string);
}
