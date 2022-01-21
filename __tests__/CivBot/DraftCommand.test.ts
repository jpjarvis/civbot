import {DraftArguments, DraftCommand} from "../../src/CivBot/DraftCommand";
import {DraftExecutor, IDraftExecutor} from "../../src/Draft/DraftExecutor";
import {Draft, DraftError} from "../../src/Draft/Types/DraftTypes";
import {CivGroup} from "../../src/Draft/Types/CivGroups";
import UserData from "../../src/CivBot/UserData";
import {createMockCivsRepository, createMockUserDataStore} from "../Mocks";
import {EmptyVoiceChannelAccessor, VoiceChannelAccessor} from "../../src/CivBot/VoiceChannelAccessor";
import Messages from "../../src/CivBot/Messages";

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

function expectOutputDraftToHave(output: string[], civGroups: Set<CivGroup>, players: string[]) {
    expect(output[0]).toContain("Drafting for ")
    for (let c of civGroups) {
        expect(output[0]).toContain(c)
    }
    for (let p of players) {
        expect(output[1]).toContain(p)
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
            civGroups: ['civ5-vanilla', 'lekmod']
        }
        const draftCommand = new DraftCommand(createMockDraftExecutor(draft), mockUserDataStore)
        
        await draftCommand.draft(draftArgs, new EmptyVoiceChannelAccessor(), "", writeOutput)

        expect(output[0]).toBe(Messages.NotInVoice)
        expect(output[1]).toBe('Drafting for `civ5-vanilla`, `lekmod`')
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
        expectOutputDraftToHave(output, new Set(['civ5-vanilla']), ['voice_player'])
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
        expectOutputDraftToHave(output, new Set(['civ5-vanilla']), ['player1', 'AI 0', 'AI 1', 'AI 2'])
    })
})