import { Constants } from "retrommo-types";
import { state } from "../state"

export const getConstants = (): Constants => {
  if (state.values.constants === null) {
    throw new Error("Attempted to get constant before they were loaded.");
  }
  return state.values.constants;
}