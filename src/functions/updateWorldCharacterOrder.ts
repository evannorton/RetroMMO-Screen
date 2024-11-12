import { WorldCharacter } from "../classes/WorldCharacter";
import { getDefinable } from "definables";
import { setEntityZIndex } from "pixel-pigeon";

export const updateWorldCharacterOrder = (
  worldCharacterID: string,
  order: number,
): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  worldCharacter.order = order;
  setEntityZIndex(worldCharacter.entityID, worldCharacter.order);
  if (worldCharacter.hasEmote()) {
    setEntityZIndex(worldCharacter.emote.entityID, worldCharacter.order);
  }
};
