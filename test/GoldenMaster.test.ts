import {DraftCommand} from "../src/DraftCommand";
import {DraftArguments, DraftExecutor} from "../src/Draft";
import Messages from "../src/Messages";
import FileUserDataStore from "../src/UserDataStore/FileUserDataStore";
import FileAndUserDataCivsRepository from "../src/CivsRepository/FileAndUserDataCivsRepository";


describe('CivBot', () => {
    let output: string[] = []
    const writeOutput = (message: string) => {
        output.push(message)
    }

    beforeEach(() => {
        output = []
    })
    
    const draftCommand = new DraftCommand(new DraftExecutor(new FileAndUserDataCivsRepository(new FileUserDataStore())), new FileUserDataStore())

    it('should be able to draft a game for the AI', async () => {
        const draftArgs: DraftArguments = {
            numberOfAi: 3,
            numberOfCivs: 3,
            noVoice: true,
            civGroups: ['civ5-vanilla']
        }

        await draftCommand.draft(draftArgs, undefined, "", writeOutput)

        expect(output[0]).toBe(Messages.NotInVoice)
        expect(output[1]).toBe('Drafting for `civ5-vanilla`')
        expect(output[2]).toMatch(/```AI 0\s+.*\/.*\/.*\nAI 1\s+.*\/.*\/.*\nAI 2\s+.*\/.*\/.*\n```/)
    })
})