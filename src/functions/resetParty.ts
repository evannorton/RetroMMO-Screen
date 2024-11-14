import { Direction, Step } from "retrommo-types";
import { Party } from "../classes/Party";
import { WorldCharacter } from "../classes/WorldCharacter";
import { getDefinable } from "definables";
import { updateWorldCharacterPosition } from "./updateWorldCharacterPosition";

export const resetParty = (partyID: string): void => {
  const party: Party = getDefinable(Party, partyID);
  const partyLeaderCharacter: WorldCharacter | undefined =
    party.worldCharacters[0];
  if (!partyLeaderCharacter) {
    throw new Error("No party leader character.");
  }
  for (const partyCharacter of party.worldCharacters) {
    if (partyCharacter !== partyLeaderCharacter) {
      updateWorldCharacterPosition(
        partyCharacter.id,
        partyLeaderCharacter.position,
      );
      partyCharacter.direction = Direction.Down;
      partyCharacter.step = Step.Right;
    }
  }
};
