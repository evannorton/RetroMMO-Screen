import { Class } from "../../../classes/Class";
import { Direction } from "retrommo-types";
import { MainMenuCharacterCustomizeStateSchema } from "../../../state";
import { State } from "pixel-pigeon";
import { getDefinable } from "definables";

export interface createMainMenuCharacterCustomizeStateOptions {
  classID: string;
}
export const createMainMenuCharacterCustomizeState = (
  options: createMainMenuCharacterCustomizeStateOptions,
): State<MainMenuCharacterCustomizeStateSchema> => {
  const characterClass: Class = getDefinable(Class, options.classID);
  const [clothesDyeItemPrimaryColorIndex, clothesDyeItemSecondaryColorIndex]: [
    number,
    number,
  ] = characterClass.clothesDyeItemOrderOffset;
  const figureIndex: number = characterClass.figureOrderOffset;
  const skinColorIndex: number = characterClass.skinColorOrderOffset;
  const hairDyeItemIndex: number = characterClass.hairDyeItemOrderOffset;
  const maskItemIndex: number = characterClass.maskItemOrderOffset;
  const outfitItemIndex: number = characterClass.outfitItemOrderOffset;
  const state: State<MainMenuCharacterCustomizeStateSchema> =
    new State<MainMenuCharacterCustomizeStateSchema>({
      classID: options.classID,
      clothesDyeItemPrimaryColorIndex,
      clothesDyeItemSecondaryColorIndex,
      direction: Direction.Down,
      figureIndex,
      hairDyeItemIndex,
      maskItemIndex,
      outfitItemIndex,
      skinColorIndex,
    });
  return state;
};
