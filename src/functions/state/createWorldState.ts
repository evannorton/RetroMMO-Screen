import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";

export const createWorldState = (
  worldCharacterID: string,
): State<WorldStateSchema> =>
  new State<WorldStateSchema>({
    lastPianoNoteAt: null,
    pianoNotes: [],
    pianoSessionID: null,
    worldCharacterID,
  });
