import { CivGroup } from "../../Types/CivGroups";
import { Civs } from "../../Types/Civs";

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
