import { CivGroups } from "../../Civs/CivGroups";
import { Civs } from "../../Civs/Civs";

export function civExists(civToBan: string) {
    const allCivs = CivGroups.reduce((acc, value) => acc.concat(Civs[value]), new Array<string>());
    return allCivs.includes(civToBan);
}
