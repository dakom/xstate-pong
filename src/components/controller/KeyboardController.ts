import {createComponent, Component} from "components/Components";
import {Option, some, none} from "fp-ts/lib/Option";
import {Direction} from "utils/Utils";
import {Machine, interpret, actions} from "xstate";
import {polarControllerMachine} from "./machines/PolarController-Machine";

const {assign} = actions;


export const KeyboardControllerId = Symbol("keyboardController");

export interface KeyboardController extends Component {
    getVerticalDirection: () => Option<"up" | "down">;
    getHorizontalDirection: () => Option<"left" | "right">;
    getStart: () => boolean;
    updateKeyPress: (key:string) => void;
    updateKeyRelease: (key:string) => void;
}

const keyDirectionLookup = new Map<string, Direction>();
keyDirectionLookup.set("ArrowUp", "up");
keyDirectionLookup.set("KeyW", "up");
keyDirectionLookup.set("ArrowDown", "down");
keyDirectionLookup.set("KeyS", "down");
keyDirectionLookup.set("ArrowLeft", "left");
keyDirectionLookup.set("KeyA", "left");
keyDirectionLookup.set("ArrowRight", "right");
keyDirectionLookup.set("KeyD", "right");


const verticalStateToDirection = (state):Option<"up" | "down"> =>
    state.matches("positive") ? some("up")
        : state.matches("negative") ? some("down")
        : none;

const horizontalStateToDirection = (state):Option<"left" | "right"> =>
    state.matches("positive") ? some("right")
        : state.matches("negative") ? some("left")
        : none;

export const createKeyboardController = ():KeyboardController => {
    //Private
    let verticalDirection = verticalStateToDirection(polarControllerMachine.initialState);
    let horizontalDirection = horizontalStateToDirection(polarControllerMachine.initialState);

    const verticalService = interpret(polarControllerMachine).onTransition(_state => {
        verticalDirection = verticalStateToDirection(_state);
    }).start();

    const horizontalService = interpret(polarControllerMachine).onTransition(_state => {
        horizontalDirection = horizontalStateToDirection(_state);
    }).start();

    const directionToService = (dir:Direction) => 
        dir === "up" || dir === "down"
            ? verticalService
            : horizontalService;

    const keyToDirection = (key:string):Option<Direction> => {
        return keyDirectionLookup.has(key) ? some(keyDirectionLookup.get(key)) : none;
    }

    const directionToEvent = (evtType:"START" | "END") => (dir:Direction) => 
        `${evtType}_${dir === "up" || dir === "right" ? "POSITIVE" : "NEGATIVE"}`;

    //Exported
    const getVerticalDirection= () => verticalDirection;

    const getHorizontalDirection= () => horizontalDirection;

    //TODO
    const getStart = () => false;

    const updateKeyPress = (key:string) => {
        keyToDirection(key)
            .map(direction => {
                const service = directionToService(direction);
                const evtType = directionToEvent("START") (direction);
                service.send({type: evtType, trigger: key});
            });
    }

    const updateKeyRelease = (key:string) => {
        keyToDirection(key)
            .map(direction => {
                const service = directionToService(direction);
                const evtType = directionToEvent("END") (direction);
                service.send({type: evtType, trigger: key});
            });
    }


    return {
        ...createComponent({id: KeyboardControllerId, dispose: none}),
        getVerticalDirection,
        getHorizontalDirection,
        getStart,
        updateKeyPress,
        updateKeyRelease,
    }
}
