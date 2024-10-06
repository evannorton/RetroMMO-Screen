import { WorldCharacter } from "../classes/WorldCharacter";
import { getDefinable } from "definables";
import { goToLevel, lockCameraToEntity } from "pixel-pigeon";

export const selectWorldCharacter = (worldCharacterID: string): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  goToLevel(worldCharacter.tilemapID);
  lockCameraToEntity(worldCharacter.entityID);
};
