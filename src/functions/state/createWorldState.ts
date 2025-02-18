import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";

export const createWorldState = (
  bagItemInstanceIDs: readonly string[],
  inventoryGold: number,
  worldCharacterID: string,
): State<WorldStateSchema> =>
  new State<WorldStateSchema>({
    bagItemInstanceIDs,
    inventoryGold,
    lastPianoNoteAt: null,
    lastUsedEmoteID: null,
    pianoNotes: [],
    pianoSessionID: null,
    worldCharacterID,
  });
