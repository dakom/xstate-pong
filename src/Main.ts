import {buildVersion, isProduction} from "config/Config";
console.log(`%c XState-Pong ${buildVersion} (productionMode: ${isProduction})`, 'color: #4286f4; font-size: large; font-family: "Comic Sans MS", cursive, sans-serif');

import {CollisionName, setup as setupPongRenderer} from "pong-renderer";
import {createEntities, createBall, createPaddle, createWall, BallId} from "entities/Entities";
import {createSystems, createRenderer, createKeyboardInput, createUserTransforms} from "systems/Systems";
import {RenderableId, TransformId} from "components/Components";


setupPongRenderer().then((pongRenderer) => {

    const entities = createEntities();

    const {constants} = pongRenderer;

    entities.add(createBall(constants));
    entities.add(createPaddle("paddle1") (constants));
    entities.add(createPaddle("paddle2") (constants));
    entities.add(createWall("left"));
    entities.add(createWall("right"));
    entities.add(createWall("top"));
    entities.add(createWall("bottom"));

    const systems = createSystems();

    systems.add(createKeyboardInput(entities));
    systems.add(createUserTransforms());
    systems.add(createRenderer(pongRenderer));

    let _lastTime:DOMHighResTimeStamp;

    const tick = (time:DOMHighResTimeStamp) => {
        if(_lastTime) {
            const deltaTime = time - _lastTime;

            systems.list().forEach(system => {
                system.onTick.map(fn => fn({entities, systems, time, deltaTime}));
            });
        }
    
        _lastTime = time;
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
});


