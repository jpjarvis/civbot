import { UserData } from "../../UserData/UserData";
import {CivId} from "../../Civs/Civs";
import { saveUserData } from "../../UserDataStore";

export async function banCivs(serverId: string, userData: UserData, civsToBan: CivId[]) {
    userData.userSettings[userData.game].bannedCivs = userData.userSettings[userData.game].bannedCivs.concat(civsToBan);
    await saveUserData(serverId, userData);
}

export async function unbanCivs(serverId: string, userData: UserData, civsToBan: CivId[]) {
    userData.userSettings[userData.game].bannedCivs = userData.userSettings[userData.game].bannedCivs.filter(
        (civ) => !civsToBan.some((x) => civ === x),
    );
    await saveUserData(serverId, userData);
}
