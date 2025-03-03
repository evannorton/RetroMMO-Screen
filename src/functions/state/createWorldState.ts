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
    agility: 0,
    bagItemInstanceIDs,
    bodyItemInstanceID: bodyItemInstanceID ?? null,
    boostItemInstanceIDs: [],
    clothesDyeItemInstanceID: clothesDyeItemInstanceID ?? null,
    defense: 0,
    experienceUntilLevel: 1,
    hairDyeItemInstanceID: hairDyeItemInstanceID ?? null,
    headItemInstanceID: headItemInstanceID ?? null,
    intelligence: 0,
    inventoryGold,
    lastPianoNoteAt: null,
    lastUsedEmoteID: null,
    luck: 0,
    mainHandItemInstanceID: mainHandItemInstanceID ?? null,
    maskItemInstanceID: maskItemInstanceID ?? null,
    offHandItemInstanceID: offHandItemInstanceID ?? null,
    outfitItemInstanceID: outfitItemInstanceID ?? null,
    pianoNotes: [],
    pianoSessionID: null,
    strength: 0,
    timePlayed: 0,
    wisdom: 0,
    worldCharacterID,
  });
