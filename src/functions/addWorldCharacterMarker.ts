import { Color, Constants, MarkerType } from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import { createEntity } from "pixel-pigeon";
import { getConstants } from "./getConstants";
import { getDefinable } from "definables";
import { getMarkerQuadrilaterals } from "./getMarkerQuadrilaterals";

export const addWorldCharacterMarker = (
  worldCharacterID: string,
  markerType: MarkerType,
): void => {
  const constants: Constants = getConstants();
  let markerColor: Color | undefined;
  switch (markerType) {
    case MarkerType.Duel:
      markerColor = Color.BrightRed;
      break;
    case MarkerType.Party:
      markerColor = Color.StrongCyan;
      break;
    case MarkerType.Selected:
      markerColor = Color.White;
      break;
    case MarkerType.Trade:
      markerColor = Color.LightYellow;
      break;
  }
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  worldCharacter.markerEntityID = createEntity({
    height: constants["tile-size"],
    layerID: "markers",
    levelID: worldCharacter.tilemapID,
    position: {
      x: worldCharacter.position.x * constants["tile-size"],
      y: worldCharacter.position.y * constants["tile-size"],
    },
    quadrilaterals: getMarkerQuadrilaterals(markerColor),
    width: constants["tile-size"],
    zIndex: worldCharacter.order,
  });
};
