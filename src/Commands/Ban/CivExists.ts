import { CivGroups } from "../../Types/CivGroups";
import { Civs } from "../../Types/Civs";

export function civExists(civToBan: string) {
    const allCivs = CivGroups.reduce((acc, value) => acc.concat(Civs[value]), new Array<string>());
    return allCivs.includes(civToBan);
}
