import { UserData } from "./UserData";

export type FeatureFlag = "Wowser";

export function isFeatureEnabled(userData: UserData, featureFlag: FeatureFlag) {
    return userData.featureFlags?.includes(featureFlag) ?? false;
}
