import Messages from "./Messages";
import {UserDataStore} from "./UserDataStore/UserDataStore";
import {CivGroup} from "../Draft/Types/CivGroups";
import {draft} from "../Draft/DraftExecutor";
import {getCivs} from "./FileAndUserDataCivsRepository";
import UserData from "./UserData";
import loadCivDataFromFile from "../Draft/JsonCivDataAccessor";

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

export async function draftCommand(args: Partial<DraftArguments>,
                                   voiceChannelMembers: string[],
                                   sendMessage: (message: string) => void,
                                   userData: UserData): Promise<void> {
    const defaultArgs = userData.defaultDraftSettings;

    const draftArgs: DraftArguments = {
        numberOfAi: args.numberOfAi ?? 0,
        numberOfCivs: args.numberOfCivs ?? 3,
        noVoice: args.noVoice ?? false,
        civGroups: args.civGroups ?? defaultArgs.civGroups ?? ["civ5-vanilla"]
    };

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

    const civData = loadCivDataFromFile("civs.json");
    const civs = await getCivs(new Set(draftArgs.civGroups), userData, civData);
    
    let draftResult = await draft(players, draftArgs.numberOfCivs, civs);

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

