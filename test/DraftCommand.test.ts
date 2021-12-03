import {draftCommand} from "../src/DraftCommand";
import {DraftArguments} from "../src/Draft";
import {VoiceChannel} from "discord.js";
import Messages from "../src/Messages";
import {Draft} from "../src/DraftTypes";

let draft: Draft = new Map<string, string[]>()

jest.mock("../src/Draft", () => {
    return {
        executeDraft: (args: DraftArguments, voiceChannel: VoiceChannel | undefined, serverId: string) => {

            return {success: true, draft: draft}
        }
    }
})

describe('draftCommand', () => {
    let output: string[] = []
    const writeOutput = (message: string) => {
        output.push(message)
    }

    beforeEach(() => {
        output = []
        draft = new Map<string, string[]>()
    })

    it('should display the draft correctly', async () => {
        draft["player1"] = ["civ1, civ2, civ3"]
        draft["player2"] = ["civ1, civ2, civ3"]
        draft["player3"] = ["civ1, civ2, civ3"]

        const draftArgs: DraftArguments = {
            numberOfAi: 3,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ['civ5-vanilla']
        }

        await draftCommand(draftArgs, undefined, "", writeOutput)

        expect(output[0]).toBe(Messages.NotInVoice)
        expect(output[1]).toBe('Drafting for `civ5-vanilla`')
        expect(output[2]).toBe('```player1             civ1, civ2, civ3\n'
            + 'player2             civ1, civ2, civ3\n'
            + 'player3             civ1, civ2, civ3\n'
            + '```')
    })

    it('should display the correct error for no players', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ['civ5-vanilla']
        }

        await draftCommand(draftArgs, undefined, "", writeOutput)
        expect(output[0]).toBe(Messages.NotInVoice)
        expect(output[1]).toBe(Messages.NoPlayers)
    })
})