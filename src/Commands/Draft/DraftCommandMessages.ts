import Messages from "../../Messages";
import { Draft, DraftEntry, DraftError } from "./DraftTypes";
import { displayName, Expansion } from "../../Civs/Expansions";
import { Result } from "../../Functional/Result";
import { renderCivShort } from "../../Civs/Civs";
import { CivGame } from "../../Civs/CivGames";

export function generateDraftCommandOutputMessage(
    game: CivGame,
    expansionsUsed: Expansion[],
    draftResult: Result<Draft, DraftError>,
) {
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
            sendMessage(`Drafting for ${game} with ${expansionsUsed.map((cg) => `\`${displayName(cg)}\``).join(", ")}`);
            sendMessage(renderDraft(draftResult.value));
        }
    }

    return message;
}

function renderDraft(draft: Draft) {
    return `\`\`\`${draft.map(renderDraftEntry).join("\n")}\`\`\``;
}

function renderDraftEntry(draftEntry: DraftEntry): string {
    return `${`${draftEntry.player}`.padEnd(20, " ")} ${draftEntry.civs.map(renderCivShort).join(" / ")}`;
}
