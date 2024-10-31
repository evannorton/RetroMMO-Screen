import { Constants } from "retrommo-types";
import { TilePosition } from "../types/TilePosition";
import { WorldCharacter } from "../classes/WorldCharacter";
import { getConstants } from "./getConstants";
import { getDefinable } from "definables";
import { setEntityPosition } from "pixel-pigeon";

export const updateWorldCharacterPosition = (
  characterID: string,
  position: TilePosition,
): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    characterID,
  );
  worldCharacter.position = position;
  const constants: Constants = getConstants();
  setEntityPosition(worldCharacter.entityID, {
    x: position.x * constants["tile-size"],
    y: position.y * constants["tile-size"],
  });
};
