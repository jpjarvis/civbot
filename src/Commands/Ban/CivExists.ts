import {expansionsInGame} from "../../Civs/Expansions";
import { Civs } from "../../Civs/Civs";
import {CivGame} from "../../Civs/CivGames";

export function civExists(civToBan: string, civGame: CivGame) {
    const allCivsInGame = expansionsInGame(civGame).reduce((acc, value) => acc.concat(Civs[value]), new Array<string>());
    return allCivsInGame.includes(civToBan);
}
