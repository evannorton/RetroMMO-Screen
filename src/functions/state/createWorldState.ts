import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";

export interface CreateWorldStateOptions {
  readonly bagItemInstanceIDs: readonly string[];
  readonly bodyItemInstanceID?: string;
  readonly headItemInstanceID?: string;
  readonly inventoryGold: number;
  readonly mainHandItemInstanceID?: string;
  readonly offHandItemInstanceID?: string;
  readonly worldCharacterID: string;
}
export const createWorldState = ({
  bagItemInstanceIDs,
  bodyItemInstanceID,
  headItemInstanceID,
  inventoryGold,
  mainHandItemInstanceID,
  offHandItemInstanceID,
  worldCharacterID,
}: CreateWorldStateOptions): State<WorldStateSchema> =>
  new State<WorldStateSchema>({
    bagItemInstanceIDs,
    bodyItemInstanceID: bodyItemInstanceID ?? null,
    headItemInstanceID: headItemInstanceID ?? null,
    inventoryGold,
    lastPianoNoteAt: null,
    lastUsedEmoteID: null,
    mainHandItemInstanceID: mainHandItemInstanceID ?? null,
    offHandItemInstanceID: offHandItemInstanceID ?? null,
    pianoNotes: [],
    pianoSessionID: null,
    worldCharacterID,
  });
