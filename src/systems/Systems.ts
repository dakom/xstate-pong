import {createComponents, Component, Components} from "components/Components";
import {Collection, CollectionItem, createCollection} from "utils/Utils";

export * from "entities/ball/Ball";
export * from "entities/paddle/Paddle";
export * from "entities/wall/Wall";

//Used by the systems as a foundation to build on
export interface System extends CollectionItem {
}

export const createSystem = (id:Symbol):System => {
    return {
        id,
    }
}


//Used in main
export interface Systems extends Collection<System> {
}

export const createSystems = ():Systems => {
    return createCollection<System>() as Systems;
}
