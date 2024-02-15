import { UserData } from "../../UserData/UserData";
import { Civ, civsEqual } from "../../Civs/Civs";
import { saveUserData } from "../../UserDataStore";

export async function banCivs(serverId: string, userData: UserData, civsToBan: Civ[]) {
    userData.userSettings[userData.game].bannedCivs = userData.userSettings[userData.game].bannedCivs.concat(civsToBan);
    await saveUserData(serverId, userData);
}

export async function unbanCivs(serverId: string, userData: UserData, civsToBan: Civ[]) {
    userData.userSettings[userData.game].bannedCivs = userData.userSettings[userData.game].bannedCivs.filter(
        (civ) => !civsToBan.some((x) => civsEqual(civ, x)),
    );
    await saveUserData(serverId, userData);
}

export function isBanned(civ: Civ, userData: UserData) {
    return userData.userSettings[userData.game].bannedCivs.some((x) => civsEqual(x, civ));
}
