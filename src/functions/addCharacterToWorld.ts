import { Color } from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import { createEntity, createQuadrilateral } from "pixel-pigeon";
import { getConstants } from "./getConstants";
import { getDefinable } from "../definables";

export const addCharacterToWorld = (characterID: string): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    characterID,
  );
  const tileSize: number = getConstants()["tile-size"];
  worldCharacter.entityID = createEntity({
    height: tileSize,
    layerID: "characters",
    levelID: worldCharacter.tilemapID,
    position: {
      x: worldCharacter.x * tileSize,
      y: worldCharacter.y * tileSize,
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
