import { State } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";

export interface CreateWorldStateOptions {
  readonly bagItemInstanceIDs: readonly string[];
  readonly bodyItemInstanceID?: string;
  readonly clothesDyeItemInstanceID?: string;
  readonly hairDyeItemInstanceID?: string;
  readonly headItemInstanceID?: string;
  readonly inventoryGold: number;
  readonly mainHandItemInstanceID?: string;
  readonly maskItemInstanceID?: string;
  readonly offHandItemInstanceID?: string;
  readonly outfitItemInstanceID?: string;
  readonly worldCharacterID: string;
}
export const createWorldState = ({
  bagItemInstanceIDs,
  bodyItemInstanceID,
  clothesDyeItemInstanceID,
  hairDyeItemInstanceID,
  headItemInstanceID,
  inventoryGold,
  mainHandItemInstanceID,
  maskItemInstanceID,
  offHandItemInstanceID,
  outfitItemInstanceID,
  worldCharacterID,
}: CreateWorldStateOptions): State<WorldStateSchema> =>
  new State<WorldStateSchema>({
    bagItemInstanceIDs,
    bodyItemInstanceID: bodyItemInstanceID ?? null,
    clothesDyeItemInstanceID: clothesDyeItemInstanceID ?? null,
    hairDyeItemInstanceID: hairDyeItemInstanceID ?? null,
    headItemInstanceID: headItemInstanceID ?? null,
    inventoryGold,
    lastPianoNoteAt: null,
    lastUsedEmoteID: null,
    mainHandItemInstanceID: mainHandItemInstanceID ?? null,
    maskItemInstanceID: maskItemInstanceID ?? null,
    offHandItemInstanceID: offHandItemInstanceID ?? null,
    outfitItemInstanceID: outfitItemInstanceID ?? null,
    pianoNotes: [],
    pianoSessionID: null,
    worldCharacterID,
  });
