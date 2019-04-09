import {createComponents, Component, Components} from "components/Components";
import {Collection, CollectionItem, createCollection, createCollectionItem} from "utils/Utils";
import {Option, some, none} from "fp-ts/lib/Option";

export * from "./ball/Ball";
export * from "./paddle/Paddle";
export * from "./wall/Wall";

//Used in main
export interface Entities extends Collection<Entity> {
    listWithComponent: (id:Symbol) => Array<Entity>;
    listWithAnyComponents: (ids:Array<Symbol>) => Array<Entity>;
    listWithAllComponents: (ids:Array<Symbol>) => Array<Entity>;
}


export const createEntities = ():Entities => {
    const _entities = createCollection<Entity>();

    const listWithComponent = (id:Symbol) => 
        _entities.listWith(entity => 
            entity.components.has(id)
        );
    const listWithAnyComponents = (ids:Array<Symbol>) => 
        _entities.listWith(entity => 
            entity.components.hasAny(ids)
        );

    const listWithAllComponents = (ids:Array<Symbol>) => 
        _entities.listWith(entity => 
            entity.components.hasAll(ids)
        );


    const entities = {
        ..._entities,
        listWithComponent,
        listWithAnyComponents,
        listWithAllComponents,
    };

    return entities;
}

//Used by the individual entities as a foundation to build on
export interface Entity extends CollectionItem {
    components:Components;
}

export const createEntity = ({id, dispose}:{id:string | Symbol, dispose: Option<() => void>}):Entity => {
    return {
        ...createCollectionItem({id, dispose}),
        components: createComponents(`${name} components`),
    }
}

