import { Class } from "../../../classes/Class";
import {
  Color,
  Direction,
  MainMenuCharacterCustomizeCreateCharacterRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  createLabel,
  emitToSocketioServer,
  getGameHeight,
  getGameWidth,
} from "pixel-pigeon";
import { Figure } from "../../../classes/Figure";
import { Item } from "../../../classes/Item";
import { SkinColor } from "../../../classes/SkinColor";
import { createCharacterSprite } from "../components/createCharacterSprite";
import { createClickableImage } from "../components/createClickableImage";
import { createMainMenuCharacterCreateState } from "../../state/main-menu/createMainMenuCharacterCreateState";
import { createPanel } from "../components/createPanel";
import { createPressableButton } from "../components/createPressableButton";
import { getDefinable } from "definables";
import { getMainMenuCharacterCustomizeState } from "../../state/main-menu/getMainMenuCharacterCustomizeState";
import { getMainMenuState } from "../../state/main-menu/getMainMenuState";
import { state } from "../../../state";

export const createMainMenuCharacterCustomizeUI = (): void => {
  const condition = (): boolean =>
    state.values.mainMenuState !== null &&
    state.values.mainMenuState.values.characterCustomizeState !== null;
  const getClass = (): Class =>
    getDefinable(Class, getMainMenuCharacterCustomizeState().values.classID);
  const getFigure = (): Figure =>
    getClass().getCharacterCustomizeFigure(
      getMainMenuCharacterCustomizeState().values.figureIndex,
    );
  const getSkinColor = (): SkinColor =>
    getClass().getCharacterCustomizeSkinColor(
      getMainMenuCharacterCustomizeState().values.skinColorIndex,
    );
  const getClothesDyeItem = (): Item =>
    getDefinable(
      Item,
      getClass().getCharacterCustomizeClothesDyeItem(
        getMainMenuCharacterCustomizeState().values
          .clothesDyeItemPrimaryColorIndex,
        getMainMenuCharacterCustomizeState().values
          .clothesDyeItemSecondaryColorIndex,
      ).id,
    );
  const getHairDyeItem = (): Item =>
    getDefinable(
      Item,
      getClass().getCharacterCustomizeHairDyeItem(
        getMainMenuCharacterCustomizeState().values.hairDyeItemIndex,
      ).id,
    );
  const getOutfitItem = (): Item =>
    getDefinable(
      Item,
      getClass().getCharacterCustomizeOutfitItem(
        getMainMenuCharacterCustomizeState().values.outfitItemIndex,
      ).id,
    );
  const getMaskItem = (): Item =>
    getDefinable(
      Item,
      getClass().getCharacterCustomizeMaskItem(
        getMainMenuCharacterCustomizeState().values.maskItemIndex,
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
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/left",
    onClick: (): void => {
      getMainMenuState().setValues({
        characterCreateState: createMainMenuCharacterCreateState(),
        characterCustomizeState: null,
      });
    },
    width: 14,
    x: 16,
    y: 16,
  });
  // Class name
  createLabel({
    color: Color.White,
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
    color: Color.White,
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
  createCharacterSprite({
    clothesDyeID: (): string => getClothesDyeItem().clothesDyeID,
    coordinates: {
      condition,
      isAnimated: true,
      x: 144,
      y: 74,
    },
    direction: (): Direction =>
      getMainMenuCharacterCustomizeState().values.direction,
    figureID: (): string => getFigure().id,
    hairDyeID: (): string => getHairDyeItem().hairDyeID,
    maskID: (): string => getMaskItem().maskID,
    outfitID: (): string => getOutfitItem().outfitID,
    skinColorID: (): string => getSkinColor().id,
  });
  // Preview left arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/left",
    onClick: (): void => {
      switch (getMainMenuCharacterCustomizeState().values.direction) {
        case Direction.Down:
          getMainMenuCharacterCustomizeState().setValues({
            direction: Direction.Left,
          });
          break;
        case Direction.Left:
          getMainMenuCharacterCustomizeState().setValues({
            direction: Direction.Up,
          });
          break;
        case Direction.Up:
          getMainMenuCharacterCustomizeState().setValues({
            direction: Direction.Right,
          });
          break;
        case Direction.Right:
          getMainMenuCharacterCustomizeState().setValues({
            direction: Direction.Down,
          });
          break;
      }
    },
    width: 14,
    x: 98,
    y: 75,
  });
  // Preview right arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/right",
    onClick: (): void => {
      switch (getMainMenuCharacterCustomizeState().values.direction) {
        case Direction.Down:
          getMainMenuCharacterCustomizeState().setValues({
            direction: Direction.Right,
          });
          break;
        case Direction.Left:
          getMainMenuCharacterCustomizeState().setValues({
            direction: Direction.Down,
          });
          break;
        case Direction.Up:
          getMainMenuCharacterCustomizeState().setValues({
            direction: Direction.Left,
          });
          break;
        case Direction.Right:
          getMainMenuCharacterCustomizeState().setValues({
            direction: Direction.Up,
          });
          break;
      }
    },
    width: 14,
    x: 192,
    y: 75,
  });
  // Figure left arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/left",
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeFigure();
    },
    width: 14,
    x: 98,
    y: 101,
  });
  // Figure label
  createLabel({
    color: Color.White,
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
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/right",
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeFigure();
    },
    width: 14,
    x: 192,
    y: 101,
  });
  // Head left arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/left",
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeMaskItem();
    },
    width: 14,
    x: 36,
    y: 127,
  });
  // Head label
  createLabel({
    color: Color.White,
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
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/right",
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeMaskItem();
    },
    width: 14,
    x: 130,
    y: 127,
  });
  // Body left arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/left",
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeOutfitItem();
    },
    width: 14,
    x: 160,
    y: 127,
  });
  // Body label
  createLabel({
    color: Color.White,
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
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/right",
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeOutfitItem();
    },
    width: 14,
    x: 254,
    y: 127,
  });
  // Hair dye left arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/left",
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeHairDyeItem();
    },
    width: 14,
    x: 36,
    y: 153,
  });
  // Hair dye label
  createLabel({
    color: Color.White,
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
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/right",
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeHairDyeItem();
    },
    width: 14,
    x: 130,
    y: 153,
  });
  // Clothes dye primary left arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/left",
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeClothesDyeItemPrimaryColor();
    },
    width: 14,
    x: 160,
    y: 153,
  });
  // Clothes dye primary label
  createLabel({
    color: Color.White,
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
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/right",
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeClothesDyeItemPrimaryColor();
    },
    width: 14,
    x: 254,
    y: 153,
  });
  // Skin color left arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/left",
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeSkinColor();
    },
    width: 14,
    x: 36,
    y: 179,
  });
  // Skin color label
  createLabel({
    color: Color.White,
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
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/right",
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeSkinColor();
    },
    width: 14,
    x: 130,
    y: 179,
  });
  // Clothes dye secondary left arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/left",
    onClick: (): void => {
      getClass().goToPreviousCharacterCustomizeClothesDyeItemSecondaryColor();
    },
    width: 14,
    x: 160,
    y: 179,
  });
  // Clothes dye secondary label
  createLabel({
    color: Color.White,
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
  // Clothes dye secondary right arrow
  createClickableImage({
    condition,
    height: 14,
    imagePath: "arrows/right",
    onClick: (): void => {
      getClass().goToNextCharacterCustomizeClothesDyeItemSecondaryColor();
    },
    width: 14,
    x: 254,
    y: 179,
  });
  // Finish button
  createPressableButton({
    condition,
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      emitToSocketioServer<MainMenuCharacterCustomizeCreateCharacterRequest>({
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
