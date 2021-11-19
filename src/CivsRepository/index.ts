import {CivsRepository} from "./interface";
import FileAndUserDataCivsRepository from "./FileAndUserDataCivsRepository";

export const CivsRepositoryInstance : CivsRepository = new FileAndUserDataCivsRepository()