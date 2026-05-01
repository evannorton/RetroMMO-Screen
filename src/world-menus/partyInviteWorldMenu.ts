import {
  Color,
  WorldAcceptPartyInviteRequest,
  WorldDeclinePartyInviteRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  createLabel,
  emitToSocketioServer,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Player } from "../classes/Player";
import { WorldMenu } from "../classes/WorldMenu";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { getDefinable } from "definables";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

export interface PartyInviteWorldMenuOpenOptions {
  readonly inviterPlayerID: string;
}
export interface PartyInviteWorldMenuStateSchema {
  isFinishing: boolean;
}
export const partyInviteWorldMenu: WorldMenu<
  PartyInviteWorldMenuOpenOptions,
  PartyInviteWorldMenuStateSchema
> = new WorldMenu<
  PartyInviteWorldMenuOpenOptions,
  PartyInviteWorldMenuStateSchema
>({
  create: (options: PartyInviteWorldMenuOpenOptions): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const inviterPlayer: Player = getDefinable(Player, options.inviterPlayerID);
    const shouldShowMenu = (): boolean => isWorldCombatInProgress() === false;
    hudElementReferences.push(
      createPanel({
        condition: shouldShowMenu,
        height: 62,
        imagePath: "panels/basic",
        width: 208,
        x: 48,
        y: 136,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: shouldShowMenu,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          emitToSocketioServer<WorldDeclinePartyInviteRequest>({
            data: {
              playerID: inviterPlayer.id,
            },
            event: "world/decline-party-invite",
          });
        },
        width: 10,
        x: 239,
        y: 143,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: shouldShowMenu,
          x: 152,
          y: 146,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: inviterPlayer.username,
        }),
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: shouldShowMenu,
          x: 152,
          y: 159,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: {
          value: "Party Invite:",
        },
      }),
    );
    hudElementReferences.push(
      createPressableButton({
        condition: shouldShowMenu,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          emitToSocketioServer<WorldAcceptPartyInviteRequest>({
            data: {
              playerID: inviterPlayer.id,
            },
            event: "world/accept-party-invite",
          });
        },
        text: { value: "Accept" },
        width: 50,
        x: 100,
        y: 172,
      }),
    );
    hudElementReferences.push(
      createPressableButton({
        condition: shouldShowMenu,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          emitToSocketioServer<WorldDeclinePartyInviteRequest>({
            data: {
              playerID: inviterPlayer.id,
            },
            event: "world/decline-party-invite",
          });
        },
        text: { value: "Decline" },
        width: 50,
        x: 154,
        y: 172,
      }),
    );
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {
    isFinishing: false,
  },
  onClose: (): boolean => {
    if (partyInviteWorldMenu.state.values.isFinishing) {
      return true;
    }
    emitToSocketioServer<WorldDeclinePartyInviteRequest>({
      data: {
        playerID: partyInviteWorldMenu.openOptions.inviterPlayerID,
      },
      event: "world/decline-party-invite",
    });
    return false;
  },
});
