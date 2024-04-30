import { CharacterCustomizeStateSchema } from "../../../state";
import { Figure } from "../../../classes/Figure";
import { Item } from "../../../classes/Item";
import { SkinColor } from "../../../classes/SkinColor";
import { State } from "pixel-pigeon";
import { getDefinables } from "../../../definables";

export interface CreateCharacterCustomizeStateOptions {
  classID: string;
}
export const createCharacterCustomizeState = (
  options: CreateCharacterCustomizeStateOptions,
): State<CharacterCustomizeStateSchema> => {
  const figure: [string, Figure] | undefined = Array.from(
    getDefinables(Figure),
  ).find(
    (loopedFigure: [string, Figure]): boolean =>
      loopedFigure[1].characterCustomizeOrder === 0,
  );
  if (typeof figure === "undefined") {
    throw new Error("Figure is undefined");
  }
  const skinColor: [string, SkinColor] | undefined = Array.from(
    getDefinables(SkinColor),
  ).find(
    (loopedSkinColor: [string, SkinColor]): boolean =>
      loopedSkinColor[1].characterCustomizeOrder === 0,
  );
  if (typeof skinColor === "undefined") {
    throw new Error("Skin color is undefined");
  }
  const clothesDyeItem: [string, Item] | undefined = Array.from(
    getDefinables(Item),
  ).find(
    (loopedItem: [string, Item]): boolean =>
      typeof loopedItem[1].characterCustomizeClothesDyeOrder !== "undefined" &&
      loopedItem[1].characterCustomizeClothesDyeOrder[0] === 0 &&
      loopedItem[1].characterCustomizeClothesDyeOrder[1] === 0,
  );
  if (typeof clothesDyeItem === "undefined") {
    throw new Error("Clothes dye item is undefined");
  }
  const hairDyeItem: [string, Item] | undefined = Array.from(
    getDefinables(Item),
  ).find(
    (loopedItem: [string, Item]): boolean =>
      typeof loopedItem[1].characterCustomizeHairDyeOrder !== "undefined" &&
      loopedItem[1].characterCustomizeHairDyeOrder === 0,
  );
  if (typeof hairDyeItem === "undefined") {
    throw new Error("Hair dye item is undefined");
  }
  const maskItem: [string, Item] | undefined = Array.from(
    getDefinables(Item),
  ).find(
    (loopedItem: [string, Item]): boolean =>
      typeof loopedItem[1].characterCustomizeMaskOrder !== "undefined" &&
      loopedItem[1].characterCustomizeMaskOrder === 0 &&
      loopedItem[1].mask.canClassEquip(options.classID),
  );
  if (typeof maskItem === "undefined") {
    throw new Error("Mask item is undefined");
  }
  const outfitItem: [string, Item] | undefined = Array.from(
    getDefinables(Item),
  ).find(
    (loopedItem: [string, Item]): boolean =>
      typeof loopedItem[1].characterCustomizeOutfitOrder !== "undefined" &&
      loopedItem[1].characterCustomizeOutfitOrder === 0 &&
      loopedItem[1].outfit.canClassEquip(options.classID),
  );
  if (typeof outfitItem === "undefined") {
    throw new Error("Outfit item is undefined");
  }
  const state: State<CharacterCustomizeStateSchema> =
    new State<CharacterCustomizeStateSchema>({
      classID: options.classID,
      clothesDyeItemID: clothesDyeItem[0],
      figureID: figure[0],
      hairDyeItemID: hairDyeItem[0],
      maskItemID: maskItem[0],
      outfitItemID: outfitItem[0],
      skinColorID: skinColor[0],
    });
  return state;
};
