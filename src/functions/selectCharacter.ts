import { Character } from "../classes/Character";
import { addCharacterToWorld } from "./addCharacterToWorld";
import { getDefinable } from "../definables";
import { goToLevel, lockCameraToEntity } from "pixel-pigeon";

export const selectCharacter = (characterID: string): void => {
  const character: Character = getDefinable(Character, characterID);
  goToLevel(character.tilemapID);
  addCharacterToWorld(character.id);
  lockCameraToEntity(character.entityID);
};
