import { UserSettings } from "../../UserData/UserSettings";
import {displayName} from "../../Civs/Expansions";

export function showConfigCommand(userSettings: UserSettings): string {
    let response = "";
    response += `Using expansions: \`\`\`\n${userSettings.defaultDraftSettings?.expansions?.map(displayName).join("\n")}\`\`\`` + "\n";
    if (userSettings.customCivs) {
        response += `Custom civs:\`\`\`\n${userSettings.customCivs.sort().join("\n")}\`\`\``;
    }
    return response;
}
