import { Character } from "../classes/Character";
import { Color } from "retrommo-types";
import { createEntity, createQuadrilateral } from "pixel-pigeon";
import { getConstants } from "./getConstants";
import { getDefinable } from "../definables";

export const addCharacterToWorld = (characterID: string): void => {
  const character: Character = getDefinable(Character, characterID);
  const tileSize: number = getConstants()["tile-size"];
  character.entityID = createEntity({
    height: tileSize,
    layerID: "characters",
    levelID: character.tilemapID,
    position: {
      x: character.x * tileSize,
      y: character.y * tileSize,
    },
    quadrilaterals: [
      {
        quadrilateralID: createQuadrilateral({
          color: Color.White,
          height: tileSize,
          width: tileSize,
        }),
      },
    ],
    width: tileSize,
  });
};
