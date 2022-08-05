import { FileUserDataStore } from "./FileUserDataStore";
import { PostgresDataStore } from "./PostgresDataStore";
import { UserDataStore } from "./UserDataStore";

const userDataStore: UserDataStore = process.env["DATABASE_URL"] ? PostgresDataStore : FileUserDataStore;

export const saveUserData = userDataStore.save;
export const loadUserData = userDataStore.load;
