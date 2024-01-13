import { Expansions } from "../../Civs/Expansions";
import { Civs } from "../../Civs/Civs";

export function civExists(civToBan: string) {
    const allCivs = Expansions.reduce((acc, value) => acc.concat(Civs[value]), new Array<string>());
    return allCivs.includes(civToBan);
}
