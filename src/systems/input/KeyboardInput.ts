import {createSystem, System, SystemTick} from "systems/Systems";
import {Entities} from "entities/Entities";
import {KeyboardControllerId, KeyboardController} from "components/Components";
import {some, none} from "fp-ts/lib/Option";
import {SetupResult as PongRenderer} from "pong-renderer";

export const KeyboardInputId = Symbol("keyboardInput");

export const createKeyboardInput = (entities:Entities):System => {

    const handleKey = (evt:KeyboardEvent) => {
        const key = evt.code || evt.key;
        entities.listWithComponent(KeyboardControllerId)
            .forEach(entity => {
                const controller = entity.components.getAs<KeyboardController>(KeyboardControllerId);
                if(evt.type === "keydown") {
                    controller.updateKeyPress(key);
                } else if(evt.type === "keyup") {
                    controller.updateKeyRelease(key);
                }
            });
    }

    document.addEventListener("keydown", handleKey, true);
    document.addEventListener("keyup", handleKey, true);

    const dispose = () => {
        document.removeEventListener("keydown", handleKey, true);
        document.removeEventListener("keyup", handleKey, true);
    }

    return createSystem({id: KeyboardInputId, dispose: some(dispose), onTick: none});
}
