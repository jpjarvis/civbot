import { UserSettings } from "../../UserData/UserSettings";
import {displayName} from "../../Civs/CivGroups";

export function showConfigCommand(userSettings: UserSettings): string {
    let response = "";
    response += `Using civ groups: \`\`\`\n${userSettings.defaultDraftSettings?.civGroups?.map(displayName).join("\n")}\`\`\`` + "\n";
    if (userSettings.customCivs) {
        response += `Custom civs:\`\`\`\n${userSettings.customCivs.sort().join("\n")}\`\`\``;
    }
    return response;
}
