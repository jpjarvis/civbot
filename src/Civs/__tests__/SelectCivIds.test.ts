import { selectCivIds } from "../SelectCivIds";
import {CivId, Civs} from "../Civs";

describe("selectCivIds", () => {
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
        expect(civs).toIncludeSameMembers((Civs["civ5-vanilla"] as CivId[]).concat(Civs["lekmod"]));
    });

    it("should not include banned civs", () => {
        const civs = selectCivIds(["civ5-vanilla"], ["Russia"]);
        expect(civs).not.toInclude("Russia");
    });
});
