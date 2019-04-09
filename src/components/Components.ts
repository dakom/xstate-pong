import {Collection, CollectionItem, createCollection} from "utils/Utils";
export * from "./renderable/Renderable";
export * from "./transform/Transform";

//Used by the component as a foundation to build on
export interface Component extends CollectionItem {
}

export const createComponent = (id:Symbol):Component => {
    return {
        id
    }
}

//Used in entities
export interface Components extends Collection<Component> {
}
export const createComponents = (name?:string):Components => {
    return createCollection<Component>(name);
}
