import { Class } from "../../../classes/Class";
import {
  CreateLabelOptionsText,
  createButton,
  createLabel,
  createSprite,
  getGameHeight,
  getGameWidth,
} from "pixel-pigeon";
import { Item } from "../../../classes/Item";
import { createCharacterCreateState } from "../../state/main-menu/createCharacterCreateState";
import { createPanel } from "../components/createPanel";
import { createPlayerSprite } from "../components/createPlayerSprite";
import { getCharacterCustomizeState } from "../../state/main-menu/getCharacterCustomizeState";
import { getDefinable } from "../../../definables";
import { getMainMenuState } from "../../state/main-menu/getMainMenuState";
import { state } from "../../../state";

export const createCharacterCustomizeUI = (): void => {
  const condition = (): boolean =>
    state.values.mainMenuState !== null &&
    state.values.mainMenuState.values.characterCustomizeState !== null;
  const getClass = (): Class =>
    getDefinable(Class, getCharacterCustomizeState().values.classID);
  // Background panel
  createPanel({
    condition,
    height: getGameHeight(),
    imagePath: "panels/basic",
    width: getGameWidth(),
    x: 0,
    y: 0,
  });
  // Back arrow
  const backX: number = 16;
  const backY: number = 16;
  const backWidth: number = 14;
  const backHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: backHeight,
            sourceHeight: backHeight,
            sourceWidth: backWidth,
            sourceX: 0,
            sourceY: 0,
            width: backWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: backX,
      y: backY,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition,
      x: backX,
      y: backY,
    },
    height: backHeight,
    onClick: (): void => {
      getMainMenuState().setValues({
        characterCreateState: createCharacterCreateState(),
        characterCustomizeState: null,
      });
    },
    width: backWidth,
  });
  // Class name
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: getGameWidth() / 2,
      y: 10,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 2,
    text: (): CreateLabelOptionsText => ({ value: getClass().name }),
  });
  // Class description
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: getGameWidth() / 2,
      y: 40,
    },
    horizontalAlignment: "center",
    maxLines: 2,
    maxWidth: getGameWidth(),
    size: 1,
    text: (): CreateLabelOptionsText => ({ value: getClass().description }),
  });
  // Preview sprite
  createPlayerSprite({
    clothesDyeID: (): string =>
      getDefinable(
        Item,
        getClass().getCharacterCustomizeClothesDyeItem(
          getCharacterCustomizeState().values.clothesDyeItemPrimaryColorIndex,
          getCharacterCustomizeState().values.clothesDyeItemSecondaryColorIndex,
        ).id,
      ).clothesDye.id,
    condition,
    figureID: (): string =>
      getClass().getCharacterCustomizeFigure(
        getCharacterCustomizeState().values.figureIndex,
      ).id,
    hairDyeID: (): string =>
      getDefinable(
        Item,
        getClass().getCharacterCustomizeHairDyeItem(
          getCharacterCustomizeState().values.hairDyeItemIndex,
        ).id,
      ).hairDye.id,
    maskID: (): string =>
      getDefinable(
        Item,
        getClass().getCharacterCustomizeMaskItem(
          getCharacterCustomizeState().values.maskItemIndex,
        ).id,
      ).mask.id,
    outfitID: (): string =>
      getDefinable(
        Item,
        getClass().getCharacterCustomizeOutfitItem(
          getCharacterCustomizeState().values.outfitItemIndex,
        ).id,
      ).outfit.id,
    skinColorID: (): string =>
      getClass().getCharacterCustomizeSkinColor(
        getCharacterCustomizeState().values.skinColorIndex,
      ).id,
    x: 144,
    y: 74,
  });

  // // Preview left arrow
  // new Picture(
  //   "character-customize/preview/left",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/left",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 98,
  //     y: 75,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.rotateCharacterCustomizePreview(-1);
  //   },
  // );
  // // Preview right arrow
  // new Picture(
  //   "character-customize/preview/right",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/right",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 192,
  //     y: 75,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.rotateCharacterCustomizePreview(1);
  //   },
  // );
  // // Figure left arrow
  // new Picture(
  //   "character-customize/figure/left",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/left",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 98,
  //     y: 101,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeFigure(-1);
  //   },
  // );
  // // Figure label
  // new Label(
  //   "character-customize/figure",
  //   (): LabelOptions => ({
  //     color: Color.White,
  //     horizontalAlignment: "center",
  //     maxLines: 1,
  //     maxWidth: 304,
  //     size: 1,
  //     text: "Figure",
  //     verticalAlignment: "middle",
  //     x: getGameWidth() / 2,
  //     y: 107,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  // );
  // // Figure right arrow
  // new Picture(
  //   "character-customize/figure/right",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/right",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 192,
  //     y: 101,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeFigure(1);
  //   },
  // );
  // // Mask left arrow
  // new Picture(
  //   "character-customize/mask/left",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/left",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 36,
  //     y: 127,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeMask(-1);
  //   },
  // );
  // // Mask label
  // new Label(
  //   "character-customize/mask",
  //   (): LabelOptions => ({
  //     color: Color.White,
  //     horizontalAlignment: "center",
  //     maxLines: 1,
  //     maxWidth: 304,
  //     size: 1,
  //     text: "Head",
  //     verticalAlignment: "middle",
  //     x: 90,
  //     y: 133,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  // );
  // // Mask right arrow
  // new Picture(
  //   "character-customize/mask/right",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/right",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 130,
  //     y: 127,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeMask(1);
  //   },
  // );
  // // Outfit left arrow
  // new Picture(
  //   "character-customize/outfit/left",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/left",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 160,
  //     y: 127,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeOutfit(-1);
  //   },
  // );
  // // Outfit label
  // new Label(
  //   "character-customize/outfit",
  //   (): LabelOptions => ({
  //     color: Color.White,
  //     horizontalAlignment: "center",
  //     maxLines: 1,
  //     maxWidth: 304,
  //     size: 1,
  //     text: "Body",
  //     verticalAlignment: "middle",
  //     x: 214,
  //     y: 133,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  // );
  // // Outfit right arrow
  // new Picture(
  //   "character-customize/outfit/right",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/right",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 254,
  //     y: 127,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeOutfit(1);
  //   },
  // );
  // // Hair dye left arrow
  // new Picture(
  //   "character-customize/hair-dye/left",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/left",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 36,
  //     y: 153,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeHairDye(-1);
  //   },
  // );
  // // Hair dye label
  // new Label(
  //   "character-customize/hair-dye",
  //   (): LabelOptions => ({
  //     color: Color.White,
  //     horizontalAlignment: "center",
  //     maxLines: 1,
  //     maxWidth: 304,
  //     size: 1,
  //     text: "Hair",
  //     verticalAlignment: "middle",
  //     x: 90,
  //     y: 159,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  // );
  // // Hair dye right arrow
  // new Picture(
  //   "character-customize/hair-dye/right",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/right",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 130,
  //     y: 153,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeHairDye(1);
  //   },
  // );
  // // Clothes dye primary left arrow
  // new Picture(
  //   "character-customize/clothes-dye-primary/left",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/left",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 160,
  //     y: 153,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeClothesDyePrimary(-1);
  //   },
  // );
  // // Clothes dye primary label
  // new Label(
  //   "character-customize/clothes-dye-primary",
  //   (): LabelOptions => ({
  //     color: Color.White,
  //     horizontalAlignment: "center",
  //     maxLines: 1,
  //     maxWidth: 304,
  //     size: 1,
  //     text: "Primary",
  //     verticalAlignment: "middle",
  //     x: 214,
  //     y: 159,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  // );
  // // Clothes dye primary right arrow
  // new Picture(
  //   "character-customize/clothes-dye-primary/right",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/right",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 254,
  //     y: 153,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeClothesDyePrimary(1);
  //   },
  // );
  // // Skin color left arrow
  // new Picture(
  //   "character-customize/skin-color/left",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/left",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 36,
  //     y: 179,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeSkinColor(-1);
  //   },
  // );
  // // Skin color label
  // new Label(
  //   "character-customize/skin-color",
  //   (): LabelOptions => ({
  //     color: Color.White,
  //     horizontalAlignment: "center",
  //     maxLines: 1,
  //     maxWidth: 304,
  //     size: 1,
  //     text: "Skin",
  //     verticalAlignment: "middle",
  //     x: 90,
  //     y: 185,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  // );
  // // Skin color right arrow
  // new Picture(
  //   "character-customize/skin-color/right",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/right",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 130,
  //     y: 179,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeSkinColor(1);
  //   },
  // );
  // // Clothes dye secondary left arrow
  // new Picture(
  //   "character-customize/clothes-dye-secondary/left",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/left",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 160,
  //     y: 179,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeClothesDyeSecondary(-1);
  //   },
  // );
  // // Clothes dye secondary label
  // new Label(
  //   "character-customize/clothes-dye-secondary",
  //   (): LabelOptions => ({
  //     color: Color.White,
  //     horizontalAlignment: "center",
  //     maxLines: 1,
  //     maxWidth: 304,
  //     size: 1,
  //     text: "Secondary",
  //     verticalAlignment: "middle",
  //     x: 214,
  //     y: 185,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  // );
  // // Clothes dye secondary right arrow
  // new Picture(
  //   "character-customize/clothes-dye-secondary/right",
  //   (): PictureOptions => ({
  //     grayscale: false,
  //     height: 14,
  //     imageSourceSlug: "arrows/right",
  //     recolors: [],
  //     sourceHeight: 14,
  //     sourceWidth: 14,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: 14,
  //     x: 254,
  //     y: 179,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.cycleCharacterCustomizeClothesDyeSecondary(1);
  //   },
  // );
  // // Finish button
  // new Button(
  //   "character-customize/finish",
  //   (): ButtonOptions => ({
  //     color: Color.White,
  //     height: 16,
  //     imageSourceSlug: "buttons/gray",
  //     text: "Finish",
  //     width: 52,
  //     x: 126,
  //     y: 207,
  //   }),
  //   (player: Player): boolean => player.isAtCharacterCustomize,
  //   (player: Player): void => {
  //     player.finishCharacterCustomize();
  //   },
  // );
};
