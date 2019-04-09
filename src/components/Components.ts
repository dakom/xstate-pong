import {Collection, CollectionItem, createCollection, createCollectionItem} from "utils/Utils";
import {Option} from "fp-ts/lib/Option";
export * from "./renderable/Renderable";
export * from "./transform/Transform";
export * from "./controller/KeyboardController";
export * from "./motion/ControllerMotion";

//Used in entities
export interface Components extends Collection<Component> {
}
export const createComponents = (name?:string):Components => {
    return createCollection<Component>(name);
}

//Used by the component as a foundation to build on
export interface Component extends CollectionItem {
}

export const createComponent = ({id, dispose}:{id: string | Symbol, dispose: Option<() => void>}):Component => {
    return {
        ...createCollectionItem({id, dispose}),
    }
}

