import { Player } from "../classes/Player";
import { State } from "pixel-pigeon";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldStateSchema } from "../state";
import { getDefinable } from "definables";
import { getWorldState } from "./state/getWorldState";

export const hasOpenedChest = (chestID: string): boolean => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  return worldCharacter.player.character.party.players.every(
    (player: Player): boolean =>
      player.worldCharacter.openedChestIDs.includes(chestID),
  );
};
