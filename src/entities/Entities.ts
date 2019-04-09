import {createComponents, Component, Components} from "components/Components";
import {Collection, CollectionItem, createCollection} from "utils/Utils";

export * from "entities/ball/Ball";
export * from "entities/paddle/Paddle";
export * from "entities/wall/Wall";

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
        listWithAllComponents
    };

    return entities;
}
//Used by the individual entities as a foundation to build on
export interface Entity extends CollectionItem {
    components:Components;
}

export const createEntity = (name:string):Entity => {
    return {
        //each entity is unique
        id: Symbol(name),
        components: createComponents(`${name} components`)
    }
}


