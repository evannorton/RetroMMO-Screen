import { MarkerType, WorldCancelInviteRequest } from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import { addWorldCharacterMarker } from "./addWorldCharacterMarker";
import { closeWorldMenus } from "./world-menus/closeWorldMenus";
import { emitToSocketioServer } from "pixel-pigeon";
import { getDefinable } from "definables";
import { selectedPlayerWorldMenu } from "../world-menus/selectedPlayerWorldMenu";
import { state } from "../state";

export const handleWorldCharacterClick = (worldCharacterID: string): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldCharacterID,
  );
  if (state.values.selectedPlayerID === worldCharacter.playerID) {
    selectedPlayerWorldMenu.close();
  } else if (worldCharacter.hasMarkerEntity()) {
    emitToSocketioServer<WorldCancelInviteRequest>({
      data: { playerID: worldCharacter.playerID },
      event: "world/cancel-invite",
    });
  } else {
    closeWorldMenus();
    state.setValues({ selectedPlayerID: worldCharacter.playerID });
    selectedPlayerWorldMenu.open({ playerID: worldCharacter.playerID });
    addWorldCharacterMarker(worldCharacter.id, MarkerType.Selected);
  }
};
