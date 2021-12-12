import CivData from "./CivData";

export default interface CivDataAccessor {
    getCivData(): CivData;
}