import { FileUserDataStore } from "./FileUserDataStore";
import { UserDataStore } from "./UserDataStore";

const userDataStore: UserDataStore = FileUserDataStore;

export const saveUserData = userDataStore.save;
export const loadUserData = userDataStore.load;
