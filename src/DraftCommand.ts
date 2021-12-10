import {VoiceChannel} from "discord.js";
import {DraftArguments, IDraftExecutor} from "./Draft";
import Messages from "./Messages";
import {UserDataStoreInstance} from "./UserDataStore";
import {CivsRepositoryInstance} from "./CivsRepository";

function getPlayerDraftString(playerName: string, civs: string[]): string {
    let response = `${playerName} `.padEnd(20, " ");
    for (let j = 0; j < civs.length - 1; j++) {
        response += `${civs[j]} / `;
    }
    response += `${civs[civs.length - 1]}\n`;
    return response;
}

export async function draftCommand(args: Partial<DraftArguments>, voiceChannel: VoiceChannel | undefined, serverId: string, draftExecutor: IDraftExecutor, sendMessage: (message: string) => void): Promise<void> {
    const defaultArgs = (await UserDataStoreInstance.load(serverId)).defaultDraftSettings;

    const draftArgs: DraftArguments = {
        numberOfAi: args.numberOfAi ?? 0,
        numberOfCivs: args.numberOfCivs ?? 3,
        noVoice: args.noVoice ?? false,
        civGroups: args.civGroups ?? defaultArgs.civGroups ?? ["civ5-vanilla"]
    }

    if (!voiceChannel) {
        sendMessage(Messages.NotInVoice);
    }

    let draftResult = await draftExecutor.executeDraft(draftArgs, voiceChannel, serverId, CivsRepositoryInstance);

    if (!draftResult.success) {
        if (draftResult.error == "no-players") {
            sendMessage(Messages.NoPlayers)
        } else if (draftResult.error == "not-enough-civs") {
            sendMessage(Messages.NotEnoughCivs)
        }
        return
    }

    let response = "";

    for (let player in draftResult.draft) {
        response += getPlayerDraftString(player, draftResult.draft[player]);
    }

    if (response === "") {
        sendMessage(Messages.NoPlayers);
    } else {
        sendMessage(`Drafting for ${draftArgs.civGroups.map(cg => `\`${cg}\``).join(", ")}`);
        sendMessage("\`\`\`" + response + "\`\`\`");
    }
}