import { Direction, Step } from "retrommo-types";
import { Party } from "../classes/Party";
import { Player } from "../classes/Player";
import { getDefinable } from "definables";
import { updateWorldCharacterPosition } from "./updateWorldCharacterPosition";

export const resetParty = (partyID: string): void => {
  const party: Party = getDefinable(Party, partyID);
  const partyLeaderPlayer: Player | undefined = party.players[0];
  if (typeof partyLeaderPlayer === "undefined") {
    throw new Error("No party leader character.");
  }
  for (const partyPlayer of party.players) {
    if (partyPlayer !== partyLeaderPlayer) {
      updateWorldCharacterPosition(
        partyPlayer.worldCharacterID,
        partyLeaderPlayer.worldCharacter.position,
      );
      partyPlayer.worldCharacter.direction = Direction.Down;
      partyPlayer.worldCharacter.step = Step.Right;
    }
  }
};
