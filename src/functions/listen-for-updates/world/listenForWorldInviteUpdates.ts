import { Player } from "../../../classes/Player";
import { WorldCharacter } from "../../../classes/WorldCharacter";
import {
  WorldInviteCancelUpdate,
  WorldInviteOutOfRangeUpdate,
  WorldInvitePromptsUpdate,
  WorldInviteStartUpdate,
} from "retrommo-types";
import { addWorldCharacterMarker } from "../../addWorldCharacterMarker";
import { clearWorldCharacterMarker } from "../../clearWorldCharacterMarker";
import { closeWorldMenus } from "../../world-menus/closeWorldMenus";
import { duelInviteWorldMenu } from "../../../world-menus/duelInviteWorldMenu";
import { getDefinable } from "definables";
import { getInviteMarkerType } from "../../getInviteMarkerType";
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadWorldInvitePromptsUpdate } from "../../load-updates/loadWorldInvitePromptsUpdate";
import { notPartyLeaderWorldMenu } from "../../../world-menus/notPartyLeaderWorldMenu";
import { outOfRangeWorldMenu } from "../../../world-menus/outOfRangeWorldMenu";
import { partyFullWorldMenu } from "../../../world-menus/partyFullWorldMenu";
import { partyInviteWorldMenu } from "../../../world-menus/partyInviteWorldMenu";
import { playerInvitedWorldMenu } from "../../../world-menus/playerInvitedWorldMenu";
import { tradeInviteWorldMenu } from "../../../world-menus/tradeInviteWorldMenu";

export const listenForWorldInviteUpdates = (): void => {
  listenToSocketioEvent<WorldInviteCancelUpdate>({
    event: "world/invite/cancel",
    onMessage: (update: WorldInviteCancelUpdate): void => {
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        update.characterID,
      );
      if (
        playerInvitedWorldMenu.isOpen() &&
        playerInvitedWorldMenu.openOptions.playerID === worldCharacter.playerID
      ) {
        playerInvitedWorldMenu.close();
      }
      clearWorldCharacterMarker(update.characterID);
    },
  });
  listenToSocketioEvent<WorldInviteOutOfRangeUpdate>({
    event: "world/invite/full-party",
    onMessage: (): void => {
      if (duelInviteWorldMenu.isOpen()) {
        duelInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      if (partyInviteWorldMenu.isOpen()) {
        partyInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      if (tradeInviteWorldMenu.isOpen()) {
        tradeInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      closeWorldMenus();
      partyFullWorldMenu.open({});
    },
  });
  listenToSocketioEvent<WorldInviteOutOfRangeUpdate>({
    event: "world/invite/not-party-leader",
    onMessage: (): void => {
      if (duelInviteWorldMenu.isOpen()) {
        duelInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      if (partyInviteWorldMenu.isOpen()) {
        partyInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      if (tradeInviteWorldMenu.isOpen()) {
        tradeInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      closeWorldMenus();
      notPartyLeaderWorldMenu.open({});
    },
  });
  listenToSocketioEvent<WorldInviteOutOfRangeUpdate>({
    event: "world/invite/out-of-range",
    onMessage: (): void => {
      if (duelInviteWorldMenu.isOpen()) {
        duelInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      if (partyInviteWorldMenu.isOpen()) {
        partyInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      if (tradeInviteWorldMenu.isOpen()) {
        tradeInviteWorldMenu.state.setValues({
          isFinishing: true,
        });
      }
      closeWorldMenus();
      outOfRangeWorldMenu.open({});
    },
  });
  listenToSocketioEvent<WorldInvitePromptsUpdate>({
    event: "world/invite/prompts",
    onMessage: (update: WorldInvitePromptsUpdate): void => {
      loadWorldInvitePromptsUpdate(update);
    },
  });
  listenToSocketioEvent<WorldInviteStartUpdate>({
    event: "world/invite/start",
    onMessage: (update: WorldInviteStartUpdate): void => {
      playerInvitedWorldMenu.open({ playerID: update.playerID });
      const player: Player = getDefinable(Player, update.playerID);
      if (player.hasWorldCharacter()) {
        addWorldCharacterMarker(
          player.worldCharacterID,
          getInviteMarkerType(update.type),
        );
      }
    },
  });
};
