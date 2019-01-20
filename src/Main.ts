import {buildVersion, isProduction} from "utils/config/Config";
import {setup, CollisionName} from "pong-renderer";

console.log(`%c XState-Pong ${buildVersion} (productionMode: ${isProduction})`, 'color: #4286f4; font-size: large; font-family: "Comic Sans MS", cursive, sans-serif');


setup().then(({constants, render: _render, addPoint, playCollisionAudio}) => {
    const {canvasWidth, canvasHeight, paddleWidth} = constants;

    //Render the items in the middle of the screen (without helper)
    //Real-world would have this in a requestAnimationFrame cycle
    //With the dynamic object positions
    const render = () => _render({
        ball: {x: canvasWidth/2, y: canvasHeight/2},
        paddle1: {x: paddleWidth/2, y: canvasHeight/2},
        paddle2: {x: canvasWidth - (paddleWidth/2), y: canvasHeight/2},
    });

    //This would be called based on physics
    //We could decide to have a different audio player or use the default 
    const handleCollision = (collisionName:CollisionName) => {
        if(collisionName === CollisionName.LEFT_WALL) {
            addPoint(2);
        } else if(collisionName === CollisionName.RIGHT_WALL) {
            addPoint(1);
        } 

        playCollisionAudio(collisionName);

        //re-render to show updated score
        render();
    }

    //Just to give the idea - pretend the ball hit the left wall on click
    //Some browsers requires a user gesture before playing audio
    window.onclick = () => handleCollision(CollisionName.LEFT_WALL);

    //Render the first screen
    render();
});


