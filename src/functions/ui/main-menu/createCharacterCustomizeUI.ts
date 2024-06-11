import { Class } from "../../../classes/Class";
import {
  CreateLabelOptionsText,
  createButton,
  createLabel,
  createSprite,
  emitToSocketioServer,
  getGameHeight,
  getGameWidth,
} from "pixel-pigeon";
import { Direction } from "retrommo-types";
import { Figure } from "../../../classes/Figure";
import { Item } from "../../../classes/Item";
import { SkinColor } from "../../../classes/SkinColor";
import { createCharacterCreateState } from "../../state/main-menu/createCharacterCreateState";
import { createPanel } from "../components/createPanel";
import { createPlayerSprite } from "../components/createPlayerSprite";
import { createPressableButton } from "../components/createPressableButton";
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
  const getFigure = (): Figure =>
    getClass().getCharacterCustomizeFigure(
      getCharacterCustomizeState().values.figureIndex,
    );
  const getSkinColor = (): SkinColor =>
    getClass().getCharacterCustomizeSkinColor(
      getCharacterCustomizeState().values.skinColorIndex,
    );
  const getClothesDyeItem = (): Item =>
    getDefinable(
      Item,
      getClass().getCharacterCustomizeClothesDyeItem(
        getCharacterCustomizeState().values.clothesDyeItemPrimaryColorIndex,
        getCharacterCustomizeState().values.clothesDyeItemSecondaryColorIndex,
      ).id,
    );
  const getHairDyeItem = (): Item =>
    getDefinable(
      Item,
      getClass().getCharacterCustomizeHairDyeItem(
        getCharacterCustomizeState().values.hairDyeItemIndex,
      ).id,
    );
  const getOutfitItem = (): Item =>
    getDefinable(
      Item,
      getClass().getCharacterCustomizeOutfitItem(
        getCharacterCustomizeState().values.outfitItemIndex,
      ).id,
    );
  const getMaskItem = (): Item =>
    getDefinable(
      Item,
      getClass().getCharacterCustomizeMaskItem(
        getCharacterCustomizeState().values.maskItemIndex,
      ).id,
    );
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
    clothesDyeID: (): string => getClothesDyeItem().clothesDye.id,
    condition,
    direction: (): Direction => getCharacterCustomizeState().values.direction,
    figureID: (): string => getFigure().id,
    hairDyeID: (): string => getHairDyeItem().hairDye.id,
    maskID: (): string => getMaskItem().mask.id,
    outfitID: (): string => getOutfitItem().outfit.id,
    skinColorID: (): string => getSkinColor().id,
    x: 144,
    y: 74,
  });
  // Preview left arrow
  const previewLeftX: number = 98;
  const previewLeftY: number = 75;
  const previewLeftWidth: number = 14;
  const previewLeftHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: previewLeftHeight,
            sourceHeight: previewLeftHeight,
            sourceWidth: previewLeftWidth,
            sourceX: 0,
            sourceY: 0,
            width: previewLeftWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: previewLeftX,
      y: previewLeftY,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition,
      x: previewLeftX,
      y: previewLeftY,
    },
    height: previewLeftHeight,
    onClick: (): void => {
      switch (getCharacterCustomizeState().values.direction) {
        case Direction.Down:
          getCharacterCustomizeState().setValues({ direction: Direction.Left });
          break;
        case Direction.Left:
          getCharacterCustomizeState().setValues({ direction: Direction.Up });
          break;
        case Direction.Up:
          getCharacterCustomizeState().setValues({
            direction: Direction.Right,
          });
          break;
        case Direction.Right:
          getCharacterCustomizeState().setValues({ direction: Direction.Down });
          break;
      }
    },
    width: previewLeftWidth,
  });
  // Preview right arrow
  const previewRightX: number = 192;
  const previewRightY: number = 75;
  const previewRightWidth: number = 14;
  const previewRightHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: previewRightHeight,
            sourceHeight: previewRightHeight,
            sourceWidth: previewRightWidth,
            sourceX: 0,
            sourceY: 0,
            width: previewRightWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: previewRightX,
      y: previewRightY,
    },
    imagePath: "arrows/right",
  });
  createButton({
    coordinates: {
      condition,
      x: previewRightX,
      y: previewRightY,
    },
    height: previewRightHeight,
    onClick: (): void => {
      switch (getCharacterCustomizeState().values.direction) {
        case Direction.Down:
          getCharacterCustomizeState().setValues({
            direction: Direction.Right,
          });
          break;
        case Direction.Left:
          getCharacterCustomizeState().setValues({ direction: Direction.Down });
          break;
        case Direction.Up:
          getCharacterCustomizeState().setValues({ direction: Direction.Left });
          break;
        case Direction.Right:
          getCharacterCustomizeState().setValues({ direction: Direction.Up });
          break;
      }
    },
    width: previewRightWidth,
  });
  // Figure left arrow
  const figureLeftX: number = 98;
  const figureLeftY: number = 101;
  const figureLeftWidth: number = 14;
  const figureLeftHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: figureLeftHeight,
            sourceHeight: figureLeftHeight,
            sourceWidth: figureLeftWidth,
            sourceX: 0,
            sourceY: 0,
            width: figureLeftWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: figureLeftX,
      y: figureLeftY,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition,
      x: figureLeftX,
      y: figureLeftY,
    },
    height: figureLeftHeight,
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeFigure();
    },
    width: figureLeftWidth,
  });
  // Figure label
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: getGameWidth() / 2,
      y: 104,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 1,
    text: { value: "Figure" },
  });
  // Figure right arrow
  const figureRightX: number = 192;
  const figureRightY: number = 101;
  const figureRightWidth: number = 14;
  const figureRightHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: figureRightHeight,
            sourceHeight: figureRightHeight,
            sourceWidth: figureRightWidth,
            sourceX: 0,
            sourceY: 0,
            width: figureRightWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: figureRightX,
      y: figureRightY,
    },
    imagePath: "arrows/right",
  });
  createButton({
    coordinates: {
      condition,
      x: figureRightX,
      y: figureRightY,
    },
    height: figureRightHeight,
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeFigure();
    },
    width: figureRightWidth,
  });
  // Head left arrow
  const maskLeftX: number = 36;
  const maskLeftY: number = 127;
  const maskLeftWidth: number = 14;
  const maskLeftHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: maskLeftHeight,
            sourceHeight: maskLeftHeight,
            sourceWidth: maskLeftWidth,
            sourceX: 0,
            sourceY: 0,
            width: maskLeftWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: maskLeftX,
      y: maskLeftY,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition,
      x: maskLeftX,
      y: maskLeftY,
    },
    height: maskLeftHeight,
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeMaskItem();
    },
    width: maskLeftWidth,
  });
  // Head label
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 90,
      y: 130,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 1,
    text: { value: "Head" },
  });
  // Head right arrow
  const maskRightX: number = 130;
  const maskRightY: number = 127;
  const maskRightWidth: number = 14;
  const maskRightHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: maskRightHeight,
            sourceHeight: maskRightHeight,
            sourceWidth: maskRightWidth,
            sourceX: 0,
            sourceY: 0,
            width: maskRightWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: maskRightX,
      y: maskRightY,
    },
    imagePath: "arrows/right",
  });
  createButton({
    coordinates: {
      condition,
      x: maskRightX,
      y: maskRightY,
    },
    height: maskRightHeight,
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeMaskItem();
    },
    width: maskRightWidth,
  });
  // Body left arrow
  const outfitLeftX: number = 160;
  const outfitLeftY: number = 127;
  const outfitLeftWidth: number = 14;
  const outfitLeftHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: outfitLeftHeight,
            sourceHeight: outfitLeftHeight,
            sourceWidth: outfitLeftWidth,
            sourceX: 0,
            sourceY: 0,
            width: outfitLeftWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: outfitLeftX,
      y: outfitLeftY,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition,
      x: outfitLeftX,
      y: outfitLeftY,
    },
    height: outfitLeftHeight,
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeOutfitItem();
    },
    width: outfitLeftWidth,
  });
  // Body label
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 214,
      y: 130,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 1,
    text: { value: "Body" },
  });
  // Body right arrow
  const outfitRightX: number = 254;
  const outfitRightY: number = 127;
  const outfitRightWidth: number = 14;
  const outfitRightHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: outfitRightHeight,
            sourceHeight: outfitRightHeight,
            sourceWidth: outfitRightWidth,
            sourceX: 0,
            sourceY: 0,
            width: outfitRightWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: outfitRightX,
      y: outfitRightY,
    },
    imagePath: "arrows/right",
  });
  createButton({
    coordinates: {
      condition,
      x: outfitRightX,
      y: outfitRightY,
    },
    height: outfitRightHeight,
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeOutfitItem();
    },
    width: outfitRightWidth,
  });
  // Hair dye left arrow
  const hairLeftX: number = 36;
  const hairLeftY: number = 153;
  const hairLeftWidth: number = 14;
  const hairLeftHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: hairLeftHeight,
            sourceHeight: hairLeftHeight,
            sourceWidth: hairLeftWidth,
            sourceX: 0,
            sourceY: 0,
            width: hairLeftWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: hairLeftX,
      y: hairLeftY,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition,
      x: hairLeftX,
      y: hairLeftY,
    },
    height: hairLeftHeight,
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeHairDyeItem();
    },
    width: hairLeftWidth,
  });
  // Hair dye label
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 90,
      y: 156,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 1,
    text: { value: "Hair" },
  });
  // Hair dye right arrow
  const hairRightX: number = 130;
  const hairRightY: number = 153;
  const hairRightWidth: number = 14;
  const hairRightHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: hairRightHeight,
            sourceHeight: hairRightHeight,
            sourceWidth: hairRightWidth,
            sourceX: 0,
            sourceY: 0,
            width: hairRightWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: hairRightX,
      y: hairRightY,
    },
    imagePath: "arrows/right",
  });
  createButton({
    coordinates: {
      condition,
      x: hairRightX,
      y: hairRightY,
    },
    height: hairRightHeight,
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeHairDyeItem();
    },
    width: hairRightWidth,
  });
  // Clothes dye primary left arrow
  const clothesDyePrimaryLeftX: number = 160;
  const clothesDyePrimaryLeftY: number = 153;
  const clothesDyePrimaryLeftWidth: number = 14;
  const clothesDyePrimaryLeftHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: clothesDyePrimaryLeftHeight,
            sourceHeight: clothesDyePrimaryLeftHeight,
            sourceWidth: clothesDyePrimaryLeftWidth,
            sourceX: 0,
            sourceY: 0,
            width: clothesDyePrimaryLeftWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: clothesDyePrimaryLeftX,
      y: clothesDyePrimaryLeftY,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition,
      x: clothesDyePrimaryLeftX,
      y: clothesDyePrimaryLeftY,
    },
    height: clothesDyePrimaryLeftHeight,
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeClothesDyeItemPrimaryColor();
    },
    width: clothesDyePrimaryLeftWidth,
  });
  // Clothes dye primary label
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 214,
      y: 156,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 1,
    text: { value: "Primary" },
  });
  // Clothes dye primary right arrow
  const clothesDyePrimaryRightX: number = 254;
  const clothesDyePrimaryRightY: number = 153;
  const clothesDyePrimaryRightWidth: number = 14;
  const clothesDyePrimaryRightHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: clothesDyePrimaryRightHeight,
            sourceHeight: clothesDyePrimaryRightHeight,
            sourceWidth: clothesDyePrimaryRightWidth,
            sourceX: 0,
            sourceY: 0,
            width: clothesDyePrimaryRightWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: clothesDyePrimaryRightX,
      y: clothesDyePrimaryRightY,
    },
    imagePath: "arrows/right",
  });
  createButton({
    coordinates: {
      condition,
      x: clothesDyePrimaryRightX,
      y: clothesDyePrimaryRightY,
    },
    height: clothesDyePrimaryRightHeight,
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeClothesDyeItemPrimaryColor();
    },
    width: clothesDyePrimaryRightWidth,
  });
  // Skin color left arrow
  const skinLeftX: number = 36;
  const skinLeftY: number = 179;
  const skinLeftWidth: number = 14;
  const skinLeftHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: skinLeftHeight,
            sourceHeight: skinLeftHeight,
            sourceWidth: skinLeftWidth,
            sourceX: 0,
            sourceY: 0,
            width: skinLeftWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: skinLeftX,
      y: skinLeftY,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition,
      x: skinLeftX,
      y: skinLeftY,
    },
    height: skinLeftHeight,
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeSkinColor();
    },
    width: skinLeftWidth,
  });
  // Skin color label
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 90,
      y: 182,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 1,
    text: { value: "Skin" },
  });
  // Skin color right arrow
  const skinRightX: number = 130;
  const skinRightY: number = 179;
  const skinRightWidth: number = 14;
  const skinRightHeight: number = 14;
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: skinRightHeight,
            sourceHeight: skinRightHeight,
            sourceWidth: skinRightWidth,
            sourceX: 0,
            sourceY: 0,
            width: skinRightWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: skinRightX,
      y: skinRightY,
    },
    imagePath: "arrows/right",
  });
  createButton({
    coordinates: {
      condition,
      x: skinRightX,
      y: skinRightY,
    },
    height: skinRightHeight,
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeSkinColor();
    },
    width: skinRightWidth,
  });
  const clothesDyeSecondaryLeftX: number = 160;
  const clothesDyeSecondaryLeftY: number = 179;
  const clothesDyeSecondaryLeftWidth: number = 14;
  const clothesDyeSecondaryLeftHeight: number = 14;
  // Clothes dye secondary left arrow
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: clothesDyeSecondaryLeftHeight,
            sourceHeight: clothesDyeSecondaryLeftHeight,
            sourceWidth: clothesDyeSecondaryLeftWidth,
            sourceX: 0,
            sourceY: 0,
            width: clothesDyeSecondaryLeftWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: clothesDyeSecondaryLeftX,
      y: clothesDyeSecondaryLeftY,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition,
      x: clothesDyeSecondaryLeftX,
      y: clothesDyeSecondaryLeftY,
    },
    height: clothesDyeSecondaryLeftHeight,
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeClothesDyeItemSecondaryColor();
    },
    width: clothesDyeSecondaryLeftWidth,
  });
  // Clothes dye secondary label
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 214,
      y: 182,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 1,
    text: { value: "Secondary" },
  });
  const clothesDyeSecondaryRightX: number = 254;
  const clothesDyeSecondaryRightY: number = 179;
  const clothesDyeSecondaryRightWidth: number = 14;
  const clothesDyeSecondaryRightHeight: number = 14;
  // Clothes dye secondary right arrow
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: clothesDyeSecondaryRightHeight,
            sourceHeight: clothesDyeSecondaryRightHeight,
            sourceWidth: clothesDyeSecondaryRightWidth,
            sourceX: 0,
            sourceY: 0,
            width: clothesDyeSecondaryRightWidth,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: clothesDyeSecondaryRightX,
      y: clothesDyeSecondaryRightY,
    },
    imagePath: "arrows/right",
  });
  createButton({
    coordinates: {
      condition,
      x: clothesDyeSecondaryRightX,
      y: clothesDyeSecondaryRightY,
    },
    height: clothesDyeSecondaryRightHeight,
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeClothesDyeItemSecondaryColor();
    },
    width: clothesDyeSecondaryRightWidth,
  });
  // Finish button
  createPressableButton({
    condition,
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      emitToSocketioServer({
        data: {
          classID: getClass().id,
          clothesDyeItemID: getClothesDyeItem().id,
          figureID: getFigure().id,
          hairDyeItemID: getHairDyeItem().id,
          maskItemID: getMaskItem().id,
          outfitItemID: getOutfitItem().id,
          skinColorID: getSkinColor().id,
        },
        event: "main-menu/character-customize/create-character",
      });
    },
    text: { value: "Finish" },
    width: 52,
    x: 126,
    y: 207,
  });
};
