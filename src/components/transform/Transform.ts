import {createComponent, Component} from "components/Components";
import {Point} from "utils/Utils";

export const TransformId = Symbol("transform");

interface Transform extends Component {
    pos: Point
}

export const createTransform = ():Transform => {
    const _transform = createComponent(TransformId);

    return {
        pos: {x: 0, y: 0},
        ..._transform
    }
}
