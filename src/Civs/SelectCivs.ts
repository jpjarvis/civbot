import { Expansion } from "./Expansions";
import {Civ, Civs, civsEqual} from "./Civs";

export function selectCivs(expansions: Expansion[], excludedCivs: Civ[]): Civ[] {
    return Array.from(new Set(expansions))
        .map((expansion) => Civs[expansion])
        .reduce((prev: Civ[], current: Civ[]) => current.concat(prev), [])
        .filter((x) => !excludedCivs.some(y => civsEqual(x, y)));
}
