import { Expansion } from "../../Civs/Expansions";
import { Civs } from "../../Civs/Civs";

export function selectCivs(expansions: Set<Expansion>, customCivs: string[], bannedCivs: string[]): string[] {
    return Array.from(expansions)
        .map((expansion) => {
            if (expansion === "custom") {
                return customCivs;
            }
            return Civs[expansion];
        })
        .reduce((prev: string[], current: string[]) => current.concat(prev), [])
        .filter(x => !bannedCivs.includes(x));
}
