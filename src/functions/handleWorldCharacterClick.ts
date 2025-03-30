import { MarkerType } from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import { addWorldCharacterMarker } from "./addWorldCharacterMarker";
import { closeWorldMenus } from "./world-menus/closeWorldMenus";
import { getDefinable } from "definables";
import { selectedPlayerWorldMenu } from "../world-menus/selectedPlayerWorldMenu";
import { state } from "../state";

export const handleWorldCharacterClick = (worldCharacterID: string): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  if (state.values.selectedPlayerID !== worldCharacter.playerID) {
    closeWorldMenus();
    state.setValues({ selectedPlayerID: worldCharacter.playerID });
    selectedPlayerWorldMenu.open({ playerID: worldCharacter.playerID });
    addWorldCharacterMarker(worldCharacter.id, MarkerType.Selected);
  } else {
    closeWorldMenus();
  }
};
