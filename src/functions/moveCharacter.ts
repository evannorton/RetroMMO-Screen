import { Character } from "../classes/Character";
import { Direction } from "retrommo-types";
import { getDefinable } from "../definables";
import { updateCharacterPosition } from "./updateCharacterPosition";

export const moveCharacter = (characterID: string): void => {
  const character: Character = getDefinable(Character, characterID);
  switch (character.direction) {
    case Direction.Down:
      updateCharacterPosition(character.id, character.x, character.y + 1);
      break;
    case Direction.Left:
      updateCharacterPosition(character.id, character.x - 1, character.y);
      break;
    case Direction.Right:
      updateCharacterPosition(character.id, character.x + 1, character.y);
      break;
    case Direction.Up:
      updateCharacterPosition(character.id, character.x, character.y - 1);
      break;
  }
};
