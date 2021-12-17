import {DraftCommand} from "../src/DraftCommand";
import {DraftArguments, DraftError, DraftExecutor, IDraftExecutor} from "../src/Draft";
import Messages from "../src/Messages";
import {Draft} from "../src/DraftTypes";
import UserData from "../src/UserData";
import {createMockCivsRepository, createMockUserDataStore} from "./Mocks";
import {EmptyVoiceChannelAccessor, VoiceChannelAccessor} from "../src/VoiceChannelAccessor";

function createMockDraftExecutor(draft: Draft): IDraftExecutor {
    return {
        executeDraft: async () => {return {success: true, draft: draft}}
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
    
    const userData: UserData = {
        defaultDraftSettings: {},
        customCivs: []
    }
    
    const userDatas = new Map<string, UserData>()
    userDatas[""] = userData
    
    const mockUserDataStore = createMockUserDataStore(userDatas)
    
    it('should display the draft correctly', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 3,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ['civ5-vanilla']
        }
        const draftCommand = new DraftCommand(createMockDraftExecutor(draft), mockUserDataStore)
        
        await draftCommand.draft(draftArgs, new EmptyVoiceChannelAccessor(), "", writeOutput)

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
        
        await draftCommand.draft(draftArgs, new EmptyVoiceChannelAccessor(), "", writeOutput)
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
        
        await draftCommand.draft(draftArgs, new EmptyVoiceChannelAccessor(), "", writeOutput)
        expect(output[0]).toBe(Messages.NotInVoice)
        expect(output[1]).toBe(Messages.NotEnoughCivs)
    })
    
    it('should include players from voice in the draft', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 0,
            numberOfCivs: 3,
            noVoice: false,
            civGroups: ['civ5-vanilla']
        }

        const voiceChannelAccessor: VoiceChannelAccessor = {
            getUsersInVoice: () => ['voice_player']
        }

        const draftExecutor = new DraftExecutor(createMockCivsRepository(100))

        const draftCommand = new DraftCommand(draftExecutor, mockUserDataStore)
        await draftCommand.draft(draftArgs, voiceChannelAccessor, "", writeOutput)
        expect(output[0]).toBe("Drafting for `civ5-vanilla`")
        expect(output[1]).toContain("voice_player")
    })

    it('should include players from voice and AI together', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 3,
            numberOfCivs: 3,
            noVoice: false,
            civGroups: ['civ5-vanilla']
        }

        const voiceChannelAccessor: VoiceChannelAccessor = {
            getUsersInVoice: () => ['player1']
        }
        
        const draftExecutor = new DraftExecutor(createMockCivsRepository(100))

        const draftCommand = new DraftCommand(draftExecutor, mockUserDataStore)
        await draftCommand.draft(draftArgs, voiceChannelAccessor, "", writeOutput)
        expect(output[0]).toBe("Drafting for `civ5-vanilla`")
        expect(output[1]).toContain("player1")
        expect(output[1]).toContain("AI 0")
        expect(output[1]).toContain("AI 1")
        expect(output[1]).toContain("AI 2")
    })
})