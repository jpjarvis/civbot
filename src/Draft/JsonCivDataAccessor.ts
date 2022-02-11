import CivData from "./CivData";
import * as fs from "fs";

export default function loadCivDataFromFile(filePath: string) : CivData {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}