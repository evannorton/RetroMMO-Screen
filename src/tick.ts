import { Constants, Direction } from "retrommo-types";
import { WorldCharacter } from "./classes/WorldCharacter";
import { getConstants } from "./functions/getConstants";
import { getCurrentTime, setEntityPosition } from "pixel-pigeon";
import { getDefinables } from "definables";
import { handleWorldCharacterClick } from "./functions/handleWorldCharacterClick";

export const tick = (): void => {
  const constants: Constants = getConstants();
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
    let percentMoved: number | undefined;
    if (worldCharacter.hasMovedAt()) {
      percentMoved = Math.min(
        1,
        (getCurrentTime() - worldCharacter.movedAt) /
          constants["movement-duration"],
      );
    } else {
      percentMoved = 1;
    }
    const pixelsMoved: number = Math.round(
      percentMoved * constants["tile-size"],
    );
    switch (worldCharacter.direction) {
      case Direction.Down:
        setEntityPosition(worldCharacter.entityID, {
          x: worldCharacter.position.x * constants["tile-size"],
          y:
            worldCharacter.position.y * constants["tile-size"] -
            (constants["tile-size"] - pixelsMoved),
        });
        break;
      case Direction.Left:
        setEntityPosition(worldCharacter.entityID, {
          x:
            worldCharacter.position.x * constants["tile-size"] +
            (constants["tile-size"] - pixelsMoved),
          y: worldCharacter.position.y * constants["tile-size"],
        });
        break;
      case Direction.Right:
        setEntityPosition(worldCharacter.entityID, {
          x:
            worldCharacter.position.x * constants["tile-size"] -
            (constants["tile-size"] - pixelsMoved),
          y: worldCharacter.position.y * constants["tile-size"],
        });
        break;
      case Direction.Up:
        setEntityPosition(worldCharacter.entityID, {
          x: worldCharacter.position.x * constants["tile-size"],
          y:
            worldCharacter.position.y * constants["tile-size"] +
            (constants["tile-size"] - pixelsMoved),
        });
        break;
    }
  }
  if (clickedWorldCharacter !== null) {
    handleWorldCharacterClick(clickedWorldCharacter.id);
  }
};
