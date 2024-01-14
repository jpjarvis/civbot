import { Expansion } from "../../Civs/Expansions";
import { draft } from "./Draft";
import { selectCivs } from "./SelectCivs";
import { UserSettings } from "../../UserData/UserSettings";
import { generateDraftCommandOutputMessage } from "./DraftCommandMessages";

export type DraftArguments = {
    numberOfAi: number;
    numberOfCivs: number;
    expansions: Expansion[];
};

export function draftCommand(args: Partial<DraftArguments>, voiceChannelMembers: string[], userSettings: UserSettings) {
    const draftArgs = fillDefaultArguments(args, userSettings);

    const players = voiceChannelMembers.concat(generateAiPlayers(draftArgs.numberOfAi));

    const civs = selectCivs(draftArgs.expansions, userSettings.customCivs, userSettings.bannedCivs);

    const draftResult = draft(players, draftArgs.numberOfCivs, civs);

    return generateDraftCommandOutputMessage(draftArgs.expansions, draftResult);
}

function fillDefaultArguments(partialArgs: Partial<DraftArguments>, userSettings: UserSettings): DraftArguments {
    const defaultArgs = userSettings.defaultDraftSettings;

    return {
        numberOfAi: partialArgs.numberOfAi ?? defaultArgs.numberOfAi ?? 0,
        numberOfCivs: partialArgs.numberOfCivs ?? defaultArgs.numberOfCivs ?? 3,
        expansions: partialArgs.expansions ?? defaultArgs.expansions ?? ["civ5-vanilla"],
    };
}

function generateAiPlayers(numberOfAiPlayers: number) {
    let players: string[] = [];
    for (let i = 0; i < numberOfAiPlayers; i++) {
        players.push(`AI ${i}`);
    }
    return players;
}
