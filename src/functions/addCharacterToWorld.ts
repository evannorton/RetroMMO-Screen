import { Direction, Step } from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import { createButton, createEntity } from "pixel-pigeon";
import { createCharacterSprite } from "./ui/components/createCharacterSprite";
import { getConstants } from "./getConstants";
import { getDefinable } from "definables";

export const addCharacterToWorld = (characterID: string): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    characterID,
  );
  const tileSize: number = getConstants()["tile-size"];
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
      x: worldCharacter.x * tileSize,
      y: worldCharacter.y * tileSize,
    },
    width: tileSize,
    zIndex: worldCharacter.order,
  });
  createCharacterSprite({
    clothesDyeID: (): string => worldCharacter.clothesDyeItem.clothesDyeID,
    direction: (): Direction => worldCharacter.direction,
    entity: {
      animationStartedAt: 0,
      entityID: worldCharacter.entityID,
      step: (): Step => worldCharacter.step,
    },
    figureID: (): string => worldCharacter.figureID,
    hairDyeID: (): string => worldCharacter.hairDyeItem.hairDyeID,
    maskID: (): string => worldCharacter.maskItem.maskID,
    outfitID: (): string => worldCharacter.outfitItem.outfitID,
    skinColorID: (): string => worldCharacter.skinColorID,
  });
};
