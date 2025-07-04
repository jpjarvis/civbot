import { Expansion } from "./Expansions";
import {CivId, Civs} from "./Civs";

export function selectCivIds(expansions: Expansion[], excludedCivs: CivId[]): CivId[] {
    return Array.from(new Set(expansions))
        .map((expansion) => Civs[expansion])
        .reduce((prev: CivId[], current: CivId[]) => current.concat(prev), [])
        .filter((x) => !excludedCivs.some(y => x === y));
}
