import {switchGameCommand} from "../SwitchGameCommand";
import {clearTestUserData, getTestUserData} from "../../../TestUtilities/TestUserData";
import {TestInteraction} from "../../../TestUtilities/TestInteraction";

describe("switch game", () => {
    beforeEach(async () => {
        await clearTestUserData();
    })

    it("should switch to Civ 6 when in Civ 5 mode", async () => {
        const testInteraction = new TestInteraction(() => {});
        await switchGameCommand(testInteraction.value);

        const userData = await getTestUserData();

        expect(userData.game).toBe("Civ 6");
        expect(testInteraction.output).toEqual(["Switched to drafting for Civ 6."])
    });

    it("should switch to Civ 5 when in Civ 6 mode", async () => {
        await switchGameCommand(new TestInteraction(() => {}).value);

        const testInteraction = new TestInteraction(() => {});
        await switchGameCommand(testInteraction.value);

        const userData = await getTestUserData();

        expect(userData.game).toBe("Civ 5");
        expect(testInteraction.output).toEqual(["Switched to drafting for Civ 5."])
    });
});