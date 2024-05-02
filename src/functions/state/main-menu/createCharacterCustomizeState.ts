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
  const [clothesDyeItemPrimaryColorIndex, clothesDyeItemSecondaryColorIndex]: [
    number,
    number,
  ] = getDefinable(Class, options.classID).clothesDyeItemOrderOffset;
  const state: State<CharacterCustomizeStateSchema> =
    new State<CharacterCustomizeStateSchema>({
      classID: options.classID,
      clothesDyeItemPrimaryColorIndex,
      clothesDyeItemSecondaryColorIndex,
      direction: Direction.Down,
      figureIndex: 0,
      hairDyeItemIndex: 0,
      maskItemIndex: 0,
      outfitItemIndex: 0,
      skinColorIndex: 0,
    });
  return state;
};
