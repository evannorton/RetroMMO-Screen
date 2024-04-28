import { CharacterSelectStateSchema } from "../../../state";
import { State } from "pixel-pigeon";

export const createCharacterSelectState =
  (): State<CharacterSelectStateSchema> =>
    new State<CharacterSelectStateSchema>({
      characterIDToDelete: null,
      isDeleting: false,
      isSorting: false,
      page: 0,
    });
