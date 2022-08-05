import { UserDataStore } from "../../UserDataStore/UserDataStore";
import { CivGroup } from "../../Types/CivGroups";

export async function disableCivGroupCommand(
    userDataStore: UserDataStore,
    tenantId: string,
    civGroup: CivGroup
): Promise<string> {
    const userData = await userDataStore.load(tenantId);

    if (!userData.activeUserSettings.defaultDraftSettings.civGroups) {
        userData.activeUserSettings.defaultDraftSettings.civGroups = [];
    }

    const toRemoveIndex = userData.activeUserSettings.defaultDraftSettings.civGroups.indexOf(civGroup);
    if (!userData.activeUserSettings.defaultDraftSettings.civGroups.includes(civGroup)) {
        return `\`${civGroup}\` is not being used.`;
    }
    userData.activeUserSettings.defaultDraftSettings.civGroups.splice(toRemoveIndex, 1);
    await userDataStore.save(tenantId, userData);

    return `\`${civGroup}\` will no longer be used in your drafts.`;
}
