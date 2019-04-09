import {createEntity} from "entities/Entities";
import {createRenderable} from "components/Components";
import {createTransform} from "components/Components";

import {none} from "fp-ts/lib/Option";
export const BallId = Symbol("ball");

interface Constants {
    canvasWidth: number;
    canvasHeight: number;
}

export const createBall = ({canvasWidth, canvasHeight}:Constants) => {
    const ball = createEntity({id: BallId, dispose: none});
    ball.components.add(createRenderable("ball"));

    const transform = createTransform();

    transform.pos.x = canvasWidth/2;
    transform.pos.y = canvasHeight/2;
    ball.components.add(transform);
    return ball;
}
