import {createComponent, Component} from "components/Components";
import {Option, some, none} from "fp-ts/lib/Option";
import {Point} from "utils/Utils";
import {Machine, interpret, actions} from "xstate";

const {assign} = actions;

export const KeyboardControllerId = Symbol("keyboardController");

export interface KeyboardController extends Component {
    getDirection: () => Option<"up" | "down">;
    getLaunch: () => boolean;
    updateKeyPress: (key:string) => void;
    updateKeyRelease: (key:string) => void;
}

export const createKeyboardController = ():KeyboardController => {

    let state = machine.initialState;

    const service = interpret(machine).onTransition(_state => {
        if(_state.changed) {
            console.log(state.context.isLaunching);
            state = _state;
        }
    }).start();

    const getDirection = ():Option<"up" | "down"> => 
        state.matches("up") ? some("up")
        : state.matches("down") ? some("down")
        : none;

    const updateKeyPress = (key:string) => {
        service.send({type: "KEY_PRESS", key});
    }

    const updateKeyRelease = (key:string) => {
        service.send({type: "KEY_RELEASE", key});
    }

    const getLaunch = () => {
        return state.context.isLaunching
    }

    return {
        ...createComponent({id: KeyboardControllerId, dispose: none}),
        getDirection,
        updateKeyPress,
        updateKeyRelease,
        getLaunch
    }
}

const machine = Machine({
    id: "keyboardController",
    initial: "none",
    context: {
        activeKey: "",
        isLaunching: false
    } as any,
    states: {
        //TODO - move launch into parallel state!
        //Shouldn't be updating the console log above on hold...
        //Needs to move into explicit state rather than update context on every update
        none: {
            onEntry: "clearActive",
            on: {
                KEY_PRESS: [
                    {
                        target: "up",
                        cond: "keyIsUp"
                    },

                    {
                        target: "down",
                        cond: "keyIsDown"
                    },

                    {
                        actions: "setLaunch",
                        cond: "keyIsLaunch"
                    }
                ],

                KEY_RELEASE: {
                    actions: "clearLaunch",
                    cond: "keyIsLaunch"
                }
            }
        },
        up: {
            onEntry: "setActive",
            on: {
                KEY_RELEASE: [
                    {
                        target: "none",
                        cond: "keyIsActive"
                    },

                    {
                        actions: "clearLaunch",
                        cond: "keyIsLaunch"
                    }
                ],

                KEY_PRESS: {
                    actions: "setLaunch",
                    cond: "keyIsLaunch"
                }
            }
        },
        down: {
            onEntry: "setActive",
            on: {
                KEY_RELEASE: [
                    {
                        target: "none",
                        cond: "keyIsActive"
                    },

                    {
                        actions: "clearLaunch",
                        cond: "keyIsLaunch"
                    }
                ],

                KEY_PRESS: {
                    actions: "setLaunch",
                    cond: "keyIsLaunch"
                }
            }
        },
    }
}, {
    actions: {
        setActive: assign({
            activeKey: (ctx, evt) => evt.key
        }),

        clearActive: assign({
            activeKey: (ctx, evt) => ""
        }),

        clearLaunch: assign({
            isLaunching: () => false
        }),

        setLaunch: assign({
            isLaunching: () => true
        })
    },
    guards: {
        keyIsActive: (ctx, evt) => {
            return ctx.activeKey === evt.key;
        },

        keyIsUp: (ctx, evt) => {
            const {key} = evt;
            return key === "ArrowUp" || key === "KeyW"
        },

        keyIsDown: (ctx, evt) => {
            const {key} = evt;
            return key === "ArrowDown" || key === "KeyS"
        },

        keyIsLaunch: (ctx, evt) => {
            const {key} = evt;
            return key === "Space";
        }
    }
});
