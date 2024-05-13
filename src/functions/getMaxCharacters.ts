import { state } from "../state";

export const getMaxCharacters = (): number => {
  if (state.values.constants === null) {
    throw new Error("Attempted to create character with no constants.");
  }
  return state.values.isSubscribed
    ? state.values.constants["paid-character-slots"]
    : state.values.constants["free-character-slots"];
};
