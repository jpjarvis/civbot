import Messages from "../../Messages";
import { Draft, DraftEntry, DraftError } from "./DraftTypes";
import { displayName, Expansion } from "../../Civs/Expansions";
import { Result } from "../../Functional/Result";
import {getCiv, renderCivShort} from "../../Civs/Civs";
import { CivGame } from "../../Civs/CivGames";

export function generateDraftMessage(
    game: CivGame,
    expansionsUsed: Expansion[],
    numberOfCustomCivs: number,
    draftResult: Result<Draft, DraftError>
) {
    let message = "";
    const sendMessage = (m: string) => {
        message += m + "\n";
    };

    if (draftResult.isError) {
        if (draftResult.error === "no-players") {
            sendMessage(Messages.NoPlayers);
        } else if (draftResult.error === "not-enough-civs") {
            sendMessage(Messages.NotEnoughCivs);
        } else if (draftResult.error === "not-enough-coastal-civs") {
            sendMessage(Messages.NotEnoughCoastalCivs)
        }
    } else {
        if (renderDraft(draftResult.value, game) === "") {
            sendMessage(Messages.NoPlayers);
        } else {
            sendMessage(renderDraftDescription(game, expansionsUsed, numberOfCustomCivs));
            sendMessage(renderDraft(draftResult.value, game));
        }
    }

    return message;
}

function renderDraftDescription(game: "Civ 5" | "Civ 6", expansionsUsed: Expansion[], numberOfCustomCivs: number) {
    const expansions = expansionsUsed.map((cg) => `\`${displayName(cg)}\``).join(", ");
    const customCivs = numberOfCustomCivs > 0 ? ` and ${numberOfCustomCivs} custom civs` : "";
    return `Drafting for ${game} with ${expansions}${customCivs}`;
}

function renderDraft(draft: Draft, game: CivGame) {
    return `\`\`\`${draft.map(x => renderDraftEntry(x, game)).join("\n")}\`\`\``;
}

function renderDraftEntry(draftEntry: DraftEntry, game: CivGame): string {
    return `${`${draftEntry.player}`.padEnd(20, " ")} ${draftEntry.civs.map(x => {
        if (x.custom) {
            return x.name
        }
        else {
            return renderCivShort(getCiv(x.id), game)
        }
    }).join(" / ")}`;
}
