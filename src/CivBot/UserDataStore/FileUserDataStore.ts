import * as fs from 'fs';
import * as path from 'path';
import UserData from "../UserData";
import {UserDataStore} from "./UserDataStore";

export default class FileUserDataStore implements UserDataStore {
    getUserDataPath(tenantId: string) {
        return `./userdata/${tenantId}.json`;
    }

    async ensureExists(filePath: string): Promise<void> {
        return fs.promises.mkdir(path.dirname(filePath), {recursive: true})
            .then(() => fs.promises.readFile(filePath))
            .then(() => {
                return;
            })
            .catch(() => {
                fs.promises.writeFile(filePath, JSON.stringify(new UserData()));
                console.log(`Creating ${filePath}`);
            });
    }

    async save(tenantId: string, userData: UserData): Promise<void> {
        let filePath = this.getUserDataPath(tenantId);
        return this.ensureExists(filePath)
            .then(() => fs.promises.writeFile(filePath, JSON.stringify(userData)));
    }

    async load(tenantId: string): Promise<UserData> {
        let filePath = this.getUserDataPath(tenantId);
        return this.ensureExists(filePath)
            .then(() => fs.promises.readFile(filePath, 'utf8'))
            .then((value) => JSON.parse(value));
    }
}