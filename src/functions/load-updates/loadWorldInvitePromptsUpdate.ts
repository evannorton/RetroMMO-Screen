import { State } from "pixel-pigeon";
import { WorldCharacter } from "../../classes/WorldCharacter";
import {
  WorldInvitePromptUpdate,
  WorldInvitePromptsUpdate,
} from "retrommo-types";
import { WorldStateSchema } from "../../state";
import { clearWorldCharacterMarker } from "../clearWorldCharacterMarker";
import { closeWorldMenus } from "../world-menus/closeWorldMenus";
import { duelInviteWorldMenu } from "../../world-menus/duelInviteWorldMenu";
import { getDefinable } from "definables";
import { getWorldState } from "../state/getWorldState";
import { partyInviteWorldMenu } from "../../world-menus/partyInviteWorldMenu";
import { playerInvitedWorldMenu } from "../../world-menus/playerInvitedWorldMenu";
import { tradeInviteWorldMenu } from "../../world-menus/tradeInviteWorldMenu";

export const loadWorldInvitePromptsUpdate = (
  worldInvitePromptsUpdate: WorldInvitePromptsUpdate,
): void => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const invitePromptData: readonly [
    readonly WorldInvitePromptUpdate[],
    (
      | typeof duelInviteWorldMenu
      | typeof partyInviteWorldMenu
      | typeof tradeInviteWorldMenu
    ),
  ][] = [
    [worldInvitePromptsUpdate.duelInvitePrompts ?? [], duelInviteWorldMenu],
    [worldInvitePromptsUpdate.partyInvitePrompts ?? [], partyInviteWorldMenu],
    [worldInvitePromptsUpdate.tradeInvitePrompts ?? [], tradeInviteWorldMenu],
  ];
  for (const [invitePrompts, worldMenu] of invitePromptData) {
    for (const invitePrompt of invitePrompts) {
      const promptInviteeCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        invitePrompt.inviteeCharacterID,
      );
      const promptInviterCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        invitePrompt.inviterCharacterID,
      );
      if (promptInviteeCharacter.hasMarkerEntity()) {
        clearWorldCharacterMarker(invitePrompt.inviteeCharacterID);
      }
      if (
        playerInvitedWorldMenu.isOpen() &&
        playerInvitedWorldMenu.openOptions.playerID ===
          promptInviteeCharacter.playerID
      ) {
        playerInvitedWorldMenu.close();
      } else if (
        invitePrompt.inviteeCharacterID === worldState.values.worldCharacterID
      ) {
        closeWorldMenus();
        worldMenu.open({
          inviterPlayerID: promptInviterCharacter.playerID,
        });
      }
    }
  }
};
