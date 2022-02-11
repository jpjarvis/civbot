import Messages from "./Messages";
import {UserDataStore} from "./UserDataStore/UserDataStore";
import {VoiceChannelAccessor} from "./VoiceChannelAccessor";
import {CivGroup} from "../Draft/Types/CivGroups";
import {DraftResult} from "../Draft/Types/DraftTypes";

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

export interface IDraftCommand {
    draft(args: Partial<DraftArguments>,
          voiceChannelAccessor: VoiceChannelAccessor,
          serverId: string,
          sendMessage: (message: string) => void): Promise<void>;
}

export class DraftCommand implements IDraftCommand {
    private readonly generateDraft: (players: string[], civsPerPlayer: number, civs: string[]) => DraftResult;
    private userDataStore: UserDataStore;

    constructor(generateDraft: (players, civsPerPlayer, civs) => DraftResult, userDataStore: UserDataStore) {
        this.generateDraft = generateDraft;
        this.userDataStore = userDataStore;
    }

    async draft(args: Partial<DraftArguments>,
                voiceChannelAccessor: VoiceChannelAccessor,
                serverId: string,
                sendMessage: (message: string) => void): Promise<void> {
        const defaultArgs = (await this.userDataStore.load(serverId)).defaultDraftSettings;

        const draftArgs: DraftArguments = {
            numberOfAi: args.numberOfAi ?? 0,
            numberOfCivs: args.numberOfCivs ?? 3,
            noVoice: args.noVoice ?? false,
            civGroups: args.civGroups ?? defaultArgs.civGroups ?? ["civ5-vanilla"]
        };

        const voiceChannelMembers = voiceChannelAccessor.getUsersInVoice();
        
        if (!voiceChannelMembers) {
            sendMessage(Messages.NotInVoice);
        }

        let players: Array<string> = [];
        if (voiceChannelMembers && !args.noVoice) {
            players = players.concat(voiceChannelMembers);
        }
        
        for (let i = 0; i < draftArgs.numberOfAi; i++) {
            players.push(`AI ${i}`);
        }
        
        
        
        let draftResult = this.generateDraft(players, draftArgs.numberOfCivs, draftArgs.civGroups);

        if (!draftResult.success) {
            if (draftResult.error == "no-players") {
                sendMessage(Messages.NoPlayers);
            } else if (draftResult.error == "not-enough-civs") {
                sendMessage(Messages.NotEnoughCivs);
            }
            return;
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
