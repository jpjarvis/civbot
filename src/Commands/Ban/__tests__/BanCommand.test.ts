import {clearTestUserData, getTestUserData} from "../../../TestUtilities/TestUserData";
import {TestInteraction} from "../../../TestUtilities/TestInteraction";
import {when} from "@typestrong/ts-mockito";
import {banCommand} from "../BanCommand";
import {switchGameCommand} from "../../SwitchGame/SwitchGameCommand";

describe("BanCommand", () => {
    beforeEach(async () => {
        await clearTestUserData();
    })

    it("should ban the specified civ", async () => {
        const interaction = new TestInteraction((options) => {
            when(options.getString("civ")).thenReturn("Russia")
        });

        await banCommand(interaction.value);
        
        const userData = await getTestUserData();

        expect(interaction.output).not.toBeEmpty();
        expect(userData.userSettings["Civ 5"].bannedCivs).toEqual(["Russia"]);
    });

    it("should ban based on civ name for Civ 6", async () => {
        await switchGameCommand(TestInteraction.createEmpty().value);
        
        const interaction = new TestInteraction((options) => {
            when(options.getString("civ")).thenReturn("Russia")
        });

        await banCommand(interaction.value);
        
        const userData = await getTestUserData();
        
        expect(interaction.output).not.toBeEmpty();
        expect(userData.userSettings["Civ 6"].bannedCivs).toEqual([{leader: "Peter", civ: "Russia"}]);
    });

    it("should ban based on leader name for Civ 6", async () => {
        await switchGameCommand(TestInteraction.createEmpty().value);

        const interaction = new TestInteraction((options) => {
            when(options.getString("civ")).thenReturn("Trajan")
        });

        await banCommand(interaction.value);

        const userData = await getTestUserData();
        
        expect(interaction.output).not.toBeEmpty();
        expect(userData.userSettings["Civ 6"].bannedCivs).toEqual([{leader: "Trajan", civ: "Rome"}]);
    });
});