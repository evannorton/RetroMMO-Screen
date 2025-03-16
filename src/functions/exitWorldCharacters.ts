import { Party } from "../classes/Party";
import { WorldCharacter } from "../classes/WorldCharacter";
import { getDefinable } from "definables";
import { resetParty } from "./resetParty";

export const exitWorldCharacters = (
  worldCharacterIDs: readonly string[],
): void => {
  const affectedPartyIDs: string[] = [];
  for (const worldCharacterID of worldCharacterIDs) {
    const worldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      worldCharacterID,
    );
    const party: Party = getDefinable(Party, worldCharacter.party.id);
    party.worldCharacters = party.worldCharacters.filter(
      (partyWorldCharacter: WorldCharacter): boolean =>
        partyWorldCharacter.id !== worldCharacter.id,
    );
    if (affectedPartyIDs.includes(party.id) === false) {
      affectedPartyIDs.push(party.id);
    }
    worldCharacter.remove();
  }
  for (const affectedPartyID of affectedPartyIDs) {
    const affectedParty: Party = getDefinable(Party, affectedPartyID);
    if (affectedParty.worldCharacters.length === 0) {
      affectedParty.remove();
    } else {
      resetParty(affectedPartyID);
    }
  }
};
