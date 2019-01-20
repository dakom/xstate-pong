import {buildVersion, isProduction} from "utils/config/Config";
import {setup, CollisionName, ControllerValue} from "pong-renderer";

console.log(`%c XState-Pong ${buildVersion} (productionMode: ${isProduction})`, 'color: #4286f4; font-size: large; font-family: "Comic Sans MS", cursive, sans-serif');

let _onCollision; //Just for demo purposes
const handleController = (value:ControllerValue) => {
    if(value === ControllerValue.UP) {
        //real-world would move paddle
        _onCollision(CollisionName.LEFT_WALL);
    }
}

setup({ handleController}).then(({constants, onRender, onCollision}) => {
    const {canvasWidth, canvasHeight, ballRadius, paddleWidth, paddleHeight} = constants;

    //Render the items in the middle of the screen (without helper)
    onRender({
        ball: {x: canvasWidth/2, y: canvasHeight/2},
        paddle1: {x: paddleWidth/2, y: canvasHeight/2},
        paddle2: {x: canvasWidth - (paddleWidth/2), y: canvasHeight/2},
    });

    //Can't call it right away in some browsers
    //so deferred until user presses up
    _onCollision = onCollision;
});
