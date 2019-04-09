import {createEntity} from "entities/Entities";
import {none} from "fp-ts/lib/Option";

export const createWall= (side:"left" | "right" | "top" | "bottom") => {
    const wall = createEntity({id: `${side} wall`, dispose: none});
    return wall;
}
