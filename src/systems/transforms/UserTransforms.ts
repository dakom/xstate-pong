import {createSystem, System, SystemTick} from "systems/Systems";
import {Entities} from "entities/Entities";
import {TransformId, Transform, ControllerMotionId, ControllerMotion, KeyboardControllerId, KeyboardController} from "components/Components";
import {some, none} from "fp-ts/lib/Option";

export const UserTransformsId = Symbol("userTransforms");

/*
 * Takes the current controller, and requests motion from that and tick info
 * If motion declines an update, do nothing
 */
export const createUserTransforms = ():System => {

    const onTick = ({entities, systems, time}:SystemTick) => {

        entities.listWithAllComponents([KeyboardControllerId, ControllerMotionId, TransformId])
            .forEach(entity => {

                const controller = entity.components.getAs<KeyboardController>(KeyboardControllerId);
                const motion = entity.components.getAs<ControllerMotion>(ControllerMotionId);
                const transform = entity.components.getAs<Transform>(TransformId);

                motion.update(controller.getVerticalDirection()) (time) (transform.pos.y);

                motion.getY(time).map(y => {
                    transform.pos.y = y;
                });

            });
    }

    return createSystem({id: UserTransformsId, dispose: none, onTick: some(onTick)});
}
