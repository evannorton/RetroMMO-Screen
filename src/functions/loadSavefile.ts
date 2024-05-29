import { Character } from "../classes/Character";
import { ItemInstance } from "../classes/ItemInstance";
import { Savefile } from "retrommo-types";
import { state } from "../state";

export const loadSavefile = (savefile: Savefile): void => {
  if (state.values.username === null) {
    throw new Error("Username is null");
  }
  if (state.values.userID === null) {
    throw new Error("User ID is null");
  }
  const characterIDs: string[] = [];
  for (const character of savefile.characters) {
    const clothesDyeItemInstanceID: string | null =
      character.clothesDyeItemInstance !== null
        ? new ItemInstance({
            id: character.clothesDyeItemInstance.id,
            itemID: character.clothesDyeItemInstance.itemID,
          }).id
        : null;
    const hairDyeItemInstanceID: string | null =
      character.hairDyeItemInstance !== null
        ? new ItemInstance({
            id: character.hairDyeItemInstance.id,
            itemID: character.hairDyeItemInstance.itemID,
          }).id
        : null;
    const maskItemInstanceID: string | null =
      character.maskItemInstance !== null
        ? new ItemInstance({
            id: character.maskItemInstance.id,
            itemID: character.maskItemInstance.itemID,
          }).id
        : null;
    const outfitItemInstanceID: string | null =
      character.outfitItemInstance !== null
        ? new ItemInstance({
            id: character.outfitItemInstance.id,
            itemID: character.outfitItemInstance.itemID,
          }).id
        : null;
    characterIDs.push(
      new Character({
        classID: character.classID,
        clothesDyeItemInstanceID,
        figureID: character.figureID,
        hairDyeItemInstanceID,
        id: character.id,
        level: character.level,
        maskItemInstanceID,
        outfitItemInstanceID,
        skinColorID: character.skinColorID,
        tilemapID: character.tilemapID,
        userID: state.values.userID,
        username: state.values.username,
        x: character.x,
        y: character.y,
      }).id,
    );
  }
  state.setValues({ characterIDs });
};
