import { Constants, Direction } from "retrommo-types";
import { WorldCharacter } from "./classes/WorldCharacter";
import { emoteDuration } from "./constants/emoteDuration";
import { getConstants } from "./functions/getConstants";
import { getCurrentTime, removeEntity, setEntityPosition } from "pixel-pigeon";
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
    if (
      worldCharacter.hasEmote() &&
      worldCharacter.emote.usedAt < getCurrentTime() - emoteDuration
    ) {
      removeEntity(worldCharacter.emote.entityID);
      worldCharacter.emote = null;
    }
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
      case Direction.Down: {
        const x: number = worldCharacter.position.x * constants["tile-size"];
        const y: number =
          worldCharacter.position.y * constants["tile-size"] -
          (constants["tile-size"] - pixelsMoved);
        setEntityPosition(worldCharacter.entityID, {
          x,
          y,
        });
        if (worldCharacter.hasEmote()) {
          setEntityPosition(worldCharacter.emote.entityID, {
            x,
            y: y - constants["tile-size"],
          });
        }
        if (worldCharacter.hasMarker()) {
          setEntityPosition(worldCharacter.marker.entityID, {
            x,
            y,
          });
        }
        break;
      }
      case Direction.Left: {
        const x: number =
          worldCharacter.position.x * constants["tile-size"] +
          (constants["tile-size"] - pixelsMoved);
        const y: number = worldCharacter.position.y * constants["tile-size"];
        setEntityPosition(worldCharacter.entityID, {
          x,
          y,
        });
        if (worldCharacter.hasEmote()) {
          setEntityPosition(worldCharacter.emote.entityID, {
            x,
            y: y - constants["tile-size"],
          });
        }
        if (worldCharacter.hasMarker()) {
          setEntityPosition(worldCharacter.marker.entityID, {
            x,
            y,
          });
        }
        break;
      }
      case Direction.Right: {
        const x: number =
          worldCharacter.position.x * constants["tile-size"] -
          (constants["tile-size"] - pixelsMoved);
        const y: number = worldCharacter.position.y * constants["tile-size"];
        setEntityPosition(worldCharacter.entityID, {
          x,
          y,
        });
        if (worldCharacter.hasEmote()) {
          setEntityPosition(worldCharacter.emote.entityID, {
            x,
            y: y - constants["tile-size"],
          });
        }
        if (worldCharacter.hasMarker()) {
          setEntityPosition(worldCharacter.marker.entityID, {
            x,
            y,
          });
        }
        break;
      }
      case Direction.Up: {
        const x: number = worldCharacter.position.x * constants["tile-size"];
        const y: number =
          worldCharacter.position.y * constants["tile-size"] +
          (constants["tile-size"] - pixelsMoved);
        setEntityPosition(worldCharacter.entityID, {
          x,
          y,
        });
        if (worldCharacter.hasEmote()) {
          setEntityPosition(worldCharacter.emote.entityID, {
            x,
            y: y - constants["tile-size"],
          });
        }
        if (worldCharacter.hasMarker()) {
          setEntityPosition(worldCharacter.marker.entityID, {
            x,
            y,
          });
        }
        break;
      }
    }
  }
  if (clickedWorldCharacter !== null) {
    handleWorldCharacterClick(clickedWorldCharacter.id);
  }
};
