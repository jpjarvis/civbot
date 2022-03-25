import {CivGroup} from "../../Types/CivGroups";
import {draft} from "./Draft";
import {selectCivs} from "./SelectCivs";
import UserData from "../../Types/UserData";
import {CivData} from "../../CivData";
import {ResultOrErrorWithDetails} from "../../Types/ResultOrError";
import {Draft, DraftError} from "./DraftTypes";

export interface DraftArguments {
    numberOfAi: number,
    numberOfCivs: number,
    civGroups: CivGroup[]
}

function fillDefaultArguments(partialArgs: Partial<DraftArguments>, userData: UserData): DraftArguments {
    const defaultArgs = userData.defaultDraftSettings;

    return {
        numberOfAi: partialArgs.numberOfAi ?? defaultArgs.numberOfAi ?? 0,
        numberOfCivs: partialArgs.numberOfCivs ?? defaultArgs.numberOfCivs ?? 3,
        civGroups: partialArgs.civGroups ?? defaultArgs.civGroups ?? ["civ5-vanilla"]
    };
}

function generateAiPlayers(numberOfAiPlayers: number) {
    let players: string[] = [];
    for (let i = 0; i < numberOfAiPlayers; i++) {
        players.push(`AI ${i}`);
    }
    return players;
}

export type DraftCommandResult = {
    civGroupsUsed: CivGroup[],
    draftResult: ResultOrErrorWithDetails<Draft, DraftError>
}

export async function draftCommand(args: Partial<DraftArguments>,
                                   voiceChannelMembers: string[],
                                   userData: UserData,
                                   civData: CivData): Promise<DraftCommandResult> {
    const draftArgs = fillDefaultArguments(args, userData);

    const players = voiceChannelMembers.concat(generateAiPlayers(draftArgs.numberOfAi));

    const civs = selectCivs(new Set(draftArgs.civGroups), civData, userData.customCivs);

    const draftResult = draft(players, draftArgs.numberOfCivs, civs);

    return {civGroupsUsed: draftArgs.civGroups, draftResult: draftResult}
}