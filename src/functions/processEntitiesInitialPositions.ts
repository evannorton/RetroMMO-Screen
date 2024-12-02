import { Bank } from "../classes/Bank";
import { Chest } from "../classes/Chest";
import { CombinationLock } from "../classes/CombinationLock";
import { Constants, Direction } from "retrommo-types";
import { NPC } from "../classes/NPC";
import { Piano } from "../classes/Piano";
import { bankToggleDuration } from "../constants/bankToggleDuration";
import { chestOpenDuration } from "../constants/chestOpenDuration";
import { createEntity, createSprite } from "pixel-pigeon";
import { getConstants } from "./getConstants";
import { getDefinable } from "definables";
import { getNPCIndicatorImagePath } from "./getNPCIndicatorImagePath";
import { hasOpenedChest } from "./hasOpenedChest";
import { state } from "../state";

export const processEntitiesInitialPositions = (): void => {
  const constants: Constants = getConstants();
  for (const position of state.values.initialBankTilePositions) {
    const bank: Bank = getDefinable(Bank, position.bankID);
    const fieldValues: Map<string, unknown> = new Map();
    fieldValues.set("bankID", bank.id);
    createEntity({
      fieldValues,
      height: constants["tile-size"],
      layerID: "banks",
      levelID: position.levelID,
      position: {
        x: position.position.x * constants["tile-size"],
        y: position.position.y * constants["tile-size"],
      },
      sprites: [
        {
          condition: (): boolean => state.values.worldState !== null,
          spriteID: createSprite({
            animationID: (): string => {
              if (bank.isOpen) {
                if (bank.hasToggledAt()) {
                  return "opening";
                }
                return "opened";
              }
              if (bank.hasToggledAt()) {
                return "closing";
              }
              return "closed";
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
                id: "closed",
              },
              {
                frames: [
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"] * 3,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                ],
                id: "opened",
              },
              {
                frames: [
                  {
                    duration: bankToggleDuration,
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"] * 2,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                  {
                    duration: bankToggleDuration,
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"],
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: 0,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                ],
                id: "closing",
              },
              {
                frames: [
                  {
                    duration: bankToggleDuration,
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"],
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                  {
                    duration: bankToggleDuration,
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"] * 2,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"] * 3,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                ],
                id: "opening",
              },
            ],
            imagePath: bank.imagePath,
          }),
        },
      ],
      type: "bank",
      width: constants["tile-size"],
    });
  }
  for (const position of state.values.initialChestTilePositions) {
    const chest: Chest = getDefinable(Chest, position.chestID);
    const fieldValues: Map<string, unknown> = new Map();
    fieldValues.set("chestID", chest.id);
    createEntity({
      fieldValues,
      height: constants["tile-size"],
      layerID: "chests",
      levelID: position.levelID,
      position: {
        x: position.position.x * constants["tile-size"],
        y: position.position.y * constants["tile-size"],
      },
      sprites: [
        {
          condition: (): boolean => state.values.worldState !== null,
          spriteID: createSprite({
            animationID: (): string => {
              if (hasOpenedChest(chest.id)) {
                if (chest.hasOpenedAt()) {
                  return "opening";
                }
                return "opened";
              }
              return "closed";
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
                id: "closed",
              },
              {
                frames: [
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"] * 3,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                ],
                id: "opened",
              },
              {
                frames: [
                  {
                    duration: chestOpenDuration,
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"],
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                  {
                    duration: chestOpenDuration,
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"] * 2,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                  {
                    height: constants["tile-size"],
                    sourceHeight: constants["tile-size"],
                    sourceWidth: constants["tile-size"],
                    sourceX: constants["tile-size"] * 3,
                    sourceY: 0,
                    width: constants["tile-size"],
                  },
                ],
                id: "opening",
              },
            ],
            imagePath: chest.imagePath,
          }),
        },
      ],
      type: "chest",
      width: constants["tile-size"],
    });
  }
  for (const position of state.values.initialCombinationLockTilePositions) {
    const combinationLock: CombinationLock = getDefinable(
      CombinationLock,
      position.combinationLockID,
    );
    const fieldValues: Map<string, unknown> = new Map();
    fieldValues.set("combinationLockID", combinationLock.id);
    createEntity({
      fieldValues,
      height: constants["tile-size"],
      layerID: "combination-locks",
      levelID: position.levelID,
      position: {
        x: position.position.x * constants["tile-size"],
        y: position.position.y * constants["tile-size"],
      },
      sprites: [
        {
          condition: (): boolean => state.values.worldState !== null,
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
            imagePath: combinationLock.imagePath,
          }),
        },
      ],
      type: "combination-lock",
      width: constants["tile-size"],
    });
  }
  for (const position of state.values.initialEnterableTilePositions) {
    createEntity({
      height: constants["tile-size"],
      layerID: "enterables",
      levelID: position.levelID,
      position: {
        x: position.position.x * constants["tile-size"],
        y: position.position.y * constants["tile-size"],
      },
      sprites: [],
      type: "enterable",
      width: constants["tile-size"],
    });
  }
  for (const position of state.values.initialNPCExtenderPositions) {
    createEntity({
      height: constants["tile-size"],
      layerID: "npc-extenders",
      levelID: position.levelID,
      position: {
        x: position.position.x * constants["tile-size"],
        y: position.position.y * constants["tile-size"],
      },
      sprites: [],
      type: "npc-extender",
      width: constants["tile-size"],
    });
  }
  for (const position of state.values.initialNPCTilePositions) {
    const npc: NPC = getDefinable(NPC, position.npcID);
    npc.position = position.position;
    const fieldValues: Map<string, unknown> = new Map();
    fieldValues.set("npcID", npc.id);
    npc.entityID = createEntity({
      fieldValues,
      height: constants["tile-size"],
      layerID: "npcs",
      levelID: position.levelID,
      position: {
        x: npc.position.x * constants["tile-size"],
        y: npc.position.y * constants["tile-size"],
      },
      sprites: [
        {
          condition: (): boolean => state.values.worldState !== null,
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
            imagePath: npc.actorImagePath,
          }),
        },
      ],
      type: "npc",
      width: constants["tile-size"],
    });
    npc.indicatorEntityID = createEntity({
      height: constants["tile-size"],
      layerID: "npc-indicators",
      levelID: position.levelID,
      position: {
        x: npc.position.x * constants["tile-size"],
        y: npc.position.y * constants["tile-size"] - constants["tile-size"],
      },
      sprites: [
        {
          condition: (): boolean => state.values.worldState !== null,
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
            imagePath: (): string => getNPCIndicatorImagePath(npc.id),
          }),
        },
      ],
      width: constants["tile-size"],
    });
  }
  for (const position of state.values.initialPianoTilePositions) {
    const piano: Piano = getDefinable(Piano, position.pianoID);
    const fieldValues: Map<string, unknown> = new Map();
    fieldValues.set("pianoID", piano.id);
    createEntity({
      fieldValues,
      height: constants["tile-size"],
      layerID: "pianos",
      levelID: position.levelID,
      position: {
        x: position.position.x * constants["tile-size"],
        y: position.position.y * constants["tile-size"],
      },
      type: "piano",
      width: constants["tile-size"],
    });
  }
};
