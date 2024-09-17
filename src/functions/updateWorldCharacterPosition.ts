import { Constants } from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import { getConstants } from "./getConstants";
import { getDefinable } from "../definables";
import { setEntityPosition } from "pixel-pigeon";

export const updateWorldCharacterPosition = (
  characterID: string,
  x: number,
  y: number,
): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    characterID,
  );
  worldCharacter.x = x;
  worldCharacter.y = y;
  const constants: Constants = getConstants();
  setEntityPosition(worldCharacter.entityID, {
    x: x * constants["tile-size"],
    y: y * constants["tile-size"],
  });
};
