import { Expansion } from "./Expansions";
import { Civ, Civs } from "./Civs";

export function selectCivs(expansions: Expansion[], excludedCivs: Civ[]): Civ[] {
    return Array.from(new Set(expansions))
        .map((expansion) => Civs[expansion])
        .reduce((prev: Civ[], current: Civ[]) => current.concat(prev), [])
        .filter((x) => !excludedCivs.includes(x));
}
