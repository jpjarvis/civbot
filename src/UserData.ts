import { rejects } from 'assert/strict'
import * as fs from 'fs'
import { resolve } from 'path/posix'
import { promisify } from 'util'
import * as path from 'path'

function getUserDataPath(serverId: string) {
    return `./userdata/${serverId}.json`
}

async function ensureExists(filePath: string): Promise<void> {
    return fs.promises.mkdir(path.dirname(filePath), { recursive: true })
        .then(() => fs.promises.readFile(filePath))
        .then(() => { return })
        .catch(() => {
            fs.promises.writeFile(filePath, JSON.stringify(new UserData()))
            console.log(`Creating ${filePath}`)
        })
}

export default class UserData {
    customCivs: Array<string> = []

    static async save(serverId: string, userData: UserData): Promise<void> {
        let filePath = getUserDataPath(serverId)
        return ensureExists(filePath)
            .then(() => fs.promises.writeFile(filePath, JSON.stringify(userData)))
    }

    static async load(serverId: string): Promise<UserData> {
        let filePath = getUserDataPath(serverId)
        return ensureExists(filePath)
            .then(() => fs.promises.readFile(filePath, 'utf8'))
            .then((value) => JSON.parse(value))
    }
}