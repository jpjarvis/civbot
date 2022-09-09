import {loadUserData, saveUserData} from "../../UserDataStore";
import {Civs} from "../../Types/Civs";
import {CivGroups} from "../../Types/CivGroups";

export async function banCommand(tenantId: string, civToBan: string) {
    if (!civExists(civToBan)) {
        return `No civ called ${civToBan} exists.`
    }
    
    const userData = await loadUserData(tenantId);
    userData.activeUserSettings.bannedCivs = userData.activeUserSettings.bannedCivs.concat(civToBan);
    await saveUserData(tenantId, userData);
    return `${civToBan} has been banned. It will no longer appear in your drafts.`
}

function civExists(civToBan: string) {
    const allCivs = CivGroups.reduce((acc, value) => acc.concat(Civs[value]), new Array<string>());
    return allCivs.includes(civToBan);
}