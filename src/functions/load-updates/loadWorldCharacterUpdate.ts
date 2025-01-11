import {
  Constants,
  Direction,
  Step,
  WorldCharacterUpdate,
  WorldQuestInstanceUpdate,
} from "retrommo-types";
import {
  WorldCharacter,
  WorldCharacterOptionsQuestInstance,
} from "../../classes/WorldCharacter";
import { addWorldCharacterEmote } from "../addWorldCharacterEmote";
import { addWorldCharacterMarker } from "../addWorldCharacterMarker";
import { createButton, createEntity, getCurrentTime } from "pixel-pigeon";
import { createCharacterSprite } from "../ui/components/createCharacterSprite";
import { getConstants } from "../getConstants";
import { getDefaultedClothesDye } from "../defaulted-cosmetics/getDefaultedClothesDye";
import { getDefaultedHairDye } from "../defaulted-cosmetics/getDefaultedHairDye";
import { getDefaultedMask } from "../defaulted-cosmetics/getDefaultedMask";
import { getDefaultedOutfit } from "../defaulted-cosmetics/getDefaultedOutfit";

export const loadWorldCharacterUpdate = (
  worldCharacterUpdate: WorldCharacterUpdate,
): void => {
  const constants: Constants = getConstants();
  const questInstances: Record<string, WorldCharacterOptionsQuestInstance> = {};
  if (typeof worldCharacterUpdate.questInstances !== "undefined") {
    for (const questID in worldCharacterUpdate.questInstances) {
      const questInstance: WorldQuestInstanceUpdate | undefined =
        worldCharacterUpdate.questInstances[questID];
      if (typeof questInstance === "undefined") {
        throw new Error("No quest instance.");
      }
      questInstances[questID] = {
        isCompleted: questInstance.isCompleted ?? false,
        isStarted: questInstance.isStarted ?? false,
        monsterKills: questInstance.monsterKills,
      };
    }
  }
  const worldCharacter: WorldCharacter = new WorldCharacter({
    classID: worldCharacterUpdate.classID,
    clothesDyeItemID: worldCharacterUpdate.clothesDyeItemID,
    direction: worldCharacterUpdate.direction,
    figureID: worldCharacterUpdate.figureID,
    hairDyeItemID: worldCharacterUpdate.hairDyeItemID,
    id: worldCharacterUpdate.id,
    isRenewing: worldCharacterUpdate.isRenewing,
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
    questInstances,
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
    clothesDyeID: (): string =>
      getDefaultedClothesDye(
        worldCharacter.hasClothesDyeItem()
          ? worldCharacter.clothesDyeItemID
          : undefined,
      ).id,
    direction: (): Direction => worldCharacter.direction,
    entity: {
      animationStartedAt: (): number | null =>
        worldCharacter.hasMovedAt() ? worldCharacter.movedAt : null,
      entityID: worldCharacter.entityID,
      step: (): Step => worldCharacter.step,
    },
    figureID: (): string => worldCharacter.figureID,
    hairDyeID: (): string =>
      getDefaultedHairDye(
        worldCharacter.hasHairDyeItem()
          ? worldCharacter.hairDyeItemID
          : undefined,
      ).id,
    maskID: (): string =>
      getDefaultedMask(
        worldCharacter.hasMaskItem() ? worldCharacter.maskItemID : undefined,
      ).id,
    outfitID: (): string =>
      getDefaultedOutfit(
        worldCharacter.hasOutfitItem()
          ? worldCharacter.outfitItemID
          : undefined,
      ).id,
    skinColorID: (): string => worldCharacter.skinColorID,
  });
  if (typeof worldCharacterUpdate.marker !== "undefined") {
    addWorldCharacterMarker(worldCharacter.id, worldCharacterUpdate.marker);
  }
  if (typeof worldCharacterUpdate.emote !== "undefined") {
    addWorldCharacterEmote(
      worldCharacter.id,
      worldCharacterUpdate.emote.emoteID,
      getCurrentTime() - worldCharacterUpdate.emote.sinceUsed,
    );
  }
};
