import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";

export const createWorldState = (
  bagItemInstanceIDs: readonly string[],
  worldCharacterID: string,
): State<WorldStateSchema> =>
  new State<WorldStateSchema>({
    bagItemInstanceIDs,
    lastPianoNoteAt: null,
    lastUsedEmoteID: null,
    pianoNotes: [],
    pianoSessionID: null,
    worldCharacterID,
  });
