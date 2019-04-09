import {createSystem, System, SystemTick} from "systems/Systems";
import {RenderableId, TransformId, Transform} from "components/Components";
import {SetupResult as PongRenderer} from "pong-renderer";
import {none, some} from "fp-ts/lib/Option";
export const RendererId = Symbol("renderer");

export const createRenderer = (pongRenderer:PongRenderer):System => {
    const onTick = ({entities}:SystemTick) => {
        //Just reformats the list of transforms into the object the renderer expects
        const items = 
            entities.listWithAllComponents([RenderableId, TransformId])
                .reduce((acc, entity) => {
                    const transform = entity.components.getAs<Transform>(TransformId);
                    return {
                        ...acc,
                        [entity.name]: transform.pos
                    }
                }, {});

        pongRenderer.render(items as any);
    }

    return createSystem({id: RendererId, dispose: none, onTick: some(onTick)});
}
