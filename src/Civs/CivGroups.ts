import {Civs} from "./Civs";
import {CivGame} from "./CivGames";

export type CivGroup = keyof typeof Civs | "custom";
export const CivGroups = Object.keys(Civs).concat("custom") as CivGroup[];

const CivGroupMetadata: { [a in CivGroup]: { displayName: string; game: CivGame | "All" } } = {
    "civ6-extra": {displayName: "Standalone DLC Civs", game: "Civ VI"},
    "civ6-frontier": {displayName: "New Frontier Pass", game: "Civ VI"},
    "civ6-gs": {displayName: "Gathering Storm", game: "Civ VI"},
    "civ6-leaderpass": {displayName: "Leader Pass", game: "Civ VI"},
    "civ6-personas": {displayName: "Persona packs", game: "Civ VI"},
    "civ6-rnf": {displayName: "Rise & Fall", game: "Civ VI"},
    custom: {displayName: "Custom civs", game: "All"},
    lekmod: {displayName: "LEKMOD", game: "Civ V"},
    "civ5-vanilla": {
        displayName: "Vanilla",
        game: "Civ V"
    },
    "civ6-vanilla": {
        displayName: "Vanilla",
        game: "Civ VI"
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
