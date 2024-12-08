import {clearTestUserData, getTestUserData} from "../../../TestUtilities/TestUserData";
import {TestInteraction} from "../../../TestUtilities/TestInteraction";
import {banCommand} from "../BanCommand";
import {switchGameCommand} from "../../SwitchGame/SwitchGameCommand";

describe("BanCommand", () => {
    beforeEach(async () => {
        await clearTestUserData();
    })

    describe("Civ 5", () => {
        it("should ban the specified civ", async () => {
            const interaction = TestInteraction.ban("Russia");

            await banCommand(interaction.value);

            const userData = await getTestUserData();

            expect(interaction.output).not.toBeEmpty();
            expect(userData.userSettings["Civ 5"].bannedCivs).toEqual(["Russia"]);
        });

        it("should not ban the civ if the civ is already banned", async () => {
            await banCommand(TestInteraction.ban("Rome").value);

            const interaction = TestInteraction.ban("Rome");
            await banCommand(interaction.value);

            const userData = await getTestUserData();

            expect(interaction.output).not.toBeEmpty();
            expect(userData.userSettings["Civ 5"].bannedCivs).toEqual(["Rome"]);
        });

        it("should not ban the civ if it doesn't exist", async () => {
            const interaction = TestInteraction.ban("ThisCivDoesNotExistOhNooooo");
            await banCommand(interaction.value);

            const userData = await getTestUserData();

            expect(interaction.output).not.toBeEmpty();
            expect(userData.userSettings["Civ 5"].bannedCivs).toEqual([]);
        });
    });

    describe("Civ 6", () => {
        beforeEach(async () => {
            await switchGameCommand(TestInteraction.empty().value);
        });

        it("should ban based on civ name", async () => {
            const interaction = TestInteraction.ban("Russia");

            await banCommand(interaction.value);

            const userData = await getTestUserData();

            expect(interaction.output).not.toBeEmpty();
            expect(userData.userSettings["Civ 6"].bannedCivs).toEqual([{leader: "Peter", civ: "Russia"}]);
        });

        it("should ban based on leader name", async () => {
            const interaction = TestInteraction.ban("Trajan");

            await banCommand(interaction.value);

            const userData = await getTestUserData();

            expect(interaction.output).not.toBeEmpty();
            expect(userData.userSettings["Civ 6"].bannedCivs).toEqual([{leader: "Trajan", civ: "Rome"}]);
        });

        it("should not ban the civ if the civ is already banned", async () => {
            await banCommand(TestInteraction.ban("Trajan").value);

            const interaction = TestInteraction.ban("Trajan");
            await banCommand(interaction.value);

            const userData = await getTestUserData();

            expect(interaction.output).not.toBeEmpty();
            expect(userData.userSettings["Civ 6"].bannedCivs).toEqual([{leader: "Trajan", civ: "Rome"}]);
        });

        it("should not ban the civ if it doesn't exist", async () => {
            const interaction = TestInteraction.ban("ThisCivDoesNotExistOhNooooo");
            await banCommand(interaction.value);

            const userData = await getTestUserData();

            expect(interaction.output).not.toBeEmpty();
            expect(userData.userSettings["Civ 6"].bannedCivs).toEqual([]);
        });
    });


});