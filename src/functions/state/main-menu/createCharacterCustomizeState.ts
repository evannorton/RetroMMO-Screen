import { CharacterCustomizeStateSchema } from "../../../state";
import { State } from "pixel-pigeon";

export interface CreateCharacterCustomizeStateOptions {
  classID: string;
}
export const createCharacterCustomizeState = (
  options: CreateCharacterCustomizeStateOptions,
): State<CharacterCustomizeStateSchema> =>
  new State<CharacterCustomizeStateSchema>({
    classID: options.classID,
  });
