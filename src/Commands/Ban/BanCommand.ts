import { loadUserData, saveUserData } from "../../UserDataStore";
import {matchCivs} from "./CivExists";
import {Civ, hasLeader} from "../../Civs/Civs";

function renderCiv(civ: Civ): string {
    if (!hasLeader(civ)) {
        return civ;
    }

    return `${civ.leader} - ${civ.civ}`;
}

export async function banCommand(tenantId: string, civToBan: string) {
    const userData = await loadUserData(tenantId);
    
    const matchedCivs = matchCivs(civToBan, userData.game);
    
    if (matchedCivs.length === 0) {
        return `No civ called ${civToBan} exists in ${userData.game}.`;
    }
    else if (matchedCivs.length > 1) {
        return `
"${civToBan}" matches ${matchedCivs.length} civs:
\`\`\`${matchedCivs.map(renderCiv).join("\n")}\`\`\`
Please be more specific.`
    }
    
    userData.userSettings[userData.game].bannedCivs = userData.userSettings[userData.game].bannedCivs.concat(civToBan);
    await saveUserData(tenantId, userData);
    return `\`${renderCiv(matchedCivs[0])}\` has been banned. It will no longer appear in your drafts.`;
}
