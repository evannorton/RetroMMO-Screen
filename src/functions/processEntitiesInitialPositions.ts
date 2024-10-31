import { Constants, Direction } from "retrommo-types";
import { NPC } from "../classes/NPC";
import { createEntity, createSprite } from "pixel-pigeon";
import { getConstants } from "./getConstants";
import { getDefinable } from "definables";
import { state } from "../state";

export const processEntitiesInitialPositions = (): void => {
  const constants: Constants = getConstants();
  for (const position of state.values.initialNPCTilePositions) {
    const npc: NPC = getDefinable(NPC, position.npcID);
    npc.position = position.position;
    npc.entityID = createEntity({
      height: constants["tile-size"],
      layerID: "npcs",
      levelID: position.levelID,
      position: {
        x: npc.position.x * constants["tile-size"],
        y: npc.position.y * constants["tile-size"],
      },
      sprites: [
        {
          spriteID: createSprite({
            animationID: (): string => {
              switch (npc.direction) {
                case Direction.Down:
                  return "IdleDown";
                case Direction.Left:
                  return "IdleLeft";
                case Direction.Right:
                  return "IdleRight";
                case Direction.Up:
                  return "IdleUp";
              }
            },
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
                id: "IdleDown",
              },
              {
                frames: [
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: 0,
                    sourceY: constants["tile-size"],
                    width: constants["tile-size"],
                  },
                ],
                id: "IdleLeft",
              },
              {
                frames: [
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: 0,
                    sourceY: constants["tile-size"] * 2,
                    width: constants["tile-size"],
                  },
                ],
                id: "IdleRight",
              },
              {
                frames: [
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: 0,
                    sourceY: constants["tile-size"] * 3,
                    width: constants["tile-size"],
                  },
                ],
                id: "IdleUp",
              },
            ],
            imagePath: npc.actorImageSourceID,
          }),
        },
      ],
      width: constants["tile-size"],
    });
  }
};
