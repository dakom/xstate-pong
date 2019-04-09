import {createEntity} from "entities/Entities";
import {createRenderable} from "components/Components";
import {createTransform} from "components/Components";
import {createKeyboardController} from "components/Components";
import {createControllerMotion} from "components/Components";
import {none} from "fp-ts/lib/Option";
export const Paddle1Id = Symbol("paddle1");
export const Paddle2Id = Symbol("paddle2");


interface Constants {
    canvasWidth: number;
    canvasHeight: number;
    paddleWidth: number;
    paddleHeight: number;
}

export const createPaddle = (name:"paddle1" | "paddle2") => ({canvasWidth, canvasHeight, paddleWidth, paddleHeight}:Constants) => {
    const id = name === "paddle1" ? Paddle1Id : Paddle2Id;

    const paddle = createEntity({id, dispose: none});
    const transform = createTransform();

    if(id === Paddle1Id) {
        transform.pos.x = paddleWidth/2;
        transform.pos.y = canvasHeight/2;

        paddle.components.add(createKeyboardController());

        paddle.components.add(createControllerMotion({
            limitTop: paddleHeight/2,
            limitBottom: canvasHeight - paddleHeight/2,
            speed: 1
        }));

    } else {
        transform.pos.x = canvasWidth - (paddleWidth/2);
        transform.pos.y = canvasHeight/2;
    }
    
    paddle.components.add(transform);
    paddle.components.add(createRenderable(name));

    return paddle;
}
