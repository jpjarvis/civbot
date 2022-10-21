import * as fs from "fs";
import * as path from "path";
import { createDefaultUserData, UserData } from "../UserData/UserData";
import { UserDataStore } from "./UserDataStore";

function getUserDataPath(tenantId: string) {
    return `./userdata/${tenantId}.json`;
}

async function ensureExists(filePath: string): Promise<void> {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    try {
        await fs.promises.readFile(filePath);
    } catch {
        await fs.promises.writeFile(filePath, JSON.stringify(createDefaultUserData()));
        console.log(`Creating ${filePath}`);
    }
}

export const FileUserDataStore: UserDataStore = {
    save: async (tenantId: string, userData: UserData) => {
        let filePath = getUserDataPath(tenantId);
        await ensureExists(filePath);
        await fs.promises.writeFile(filePath, JSON.stringify(userData));
    },

    load: async (tenantId: string) => {
        let filePath = getUserDataPath(tenantId);
        await ensureExists(filePath);
        return JSON.parse(await fs.promises.readFile(filePath, "utf8"));
    },
};
