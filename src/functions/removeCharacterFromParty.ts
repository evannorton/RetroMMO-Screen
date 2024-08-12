import { Character } from "../classes/Character";
import { getDefinable } from "../definables";

export const removeCharacterFromParty = (characterID: string): void => {
  const character: Character = getDefinable(Character, characterID);
  character.party.characters = character.party.characters.filter(
    (characterInParty: Character): boolean => characterInParty !== character,
  );
  if (character.party.characters.length === 0) {
    character.party.remove();
  }
  character.party = null;
};
