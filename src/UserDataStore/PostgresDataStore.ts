import {UserDataStore} from "./interface";
import UserData from "../UserData";
import {Client} from "pg";

const connectionString = process.env['DATABASE_URL']!;

export default class PostgresDataStore implements UserDataStore {
    async load(serverId: string): Promise<UserData> {
        const client = new Client({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false
            }
        });
        await client.connect();
        
        const result = await client.query("select data from userdata where serverid = $1", [serverId])
        
        if (!result.rows || result.rows.length == 0) {
            const userData = new UserData();
            await client.query(
                "insert into userdata VALUES ($1, $2)",
                [serverId, JSON.stringify(userData)]
            )
            return userData;
        }
        
        const row = result.rows[0]["data"];
        await client.end();
        return JSON.parse(row);
    }

    async save(serverId: string, userData: UserData): Promise<void> {
        const client = new Client({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false
            }
        });
        await client.connect();

        const existingData = await client.query(
            "select data from userdata where serverid = $1",
            [serverId]
        )

        if (!existingData.rows || existingData.rows.length == 0) {
            await client.query(
                "insert into userdata VALUES ($1, $2)",
                [serverId, JSON.stringify(userData)]
            )
        }
        else {
            await client.query(
                "update userdata set data = $2 where serverId = $1",
                [serverId, JSON.stringify(userData)]
            )
        }
        
        await client.end();
    }

}