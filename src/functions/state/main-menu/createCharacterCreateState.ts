import { CharacterCreateStateSchema } from "../../../state";
import { State } from "pixel-pigeon";

export const createCharacterCreateState =
  (): State<CharacterCreateStateSchema> =>
    new State<CharacterCreateStateSchema>({});
