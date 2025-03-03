import { State, getCurrentTime } from "pixel-pigeon";
import { WorldStateSchema } from "../../state";

export interface CreateWorldStateOptions {
  readonly agility: number;
  readonly bagItemInstanceIDs: readonly string[];
  readonly bodyItemInstanceID?: string;
  readonly boostItemInstanceIDs: readonly string[];
  readonly clothesDyeItemInstanceID?: string;
  readonly defense: number;
  readonly experienceUntilLevel?: number;
  readonly hairDyeItemInstanceID?: string;
  readonly headItemInstanceID?: string;
  readonly intelligence: number;
  readonly inventoryGold: number;
  readonly luck: number;
  readonly mainHandItemInstanceID?: string;
  readonly maskItemInstanceID?: string;
  readonly offHandItemInstanceID?: string;
  readonly outfitItemInstanceID?: string;
  readonly strength: number;
  readonly timePlayed: number;
  readonly wisdom: number;
  readonly worldCharacterID: string;
}
export const createWorldState = ({
  agility,
  bagItemInstanceIDs,
  bodyItemInstanceID,
  boostItemInstanceIDs,
  clothesDyeItemInstanceID,
  defense,
  experienceUntilLevel,
  hairDyeItemInstanceID,
  headItemInstanceID,
  intelligence,
  inventoryGold,
  luck,
  mainHandItemInstanceID,
  maskItemInstanceID,
  offHandItemInstanceID,
  outfitItemInstanceID,
  strength,
  timePlayed,
  wisdom,
  worldCharacterID,
}: CreateWorldStateOptions): State<WorldStateSchema> =>
  new State<WorldStateSchema>({
    agility,
    bagItemInstanceIDs,
    bodyItemInstanceID: bodyItemInstanceID ?? null,
    boostItemInstanceIDs,
    clothesDyeItemInstanceID: clothesDyeItemInstanceID ?? null,
    defense,
    experienceUntilLevel: experienceUntilLevel ?? null,
    hairDyeItemInstanceID: hairDyeItemInstanceID ?? null,
    headItemInstanceID: headItemInstanceID ?? null,
    intelligence,
    inventoryGold,
    lastPianoNoteAt: null,
    lastUsedEmoteID: null,
    luck,
    mainHandItemInstanceID: mainHandItemInstanceID ?? null,
    maskItemInstanceID: maskItemInstanceID ?? null,
    offHandItemInstanceID: offHandItemInstanceID ?? null,
    outfitItemInstanceID: outfitItemInstanceID ?? null,
    pianoNotes: [],
    pianoSessionID: null,
    strength,
    timePlayed: {
      amount: timePlayed,
      updatedAt: getCurrentTime(),
    },
    wisdom,
    worldCharacterID,
  });
