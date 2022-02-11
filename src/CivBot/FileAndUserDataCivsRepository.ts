import {CivGroup} from "../Draft/Types/CivGroups";
import UserData from "./UserData";
import CivData from "../Draft/CivData";

export async function getCivs(groups: Set<CivGroup>, userData: UserData, civData: CivData): Promise<string[]> {
    return Array.from(groups)
        .map((civGroup) => {
            if (civGroup === "custom") {
                return userData.customCivs;
            }
            return civData.civs[civGroup];
        })
        .reduce((prev: string[], current: string[]) => current.concat(prev), []);
}

