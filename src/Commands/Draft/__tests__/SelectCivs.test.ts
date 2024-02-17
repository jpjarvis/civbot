import { Expansion } from "../../../Civs/Expansions";
import { selectCivs } from "../SelectCivs";
import { Civs } from "../../../Civs/Civs";

const customCivs = ["custom1"];

describe("selectCivs", () => {
    it("should return no civs if no expansions are given", () => {
        const civs = selectCivs([], []);
        expect(civs).toHaveLength(0);
    });

    it("should return the civs of one expansion when specified", () => {
        const civs = selectCivs(["civ5-vanilla"], []);
        expect(civs).toIncludeSameMembers(Civs["civ5-vanilla"]);
    });

    it("should include custom civs from user data if specified", () => {
        const civs = selectCivs([], []);
        expect(civs).toIncludeSameMembers(["custom1"]);
    });

    it("should return the civs of multiple expansions when specified", () => {
        const civs = selectCivs(["civ5-vanilla", "lekmod"], []);
        expect(civs).toIncludeSameMembers(Civs["civ5-vanilla"].concat(Civs["lekmod"]));
    });

    it("should include custom civs with normal expansions when specified", () => {
        const civs = selectCivs(["civ5-vanilla", "lekmod"], []);
        expect(civs).toIncludeSameMembers(Civs["civ5-vanilla"].concat(Civs["lekmod"]).concat(customCivs));
    });

    it("should not include banned civs", () => {
        const civs = selectCivs(["civ5-vanilla"], ["Russia"]);
        expect(civs).not.toInclude("Russia");
    });
});
