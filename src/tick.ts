import { WorldCharacter } from "./classes/WorldCharacter";
import { getDefinables } from "definables";
import { handleWorldCharacterClick } from "./functions/handleWorldCharacterClick";

export const tick = (): void => {
  let clickedWorldCharacter: WorldCharacter | null = null;
  for (const worldCharacter of getDefinables(WorldCharacter).values()) {
    if (
      worldCharacter.wasClicked &&
      (clickedWorldCharacter === null ||
        worldCharacter.order > clickedWorldCharacter.order)
    ) {
      clickedWorldCharacter = worldCharacter;
    }
    worldCharacter.wasClicked = false;
  }
  if (clickedWorldCharacter !== null) {
    handleWorldCharacterClick(clickedWorldCharacter.id);
  }
};
