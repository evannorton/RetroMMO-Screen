import { Constants } from "retrommo-types";
import { Emote } from "../classes/Emote";
import {
  EntitySprite,
  createEntity,
  createSprite,
  removeEntity,
} from "pixel-pigeon";
import { WorldCharacter } from "../classes/WorldCharacter";
import { getConstants } from "./getConstants";
import { getDefinable } from "definables";

export const addWorldCharacterEmote = (
  worldCharacterID: string,
  emoteID: string,
  usedAt: number,
): void => {
  const constants: Constants = getConstants();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  if (worldCharacter.hasEmote()) {
    removeEntity(worldCharacter.emote.entityID);
  }
  const emote: Emote = getDefinable(Emote, emoteID);
  const sprites: EntitySprite[] = [
    {
      spriteID: createSprite({
        animationID: "default",
        animations: [
          {
            frames: [
              {
                height: constants["tile-size"],
                sourceHeight: constants["tile-size"],
                sourceWidth: constants["tile-size"],
                sourceX: 0,
                sourceY: 0,
                width: constants["tile-size"],
              },
            ],
            id: "default",
          },
        ],
        imagePath: emote.backgroundImagePath,
      }),
    },
  ];
  if (emote.hasForegroundImagePath()) {
    sprites.push({
      spriteID: createSprite({
        animationID: "default",
        animations: [
          {
            frames: [
              {
                height: constants["tile-size"],
                sourceHeight: constants["tile-size"],
                sourceWidth: constants["tile-size"],
                sourceX: 0,
                sourceY: 0,
                width: constants["tile-size"],
              },
            ],
            id: "default",
          },
        ],
        imagePath: emote.foregroundImagePath,
      }),
    });
  }
  const entityID: string = createEntity({
    height: constants["tile-size"],
    layerID: "emotes",
    levelID: worldCharacter.tilemapID,
    position: {
      x: worldCharacter.position.x * constants["tile-size"],
      y:
        worldCharacter.position.y * constants["tile-size"] -
        constants["tile-size"],
    },
    sprites,
    width: constants["tile-size"],
  });
  worldCharacter.emote = {
    entityID,
    usedAt,
  };
};
