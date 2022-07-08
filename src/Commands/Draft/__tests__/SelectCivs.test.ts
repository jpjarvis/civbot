import {CivGroup} from "../../../Types/CivGroups";
import {selectCivs} from "../SelectCivs";
import {Civs} from "../../../Types/Civs";

const customCivs = ["custom1"];

describe("selectCivs", () => {

    it("should return no civs if no civ groups are given", () => {
        const civs = selectCivs(new Set<CivGroup>(), customCivs);
        expect(civs).toHaveLength(0);
    });

    it("should return the civs of one civ group when specified", () => {
        const civs = selectCivs(new Set(["civ5-vanilla"]), customCivs);
        expect(civs).toIncludeSameMembers(Civs["civ5-vanilla"]);
    });

    it("should include custom civs from user data if specified", () => {
        const civs = selectCivs(new Set(["custom"]), customCivs);
        expect(civs).toIncludeSameMembers(["custom1"]);
    });

    it("should return the civs of multiple groups when specified", () => {
        const civs = selectCivs(new Set(["civ5-vanilla", "lekmod"]), customCivs);
        expect(civs).toIncludeSameMembers(Civs["civ5-vanilla"].concat(Civs["lekmod"]));
    });

    it("should include custom civs with normal groups when specified", () => {
        const civs = selectCivs(new Set(["civ5-vanilla", "lekmod", "custom"]), customCivs);
        expect(civs).toIncludeSameMembers(Civs["civ5-vanilla"].concat(Civs["lekmod"]).concat(customCivs));
    });
});