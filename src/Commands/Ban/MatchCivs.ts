import {expansionsInGame} from "../../Civs/Expansions";
import {Civ, Civs, hasLeader} from "../../Civs/Civs";
import {CivGame} from "../../Civs/CivGames";

export function matchCivs(civString: string, civGame: CivGame): Civ[] {
    const allCivsInGame = expansionsInGame(civGame).reduce((acc, value) => acc.concat(Civs[value]), new Array<Civ>()).filter(Boolean);
    
    return allCivsInGame.filter(civ => {
        if (hasLeader(civ)) {
            if (civ.civ.includes(civString) || civ.leader.includes(civString)) {
                return true;
            } 
        }
        else {
            if (civ.includes(civString)) {
                return true;
            }
        }
        
        return false;
    });
}
