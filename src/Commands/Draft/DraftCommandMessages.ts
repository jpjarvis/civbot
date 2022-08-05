import Messages from "../../Messages";
import { DraftCommandResult } from "./DraftCommand";
import { DraftEntry } from "./DraftTypes";

function getPlayerDraftString(draftEntry: DraftEntry): string {
    let response = `${draftEntry.player} `.padEnd(20, " ");
    for (let j = 0; j < draftEntry.civs.length - 1; j++) {
        response += `${draftEntry.civs[j]} / `;
    }
    response += `${draftEntry.civs[draftEntry.civs.length - 1]}`;
    return response;
}

export function generateDraftCommandOutputMessage(draftCommandResult: DraftCommandResult) {
    let message = "";
    const sendMessage = (m: string) => {
        message += m + "\n";
    };

    if (draftCommandResult.draftResult.isError) {
        if (draftCommandResult.draftResult.error == "no-players") {
            sendMessage(Messages.NoPlayers);
        } else if (draftCommandResult.draftResult.error == "not-enough-civs") {
            sendMessage(Messages.NotEnoughCivs);
        }
    } else {
        let draftString = draftCommandResult.draftResult.value.map((x) => getPlayerDraftString(x)).join("\n");

        if (draftString === "") {
            sendMessage(Messages.NoPlayers);
        } else {
            sendMessage(`Drafting for ${draftCommandResult.civGroupsUsed.map((cg) => `\`${cg}\``).join(", ")}`);
            sendMessage("```" + draftString + "```");
        }
    }

    return message;
}
