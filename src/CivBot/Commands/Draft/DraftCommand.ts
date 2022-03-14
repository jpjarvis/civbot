import Messages from "../../Messages";
import {CivGroup} from "../../Types/CivGroups";
import {draft} from "./Draft";
import {selectCivs} from "./SelectCivs";
import UserData from "../../Types/UserData";
import {CivData} from "../../CivData";

export interface DraftArguments {
    numberOfAi: number,
    numberOfCivs: number,
    noVoice: boolean,
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
        noVoice: partialArgs.noVoice ?? defaultArgs.noVoice ?? false,
        civGroups: partialArgs.civGroups ?? defaultArgs.civGroups ?? ["civ5-vanilla"]
    };
}

export async function draftCommand(args: Partial<DraftArguments>,
                                   voiceChannelMembers: string[],
                                   sendMessage: (message: string) => void,
                                   userData: UserData,
                                   civData: CivData): Promise<void> {
    const draftArgs = fillDefaultArguments(args, userData);

    if (voiceChannelMembers.length == 0) {
        sendMessage(Messages.NotInVoice);
    }

    let players: Array<string> = [];
    if (voiceChannelMembers && !args.noVoice) {
        players = players.concat(voiceChannelMembers);
    }

    for (let i = 0; i < draftArgs.numberOfAi; i++) {
        players.push(`AI ${i}`);
    }
    
    const civs = await selectCivs(new Set(draftArgs.civGroups), civData, userData.customCivs);
    
    const draftResult = await draft(players, draftArgs.numberOfCivs, civs);

    if (draftResult.isError) {
        if (draftResult.error == "no-players") {
            sendMessage(Messages.NoPlayers);
        } else if (draftResult.error == "not-enough-civs") {
            sendMessage(Messages.NotEnoughCivs);
        }
        return;
    }

    let response = "";

    for (let player in draftResult.result) {
        response += getPlayerDraftString(player, draftResult.result[player]);
    }

    if (response === "") {
        sendMessage(Messages.NoPlayers);
    } else {
        sendMessage(`Drafting for ${draftArgs.civGroups.map(cg => `\`${cg}\``).join(", ")}`);
        sendMessage("\`\`\`" + response + "\`\`\`");
    }
}

