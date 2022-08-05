import { UserDataStore } from "../../UserDataStore/UserDataStore";
import { CivGroup } from "../../Types/CivGroups";

export async function enableCivGroupCommand(
    userDataStore: UserDataStore,
    tenantId: string,
    civGroup: CivGroup
): Promise<string> {
    const userData = await userDataStore.load(tenantId);

    if (!userData.activeUserSettings.defaultDraftSettings.civGroups) {
        userData.activeUserSettings.defaultDraftSettings.civGroups = [];
    }

    if (userData.activeUserSettings.defaultDraftSettings.civGroups.includes(civGroup)) {
        return `\`${civGroup}\` is already being used.`;
    }
    userData.activeUserSettings.defaultDraftSettings.civGroups.push(civGroup);

    await userDataStore.save(tenantId, userData);
    return `\`${civGroup}\` will now be used in your drafts.`;
}
