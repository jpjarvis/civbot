import * as fs from "fs";
import {loadUserData} from "../UserDataStore";

export async function clearTestUserData() {
    await fs.promises.rm("./userdata/test-guild.json", {force: true})
}

export async function getTestUserData() {
    return await loadUserData("test-guild");
}