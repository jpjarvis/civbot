import * as fs from "fs";
import * as path from "path";
import { createEmptyUserData, UserData } from "../Types/UserData";
import { UserDataStore } from "./UserDataStore";

function getUserDataPath(tenantId: string) {
    return `./userdata/${tenantId}.json`;
}

async function ensureExists(filePath: string): Promise<void> {
    return fs.promises
        .mkdir(path.dirname(filePath), { recursive: true })
        .then(() => fs.promises.readFile(filePath))
        .then(() => {
            return;
        })
        .catch(() => {
            fs.promises.writeFile(filePath, JSON.stringify(createEmptyUserData()));
            console.log(`Creating ${filePath}`);
        });
}

export const FileUserDataStore: UserDataStore = {
    save: async (tenantId: string, userData: UserData) => {
        let filePath = getUserDataPath(tenantId);
        return ensureExists(filePath).then(() => fs.promises.writeFile(filePath, JSON.stringify(userData)));
    },

    load: async (tenantId: string) => {
        let filePath = getUserDataPath(tenantId);
        return ensureExists(filePath)
            .then(() => fs.promises.readFile(filePath, "utf8"))
            .then((value) => JSON.parse(value));
    },
};
