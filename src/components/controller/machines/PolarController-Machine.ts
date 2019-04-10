import {Machine, interpret, actions} from "xstate";
import {Option, some, none} from "fp-ts/lib/Option";
const {assign} = actions;

/*
 * This represents a switch that can be in 3 states:
 * neutral, positive, and negative
 *
 * it also (optionally) supports moving between these states from multiple triggers
 * in the case where multiple triggers are used, they must ALL be released to move out of the state
 */

export const polarControllerMachine = Machine({
    id: "polarController",
    initial: "neutral",
    context: {
        triggers: new Set()
    },
    states: {
        neutral: {
            onEntry: "clearTriggers",
            on: {
                START_POSITIVE: "positive",
                START_NEGATIVE: "negative",
            }
        },

        positive: {
            onEntry: "addTrigger",

            on: {
                START_POSITIVE: {
                    actions: "addTrigger",
                },
                END_POSITIVE: [
                    {
                        actions: "removeTrigger",
                        cond: "isNotLastTrigger",
                    }, 
                    {
                        target: "neutral",
                        cond: "isLastTrigger"
                    },
                ]
            }
        },

        negative: {
            onEntry: "addTrigger",

            on: {
                START_NEGATIVE: {
                    actions: "addTrigger",
                },
                END_NEGATIVE: [
                    {
                        actions: "removeTrigger",
                        cond: "isNotLastTrigger",
                    }, 
                    {
                        target: "neutral",
                        cond: "isLastTrigger"
                    },
                ]
            }
        },
    }
},{
    actions: {
        clearTriggers: assign({
            triggers: (ctx) => {
                ctx.triggers.clear();
                return ctx.triggers;
            }
        }),

        addTrigger: assign({
            triggers: (ctx, evt) => {
                if(evt.trigger) {
                    ctx.triggers.add(evt.trigger);
                }
                return ctx.triggers;
            }
        }),

        removeTrigger: assign({
            triggers: (ctx, evt) => {
                if(evt.trigger) {
                    ctx.triggers.delete(evt.trigger);
                }
                return ctx.triggers;
            }
        })
    },
    guards: {
        isLastTrigger: (ctx, evt) => {
            if(ctx.triggers.size && !evt.trigger) {
                console.warn("either use triggers with polarController or don't...");
            }

            return (!ctx.triggers.size || (ctx.triggers.size === 1 && ctx.triggers.has(evt.trigger)))
                ? true
                : false
        },

        isNotLastTrigger: (ctx, evt) => {
            if(!ctx.triggers.size) {
                //not entirely true, but relatively true for the desired outcome
                return false;
            }

            return (ctx.triggers.size > 1 || (ctx.triggers.size === 1 && !ctx.triggers.has(evt.trigger)))
                ? true
                : false
        }
    }
})
    
