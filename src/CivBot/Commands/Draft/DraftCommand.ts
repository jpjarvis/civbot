import Messages from "../../Messages";
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

function getPlayerDraftString(playerName: string, civs: string[]): string {
    let response = `${playerName} `.padEnd(20, " ");
    for (let j = 0; j < civs.length - 1; j++) {
        response += `${civs[j]} / `;
    }
    response += `${civs[civs.length - 1]}\n`;
    return response;
}

function fillDefaultArguments(partialArgs: Partial<DraftArguments>, userData: UserData) : DraftArguments {
    const defaultArgs = userData.defaultDraftSettings;
    
    return {
        numberOfAi: partialArgs.numberOfAi ?? defaultArgs.numberOfAi ?? 0,
        numberOfCivs: partialArgs.numberOfCivs ?? defaultArgs.numberOfCivs ?? 3,
        civGroups: partialArgs.civGroups ?? defaultArgs.civGroups ?? ["civ5-vanilla"]
    };
}

function generateOutputMessage(draftResult: ResultOrErrorWithDetails<Draft, DraftError>, draftArgs: DraftArguments) {
    let message = "";
    const sendMessage = (m: string) => {
        message += m + "\n";
    }
    
    if (draftResult.isError) {
        if (draftResult.error == "no-players") {
            sendMessage(Messages.NoPlayers);
        } else if (draftResult.error == "not-enough-civs") {
            sendMessage(Messages.NotEnoughCivs);
        }
    }
    else {
        let draftString = "";
        
        for (let player in draftResult.result) {
            draftString += getPlayerDraftString(player, draftResult.result[player]);
        }

        if (draftString === "") {
            sendMessage(Messages.NoPlayers);
        } else {
            sendMessage(`Drafting for ${draftArgs.civGroups.map(cg => `\`${cg}\``).join(", ")}`);
            sendMessage("\`\`\`" + draftString + "\`\`\`");
        }
    }
    
    return message;
}

function generateAiPlayers(numberOfAiPlayers: number) {
    let players : string[] = [];
    for (let i = 0; i < numberOfAiPlayers; i++) {
        players.push(`AI ${i}`);
    }
    return players;
}

export async function draftCommand(args: Partial<DraftArguments>,
                                   voiceChannelMembers: string[],
                                   userData: UserData,
                                   civData: CivData): Promise<string> {
    const draftArgs = fillDefaultArguments(args, userData);

    const players = voiceChannelMembers.concat(generateAiPlayers(draftArgs.numberOfAi));
    
    const civs = await selectCivs(new Set(draftArgs.civGroups), civData, userData.customCivs);
    
    const draftResult = draft(players, draftArgs.numberOfCivs, civs);

    return generateOutputMessage(draftResult, draftArgs);
}

