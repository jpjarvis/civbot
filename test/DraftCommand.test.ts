import {draftCommand} from "../src/DraftCommand";
import {DraftArguments, DraftError, IDraftExecutor} from "../src/Draft";
import Messages from "../src/Messages";
import {Draft} from "../src/DraftTypes";

function createMockDraftExecutor(draft: Draft): IDraftExecutor {
    return {
        executeDraft: async (args, voiceChannel, serverId) => {
            return {success: true, draft: draft}
        }
    }
}

function createFailingMockDraftExecutor(error: DraftError): IDraftExecutor {
    return {
        executeDraft: async (args, voiceChannel, serverId) => {
            return {success: false, error: error}
        }
    }
}

describe('draftCommand', () => {
    let output: string[] = []
    const writeOutput = (message: string) => {
        output.push(message)
    }

    beforeEach(() => {
        output = []
    })

    const draft = new Map<string, string[]>()
    draft["player1"] = ["civ1, civ2, civ3"]
    draft["player2"] = ["civ1, civ2, civ3"]
    draft["player3"] = ["civ1, civ2, civ3"]
    
    it('should display the draft correctly', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 3,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ['civ5-vanilla']
        }

        await draftCommand(draftArgs, undefined, "", createMockDraftExecutor(draft), writeOutput)

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

        await draftCommand(draftArgs, undefined, "", createFailingMockDraftExecutor("no-players"), writeOutput)
        expect(output[0]).toBe(Messages.NotInVoice)
        expect(output[1]).toBe(Messages.NoPlayers)
    })

    it('should display the correct error for not enough civs', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ['civ5-vanilla']
        }

        await draftCommand(draftArgs, undefined, "", createFailingMockDraftExecutor("not-enough-civs"), writeOutput)
        expect(output[0]).toBe(Messages.NotInVoice)
        expect(output[1]).toBe(Messages.NotEnoughCivs)
    })
})