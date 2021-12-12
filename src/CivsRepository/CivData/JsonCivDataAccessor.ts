import CivData from "./CivData";
import * as fs from "fs";
import CivDataAccessor from "./CivDataAccessor";

export default class JsonCivDataAccessor implements CivDataAccessor {
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    getCivData(): CivData {
        return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    }
}