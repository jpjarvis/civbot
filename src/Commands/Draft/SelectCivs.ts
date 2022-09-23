import { CivGroup } from "../../Civs/CivGroups";
import { Civs } from "../../Civs/Civs";

export function selectCivs(groups: Set<CivGroup>, customCivs: string[], bannedCivs: string[]): string[] {
    return Array.from(groups)
        .map((civGroup) => {
            if (civGroup === "custom") {
                return customCivs;
            }
            return Civs[civGroup];
        })
        .reduce((prev: string[], current: string[]) => current.concat(prev), [])
        .filter(x => !bannedCivs.includes(x));
}
