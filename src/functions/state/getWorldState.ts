import { State } from "pixel-pigeon";
import { WorldStateSchema, state } from "../../state";

export const getWorldState = (): State<WorldStateSchema> => {
  if (state.values.worldState === null) {
    throw new Error("worldState is null");
  }
  return state.values.worldState;
};
