import {
  Color,
  WorldAcceptDuelInviteRequest,
  WorldDeclineDuelInviteRequest,
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

export interface DuelInviteWorldMenuOpenOptions {
  readonly inviterPlayerID: string;
}
export interface DuelInviteWorldMenuStateSchema {
  isFinishing: boolean;
}
export const duelInviteWorldMenu: WorldMenu<
  DuelInviteWorldMenuOpenOptions,
  DuelInviteWorldMenuStateSchema
> = new WorldMenu<
  DuelInviteWorldMenuOpenOptions,
  DuelInviteWorldMenuStateSchema
>({
  create: (options: DuelInviteWorldMenuOpenOptions): HUDElementReferences => {
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
          emitToSocketioServer<WorldDeclineDuelInviteRequest>({
            data: {
              playerID: inviterPlayer.id,
            },
            event: "world/decline-duel-invite",
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
          value: "Duel Invite:",
        },
      }),
    );
    hudElementReferences.push(
      createPressableButton({
        condition: shouldShowMenu,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          emitToSocketioServer<WorldAcceptDuelInviteRequest>({
            data: {
              playerID: inviterPlayer.id,
            },
            event: "world/accept-duel-invite",
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
          emitToSocketioServer<WorldDeclineDuelInviteRequest>({
            data: {
              playerID: inviterPlayer.id,
            },
            event: "world/decline-duel-invite",
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
    if (duelInviteWorldMenu.state.values.isFinishing) {
      return true;
    }
    emitToSocketioServer<WorldDeclineDuelInviteRequest>({
      data: {
        playerID: duelInviteWorldMenu.openOptions.inviterPlayerID,
      },
      event: "world/decline-duel-invite",
    });
    return false;
  },
});
