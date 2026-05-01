import { State } from "pixel-pigeon";
import { WorldCharacter } from "../../classes/WorldCharacter";
import {
  WorldInvitePromptUpdate,
  WorldInvitePromptsUpdate,
} from "retrommo-types";
import { WorldStateSchema } from "../../state";
import { clearWorldCharacterMarker } from "../clearWorldCharacterMarker";
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
      if (
        playerInvitedWorldMenu.isOpen() &&
        playerInvitedWorldMenu.openOptions.playerID ===
          promptInviteeCharacter.playerID
      ) {
        playerInvitedWorldMenu.close();
        if (promptInviteeCharacter.hasMarkerEntity()) {
          clearWorldCharacterMarker(invitePrompt.inviteeCharacterID);
        }
      } else if (
        invitePrompt.inviteeCharacterID === worldState.values.worldCharacterID
      ) {
        worldMenu.open({
          inviterPlayerID: promptInviterCharacter.playerID,
        });
      }
    }
  }
};
