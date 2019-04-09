import {createComponent, Component, Transform} from "components/Components";
import {Option, none, some} from "fp-ts/lib/Option";
export const ControllerMotionId = Symbol("controllerMotion");

export interface ControllerMotion extends Component {
    getY: (direction: "up" | "down") => (deltaTime:number) => (posY:number) => Option<number>;
}

interface Options {
    limitTop: number;
    limitBottom: number;
    speed: number;
}

/*
 * Determines motion based on controller settings (up or down), tick info, and previous position
 * Also allows per-component config for limits and speed
 *
 * We're using a function that closes over time to create a trajectory that's evaluated on tick
 * It's only changed when the controller direction changes
 * Maybe this alleviates some floating-point accumulation errors...
 */
export const createControllerMotion = ({limitTop, limitBottom, speed}:Options):ControllerMotion => {

    let _lastDirection: "up" | "down";

    let fn:(time:number) => number;

    const createTrajectoryFunction = (posY:number) => (initialTime:number) => (multiplier:number) => {
        return (time:number) => posY + ((time - initialTime) * speed * multiplier)
    }

    const getY = (direction: "up" | "down") => (time:number) => (posY:number):Option<number> => {
        if(_lastDirection !== direction) {
            fn = createTrajectoryFunction (posY) (time) (direction === "down" ? -1 : 1); 
            _lastDirection = direction;
        }

        const y = fn(time); 

        if(y < limitTop || y > limitBottom) {
            return none;
        }

        return some(y);
    }

    return {
        ...createComponent({id: ControllerMotionId, dispose: none}),
        getY
    }
}
