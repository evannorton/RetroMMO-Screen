import { Character } from "../classes/Character";
import { ItemInstance } from "../classes/ItemInstance";
import { WorldCharacterUpdate } from "retrommo-types";

export const loadWorldCharacterUpdate = (
  characterUpdate: WorldCharacterUpdate,
): void => {
  if (characterUpdate.clothesDyeItemInstance !== null) {
    new ItemInstance({
      id: characterUpdate.clothesDyeItemInstance.id,
      itemID: characterUpdate.clothesDyeItemInstance.itemID,
    });
  }
  if (characterUpdate.hairDyeItemInstance !== null) {
    new ItemInstance({
      id: characterUpdate.hairDyeItemInstance.id,
      itemID: characterUpdate.hairDyeItemInstance.itemID,
    });
  }
  if (characterUpdate.maskItemInstance !== null) {
    new ItemInstance({
      id: characterUpdate.maskItemInstance.id,
      itemID: characterUpdate.maskItemInstance.itemID,
    });
  }
  if (characterUpdate.outfitItemInstance !== null) {
    new ItemInstance({
      id: characterUpdate.outfitItemInstance.id,
      itemID: characterUpdate.outfitItemInstance.itemID,
    });
  }
  const worldCharacter: Character = new Character({
    classID: characterUpdate.classID,
    clothesDyeItemInstanceID:
      characterUpdate.clothesDyeItemInstance?.id ?? null,
    figureID: characterUpdate.figureID,
    hairDyeItemInstanceID: characterUpdate.hairDyeItemInstance?.id ?? null,
    id: characterUpdate.id,
    level: characterUpdate.level,
    maskItemInstanceID: characterUpdate.maskItemInstance?.id ?? null,
    outfitItemInstanceID: characterUpdate.outfitItemInstance?.id ?? null,
    skinColorID: characterUpdate.skinColorID,
    tilemapID: characterUpdate.tilemapID,
    userID: characterUpdate.userID,
    username: characterUpdate.username,
    x: characterUpdate.x,
    y: characterUpdate.y,
  });
  worldCharacter.addToWorld();
};
