import {buildVersion, isProduction} from "config/Config";
console.log(`%c XState-Pong ${buildVersion} (productionMode: ${isProduction})`, 'color: #4286f4; font-size: large; font-family: "Comic Sans MS", cursive, sans-serif');

import {CollisionName, setup as setupRenderer} from "pong-renderer";
import {createEntities, createBall, createPaddle, createWall} from "entities/Entities";
import {RenderableId, TransformId} from "components/Components";

setupRenderer().then((renderer) => {
    const entities = createEntities();

    const ball = createBall();
    entities.add(ball);
    entities.add(createPaddle("left"));
    entities.add(createPaddle("right"));
    entities.add(createWall("left"));
    entities.add(createWall("right"));
    entities.add(createWall("top"));
    entities.add(createWall("bottom"));

    console.log(ball.components.listIds());
    /*
    console.log("all entities");
    console.log(entities.list());

    console.log("entities with renderable:");
    console.log(entities.listWithComponent(RenderableId));
    
    console.log("entities with renderable Or transform:");
    console.log(entities.listWithAnyComponents([RenderableId, TransformId]));
    
    console.log("entities with renderable And transform:");
    console.log(entities.listWithAllComponents([RenderableId, TransformId]));
    */
    /*
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
            addScorePoint(2);
        } else if(collisionName === CollisionName.RIGHT_WALL) {
            addScorePoint(1);
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
    */
});


