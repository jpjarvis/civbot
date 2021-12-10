import {DraftCommand} from "../src/DraftCommand";
import {DraftArguments, DraftError, IDraftExecutor} from "../src/Draft";
import Messages from "../src/Messages";
import {Draft} from "../src/DraftTypes";
import UserData from "../src/UserData";
import {UserDataStore} from "../src/UserDataStore/interface";

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

function createMockUserDataStore(userData: UserData): UserDataStore {
    return {
        load: async _ => userData,
        save: async _ => {}
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
    
    const userData: UserData = {
        defaultDraftSettings: {},
        customCivs: []
    }
    const mockUserDataStore = createMockUserDataStore(userData)
    
    it('should display the draft correctly', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 3,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ['civ5-vanilla']
        }
        const draftCommand = new DraftCommand(createMockDraftExecutor(draft), mockUserDataStore)
        
        await draftCommand.draft(draftArgs, undefined, "", writeOutput)

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
        const draftCommand = new DraftCommand(createFailingMockDraftExecutor("no-players"), mockUserDataStore)
        
        await draftCommand.draft(draftArgs, undefined, "", writeOutput)
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
        const draftCommand = new DraftCommand(createFailingMockDraftExecutor("not-enough-civs"), mockUserDataStore)

        await draftCommand.draft(draftArgs, undefined, "", writeOutput)
        expect(output[0]).toBe(Messages.NotInVoice)
        expect(output[1]).toBe(Messages.NotEnoughCivs)
    })
})