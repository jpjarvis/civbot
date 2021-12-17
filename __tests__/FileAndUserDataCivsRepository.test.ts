import UserData from "../src/UserData";
import CivData from "../src/CivsRepository/CivData/CivData";
import FileAndUserDataCivsRepository from "../src/CivsRepository/FileAndUserDataCivsRepository";
import {CivGroup} from "../src/CivGroups";
import {createMockCivDataAccessor, createMockUserDataStore} from "./Mocks";

const fakeUserData1: UserData = {
    defaultDraftSettings: {},
    customCivs: ["custom1"]
};

const fakeUserData2: UserData = {
    defaultDraftSettings: {},
    customCivs: ["custom2"]
};

const userDatas = new Map<string, UserData>();

userDatas["1"] = fakeUserData1;
userDatas["2"] = fakeUserData2;

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

describe("FileAndUserDataCivsRepository", () => {
    const civsRepository = new FileAndUserDataCivsRepository(createMockUserDataStore(userDatas), createMockCivDataAccessor(fakeCivData));

    it("should return no civs if no civ groups are given", async () => {
        const civs = await civsRepository.getCivs(new Set<CivGroup>(), "1");
        expect(civs).toHaveLength(0);
    });

    it("should return the civs of one civ group when specified", async () => {
        const civs = await civsRepository.getCivs(new Set(["civ5-vanilla"]), "1");
        expect(civs).toStrictEqual(["civ5"]);
    });

    it("should return the custom civs for the appropriate server", async () => {
        const civs = await civsRepository.getCivs(new Set(["custom"]), "2");
        expect(civs).toStrictEqual(["custom2"]);
    });

    it("should return the civs of multiple groups when specified", async () => {
        const civs = await civsRepository.getCivs(new Set(["civ5-vanilla", "lekmod"]), "1");
        expect(civs).toHaveLength(2);
        expect(civs).toContain("civ5");
        expect(civs).toContain("lekmod");
    });

    it("should include custom civs with normal groups when specified", async () => {
        const civs = await civsRepository.getCivs(new Set(["civ5-vanilla", "lekmod", "custom"]), "1");
        expect(civs).toHaveLength(3);
        expect(civs).toContain("civ5");
        expect(civs).toContain("lekmod");
        expect(civs).toContain("custom1");
    });
});