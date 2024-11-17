import { Class } from "../../../classes/Class";
import { Color, Direction } from "retrommo-types";
import { createCharacterSprite } from "../components/createCharacterSprite";
import { createClickableImage } from "../components/createClickableImage";
import { createLabel, getGameHeight, getGameWidth } from "pixel-pigeon";
import { createMainMenuCharacterCustomizeState } from "../../state/main-menu/createMainMenuCharacterCustomizeState";
import { createMainMenuCharacterSelectState } from "../../state/main-menu/createMainMenuCharacterSelectState";
import { createPanel } from "../components/createPanel";
import { createPressableButton } from "../components/createPressableButton";
import { getDefinables } from "definables";
import { getMainMenuState } from "../../state/main-menu/getMainMenuState";
import { state } from "../../../state";

export const createMainMenuCharacterCreateUI = (): void => {
  const condition = (): boolean =>
    state.values.mainMenuState !== null &&
    state.values.mainMenuState.values.characterCreateState !== null;
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
        characterCreateState: null,
        characterSelectState: createMainMenuCharacterSelectState(0),
      });
    },
    width: 14,
    x: 16,
    y: 16,
  });
  // Title text
  createLabel({
    color: Color.White,
    coordinates: {
      condition,
      x: getGameWidth() / 2,
      y: 10,
    },
    horizontalAlignment: "center",
    size: 2,
    text: { value: "Character Creation" },
  });
  const classes: [string, Class][] = Array.from(getDefinables(Class));
  const sortedClasses: [string, Class][] = classes.sort(
    ([, a]: [string, Class], [, b]: [string, Class]): number =>
      a.order - b.order,
  );
  sortedClasses.forEach(
    ([, sortedClass]: [string, Class], sortedClassIndex: number): void => {
      // Class panel
      createPanel({
        condition,
        height: 80,
        imagePath: "panels/basic",
        width: 80,
        x: 16 + sortedClassIndex * 96,
        y: 48,
      });
      // Class name text
      createLabel({
        color: Color.White,
        coordinates: {
          condition,
          x: 56 + sortedClassIndex * 96,
          y: 57,
        },
        horizontalAlignment: "center",
        size: 1,
        text: { value: sortedClass.name },
      });
      // Class player sprite
      createCharacterSprite({
        clothesDyeID: sortedClass.defaultClothesDyeItem.clothesDyeID,
        coordinates: {
          condition,
          isAnimated: true,
          x: 48 + sortedClassIndex * 96,
          y: 74,
        },
        direction: Direction.Down,
        figureID: sortedClass.defaultFigureID,
        hairDyeID: sortedClass.defaultHairDyeItem.hairDyeID,
        maskID: sortedClass.defaultMaskItem.maskID,
        outfitID: sortedClass.defaultOutfitItem.outfitID,
        skinColorID: sortedClass.defaultSkinColorID,
      });
      // Select button
      createPressableButton({
        condition,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          getMainMenuState().setValues({
            characterCreateState: null,
            characterCustomizeState: createMainMenuCharacterCustomizeState({
              classID: sortedClass.id,
            }),
          });
        },
        text: { value: "Select" },
        width: 44,
        x: 34 + sortedClassIndex * 96,
        y: 103,
      });
    },
  );
};
