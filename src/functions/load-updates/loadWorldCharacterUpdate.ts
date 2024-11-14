import {
  Constants,
  Direction,
  Step,
  WorldCharacterUpdate,
} from "retrommo-types";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { addWorldCharacterMarker } from "../addWorldCharacterMarker";
import { createButton, createEntity } from "pixel-pigeon";
import { createCharacterSprite } from "../ui/components/createCharacterSprite";
import { getConstants } from "../getConstants";

export const loadWorldCharacterUpdate = (
  worldCharacterUpdate: WorldCharacterUpdate,
): void => {
  const constants: Constants = getConstants();
  const worldCharacter: WorldCharacter = new WorldCharacter({
    classID: worldCharacterUpdate.classID,
    clothesDyeItemID: worldCharacterUpdate.clothesDyeItemID,
    direction: worldCharacterUpdate.direction,
    figureID: worldCharacterUpdate.figureID,
    hairDyeItemID: worldCharacterUpdate.hairDyeItemID,
    id: worldCharacterUpdate.id,
    level: worldCharacterUpdate.level,
    maskItemID: worldCharacterUpdate.maskItemID,
    openedChestIDs: worldCharacterUpdate.openedChestIDs,
    order: worldCharacterUpdate.order,
    outfitItemID: worldCharacterUpdate.outfitItemID,
    partyID: worldCharacterUpdate.partyID,
    playerID: worldCharacterUpdate.playerID,
    position: {
      x: worldCharacterUpdate.x,
      y: worldCharacterUpdate.y,
    },
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
    step: worldCharacterUpdate.step,
    tilemapID: worldCharacterUpdate.tilemapID,
    userID: worldCharacterUpdate.userID,
    username: worldCharacterUpdate.username,
  });
  const tileSize: number = constants["tile-size"];
  worldCharacter.entityID = createEntity({
    buttons: [
      {
        buttonID: createButton({
          height: tileSize,
          width: tileSize,
        }),
        onClick: (): void => {
          worldCharacter.wasClicked = true;
        },
      },
    ],
    height: tileSize,
    layerID: "characters",
    levelID: worldCharacter.tilemapID,
    position: {
      x: worldCharacter.position.x * tileSize,
      y: worldCharacter.position.y * tileSize,
    },
    width: tileSize,
    zIndex: worldCharacter.order,
  });
  createCharacterSprite({
    clothesDyeID: (): string => worldCharacter.clothesDyeItem.clothesDyeID,
    direction: (): Direction => worldCharacter.direction,
    entity: {
      animationStartedAt: (): number | null =>
        worldCharacter.hasMovedAt() ? worldCharacter.movedAt : null,
      entityID: worldCharacter.entityID,
      step: (): Step => worldCharacter.step,
    },
    figureID: (): string => worldCharacter.figureID,
    hairDyeID: (): string => worldCharacter.hairDyeItem.hairDyeID,
    maskID: (): string => worldCharacter.maskItem.maskID,
    outfitID: (): string => worldCharacter.outfitItem.outfitID,
    skinColorID: (): string => worldCharacter.skinColorID,
  });
  if (typeof worldCharacterUpdate.marker !== "undefined") {
    addWorldCharacterMarker(worldCharacter.id, worldCharacterUpdate.marker);
  }
};
