import { Party } from "../../classes/Party";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { WorldPartyUpdate } from "retrommo-types";
import { definableExists, getDefinable } from "definables";

export const loadWorldPartyUpdate = (
  worldPartyUpdate: WorldPartyUpdate,
): void => {
  const party: Party = definableExists(Party, worldPartyUpdate.id)
    ? getDefinable(Party, worldPartyUpdate.id)
    : new Party({ id: worldPartyUpdate.id });
  party.worldCharacters = worldPartyUpdate.worldCharacterIDs.map(
    (worldCharacterID: string): WorldCharacter =>
      getDefinable(WorldCharacter, worldCharacterID),
  );
};
