import { createEmptyUserData, UserData } from "../UserData/UserData";
import { Client } from "pg";
import { UserDataStore } from "./UserDataStore";

const connectionString = process.env["DATABASE_URL"]!;

export const PostgresDataStore: UserDataStore = {
    load: async (tenantId: string) => {
        const client = new Client({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false,
            },
        });
        await client.connect();

        const result = await client.query("select data from userdata where serverid = $1", [tenantId]);

        if (!result.rows || result.rows.length == 0) {
            const userData = createEmptyUserData();
            await client.query("insert into userdata VALUES ($1, $2)", [tenantId, JSON.stringify(userData)]);
            return userData;
        }

        const row = result.rows[0]["data"];
        await client.end();
        return JSON.parse(row);
    },

    save: async (tenantId: string, userData: UserData) => {
        const client = new Client({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false,
            },
        });
        await client.connect();

        const existingData = await client.query("select data from userdata where serverid = $1", [tenantId]);

        if (!existingData.rows || existingData.rows.length == 0) {
            await client.query("insert into userdata VALUES ($1, $2)", [tenantId, JSON.stringify(userData)]);
        } else {
            await client.query("update userdata set data = $2 where serverId = $1", [
                tenantId,
                JSON.stringify(userData),
            ]);
        }

        await client.end();
    },
};
