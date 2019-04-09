import {createComponent, Component} from "components/Components";
import {none} from "fp-ts/lib/Option";
export const RenderableId = Symbol("renderable");

export type WorldId = "ball" | "paddle1" | "paddle2";

interface Renderable extends Component {
    worldId: WorldId;
}

export const createRenderable = (worldId:WorldId):Renderable => {
    const _renderable = createComponent({id: RenderableId, dispose: none});

    const renderable:Renderable = {
        worldId,
        ..._renderable
    }

    return renderable;
}
