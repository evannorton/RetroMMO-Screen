import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldCharacterUpdate } from "retrommo-types";
import { addCharacterToWorld } from "./addCharacterToWorld";

export const loadWorldCharacterUpdate = (
  worldCharacterUpdate: WorldCharacterUpdate,
): void => {
  const worldCharacter: WorldCharacter = new WorldCharacter({
    classID: worldCharacterUpdate.classID,
    clothesDyeItemID: worldCharacterUpdate.clothesDyeItemID,
    direction: worldCharacterUpdate.direction,
    figureID: worldCharacterUpdate.figureID,
    hairDyeItemID: worldCharacterUpdate.hairDyeItemID,
    id: worldCharacterUpdate.id,
    level: worldCharacterUpdate.level,
    maskItemID: worldCharacterUpdate.maskItemID,
    order: worldCharacterUpdate.order,
    outfitItemID: worldCharacterUpdate.outfitItemID,
    partyID: worldCharacterUpdate.partyID,
    playerID: worldCharacterUpdate.playerID,
    resources:
      typeof worldCharacterUpdate.resources !== "undefined"
        ? {
            hp: worldCharacterUpdate.resources.hp,
            maxHP: worldCharacterUpdate.resources.maxHP,
            maxMP: worldCharacterUpdate.resources.maxMP,
            mp: worldCharacterUpdate.resources.mp,
          }
        : undefined,
    skinColorID: worldCharacterUpdate.skinColorID,
    tilemapID: worldCharacterUpdate.tilemapID,
    userID: worldCharacterUpdate.userID,
    username: worldCharacterUpdate.username,
    x: worldCharacterUpdate.x,
    y: worldCharacterUpdate.y,
  });
  addCharacterToWorld(worldCharacter.id);
};
