import { selectCivIds } from "../SelectCivIds";
import { Civs } from "../Civs";

describe("selectCivs", () => {
    it("should return no civs if no expansions are given", () => {
        const civs = selectCivIds([], []);
        expect(civs).toHaveLength(0);
    });

    it("should return the civs of one expansion when specified", () => {
        const civs = selectCivIds(["civ5-vanilla"], []);
        expect(civs).toIncludeSameMembers(Civs["civ5-vanilla"]);
    });

    it("should return the civs of multiple expansions when specified", () => {
        const civs = selectCivIds(["civ5-vanilla", "lekmod"], []);
        expect(civs).toIncludeSameMembers(Civs["civ5-vanilla"].concat(Civs["lekmod"]));
    });

    it("should not include banned civs", () => {
        const civs = selectCivIds(["civ5-vanilla"], ["Russia"]);
        expect(civs).not.toInclude("Russia");
    });
});
