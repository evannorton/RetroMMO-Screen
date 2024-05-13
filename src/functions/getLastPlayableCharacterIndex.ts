import { getMaxCharacters } from "./getMaxCharacters";
import { state } from "../state";

export const getLastPlayableCharacterIndex = (): number =>
  Math.min(state.values.characterIDs.length, getMaxCharacters()) - 1;
