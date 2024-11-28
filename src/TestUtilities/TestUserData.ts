import * as fs from "fs";
import {loadUserData} from "../UserDataStore";

export async function clearTestUserData() {
    await fs.promises.rm("./userdata/test-guild.json");
}

export async function getTestUserData() {
    return await loadUserData("test-guild");
}