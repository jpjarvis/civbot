import { loadUserData, saveUserData } from "../../UserDataStore";

export async function removeCustomCivsCommand(tenantId: string, civs: string[]): Promise<string> {
    const userData = await loadUserData(tenantId);

    const failedCivs = civs.filter((c) => !userData.userSettings[userData.game].customCivs.includes(c));
    userData.userSettings[userData.game].customCivs = userData.userSettings[userData.game].customCivs.filter((c) => !civs.includes(c));

    await saveUserData(tenantId, userData);

    return createMessage(failedCivs, civs);
}

function createMessage(failedCivs: string[], civsRemoved: string[]) {
    let message: string = "";
    if (failedCivs.length > 0) {
        message += `Civ(s) \`${failedCivs.join(", ")}\` not found.\n`;
    }
    message += `Removed ${civsRemoved.length - failedCivs.length} custom civ(s).`;
    return message;
}
