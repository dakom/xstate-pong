import {createComponent, Component, Transform} from "components/Components";
import {Option, none, some} from "fp-ts/lib/Option";
export const ControllerMotionId = Symbol("controllerMotion");

export interface ControllerMotion extends Component {
    update: (direction: Option<"up" | "down">) => (time:number) => (posY:number) => void;
    getY: (time:number) => Option<number>;
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

    let _lastDirection: Option<"up" | "down"> = none;

    let fn:Option<(time:number) => number> = none;

    const createTrajectoryFunction = (posY:number) => (initialTime:number) => (multiplier:number) => {
        return (time:number) => posY + ((time - initialTime) * speed * multiplier)
    }

    const update = (direction: Option<"up" | "down">) => (time:number) => (posY:number) => {
        if(_lastDirection.getOrElse(null) !== direction.getOrElse(null)) {

            console.log("updating traj!");

            direction.foldL(
                () => {
                    fn = some(() => posY);
                }, 
                dir => {
                    fn = some(createTrajectoryFunction (posY) (time) (dir === "down" ? -1 : 1)); 
                }
            );

            _lastDirection = direction;
        }
    }

    const getY = (time:number):Option<number> => {
        return fn.chain(f => {
            const y = f(time); 

            if(y < limitTop || y > limitBottom) {
                return none;
            }

            return some(y);
        });
    }

    return {
        ...createComponent({id: ControllerMotionId, dispose: none}),
        update,
        getY
    }
}
