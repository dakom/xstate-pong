import {createEntity} from "entities/Entities";
import {createRenderable} from "components/Components";
import {createTransform} from "components/Components";

export const createBall = (name:string = "ball") => {
    const ball = createEntity(name);
    ball.components.add(createRenderable());
    ball.components.add(createTransform());
    return ball;
}
