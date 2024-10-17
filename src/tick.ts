import { WorldCharacter } from "./classes/WorldCharacter";
import { getDefinables } from "definables";

export const tick = (): void => {
  let clickedWorldCharacter: WorldCharacter | null = null;
  for (const worldCharacter of getDefinables(WorldCharacter).values()) {
    if (
      worldCharacter.wasClicked &&
      (clickedWorldCharacter === null ||
        worldCharacter.order < clickedWorldCharacter.order)
    ) {
      clickedWorldCharacter = worldCharacter;
    }
    worldCharacter.wasClicked = false;
  }
  if (clickedWorldCharacter !== null) {
    console.log(`handle click on character ${clickedWorldCharacter.username}`);
  }
};
