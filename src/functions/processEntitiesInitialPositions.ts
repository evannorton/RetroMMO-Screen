import { Bank } from "../classes/Bank";
import { Chest } from "../classes/Chest";
import { CombinationLock } from "../classes/CombinationLock";
import { Constants, Direction } from "retrommo-types";
import { NPC } from "../classes/NPC";
import { State, createEntity, createSprite } from "pixel-pigeon";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldStateSchema, state } from "../state";
import { getConstants } from "./getConstants";
import { getDefinable } from "definables";
import { getWorldState } from "./state/getWorldState";

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
            imagePath: npc.indicatorImagePath,
          }),
        },
      ],
      width: constants["tile-size"],
    });
  }
  for (const position of state.values.initialBankTilePositions) {
    const bank: Bank = getDefinable(Bank, position.bankID);
    createEntity({
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
            imagePath: bank.imagePath,
          }),
        },
      ],
      width: constants["tile-size"],
    });
  }
  for (const position of state.values.initialChestTilePositions) {
    const chest: Chest = getDefinable(Chest, position.chestID);
    createEntity({
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
              const worldState: State<WorldStateSchema> = getWorldState();
              const character: WorldCharacter = getDefinable(
                WorldCharacter,
                worldState.values.worldCharacterID,
              );
              if (
                character.party.worldCharacters.every(
                  (worldCharacter: WorldCharacter): boolean =>
                    worldCharacter.openedChestIDs.includes(chest.id),
                )
              ) {
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
            ],
            imagePath: chest.imagePath,
          }),
        },
      ],
      width: constants["tile-size"],
    });
  }
  for (const position of state.values.initialCombinationLockTilePositions) {
    const combinationLock: CombinationLock = getDefinable(
      CombinationLock,
      position.combinationLockID,
    );
    createEntity({
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
      width: constants["tile-size"],
    });
  }
};
