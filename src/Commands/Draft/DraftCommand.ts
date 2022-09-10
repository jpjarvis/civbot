import { CivGroup } from "../../Types/CivGroups";
import { draft } from "./Draft";
import { selectCivs } from "./SelectCivs";
import { UserSettings } from "../../Types/UserSettings";
import { generateDraftCommandOutputMessage } from "./DraftCommandMessages";

export type DraftArguments = {
    numberOfAi: number;
    numberOfCivs: number;
    civGroups: CivGroup[];
};

export function draftCommand(args: Partial<DraftArguments>, voiceChannelMembers: string[], userSettings: UserSettings) {
    const draftArgs = fillDefaultArguments(args, userSettings);

    const players = voiceChannelMembers.concat(generateAiPlayers(draftArgs.numberOfAi));

    const civs = selectCivs(new Set(draftArgs.civGroups), userSettings.customCivs, userSettings.bannedCivs);

    const draftResult = draft(players, draftArgs.numberOfCivs, civs);

    return generateDraftCommandOutputMessage(draftArgs.civGroups, draftResult);
}

function fillDefaultArguments(partialArgs: Partial<DraftArguments>, userSettings: UserSettings): DraftArguments {
    const defaultArgs = userSettings.defaultDraftSettings;

    return {
        numberOfAi: partialArgs.numberOfAi ?? defaultArgs.numberOfAi ?? 0,
        numberOfCivs: partialArgs.numberOfCivs ?? defaultArgs.numberOfCivs ?? 3,
        civGroups: partialArgs.civGroups ?? defaultArgs.civGroups ?? ["civ5-vanilla"],
    };
}

function generateAiPlayers(numberOfAiPlayers: number) {
    let players: string[] = [];
    for (let i = 0; i < numberOfAiPlayers; i++) {
        players.push(`AI ${i}`);
    }
    return players;
}
