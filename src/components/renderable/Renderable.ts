import {createComponent, Component} from "components/Components";

export const RenderableId = Symbol("renderable");

interface Renderable extends Component {
    mesh: boolean;
}

export const createRenderable = ():Renderable => {
    const _renderable = createComponent(RenderableId);

    const renderable:Renderable = {
        mesh: true,
        ..._renderable
    }
    return renderable;
}
