import Messages from "../../Messages";
import { Draft, DraftEntry, DraftError } from "./DraftTypes";
import { displayName, Expansion } from "../../Civs/Expansions";
import { Result } from "../../Functional/Result";
import { renderCivShort } from "../../Civs/Civs";

function renderDraftEntry(draftEntry: DraftEntry): string {
    let response = `${draftEntry.player} `.padEnd(20, " ");
    for (let j = 0; j < draftEntry.civs.length - 1; j++) {
        response += `${renderCivShort(draftEntry.civs[j])} / `;
    }
    response += `${renderCivShort(draftEntry.civs[draftEntry.civs.length - 1])}`;
    return response;
}

function renderDraft(draft: Draft) {
    return `\`\`\`${draft.map(renderDraftEntry).join("\n")}\`\`\``;
}

export function generateDraftCommandOutputMessage(expansionsUsed: Expansion[], draftResult: Result<Draft, DraftError>) {
    let message = "";
    const sendMessage = (m: string) => {
        message += m + "\n";
    };

    if (draftResult.isError) {
        if (draftResult.error == "no-players") {
            sendMessage(Messages.NoPlayers);
        } else if (draftResult.error == "not-enough-civs") {
            sendMessage(Messages.NotEnoughCivs);
        }
    } else {
        if (renderDraft(draftResult.value) === "") {
            sendMessage(Messages.NoPlayers);
        } else {
            sendMessage(`Drafting for ${expansionsUsed.map((cg) => `\`${displayName(cg)}\``).join(", ")}`);
            sendMessage(renderDraft(draftResult.value));
        }
    }

    return message;
}
