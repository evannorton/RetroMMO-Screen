import { Character } from "../classes/Character";
import { Party } from "../classes/Party";
import { definableExists, getDefinable } from "../definables";
import { removeCharacterFromParty } from "./removeCharacterFromParty";
import { resetPartyPosition } from "./resetPartyPosition";

export const updateCharacterParty = (
  characterID: string,
  partyID: string | null,
): void => {
  const character: Character = getDefinable(Character, characterID);
  if (character.hasParty()) {
    resetPartyPosition(character.party.id);
    removeCharacterFromParty(character.id);
  }
  if (partyID !== null) {
    if (definableExists(Party, partyID) === false) {
      new Party({
        characterIDs: [],
        id: partyID,
      });
    }
    character.party = getDefinable(Party, partyID);
    character.party.characters = [...character.party.characters, character];
  }
};
