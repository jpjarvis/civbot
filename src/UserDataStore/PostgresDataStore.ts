import {UserDataStore} from "./interface";
import UserData from "../UserData";
import {Connection} from "postgresql-client";

const connectionString = process.env['DATABASE_URL']! + "?sslmode=require";

export default class PostgresDataStore implements UserDataStore {
    async load(serverId: string): Promise<UserData> {
        const connection = new Connection(connectionString);
        await connection.connect();
        
        const result = await connection.query(
            "select data from userdata where serverid = $1",
        {params: [serverId]}
        )
        
        if (!result.rows || result.rows.length == 0) {
            const userData = new UserData();
            await connection.query(
                "insert into userdata VALUES ($1, $2)",
                {params: [serverId, JSON.stringify(userData)]}
            )
            return userData;
        }
        
        const row = result.rows[0][0];
        await connection.close();
        return JSON.parse(row);
    }

    async save(serverId: string, userData: UserData): Promise<void> {
        const connection = new Connection(connectionString);
        await connection.connect();

        const existingData = await connection.query(
            "select data from userdata where serverid = $1",
            {params: [serverId]}
        )

        if (!existingData.rows || existingData.rows.length == 0) {
            await connection.query(
                "insert into userdata VALUES ($1, $2)",
                {params: [serverId, JSON.stringify(userData)]}
            )
        }
        else {
            await connection.query(
                "update userdata set data = $2 where serverId = $1",
                {params: [serverId, JSON.stringify(userData)]}
            )
        }
        
        await connection.close();
    }

}