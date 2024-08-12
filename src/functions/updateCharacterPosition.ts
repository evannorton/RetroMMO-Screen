import { Character } from "../classes/Character";
import { Constants } from "retrommo-types";
import { getConstants } from "./getConstants";
import { getDefinable } from "../definables";
import { setEntityPosition } from "pixel-pigeon";

export const updateCharacterPosition = (
  characterID: string,
  x: number,
  y: number,
): void => {
  const character: Character = getDefinable(Character, characterID);
  character.x = x;
  character.y = y;
  const constants: Constants = getConstants();
  setEntityPosition(character.entityID, {
    x: x * constants["tile-size"],
    y: y * constants["tile-size"],
  });
};
