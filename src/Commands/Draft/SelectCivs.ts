import { Expansion } from "../../Civs/Expansions";
import {Civ, Civs} from "../../Civs/Civs";

export function selectCivs(expansions: Expansion[], customCivs: string[], bannedCivs: Civ[]): Civ[] {
    return Array.from(new Set(expansions))
        .map((expansion) => {
            if (expansion === "custom") {
                return customCivs;
            }
            return Civs[expansion];
        })
        .reduce((prev: Civ[], current: Civ[]) => current.concat(prev), [])
        .filter(x => !bannedCivs.includes(x));
}
