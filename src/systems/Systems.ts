import {createComponents, Component, Components} from "components/Components";
import {Entities} from "entities/Entities";
import {Collection, CollectionItem, createCollection, createCollectionItem} from "utils/Utils";
import {Option} from "fp-ts/lib/Option";

export * from "./renderer/Renderer";
export * from "./input/KeyboardInput";
export * from "./transforms/UserTransforms";

export interface SystemTick {
    entities: Entities;
    systems: Systems;
    time: number;
    deltaTime: number;
}

type SystemTickFn = (tick:SystemTick) => void; 

//Used in main
export interface Systems extends Collection<System> {
}

export const createSystems = ():Systems => {
    return createCollection<System>() as Systems;
}

//Used by the systems as a foundation to build on
export interface System extends CollectionItem {
    onTick: Option<SystemTickFn>,
}

export const createSystem = ({id, dispose, onTick}:{id:string | Symbol, dispose: Option<() => void>, onTick: Option<SystemTickFn>}):System => {
    return {
        ...createCollectionItem({id, dispose}),
        onTick,
    }
}

