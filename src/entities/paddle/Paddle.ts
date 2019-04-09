import {createEntity} from "entities/Entities";

export const createPaddle = (side:"left" | "right") => {
    const paddle = createEntity(`${side} paddle`);
    return paddle;
}
