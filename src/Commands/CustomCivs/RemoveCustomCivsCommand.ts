import {UserDataStore} from "../../UserDataStore/UserDataStore";

export async function removeCustomCivsCommand(userDataStore: UserDataStore, tenantId: string, civs: string[]): Promise<string> {
    const userData = await userDataStore.load(tenantId);
    const originalNumberOfCivs = userData.activeUserSettings.customCivs.length;

    const failedCivs = civs.filter(c => !userData.activeUserSettings.customCivs.includes(c));
    userData.activeUserSettings.customCivs = userData.activeUserSettings.customCivs.filter(c => !civs.includes(c));

    await userDataStore.save(tenantId, userData);

    let message: string = "";
    if (failedCivs.length > 0) {
        message += `Civ(s) \`${failedCivs.join(", ")}\` not found.\n`;
    }
    message += `Removed ${originalNumberOfCivs - userData.activeUserSettings.customCivs.length} custom civ(s).`;
    return message;
}