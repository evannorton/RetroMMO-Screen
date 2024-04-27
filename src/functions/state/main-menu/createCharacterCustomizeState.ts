import { CharacterCustomizeStateSchema } from "../../../state";
import { State } from "pixel-pigeon";

export const createCharacterCustomizeState =
  (): State<CharacterCustomizeStateSchema> =>
    new State<CharacterCustomizeStateSchema>({});
