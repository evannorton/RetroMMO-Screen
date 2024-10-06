import { Direction } from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import { getDefinable } from "definables";
import { updateWorldCharacterPosition } from "./updateWorldCharacterPosition";

export const moveWorldCharacter = (worldCharacterID: string): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  switch (worldCharacter.direction) {
    case Direction.Down:
      updateWorldCharacterPosition(
        worldCharacter.id,
        worldCharacter.x,
        worldCharacter.y + 1,
      );
      break;
    case Direction.Left:
      updateWorldCharacterPosition(
        worldCharacter.id,
        worldCharacter.x - 1,
        worldCharacter.y,
      );
      break;
    case Direction.Right:
      updateWorldCharacterPosition(
        worldCharacter.id,
        worldCharacter.x + 1,
        worldCharacter.y,
      );
      break;
    case Direction.Up:
      updateWorldCharacterPosition(
        worldCharacter.id,
        worldCharacter.x,
        worldCharacter.y - 1,
      );
      break;
  }
};
