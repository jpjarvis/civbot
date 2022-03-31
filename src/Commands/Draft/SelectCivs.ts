import {CivGroup} from "../../Types/CivGroups";
import {CivData} from "../../CivData";

export function selectCivs(groups: Set<CivGroup>, civData: CivData, customCivs: string[]): string[] {
    return Array.from(groups)
        .map((civGroup) => {
            if (civGroup === "custom") {
                return customCivs;
            }
            return civData.civs[civGroup];
        })
        .reduce((prev: string[], current: string[]) => current.concat(prev), []);
}

