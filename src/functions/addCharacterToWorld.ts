import { Color } from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import { createButton, createEntity, createQuadrilateral } from "pixel-pigeon";
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
          console.log(
            `TODO: handle character click for ${worldCharacter.username}`,
          );
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
    quadrilaterals: [
      {
        quadrilateralID: createQuadrilateral({
          color: Object.values(Color)[
            Math.floor(Math.random() * Object.keys(Color).length)
          ] as Color,
          height: tileSize,
          width: tileSize,
        }),
      },
    ],
    width: tileSize,
    zIndex: worldCharacter.order,
  });
};
