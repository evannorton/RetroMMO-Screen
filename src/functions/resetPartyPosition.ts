import { Character } from "../classes/Character";
import { Direction } from "retrommo-types";
import { Party } from "../classes/Party";
import { getDefinable } from "../definables";
import { updateCharacterPosition } from "./updateCharacterPosition";

export const resetPartyPosition = (partyID: string): void => {
  const party: Party = getDefinable(Party, partyID);
  const partyLeaderCharacter: Character | undefined = party.characters[0];
  if (!partyLeaderCharacter) {
    throw new Error("No party leader character.");
  }
  for (const partyCharacter of party.characters) {
    if (partyCharacter !== partyLeaderCharacter) {
      updateCharacterPosition(
        partyCharacter.id,
        partyLeaderCharacter.x,
        partyLeaderCharacter.y,
      );
      partyCharacter.direction = Direction.Down;
    }
  }
};
