import { WorldCharacter } from "../classes/WorldCharacter";
import { getDefinable } from "definables";
import { removeEntity } from "pixel-pigeon";

export const clearWorldCharacterMarker = (worldCharacterID: string): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  removeEntity(worldCharacter.markerEntityID);
  worldCharacter.markerEntityID = null;
};
