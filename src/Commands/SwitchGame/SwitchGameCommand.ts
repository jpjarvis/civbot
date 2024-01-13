import {loadUserData, saveUserData} from "../../UserDataStore";
import {CivGame} from "../../Civs/CivGames";

export async function switchGameCommand(tenantId: string) {
    const userData = await loadUserData(tenantId);
    const game: CivGame = userData.game === "Civ 5" ? "Civ 6" : "Civ 5";
    await saveUserData(tenantId, {...userData, game});
    return game;
}