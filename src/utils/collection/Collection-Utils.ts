import {Option, some, none} from "fp-ts/lib/Option";
import {getSymbolString} from "utils/Utils";

//As long as the interface is satisfied, this
//could be replaced with a different storage (e.g. Immutable.JS)

export interface Collection <T extends CollectionItem> {
    id: Symbol,
    add: (item:T) => Collection<T>;
    remove: (id:Symbol) => Collection<T>;
    get: (id:Symbol) => Option<T>;
    getAs: <V extends T>(id:Symbol) => V; //unsafe
    getFirstWith: (pred: (item:T) => boolean) => Option<T>;
    getFirstWithName: (name:string) => Option<T>;
    list: () => Array<T>;
    listIds: () => Array<Symbol>;
    listWith: (pred:(item:T) => boolean) => Array<T>; 
    has: (id:Symbol) => boolean;
    hasAny: (ids:Array<Symbol>) => boolean;
    hasAll: (ids:Array<Symbol>) => boolean;
}

export interface CollectionItem {
    id: Symbol;
    name: string;
    dispose: Option<() => void>;
}

export const createCollection = <T extends CollectionItem>(name?:string):Collection<T> => {

    let _listDirty: boolean = false;
    let _list: Array<T> = [];

    const items = new Map<Symbol, T>(); 

    const collection:Partial<Collection<T>> = {
        id: Symbol(name)
    }

    collection.add = (item:T) => {
        items.set(item.id, item);
        _listDirty = true;
        return collection as Collection<T>;
    }


    collection.remove = (id:Symbol) => {
        const item = items.get(id);
        if(item) {
            item.dispose.map(fn => fn());
            items.delete(id);
            _listDirty = true;
        }
        return collection as Collection<T>;
    }


    collection.get = (id:Symbol) => {
        const item = items.get(id);
        return item ? some(item) : none;
    }

    //unsafe
    collection.getAs = <V extends T>(id:Symbol) => {
        return items.get(id) as V;
    }

    collection.getFirstWith = (pred:(item:T) => boolean) => {

        for (let item of items.values()) {
            if(pred(item)) {
                return some(item);
            }
        }
        return none;
    }

    collection.getFirstWithName = (name:string) => 
        collection.getFirstWith(item => item.name === name);

    collection.list = () => {
        if(_listDirty) {
            _list = Array.from(items.values()); 
            _listDirty = false;
        }

        return _list;
    }

    collection.listIds = () => collection.list().map(({id}) => id);

    collection.listWith = (pred:(item:T) => boolean) => collection.list().filter(pred);

    collection.has = (id:Symbol) => items.has(id);

    collection.hasAny = (ids:Array<Symbol>) => ids.some(collection.has);
    collection.hasAll = (ids:Array<Symbol>) => ids.every(collection.has);

    return collection as Collection<T>;
}

export const createCollectionItem = ({id, dispose}:{id: string | Symbol, dispose: Option<() => void>}):CollectionItem => ({
    id: typeof id === "string" ? Symbol(id) : id,
    name: typeof id === "string" ? id : getSymbolString(id),
    dispose
})
