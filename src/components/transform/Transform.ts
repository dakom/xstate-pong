import {createComponent, Component} from "components/Components";
import {Point} from "utils/Utils";
import {none} from "fp-ts/lib/Option";
export const TransformId = Symbol("transform");

export interface Transform extends Component {
    pos: Point
}

export const createTransform = ():Transform => {
    return {
        ...createComponent({id: TransformId, dispose: none}),
        pos: {x: 0, y: 0},
    }
}
