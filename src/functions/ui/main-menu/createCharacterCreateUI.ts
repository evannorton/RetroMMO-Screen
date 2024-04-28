import { Class } from "../../../classes/Class";
import {
  createButton,
  createLabel,
  createSprite,
  getGameHeight,
  getGameWidth,
} from "pixel-pigeon";
import { createCharacterSelectState } from "../../state/main-menu/createCharacterSelectState";
import { createPanel } from "../components/createPanel";
import { createPlayerSprite } from "../components/createPlayerSprite";
import { createPressableButton } from "../components/createPressableButton";
import { getDefinables } from "../../../definables";
import { state } from "../../../state";

export const createCharacterCreateUI = (): void => {
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
      if (state.values.mainMenuState === null) {
        throw new Error("mainMenuState is null");
      }
      state.values.mainMenuState.setValues({
        characterCreateState: null,
        characterSelectState: createCharacterSelectState(),
      });
    },
    width: backWidth,
  });
  // Title text
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: 152,
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
        color: "#ffffff",
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
      createPlayerSprite({
        clothesDyeItemID: sortedClass.defaultClothesDyeItem.id,
        condition,
        figureID: sortedClass.defaultFigure.id,
        hairDyeItemID: sortedClass.defaultHairDyeItem.id,
        maskItemID: sortedClass.defaultMaskItem.id,
        outfitItemID: sortedClass.defaultOutfitItem.id,
        skinColorID: sortedClass.defaultSkinColor.id,
        x: 48 + sortedClassIndex * 96,
        y: 74,
      });
      // Select button
      createPressableButton({
        condition,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          console.log("TODO");
        },
        text: { value: "Select" },
        width: 44,
        x: 34 + sortedClassIndex * 96,
        y: 103,
      });
    },
  );
};
