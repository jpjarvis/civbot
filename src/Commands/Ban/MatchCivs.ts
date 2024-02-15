import { expansionsInGame } from "../../Civs/Expansions";
import { Civ, Civs, hasLeader } from "../../Civs/Civs";
import { CivGame } from "../../Civs/CivGames";

export function matchCivs(civString: string, civGame: CivGame): Civ[] {
    const allCivsInGame = expansionsInGame(civGame)
        .reduce((acc, value) => acc.concat(Civs[value]), new Array<Civ>())
        .filter(Boolean);

    return allCivsInGame.filter((civ) => {
        const lowercaseCivString = civString.toLowerCase();
        if (hasLeader(civ)) {
            if (
                civ.civ.toLowerCase().includes(lowercaseCivString) ||
                civ.leader.toLowerCase().includes(lowercaseCivString)
            ) {
                return true;
            }
        } else {
            if (civ.toLowerCase().includes(lowercaseCivString)) {
                return true;
            }
        }

        return false;
    });
}
