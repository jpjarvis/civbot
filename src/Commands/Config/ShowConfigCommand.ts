import { UserSettings } from "../../UserData/UserSettings";

export function showConfigCommand(userSettings: UserSettings): string {
    let response = "";
    response += `Using civ groups: \`\`\`\n${userSettings.defaultDraftSettings?.civGroups?.join("\n")}\`\`\`` + "\n";
    if (userSettings.customCivs) {
        response += `Custom civs:\`\`\`\n${userSettings.customCivs.sort().join("\n")}\`\`\``;
    }
    return response;
}
