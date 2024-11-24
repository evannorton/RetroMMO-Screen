import { State } from "pixel-pigeon";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldStateSchema } from "../state";
import { getDefinable } from "definables";
import { getWorldState } from "./state/getWorldState";

export const hasOpenedChest = (chestID: string): boolean => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const character: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  return character.party.worldCharacters.every(
    (worldCharacter: WorldCharacter): boolean =>
      worldCharacter.openedChestIDs.includes(chestID),
  );
};
