import {
  CollisionData,
  EntityCollidable,
  getEntityFieldValue,
  getRectangleCollisionData,
} from "pixel-pigeon";
import { Constants, Direction } from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import { getConstants } from "./getConstants";
import { getDefinable } from "definables";
import { getWorldState } from "./state/getWorldState";
import { hasOpenedChest } from "./hasOpenedChest";

const getNPCEntityCollidable = (
  direction: Direction,
  x: number,
  y: number,
): EntityCollidable | null => {
  const constants: Constants = getConstants();
  const npcCollisionData: CollisionData = getRectangleCollisionData({
    entityTypes: ["npc", "npc-extender"],
    rectangle: {
      height: constants["tile-size"],
      width: constants["tile-size"],
      x,
      y,
    },
  });
  if (npcCollisionData.entityCollidables.length > 0) {
    const entityCollidable: EntityCollidable = npcCollisionData
      .entityCollidables[0] as EntityCollidable;
    switch (entityCollidable.type) {
      case "npc":
        return entityCollidable;
      case "npc-extender": {
        let newX: number = x;
        let newY: number = y;
        switch (direction) {
          case Direction.Down:
            newY += constants["tile-size"];
            break;
          case Direction.Left:
            newX -= constants["tile-size"];
            break;
          case Direction.Right:
            newX += constants["tile-size"];
            break;
          case Direction.Up:
            newY -= constants["tile-size"];
            break;
        }
        return getNPCEntityCollidable(direction, newX, newY);
      }
    }
  }
  return null;
};

export const getInteractableEntityCollidable = (): EntityCollidable | null => {
  const constants: Constants = getConstants();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    getWorldState().values.worldCharacterID,
  );
  let x: number = worldCharacter.position.x * constants["tile-size"];
  let y: number = worldCharacter.position.y * constants["tile-size"];
  switch (worldCharacter.direction) {
    case Direction.Down:
      y += constants["tile-size"];
      break;
    case Direction.Left:
      x -= constants["tile-size"];
      break;
    case Direction.Right:
      x += constants["tile-size"];
      break;
    case Direction.Up:
      y -= constants["tile-size"];
      break;
  }
  const collisionData: CollisionData = getRectangleCollisionData({
    entityTypes: ["bank", "chest", "combination-lock", "enterable", "piano"],
    rectangle: {
      height: constants["tile-size"],
      width: constants["tile-size"],
      x,
      y,
    },
  });
  if (collisionData.entityCollidables.length > 0) {
    const entityCollidable: EntityCollidable | undefined =
      collisionData.entityCollidables[0];
    if (typeof entityCollidable === "undefined") {
      throw new Error("Entity collidable is undefined");
    }
    if (entityCollidable.type === "chest") {
      const chestID: unknown = getEntityFieldValue(
        entityCollidable.entityID,
        "chestID",
      );
      if (typeof chestID !== "string") {
        throw new Error("No chest ID.");
      }
      if (hasOpenedChest(chestID)) {
        return null;
      }
    }
    return entityCollidable;
  }
  return getNPCEntityCollidable(worldCharacter.direction, x, y);
};
