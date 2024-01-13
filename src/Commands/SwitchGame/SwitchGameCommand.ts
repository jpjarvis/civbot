import {loadUserData, saveUserData} from "../../UserDataStore";
import {CivGame} from "../../Civs/CivGames";

export async function switchGameCommand(tenantId: string) {
    const userData = await loadUserData(tenantId);
    const game: CivGame = userData.game === "Civ V" ? "Civ VI" : "Civ V";
    await saveUserData(tenantId, {...userData, game});
    return game;
}