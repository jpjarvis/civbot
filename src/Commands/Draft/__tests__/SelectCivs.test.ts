import {CivData} from "../../../CivData";
import {CivGroup} from "../../../Types/CivGroups";
import {selectCivs} from "../SelectCivs";

const fakeCivData: CivData = {
    civs: {
        "civ5-vanilla": ["civ5"],
        "lekmod": ["lekmod"],
        "civ6-vanilla": ["civ6"],
        "civ6-rnf": ["rnf"],
        "civ6-gs": ["gs"],
        "civ6-frontier": ["frontier"],
        "civ6-extra": ["extra"]
    }
};

const customCivs = ["custom1"];

describe("selectCivs", () => {

    it("should return no civs if no civ groups are given", async () => {
        const civs = await selectCivs(new Set<CivGroup>(), fakeCivData, customCivs);
        expect(civs).toHaveLength(0);
    });

    it("should return the civs of one civ group when specified", async () => {
        const civs = await selectCivs(new Set(["civ5-vanilla"]), fakeCivData, customCivs);
        expect(civs).toStrictEqual(["civ5"]);
    });

    it("should include custom civs from user data if specified", async () => {
        const civs = await selectCivs(new Set(["custom"]), fakeCivData, customCivs);
        expect(civs).toStrictEqual(["custom1"]);
    });

    it("should return the civs of multiple groups when specified", async () => {
        const civs = await selectCivs(new Set(["civ5-vanilla", "lekmod"]), fakeCivData, customCivs);
        expect(civs).toHaveLength(2);
        expect(civs).toContain("civ5");
        expect(civs).toContain("lekmod");
    });

    it("should include custom civs with normal groups when specified", async () => {
        const civs = await selectCivs(new Set(["civ5-vanilla", "lekmod", "custom"]), fakeCivData, customCivs);
        expect(civs).toHaveLength(3);
        expect(civs).toContain("civ5");
        expect(civs).toContain("lekmod");
        expect(civs).toContain("custom1");
    });
});