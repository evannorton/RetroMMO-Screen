import { CharacterSelectStateSchema } from "../../../state";
import { State } from "pixel-pigeon";

export const createCharacterSelectState =
  (): State<CharacterSelectStateSchema> =>
    new State<CharacterSelectStateSchema>({
      isDeleting: false,
      isSorting: false,
      page: 0,
    });
