import {displayName} from "../../Civs/Expansions";
import {UserData} from "../../UserData/UserData";

export function showConfigCommand(userData: UserData): string {
    let response = "";

    response += `CivBot is drafting for **${userData.game}**.\n*To change this, use \`/switch-game\`.*\n\n`

    const activeSettings = userData.userSettings[userData.game];
    response += `Enabled expansions: \`\`\`\n${activeSettings.defaultDraftSettings?.expansions?.map(displayName).join("\n")}\`\`\`` + "\n";
    
    if (activeSettings.defaultDraftSettings.expansions?.includes("custom")) {
        if (activeSettings.customCivs.length === 0) {
            response += "No custom civs are defined. Use \`/custom-civs\` to add some.\n\n"
        } else if (activeSettings.customCivs.length > 20) {
            response += `${activeSettings.customCivs.length} custom civs are defined. To see the full list, use \`/custom-civs\`.\n\n`
        } else {
            response += `${activeSettings.customCivs.length} custom civs are defined:\`\`\`\n${activeSettings.customCivs.sort().join("\n")}\`\`\`\n`;
        }

    }
    
    if (activeSettings.bannedCivs?.length > 0) {
        response += `Banned civs:\`\`\`\n${activeSettings.bannedCivs.sort().join("\n")}\`\`\``;
    }


    return response;
}
