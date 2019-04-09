import {createEntity} from "entities/Entities";

export const createWall= (side:"left" | "right" | "top" | "bottom") => {
    const wall = createEntity(`${side} wall`);
    return wall;
}
