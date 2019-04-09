import {Option, some, none} from "fp-ts/lib/Option";

//As long as the interface is satisfied, this
//could be replaced with a different storage (e.g. Immutable.JS)

export interface Collection <T extends CollectionItem> {
    id: Symbol,
    add: (item:T) => Collection<T>;
    remove: (id:Symbol) => Collection<T>;
    get: (id:Symbol) => T;
    safeGet: (id:Symbol) => Option<T>;
    getFirstWith: (pred: (item:T) => boolean) => T;
    safeGetFirstWith: (pred: (item:T) => boolean) => Option<T>;
    list: () => Array<T>;
    listIds: () => Array<Symbol>;
    listWith: (pred:(item:T) => boolean) => Array<T>; 
    has: (id:Symbol) => boolean;
    hasAny: (ids:Array<Symbol>) => boolean;
    hasAll: (ids:Array<Symbol>) => boolean;
}

export interface CollectionItem {
    id: Symbol;
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
        items.delete(id);
        _listDirty = true;
        return collection as Collection<T>;
    }

    collection.get = (id:Symbol) => items.get(id);

    collection.safeGet = (id:Symbol) => {
        const item = collection.get(id);
        return item ? some(item) : none;
    }

    collection.getFirstWith = (pred:(item:T) => boolean) => {
        for (const [_, item] of Object.entries(items)) {
            if(pred(item)) {
                return item;
            }
        }
        return null;
    }

    collection.safeGetFirstWith = (pred:(item:T) => boolean) => {
        const item = collection.getFirstWith(pred);
        return item ? some(item) : none;
    }

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
