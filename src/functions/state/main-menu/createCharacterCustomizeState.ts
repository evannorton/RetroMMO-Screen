import { CharacterCustomizeStateSchema } from "../../../state";
import { Class } from "../../../classes/Class";
import { Direction } from "retrommo-types";
import { State } from "pixel-pigeon";
import { getDefinable } from "../../../definables";

export interface CreateCharacterCustomizeStateOptions {
  classID: string;
}
export const createCharacterCustomizeState = (
  options: CreateCharacterCustomizeStateOptions,
): State<CharacterCustomizeStateSchema> => {
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
  const state: State<CharacterCustomizeStateSchema> =
    new State<CharacterCustomizeStateSchema>({
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
