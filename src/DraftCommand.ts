import {VoiceChannel} from "discord.js";
import {DraftArguments, IDraftExecutor} from "./Draft";
import Messages from "./Messages";
import {UserDataStore} from "./UserDataStore/interface";

function getPlayerDraftString(playerName: string, civs: string[]): string {
    let response = `${playerName} `.padEnd(20, " ");
    for (let j = 0; j < civs.length - 1; j++) {
        response += `${civs[j]} / `;
    }
    response += `${civs[civs.length - 1]}\n`;
    return response;
}

export interface IDraftCommand {
    draft(args: Partial<DraftArguments>, 
          voiceChannel: VoiceChannel | undefined, 
          serverId: string, 
          sendMessage: (message: string) => void) : Promise<void>
}

export class DraftCommand implements IDraftCommand {
    private draftExecutor: IDraftExecutor;
    private userDataStore: UserDataStore;
    
    constructor(draftExecutor: IDraftExecutor, userDataStore: UserDataStore) {
        this.draftExecutor = draftExecutor;
        this.userDataStore = userDataStore;
    }

    async draft(args: Partial<DraftArguments>,
                voiceChannel: VoiceChannel | undefined,
                serverId: string,
                sendMessage: (message: string) => void): Promise<void> {
        const defaultArgs = (await this.userDataStore.load(serverId)).defaultDraftSettings;

        const draftArgs: DraftArguments = {
            numberOfAi: args.numberOfAi ?? 0,
            numberOfCivs: args.numberOfCivs ?? 3,
            noVoice: args.noVoice ?? false,
            civGroups: args.civGroups ?? defaultArgs.civGroups ?? ["civ5-vanilla"]
        }

        if (!voiceChannel) {
            sendMessage(Messages.NotInVoice);
        }

        let draftResult = await this.draftExecutor.executeDraft(draftArgs, voiceChannel, serverId);

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
}

